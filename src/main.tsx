import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';

// Register service worker
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // Dynamic import without top-level await
  import('workbox-window').then(({ Workbox }) => {
    const wb = new Workbox('/service-worker.js');
    
    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        if (confirm('Yeni versiyon mevcut. Yenilemek ister misiniz?')) {
          window.location.reload();
        }
      }
    });

    wb.addEventListener('waiting', () => {
      wb.messageSkipWaiting();
    });

    wb.register().catch(error => {
      console.warn('Service worker registration failed:', error);
    });
  }).catch(error => {
    console.warn('Service worker setup failed:', error);
  });
}

// Prevent zooming on mobile devices
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
document.getElementsByTagName('head')[0].appendChild(meta);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);