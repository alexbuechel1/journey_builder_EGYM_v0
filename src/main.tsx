import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { JourneyProvider } from './contexts/JourneyContext'
import { SimulatorProvider } from './contexts/SimulatorContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JourneyProvider>
      <SimulatorProvider>
        <App />
      </SimulatorProvider>
    </JourneyProvider>
  </StrictMode>,
)
