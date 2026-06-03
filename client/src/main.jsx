import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0D1B3E',
          color: '#E8E8F0',
          border: '1px solid rgba(201,168,76,0.3)',
        },
        success: { iconTheme: { primary: '#C9A84C', secondary: '#0D1B3E' } },
        error:   { iconTheme: { primary: '#8B1A2E', secondary: '#E8E8F0' } },
      }}
    />
  </StrictMode>
);
