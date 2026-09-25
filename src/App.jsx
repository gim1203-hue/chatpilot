import { useEffect, useState } from 'react'
import { browserLocalPersistence, getRedirectResult, onAuthStateChanged, setPersistence, signInWithPopup, signInWithRedirect, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from './lib/firebase'
import './App.css'

const starterPrompts = [
  'Explain the difference between props and state',
  'Give me a 20-minute study plan for React',
  'Quiz me on JavaScript array methods',
]

const flashcards = [
  { front: 'What is a React component?', back: 'A reusable JavaScript function that returns UI.' },
  { front: 'What does useState return?', back: 'A state value and a function used to update it.' },
  { front: 'Why do lists need keys?', back: 'Keys help React identify which list items changed.' },
]

const quizQuestions = [
  { question: 'Which hook stores changing data in a component?', options: ['useFetch', 'useState', 'useRoute'], answer: 'useState' },
  { question: 'Which method renders an array into JSX?', options: ['map()', 'push()', 'join()'], answer: 'map()' },
  { question: 'What are props used for?', options: ['Styling only', 'Passing data to components', 'Starting a server'], answer: 'Passing data to components' },
]

function WelcomeScreen({ error, isSigningIn, onSignIn }) {
  return (
    <main className="welcome-page">
      <section className="welcome-copy">
        <div className="brand welcome-brand"><span className="brand-mark">✦</span><span>chatpilot</span></div>
        <span className="welcome-kicker">A calmer way to learn</span>
        <h1>Make progress feel <em>possible.</em></h1>
        <p className="welcome-description">A focused learning space for curious minds. Ask better questions, build recall, and keep your momentum in one quiet place.</p>
        <div className="welcome-actions">
          <button className="google-button" onClick={onSignIn} disabled={isSigningIn || !isFirebaseConfigured} type="button">
            <span className="google-mark">G</span>
            {isSigningIn ? 'Opening Google...' : 'Continue with Google'}
          </button>
          {!isFirebaseConfigured && <p className="setup-message">Add your Firebase environment variables to enable Google sign-in.</p>}
          {error && <p className="auth-error" role="alert">{error}</p>}
        </div>
        <small className="welcome-footnote">Your workspace is private to you.</small>
      </section>
      <section className="welcome-preview" aria-label="ChatPilot workspace preview">
        <div className="preview-glow"></div>
        <div className="preview-window">
          <div className="preview-topline"><span>✦ chatpilot</span><span className="preview-status">● in focus</span></div>
          <div className="preview-question">What are we learning today?</div>
          <div className="preview-message"><span className="preview-avatar">✦</span><p>Break big ideas into small examples, then test each one.</p></div>
          <div className="preview-prompt">Explain the difference between props and state <span>↗</span></div>
          <div className="preview-prompt short">Give me a 20-minute study plan <span>↗</span></div>
        </div>
        <div className="preview-note"><strong>01</strong><span>Learn at your own pace<br />with less noise.</span></div>
      </section>
    </main>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [authError, setAuthError] = useState('')
  const [activeView, setActiveView] = useState('chat')
  const [darkMode, setDarkMode] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Welcome back. What would you like to learn today?' }])
  const [cardIndex, setCardIndex] = useState(0)
  const [isCardFlipped, setIsCardFlipped] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)

  useEffect(() => {
    if (!auth) return undefined

    let cancelled = false
    let unsubscribe

    async function initializeAuth() {
      try {
        await setPersistence(auth, browserLocalPersistence)
        const redirectResult = await getRedirectResult(auth)
        if (redirectResult?.user && !cancelled) {
          setSession(redirectResult.user)
          setAuthLoading(false)
        }
      } catch (error) {
        const messages = {
          'auth/unauthorized-domain': `Firebase does not allow ${window.location.hostname} yet. Add this domain in Firebase Authentication settings.`,
          'auth/operation-not-allowed': 'Google sign-in is not enabled in Firebase Authentication yet.',
        }
        if (!cancelled) setAuthError(messages[error.code] || 'Google sign-in could not be completed. Please try again.')
      }

      if (cancelled) return
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setSession(currentUser)
        setAuthLoading(false)
        setIsSigningIn(false)
      })
    }

    initializeAuth()

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  async function signInWithGoogle() {
    if (!auth) return
    setAuthError('')
    setIsSigningIn(true)
    try {
      await setPersistence(auth, browserLocalPersistence)
      const result = await signInWithPopup(auth, googleProvider)
      setSession(result.user)
      setAuthLoading(false)
      setIsSigningIn(false)
    } catch (error) {
      let authFailure = error
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/web-storage-unsupported') {
        try {
          await signInWithRedirect(auth, googleProvider)
          return
        } catch (redirectError) {
          authFailure = redirectError
        }
      }
      const messages = {
        'auth/popup-closed-by-user': 'The Google sign-in window was closed before login finished.',
        'auth/unauthorized-domain': `Firebase does not allow ${window.location.hostname} yet. Add this domain in Firebase Authentication settings.`,
        'auth/operation-not-allowed': 'Google sign-in is not enabled in Firebase Authentication yet.',
      }
      setAuthError(messages[authFailure.code] || 'Google sign-in could not start. Check your Firebase Authentication settings and try again.')
      setIsSigningIn(false)
    }
  }

  async function signOut() {
    await firebaseSignOut(auth)
    setSession(null)
  }

  async function sendMessage(message = input) {
  const trimmedMessage = message.trim()

  if (!trimmedMessage || isTyping) return

  const userMessage = {
    role: 'user',
    text: trimmedMessage,
  }

  const conversation = [...messages, userMessage]

  setMessages(conversation)
  setInput('')
  setIsTyping(true)

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: conversation,
      }),
    })

    const contentType = response.headers.get('content-type') || ''

    if (!contentType.includes('application/json')) {
      const rawText = await response.text()

      console.error('Non-JSON response from /api/chat:', rawText)

      throw new Error(
        `Server returned HTML instead of JSON. Status: ${response.status}`
      )
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'ChatPilot could not answer right now.')
    }

    setMessages((current) => [
      ...current,
      {
        role: 'assistant',
        text: data.text,
      },
    ])
  } catch (error) {
    setMessages((current) => [
      ...current,
      {
        role: 'assistant',
        text: `I could not answer that yet. ${error.message}`,
      },
    ])
  } finally {
    setIsTyping(false)
  }
}
  function resetQuiz() {
    setQuizIndex(0)
    setSelectedAnswer('')
    setScore(0)
    setQuizFinished(false)
  }

  function chooseAnswer(option) {
    if (selectedAnswer) return
    setSelectedAnswer(option)
    if (option === quizQuestions[quizIndex].answer) setScore((current) => current + 1)
  }

  function nextQuestion() {
    if (quizIndex === quizQuestions.length - 1) setQuizFinished(true)
    else { setQuizIndex((current) => current + 1); setSelectedAnswer('') }
  }

  const currentQuestion = quizQuestions[quizIndex]

  if (authLoading) return <div className="auth-loading"><span className="brand-mark">✦</span><p>Preparing your workspace...</p></div>
  if (!session) return <WelcomeScreen error={authError} isSigningIn={isSigningIn} onSignIn={signInWithGoogle} />

  const user = session
  const userName = user.displayName || user.email?.split('@')[0] || 'Learner'
  const userInitials = userName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className={`app-shell ${darkMode ? 'dark' : ''}`}>
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✦</span><span>chatpilot</span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          {[['chat', '◌', 'Study chat'], ['flashcards', '▣', 'Flashcards'], ['quiz', '✓', 'Quick quiz']].map(([view, icon, label]) => <button className={`nav-item ${activeView === view ? 'active' : ''}`} key={view} onClick={() => setActiveView(view)} type="button"><span>{icon}</span>{label}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="streak-card"><span className="streak-icon">✦</span><div><strong>4 day streak</strong><small>Keep the momentum going</small></div></div><button className="profile" onClick={signOut} type="button" title="Sign out"><span className="avatar">{userInitials}</span><span><strong>{userName}</strong><small>Sign out</small></span><span className="more">•••</span></button></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div><span className="eyebrow">PERSONAL LEARNING SPACE</span><h1>{activeView === 'chat' ? `Good morning, ${userName.split(' ')[0]}` : activeView === 'flashcards' ? 'Review your knowledge' : 'Test your understanding'}</h1></div><button className="theme-button" onClick={() => setDarkMode((current) => !current)} type="button" aria-label="Toggle theme">{darkMode ? '☀' : '☾'}</button></header>
        {activeView === 'chat' && <section className="content-grid"><div className="chat-panel panel"><div className="panel-heading"><div><span className="section-kicker">AI STUDY ASSISTANT</span><h2>What are we learning today?</h2></div><button className="quiet-button" onClick={() => setMessages([{ role: 'assistant', text: 'Welcome back. What would you like to learn today?' }])} type="button">Clear chat</button></div><div className="messages" aria-live="polite">{messages.map((message, index) => <div className={`message-row ${message.role}`} key={`${message.role}-${index}`}><div className="message-avatar">{message.role === 'assistant' ? '✦' : 'AS'}</div><div className="message-bubble"><span className="message-name">{message.role === 'assistant' ? 'ChatPilot' : 'You'}</span><p>{message.text}</p></div></div>)}{isTyping && <div className="message-row assistant"><div className="message-avatar">✦</div><div className="message-bubble typing"><span></span><span></span><span></span></div></div>}</div><div className="prompt-area"><span className="section-kicker">TRY ASKING</span><div className="prompt-list">{starterPrompts.map((prompt) => <button type="button" key={prompt} onClick={() => sendMessage(prompt)}>{prompt}<span>↗</span></button>)}</div><form className="chat-form" onSubmit={(event) => { event.preventDefault(); sendMessage() }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask anything about your studies..." aria-label="Ask ChatPilot" /><button type="submit" aria-label="Send message">↑</button></form><small className="mock-note">ChatPilot can answer questions with current web context.</small></div></div><aside className="right-rail"><div className="panel today-card"><span className="section-kicker">TODAY'S PROGRESS</span><div className="progress-ring"><strong>68%</strong><span>complete</span></div><p>You are building a consistent learning habit.</p><div className="progress-line"><span style={{ width: '68%' }}></span></div><div className="stats"><span><strong>12</strong> questions</span><span><strong>24m</strong> study time</span></div></div><div className="panel focus-card"><span className="section-kicker">YOUR FOCUS</span><h3>React fundamentals</h3><p>Continue where you left off in your frontend study path.</p><button type="button" onClick={() => setActiveView('flashcards')}>Open flashcards <span>→</span></button></div></aside></section>}
        {activeView === 'flashcards' && <section className="single-view"><div className="view-intro"><div><span className="section-kicker">ACTIVE DECK · REACT FUNDAMENTALS</span><h2>Build recall, one card at a time.</h2><p>Flip each card to reveal the answer. Short, focused reviews make knowledge stick.</p></div><span className="counter">{cardIndex + 1} / {flashcards.length}</span></div><button className="flashcard" onClick={() => setIsCardFlipped((current) => !current)} type="button"><span className="card-label">{isCardFlipped ? 'ANSWER' : 'QUESTION'}</span><strong>{isCardFlipped ? flashcards[cardIndex].back : flashcards[cardIndex].front}</strong><small>Click to flip</small></button><div className="card-controls"><button type="button" onClick={() => { setCardIndex((current) => (current - 1 + flashcards.length) % flashcards.length); setIsCardFlipped(false) }}>← Previous</button><button className="primary-button" type="button" onClick={() => { setCardIndex((current) => (current + 1) % flashcards.length); setIsCardFlipped(false) }}>Next card →</button></div></section>}
        {activeView === 'quiz' && <section className="single-view quiz-view"><div className="view-intro"><div><span className="section-kicker">QUICK QUIZ · REACT FUNDAMENTALS</span><h2>Check what you know.</h2><p>Three questions. No pressure. Just a clearer picture of what to review next.</p></div><span className="counter">{quizFinished ? 'Complete' : `${quizIndex + 1} / ${quizQuestions.length}`}</span></div>{quizFinished ? <div className="quiz-result"><span className="result-star">✦</span><span className="section-kicker">QUIZ COMPLETE</span><h3>{score} out of {quizQuestions.length}</h3><p>{score === quizQuestions.length ? 'Excellent work. You have a strong grasp of these fundamentals.' : 'A solid start. Review the flashcards and try again when you are ready.'}</p><button className="primary-button" type="button" onClick={resetQuiz}>Try again</button></div> : <div className="quiz-card"><span className="question-number">QUESTION {quizIndex + 1}</span><h3>{currentQuestion.question}</h3><div className="options">{currentQuestion.options.map((option) => <button className={selectedAnswer ? option === currentQuestion.answer ? 'correct' : option === selectedAnswer ? 'wrong' : '' : ''} key={option} onClick={() => chooseAnswer(option)} type="button">{option}<span>{selectedAnswer && option === currentQuestion.answer ? '✓' : ''}</span></button>)}</div>{selectedAnswer && <button className="primary-button next-question" type="button" onClick={nextQuestion}>{quizIndex === quizQuestions.length - 1 ? 'See results' : 'Next question →'}</button>}</div>}</section>}
      </main>
    </div>
  )
}

export default App
