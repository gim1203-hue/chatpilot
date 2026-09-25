# ChatPilot

ChatPilot is a focused React study assistant for learning frontend fundamentals through conversation, flashcards, and quick quizzes.

## Features

- AI-style study chat with suggested prompts and delayed mock responses
- React fundamentals flashcard deck with flip and navigation controls
- Quick quiz with answer feedback and score results
- Responsive layout for desktop, tablet, and mobile
- Light and dark themes
- Clean learning progress panel
- Google sign-in with Firebase Authentication
- Public welcome experience for new users
- Vercel-ready SPA deployment

## Technologies Used

- React 19
- Vite
- JavaScript
- CSS
- Oxlint
- Firebase Authentication

## Installation

```bash
npm install
```

## Google Sign-In Setup

1. Create a Firebase project and register a Web app.
2. Enable **Authentication > Sign-in method > Google** in the Firebase console.
3. Copy `.env.example` to `.env.local` and fill in the Firebase Web app configuration values.
4. Add `localhost` and your Vercel domain under **Authentication > Settings > Authorized domains**.

The app opens Google's consent flow with Firebase `signInWithPopup`. The learning workspace is private and the signed-in user's Google profile supplies the displayed name and initials.

## Deploying to Vercel

Import the repository into Vercel with the default Vite settings. Add these environment variables in the Vercel project settings:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

The included `vercel.json` keeps client-side routes working on refresh. The app uses the domain root as its Vite base path for Vercel deployment.

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
├── lib/firebase.js # Firebase browser client
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
- Confirm the welcome screen when signed out
- Confirm Google sign-in and sign-out with Firebase configured
- Run `npm run build` and confirm there are no errors

## Future Improvements

- Connect chat to a secure backend and AI provider
- Save conversations and progress with the authenticated user
- Add more study decks and quiz topics
- Add markdown response formatting
- Add a progress history page

## Portfolio Description

Built ChatPilot, a responsive React learning assistant with interactive chat, flashcards, quizzes, theme switching, mock asynchronous states, and mobile-first layout design.

## Author

Alex Student
