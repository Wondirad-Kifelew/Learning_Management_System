import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import {BrowserRouter} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
   <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      theme="light"
    />
     <AppContextProvider>
        <App />
     </AppContextProvider>

   </BrowserRouter>
)
