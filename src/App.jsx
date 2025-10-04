import { useState } from 'react'
import './App.css'
import LoginPage from './pages/auth/LoginPage/LoginPage'
import RegisterPage from './pages/auth/RegisterPage/RegisterPage'
import ConfirmEmailPage from './pages/auth/ConfirmEmailPage/ConfirmEmailPage'
import ChangePassword from './pages/auth/ChangePassword/ChangePasswordPage'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import HomeHooks from './playground/HomeHooks'
import HookUseState from './playground/HookUseState'
import HookCallback from './playground/HookCallback'
import HookUseContext from './playground/HookUseContext'
import HookUseDebug from './playground/HookUseDebug'
import HookUseDeferredValue from './playground/HookUseDeferredValue'
import HookUseEffect from './playground/HookUseEffect'
import HookUseId from './playground/HookUseId'
import HookUseImperativeHandle from './playground/HookUseImperativeHandle'
import HookUseInsertionEffect from './playground/HookUseInsertionEffect'
import HookUseLayoutEffect from './playground/HookUseLayoutEffect'
import HookUseMemo from './playground/HookUseMemo'
import HookUseOptimistic from './playground/HookUseOptimistic'
import HookUseReducer from './playground/HookUseReducer'
import HookUseRef from './playground/HookUseRef'
import HookUseActionsState from './playground/HookUseActionState'
import HookUseSyncExternalStore from './playground/HookUseSyncExternalStore'
import HookUseTransition from './playground/HookUseTransition'
import DashboardPage from './pages/DashboardPage'
import CreateBook from './pages/books/CreateBookPage'
import EditBook from './pages/books/EditBookPage'
import BookList from './pages/books/BookListPage'
import OpinionsPage from './pages/opinions/OpinionsPage'
import OpinionsList from './pages/opinions/OpinionsListPage'
import DetailOpinion from './pages/opinions/DetailOpinionPage'
import EditOpinion from './pages/opinions/EditOpinionPage'

function App() {
  

  return (
    <>
     <BrowserRouter>
    <Routes>
      <Route path='/home' element={<HomeHooks/>}/>
      <Route path='/usestate' element={<HookUseState/>}/>
      <Route path='/usecallback' element={<HookCallback/>}/> 
      <Route path='/usecontext' element={<HookUseContext/>}/> 
      <Route path='/usedebug' element={<HookUseDebug/>}/>
      <Route path='/usedeffer' element={<HookUseDeferredValue/>}/>
      <Route path='/useeffect' element={<HookUseEffect/>}/>
      <Route path='/useid' element={<HookUseId/>}/>
      <Route path='/useimperativehandle' element={<HookUseImperativeHandle/>}/>
      <Route path='/useinsertioneffect' element={<HookUseInsertionEffect/>}/>
      <Route path='/uselayouteffect' element={<HookUseLayoutEffect/>}/>
      <Route path='/usememo' element={<HookUseMemo/>}/>
      <Route path='/useoptimistic' element={<HookUseOptimistic/>}/>
      <Route path='/usereducer' element={<HookUseReducer/>}/>
      <Route path='/useref' element={<HookUseRef/>}/>
      <Route path='/useactionstate' element={<HookUseActionsState/>}/>
      <Route path='/usesyncexternalstore' element={<HookUseSyncExternalStore/>}/>
      <Route path='/usetransition' element={<HookUseTransition/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/confirm' element={<ConfirmEmailPage/>}/>
      <Route path='/change' element={<ChangePassword/>}/>
      <Route path='/' element={<DashboardPage/>}/>
      <Route path="/books" element={<BookList />} />
      <Route path="/create" element={<CreateBook />} />
      <Route path="/edit-book/:id" element={<EditBook />} />
      <Route path='/createopinion' element={<OpinionsPage/>}/>
      <Route path='/opinions' element={<OpinionsList/>}/>
      <Route path="/opinions/:id" element={<DetailOpinion />} />
      <Route path="/opinions/edit/:id" element={<EditOpinion />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App