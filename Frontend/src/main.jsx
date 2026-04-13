import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'

function Root() {
  const [view, setView] = useState(() => {
    // Check if user is already logged in
    const userId = localStorage.getItem('userId');
    return userId ? 'app' : 'login';
  })
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : { fullName: 'User' };
  })

  if (view === 'app') {
    return <App userInfo={userInfo} setUserInfo={setUserInfo} />
  }

  return view === 'signup' ? (
    <Signup onToggle={() => setView('login')} onSuccess={(name) => { setUserInfo({ fullName: name }); localStorage.setItem('userInfo', JSON.stringify({ fullName: name })); setView('app'); }} />
  ) : (
    <Login onToggle={() => setView('signup')} onSuccess={(name) => { setUserInfo({ fullName: name }); localStorage.setItem('userInfo', JSON.stringify({ fullName: name })); setView('app'); }} />
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
