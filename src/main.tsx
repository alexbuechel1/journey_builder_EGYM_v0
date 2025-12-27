import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ChecklistPage } from './pages/ChecklistPage'
import { JourneyProvider } from './contexts/JourneyContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="*" element={
          <JourneyProvider>
            <App />
          </JourneyProvider>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
