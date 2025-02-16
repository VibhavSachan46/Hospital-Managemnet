import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import toast, { Toaster } from 'react-hot-toast';
import { AccountProvider } from './AccountContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccountProvider>
      <App />
      <Toaster />
    </AccountProvider>
  </StrictMode>,
)
