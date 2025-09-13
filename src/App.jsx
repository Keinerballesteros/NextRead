import { useState } from 'react'
import './App.css'
import LoginPage from './pages/auth/LoginPage/LoginPage'
import RegisterPage from './pages/auth/RegisterPage/RegisterPage'
import ConfirmEmailPage from './pages/auth/ConfirmEmailPage/ConfirmEmailPage'
import ChangePassword from './pages/auth/ChangePassword/ChangePasswordPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeHooks from './playground/HomeHooks'
function App() {
  

  return (
    <>
     <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomeHooks/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/confirm' element={<ConfirmEmailPage/>}/>
      <Route path='/change' element={<ChangePassword/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
