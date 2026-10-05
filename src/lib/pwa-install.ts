/**
 * Capture de l'invite d'installation PWA.
 * `beforeinstallprompt` n'est émis qu'une fois, souvent avant le montage des
 * composants (pages chargées à la demande, Navbar remontée à chaque page) :
 * on le capture au démarrage et on le partage via ce petit store.
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PwaInstallState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstalled: boolean;
}

let state: PwaInstallState = { deferredPrompt: null, isInstalled: false };
const listeners = new Set<() => void>();

const setState = (next: Partial<PwaInstallState>) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};

export const initPwaInstallCapture = () => {
  if (typeof window === 'undefined') return;

  setState({ isInstalled: window.matchMedia('(display-mode: standalone)').matches });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    setState({ deferredPrompt: event as BeforeInstallPromptEvent });
  });

  window.addEventListener('appinstalled', () => {
    setState({ deferredPrompt: null, isInstalled: true });
  });
};

export const subscribePwaInstall = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getPwaInstallState = () => state;

/** Affiche l'invite native ; renvoie true si l'utilisateur a accepté */
export const promptPwaInstall = async (): Promise<boolean> => {
  const { deferredPrompt } = state;
  if (!deferredPrompt) return false;
  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  // Une invite ne peut servir qu'une fois
  setState({ deferredPrompt: null });
  return outcome === 'accepted';
};
