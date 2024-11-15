import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import {store} from './app/store'
import ToastNotification from './Components/ToastNotification.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <ToastNotification />
      <App />
    </Provider>
  </StrictMode>
)
