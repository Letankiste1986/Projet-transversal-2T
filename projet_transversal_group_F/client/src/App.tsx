import { useState } from 'react'
import Home from './pages/home/home'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Home></Home>
    </div>
  )
}

export default App
