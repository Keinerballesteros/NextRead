import { useState } from 'react'
import './App.css'
import RegisterPage from './pages/auth/RegisterPage/RegisterPage'
import ChangePassword from './pages/auth/ChangePassword/ChangePasswordPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
function App() {
  

  return (
    <>
     <BrowserRouter>
    <Routes>
      <Route path='/' element={<RegisterPage/>}/>
      <Route path='/change' element={<ChangePassword/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
