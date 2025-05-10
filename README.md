# ChatGPT Inline Questioning UI

A simple prototype that improves AI chat UX by allowing inline followup questions on various sections of the response.

## Built with

- Base UI : ['chatgpt-minimal'] (https://github.com/blrchen/chatgpt-minimal)
- OpenRouter API (OpenAI-compatible)
- Next.js + React

## What it does

The chat works like it does, but there a 💬 icon beside each section of the response which on clicking opens an **inline sub-question tab**. We can ask our follow-up questions to any specific part of the chat rather than asking it as another question in the main chat preventing the chat to be unorganized or loose context. Ask your question, view the answer and collapse it when you're done. Keeps the main chat organized and focused. 

## How to run

1. Clone the repo
2. Run : `npm install`
3. Create a `.env.local` (refer `.env.example`) and add your API key

## Credits

- **Base UI** : Built on top of the open-source project ['chatgpt-minimal'](https://github.com/blrchen/chatgpt-minimal)
- **Feature Extension**
