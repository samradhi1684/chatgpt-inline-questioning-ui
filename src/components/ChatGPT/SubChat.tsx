import React, { useState } from 'react'
import SendBar from './SendBar'
import { ChatRole, ChatMessage } from './interface'

const SubChat = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async (message: ChatMessage) => {
    setMessages(prev => [...prev, message])
    setLoading(true)

    try {
      const res = await fetch('/api/subchat', {
        method: 'POST',
        body: JSON.stringify({ prompt: message.content }),
      })

      const data = await res.json()
      const response: ChatMessage = {
        role: ChatRole.Assistant,
        content: data?.response || '(No reply)',
      }

      setMessages(prev => [...prev, response])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: ChatRole.Assistant,
        content: 'Error: failed to fetch response.',
      }])
    }

    setLoading(false)
  }

  return (
    <div
  className="sub-chat"
  style={{
    background: '#f3f3f3',
    padding: '10px',
    borderRadius: '6px',
    maxWidth: '80%',        // ✅ Make it smaller than full width
    marginLeft: 'auto',     // ✅ Align it nicely
    marginRight: 'auto'
    }}
    >
      {messages.map((msg, i) => (
        <div key={i} style={{ fontSize: '0.9rem', padding: '4px 0', color: msg.role === ChatRole.User ? '#007bff' : '#333' }}>
          <strong>{msg.role === ChatRole.User ? 'Your question' : 'Answer'}:</strong> {msg.content}
        </div>
      ))}

      <SendBar
        loading={loading}
        disabled={loading}
        onSend={handleSend}
        onClear={() => {}}
        onStop={() => setLoading(false)}
      />

      <button
        onClick={onClose}
        style={{
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          color: '#999',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          textDecoration: 'underline'
        }}
      >
        Collapse
      </button>
    </div>
  )
}

export default SubChat
