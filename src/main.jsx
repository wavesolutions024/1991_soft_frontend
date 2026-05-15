
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ContextProvider from './Context.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
<ContextProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>

</ContextProvider>
  

)
