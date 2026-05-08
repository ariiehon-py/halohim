import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Toaster diletakkan di sini agar notifikasi bisa muncul di semua halaman */}
    <Toaster position="top-center" richColors />
    <App />
  </React.StrictMode>,
)