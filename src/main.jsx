import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './paginas/Login.jsx' 

// Este es el punto donde React toma el control del <div id="root"> de tu index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
)