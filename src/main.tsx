import { createRoot } from 'react-dom/client'
import { Provider } from './shared/components/ui/provider';
import { AuthProvider } from './shared/context/AuthContext';
import App from './app/App.tsx';

const root = document.getElementById("root");

createRoot(root!).render(
  <Provider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>
);
