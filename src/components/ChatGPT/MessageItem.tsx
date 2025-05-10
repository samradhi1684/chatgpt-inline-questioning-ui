import React, { useState } from 'react'
import MarkdownIt from 'markdown-it'
import mdHighlight from 'markdown-it-highlightjs'
import mdKatex from 'markdown-it-katex'
import { CommentOutlined } from '@ant-design/icons'

import { ChatMessageItemProps } from './interface'
import SubChat from './SubChat'

const md = MarkdownIt({ html: true }).use(mdKatex).use(mdHighlight)
const fence = md.renderer.rules.fence!
md.renderer.rules.fence = (...args) => {
  const [tokens, idx] = args
  const token = tokens[idx]
  const rawCode = fence(...args)

  return `<div relative>
  <div data-clipboard-text=${encodeURIComponent(token.content)} class="copy-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z" /><path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z" /></svg>
    <div>Copy</div>
  </div>
  ${rawCode}
  </div>`
}

const MessageItem = (props: ChatMessageItemProps) => {
  const { message } = props
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

    // ✅ Only show hover actions for Assistant messages
  const isAssistant = message.role === 'assistant'
  const sections = message.content.split('\n').filter(Boolean)

  return (
    <div className="message-item">
      <div className="meta">
        <div className="avatar">
          <span className={message.role}></span>
        </div>
        <div className="message">
          {sections.map((section, index) => (
            <div
              key={index}
              className="hover-section"
              style={{ position: 'relative', paddingBottom: '0.5rem' }}
            >
              <div dangerouslySetInnerHTML={{ __html: md.render(section) }} />

              {/* ✅ Only show icon for assistant messages */}
              {isAssistant && (
              <CommentOutlined
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  cursor: 'pointer',
                  opacity: 0.5,
                  fontSize: '0.8rem'
                }}
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              />
              )}

              {/* SubChat Component */}
              {isAssistant && activeIndex === index && (
                <div style={{ marginTop: '0.5rem' }}>
                  <SubChat onClose={() => setActiveIndex(null)} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MessageItem
