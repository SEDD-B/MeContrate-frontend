import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from './shared/components/ui/provider';
import { AuthProvider } from './shared/context/AuthContext';
import App from './app/App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider>
    <AuthProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthProvider>
  </Provider>
)
