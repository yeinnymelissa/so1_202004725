import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Mainrouter } from './routers/Mainrouter'
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient({});

function App() {
  const [count, setCount] = useState(0)

  return (
    <QueryClientProvider client={queryClient}>
      <Mainrouter />
    </QueryClientProvider>
  )
}

export default App
