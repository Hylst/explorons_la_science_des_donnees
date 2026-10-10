import React, { useState, useSyncExternalStore } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { getPwaInstallState, promptPwaInstall, subscribePwaInstall } from '@/lib/pwa-install';
import { readStorage, writeStorage } from '@/lib/storage';
import { SITE_NAME } from "@/config/site";

/** État d'installation partagé, capturé au démarrage (voir src/lib/pwa-install.ts) */
const usePwaInstall = () => useSyncExternalStore(subscribePwaInstall, getPwaInstallState);

const isIOSDevice = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;

const installFromPrompt = async () => {
  try {
    await promptPwaInstall();
  } catch (error) {
    console.error('Error during PWA installation:', error);
  }
};

/**
 * PWA Install Button Component
 * Provides functionality to install the app as a PWA with a user-friendly interface
 */
export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { deferredPrompt, isInstalled } = usePwaInstall();
  const [isIOS] = useState(isIOSDevice);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const showInstallPrompt = deferredPrompt !== null;

  /**
   * Handle PWA installation for supported browsers
   */
  const handleInstallClick = installFromPrompt;

  /**
   * Show iOS installation instructions
   */
  const handleIOSInstall = () => {
    setShowIOSInstructions(true);
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  // iOS Instructions Modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Installer sur iOS
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowIOSInstructions(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Suivez ces étapes pour installer {SITE_NAME} sur votre appareil iOS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <p className="text-sm">
                  Appuyez sur le bouton <strong>Partager</strong> 📤 dans Safari
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <p className="text-sm">
                  Faites défiler vers le bas et appuyez sur <strong>"Sur l'écran d'accueil"</strong> 📱
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <p className="text-sm">
                  Appuyez sur <strong>"Ajouter"</strong> pour installer l'application
                </p>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                Une fois installée, vous pourrez accéder à {SITE_NAME} directement depuis votre écran d'accueil, même hors ligne.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main install button
  return (
    <>
      {(showInstallPrompt || isIOS) && (
        <Button
          onClick={isIOS ? handleIOSInstall : handleInstallClick}
          variant="outline"
          size="sm"
          title="Installer l'app"
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
        >
          <Download className="h-4 w-4" />
          {/* Mode compact (barre de navigation entre 1280 et 1536 px) : icône seule, libellé pour les lecteurs d'écran */}
          <span className={compact ? "sr-only 2xl:not-sr-only" : undefined}>Installer l'app</span>
        </Button>
      )}
    </>
  );
};



/**
 * PWA Install Banner Component
 * A more prominent banner for promoting PWA installation
 */
export const PWAInstallBanner: React.FC = () => {
  const { deferredPrompt, isInstalled } = usePwaInstall();
  const [isDismissed, setIsDismissed] = useState(() => readStorage('pwa-banner-dismissed') !== null);

  const handleInstall = installFromPrompt;

  const handleDismiss = () => {
    setIsDismissed(true);
    writeStorage('pwa-banner-dismissed', 'true');
  };

  if (!deferredPrompt || isInstalled || isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold">Installez {SITE_NAME}</h3>
            <p className="text-sm opacity-90">
              Accédez rapidement à vos cours, même hors ligne.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleInstall}
            variant="secondary"
            size="sm"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Download className="h-4 w-4 mr-2" />
            Installer
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallButton;