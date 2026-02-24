
import './App.css'
import LoginPage from './pages/LoginPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import SignupPage from './pages/SignupPage'
function App() {


  return (
    <>
    <div className='flex-1 full-screen bg-gray-700 text-white'>
      <React.Fragment>
        <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Routes>
      </Router>
      </React.Fragment>
    </div>
    </>
  )
}

export default App
