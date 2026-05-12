import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home'
import Historique from './pages/historique/historique'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historique" element={<Historique />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
