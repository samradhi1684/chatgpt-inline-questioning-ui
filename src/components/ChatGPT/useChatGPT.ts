import { useEffect, useReducer, useRef, useState } from 'react';
import ClipboardJS from 'clipboard';
import { throttle } from 'lodash-es';
import { ChatGPTProps, ChatMessage, ChatRole } from './interface';

const scrollDown = throttle(() => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}, 300, {
  leading: true,
  trailing: false,
});

const requestMessage = async (
  url: string,
  messages: ChatMessage[],
  controller: AbortController | null
) => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ messages }),
    signal: controller?.signal,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = response.body;
  if (!data) {
    throw new Error('No data');
  }

  return data.getReader();
};

export const useChatGPT = (props: ChatGPTProps) => {
  const { fetchPath } = props;
  const [, forceUpdate] = useReducer((x) => !x, false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [disabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const controller = useRef<AbortController | null>(null);
  const currentMessage = useRef<string>('');

  const archiveCurrentMessage = () => {
    const content = currentMessage.current;
    currentMessage.current = '';
    setLoading(false);
    if (content) {
      setMessages((prev) => [...prev, { content, role: ChatRole.Assistant }]);
      scrollDown();
    }
  };

  const fetchMessage = async (messages: ChatMessage[]) => {
    try {
      currentMessage.current = '';
      controller.current = new AbortController();
      setLoading(true);

      const reader = await requestMessage(fetchPath, messages, controller.current);
      const decoder = new TextDecoder('utf-8');
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (value) {
          const lines = decoder.decode(value, { stream: true }).split('\n');
          for (let line of lines) {
            line = line.trim();
            if (!line || !line.startsWith('data:')) continue;

            const json = line.replace(/^data:\s*/, '');

            if (json === '[DONE]') {
              done = true;
              break;
            }

            try {
              const parsed = JSON.parse(json);
              const delta = parsed?.choices?.[0]?.delta?.content;
              if (delta) {
                currentMessage.current += delta;
                forceUpdate();
              }
            } catch (e) {
              console.error('Stream parse error:', e, json);
            }
          }
          scrollDown();
        }
        done = readerDone;
      }

      archiveCurrentMessage();
    } catch (e) {
      console.error(e);
      setLoading(false);
      return;
    }
  };

  const onStop = () => {
    if (controller.current) {
      controller.current.abort();
      archiveCurrentMessage();
    }
  };

  const onSend = (message: ChatMessage) => {
    const newMessages = [...messages, message];
    setMessages(newMessages);
    fetchMessage(newMessages);
  };

  const onClear = () => {
    setMessages([]);
  };

  useEffect(() => {
    new ClipboardJS('.chat-wrapper .copy-btn');
  }, []);

  return {
    loading,
    disabled,
    messages,
    currentMessage,
    onSend,
    onClear,
    onStop,
  };
};