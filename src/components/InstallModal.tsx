import React, { useState, useEffect } from 'react';
import { Download, Monitor, Smartphone, Apple, CheckCircle2, X, Share2, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already running installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install,
  };
}

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/80 text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">How to Install Color Matrix App</h3>
              <p className="text-xs text-slate-400">Run as a standalone desktop or mobile application with offline speed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close install modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {isInstalled ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-white">Application is already installed!</div>
              <p className="text-xs text-slate-300">
                You are currently running the app in standalone mode from your home screen or application launcher.
              </p>
            </div>
          ) : isInstallable ? (
            <div className="p-4 bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-800/70 rounded-xl text-center space-y-3">
              <div className="text-sm font-bold text-white">1-Click Install Available for your Browser</div>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Click below to add the application directly to your desktop or mobile home screen as a high-performance native app.
              </p>
              <button
                onClick={handleNativeInstall}
                className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold text-xs rounded-xl shadow-lg transition-transform transform active:scale-95 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Install Application Now</span>
              </button>
              {installSuccess && (
                <div className="text-xs text-emerald-400 font-medium animate-pulse">
                  Installation accepted! Launching app...
                </div>
              )}
            </div>
          ) : null}

          {/* Platform Guides */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Installation Instructions by Platform
            </h4>

            {/* Desktop: Chrome / Edge / Brave */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>Desktop (Google Chrome / Microsoft Edge / Brave)</span>
              </div>
              <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
                <li>
                  Look at the right side of the address bar at the top of your browser for the{' '}
                  <span className="font-semibold text-cyan-300">Install App</span> icon (looks like a monitor or download symbol).
                </li>
                <li>
                  Alternatively, click the browser menu (<strong>3 dots ⋮</strong> in top right) &rarr;{' '}
                  <span className="font-medium text-white">"Save and share"</span> &rarr;{' '}
                  <span className="font-medium text-cyan-300">"Install page as app..."</span>.
                </li>
                <li>Click <strong>Install</strong>. The app will launch in its own clean window without browser toolbars.</li>
              </ol>
            </div>

            {/* iPhone / iPad */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Apple className="w-4 h-4 text-rose-400" />
                <span>iPhone &amp; iPad (Apple Safari)</span>
              </div>
              <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span>1.</span>
                  <span>
                    Tap the <strong className="text-white">Share</strong> button in the bottom Safari toolbar (<Share2 className="w-3.5 h-3.5 inline text-cyan-400" />).
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span>2.</span>
                  <span>
                    Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-amber-400" />).
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span>3.</span>
                  <span>Tap <strong className="text-white">Add</strong> in the top-right corner. It will now appear alongside your native apps!</span>
                </li>
              </ol>
            </div>

            {/* Android */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Android (Google Chrome / Samsung Internet)</span>
              </div>
              <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
                <li>Tap the <strong>three dots ⋮</strong> in the upper right corner of Chrome.</li>
                <li>Select <strong className="text-white">"Install app"</strong> or <strong className="text-white">"Add to Home screen"</strong>.</li>
                <li>Follow the on-screen prompt to confirm installation.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
