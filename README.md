# ChatPilot

ChatPilot is a focused React study assistant for learning frontend fundamentals through conversation, flashcards, and quick quizzes.

## Features

- AI-style study chat with suggested prompts and delayed mock responses
- React fundamentals flashcard deck with flip and navigation controls
- Quick quiz with answer feedback and score results
- Responsive layout for desktop, tablet, and mobile
- Light and dark themes
- Clean learning progress panel

## Technologies Used

- React 19
- Vite
- JavaScript
- CSS
- Oxlint

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

Open the local URL shown by Vite in your browser.

## Production Build

```bash
npm run build
```

## Project Structure

```text
src/
├── App.jsx       # Main application and interactive state
├── App.css       # ChatPilot layout and responsive styles
├── index.css     # Global browser styles
└── main.jsx      # React entry point
```

## How It Works

The app uses React `useState` to manage the active view, chat messages, mock response loading state, flashcard position, quiz answers, score, and theme. The chat currently uses local mock responses, so it does not connect to a real AI service or database yet.

## Testing Checklist

- Switch between Study chat, Flashcards, and Quick quiz
- Submit a custom chat question and wait for the response
- Use each suggested prompt
- Clear the chat
- Flip cards and move forward or backward
- Answer quiz questions and restart the quiz
- Toggle light and dark themes
- Check the layout at mobile width
- Run `npm run build` and confirm there are no errors

## Future Improvements

- Connect chat to a secure backend and AI provider
- Save conversations and progress with user accounts
- Add more study decks and quiz topics
- Add markdown response formatting
- Add a progress history page

## Portfolio Description

Built ChatPilot, a responsive React learning assistant with interactive chat, flashcards, quizzes, theme switching, mock asynchronous states, and mobile-first layout design.

## Author

Alex Student
