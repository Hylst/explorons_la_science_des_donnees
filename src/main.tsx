import { createRoot } from 'react-dom/client'
import { toast } from 'sonner'
import App from './App.tsx'
import { initPwaInstallCapture } from './lib/pwa-install'
import './index.css'

/**
 * Service worker (PWA) : enregistré uniquement en production.
 * En dev, on désinscrit tout worker résiduel pour ne pas servir un cache périmé.
 */
const setupServiceWorker = () => {
  if (!('serviceWorker' in navigator)) return;

  if (!import.meta.env.PROD) {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => registrations.forEach((registration) => registration.unregister()));
    return;
  }

  // Recharge uniquement après une mise à jour demandée par l'utilisateur :
  // à la première visite, clients.claim() déclenche aussi controllerchange.
  let updateRequested = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!updateRequested) return;
    updateRequested = false;
    window.location.reload();
  });

  const promptUpdate = (worker: ServiceWorker) => {
    // Le worker peut s'activer seul (remplacement de l'ancien worker) : le toast n'a alors plus lieu d'être
    worker.addEventListener('statechange', () => {
      if (worker.state === 'activated' || worker.state === 'redundant') {
        toast.dismiss('sw-update');
      }
    });

    toast('Une nouvelle version est disponible.', {
      id: 'sw-update',
      duration: Infinity,
      action: {
        label: 'Actualiser',
        onClick: () => {
          updateRequested = true;
          worker.postMessage({ type: 'SKIP_WAITING' });
        },
      },
    });
  };

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .then((registration) => {
        // Mise à jour déjà téléchargée lors d'une visite précédente
        if (registration.waiting && navigator.serviceWorker.controller) {
          promptUpdate(registration.waiting);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              promptUpdate(newWorker);
            }
          });
        });
      })
      .catch((error) => {
        console.error("Échec de l'enregistrement du service worker :", error);
      });
  });
};

setupServiceWorker();
initPwaInstallCapture();

createRoot(document.getElementById("root")!).render(<App />);
