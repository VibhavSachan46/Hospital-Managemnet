import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AccountProvider } from './AccountContext'
import LandingPage from './component/LandingPage'
import Doctor from './component/Doctor'

function App() {

  return (
    <div className='bg-gray-100'>
      <AccountProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/doctor" element={<Doctor />} />
            
          </Routes>
        </Router>
      </AccountProvider>
    </div>
  )
}

export default App
