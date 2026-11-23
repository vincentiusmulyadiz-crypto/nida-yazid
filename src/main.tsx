import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

// Smoothly dismiss initial HTML loader
if (typeof window !== 'undefined') {
  const dismissLoader = () => {
    const el = document.getElementById('joyever-initial-loader');
    if (el && !el.classList.contains('fade-out')) {
      el.classList.add('fade-out');
      setTimeout(() => {
        el.remove();
      }, 500);
    }
  };
  setTimeout(dismissLoader, 350);
}
