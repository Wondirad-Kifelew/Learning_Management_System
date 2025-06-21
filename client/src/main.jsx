import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import {BrowserRouter} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


createRoot(document.getElementById('root')).render(
   <BrowserRouter>
   <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      theme="light"
      progressClassName={({ type }) =>
    type === 'success' ? 'bg-blue-600' : undefined//else the default like red for error
  }
    />
     <AppContextProvider>
        <App />
     </AppContextProvider>

   </BrowserRouter>
)
