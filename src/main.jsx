import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Auth/AuthContext.jsx'
import { SnackbarProvider } from 'notistack'
import 'leaflet/dist/leaflet.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <SnackbarProvider>
    <AuthProvider>
    <App />
    </AuthProvider>
    </SnackbarProvider>
    </BrowserRouter>
  </StrictMode>
)
