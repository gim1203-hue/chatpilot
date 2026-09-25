import { useState } from 'react'
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

function App() {
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

  function sendMessage(message = input) {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isTyping) return
    setMessages((current) => [...current, { role: 'user', text: trimmedMessage }])
    setInput('')
    setIsTyping(true)
    window.setTimeout(() => {
      setMessages((current) => [...current, { role: 'assistant', text: `Great question. Start by breaking “${trimmedMessage}” into a small example, then test each part in the browser. I can help you explore it step by step.` }])
      setIsTyping(false)
    }, 700)
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

  return (
    <div className={`app-shell ${darkMode ? 'dark' : ''}`}>
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✦</span><span>chatpilot</span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          {[['chat', '◌', 'Study chat'], ['flashcards', '▣', 'Flashcards'], ['quiz', '✓', 'Quick quiz']].map(([view, icon, label]) => <button className={`nav-item ${activeView === view ? 'active' : ''}`} key={view} onClick={() => setActiveView(view)} type="button"><span>{icon}</span>{label}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="streak-card"><span className="streak-icon">✦</span><div><strong>4 day streak</strong><small>Keep the momentum going</small></div></div><button className="profile" type="button"><span className="avatar">AS</span><span><strong>Alex Student</strong><small>Personal workspace</small></span><span className="more">•••</span></button></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div><span className="eyebrow">PERSONAL LEARNING SPACE</span><h1>{activeView === 'chat' ? 'Good morning, Alex' : activeView === 'flashcards' ? 'Review your knowledge' : 'Test your understanding'}</h1></div><button className="theme-button" onClick={() => setDarkMode((current) => !current)} type="button" aria-label="Toggle theme">{darkMode ? '☀' : '☾'}</button></header>
        {activeView === 'chat' && <section className="content-grid"><div className="chat-panel panel"><div className="panel-heading"><div><span className="section-kicker">AI STUDY ASSISTANT</span><h2>What are we learning today?</h2></div><button className="quiet-button" onClick={() => setMessages([{ role: 'assistant', text: 'Welcome back. What would you like to learn today?' }])} type="button">Clear chat</button></div><div className="messages" aria-live="polite">{messages.map((message, index) => <div className={`message-row ${message.role}`} key={`${message.role}-${index}`}><div className="message-avatar">{message.role === 'assistant' ? '✦' : 'AS'}</div><div className="message-bubble"><span className="message-name">{message.role === 'assistant' ? 'ChatPilot' : 'You'}</span><p>{message.text}</p></div></div>)}{isTyping && <div className="message-row assistant"><div className="message-avatar">✦</div><div className="message-bubble typing"><span></span><span></span><span></span></div></div>}</div><div className="prompt-area"><span className="section-kicker">TRY ASKING</span><div className="prompt-list">{starterPrompts.map((prompt) => <button type="button" key={prompt} onClick={() => sendMessage(prompt)}>{prompt}<span>↗</span></button>)}</div><form className="chat-form" onSubmit={(event) => { event.preventDefault(); sendMessage() }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask anything about your studies..." aria-label="Ask ChatPilot" /><button type="submit" aria-label="Send message">↑</button></form><small className="mock-note">ChatPilot is using thoughtful mock responses for now. Your learning data stays in this browser.</small></div></div><aside className="right-rail"><div className="panel today-card"><span className="section-kicker">TODAY'S PROGRESS</span><div className="progress-ring"><strong>68%</strong><span>complete</span></div><p>You are building a consistent learning habit.</p><div className="progress-line"><span style={{ width: '68%' }}></span></div><div className="stats"><span><strong>12</strong> questions</span><span><strong>24m</strong> study time</span></div></div><div className="panel focus-card"><span className="section-kicker">YOUR FOCUS</span><h3>React fundamentals</h3><p>Continue where you left off in your frontend study path.</p><button type="button" onClick={() => setActiveView('flashcards')}>Open flashcards <span>→</span></button></div></aside></section>}
        {activeView === 'flashcards' && <section className="single-view"><div className="view-intro"><div><span className="section-kicker">ACTIVE DECK · REACT FUNDAMENTALS</span><h2>Build recall, one card at a time.</h2><p>Flip each card to reveal the answer. Short, focused reviews make knowledge stick.</p></div><span className="counter">{cardIndex + 1} / {flashcards.length}</span></div><button className="flashcard" onClick={() => setIsCardFlipped((current) => !current)} type="button"><span className="card-label">{isCardFlipped ? 'ANSWER' : 'QUESTION'}</span><strong>{isCardFlipped ? flashcards[cardIndex].back : flashcards[cardIndex].front}</strong><small>Click to flip</small></button><div className="card-controls"><button type="button" onClick={() => { setCardIndex((current) => (current - 1 + flashcards.length) % flashcards.length); setIsCardFlipped(false) }}>← Previous</button><button className="primary-button" type="button" onClick={() => { setCardIndex((current) => (current + 1) % flashcards.length); setIsCardFlipped(false) }}>Next card →</button></div></section>}
        {activeView === 'quiz' && <section className="single-view quiz-view"><div className="view-intro"><div><span className="section-kicker">QUICK QUIZ · REACT FUNDAMENTALS</span><h2>Check what you know.</h2><p>Three questions. No pressure. Just a clearer picture of what to review next.</p></div><span className="counter">{quizFinished ? 'Complete' : `${quizIndex + 1} / ${quizQuestions.length}`}</span></div>{quizFinished ? <div className="quiz-result"><span className="result-star">✦</span><span className="section-kicker">QUIZ COMPLETE</span><h3>{score} out of {quizQuestions.length}</h3><p>{score === quizQuestions.length ? 'Excellent work. You have a strong grasp of these fundamentals.' : 'A solid start. Review the flashcards and try again when you are ready.'}</p><button className="primary-button" type="button" onClick={resetQuiz}>Try again</button></div> : <div className="quiz-card"><span className="question-number">QUESTION {quizIndex + 1}</span><h3>{currentQuestion.question}</h3><div className="options">{currentQuestion.options.map((option) => <button className={selectedAnswer ? option === currentQuestion.answer ? 'correct' : option === selectedAnswer ? 'wrong' : '' : ''} key={option} onClick={() => chooseAnswer(option)} type="button">{option}<span>{selectedAnswer && option === currentQuestion.answer ? '✓' : ''}</span></button>)}</div>{selectedAnswer && <button className="primary-button next-question" type="button" onClick={nextQuestion}>{quizIndex === quizQuestions.length - 1 ? 'See results' : 'Next question →'}</button>}</div>}</section>}
      </main>
    </div>
  )
}

export default App
