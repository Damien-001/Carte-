import React, { useState, useEffect } from 'react';
import {
  Printer,
  DownloadSimple,
  Sparkle,
  CaretDown,
  ArrowCounterClockwise,
  Sun,
  Moon,
  DeviceMobile,
  X,
  Laptop,
  AppleLogo,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { DemoCardSample, ThemeMode } from '../types';
import { DEMO_CARDS } from '../constants/presets';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSelectDemoCard: (demo: DemoCardSample) => void;
  onDownloadPdf: () => void;
  onResetSettings: () => void;
  isGenerating: boolean;
  hasImage: boolean;
  totalCards: number;
}

export function Header({
  theme,
  onToggleTheme,
  onSelectDemoCard,
  onDownloadPdf,
  onResetSettings,
  isGenerating,
  hasImage,
  totalCards,
}: HeaderProps) {
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    // Check if app is already running in PWA standalone mode
    const isStandaloneApp =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneApp);

    // Listen for Chrome/Android/Desktop beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  return (
    <header
      className={`w-full px-4 lg:px-8 py-3.5 border-b backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between gap-4 transition-colors duration-200 ${
        isDark
          ? 'border-zinc-800/80 bg-[#07070a]/90 text-zinc-100'
          : 'border-slate-200/90 bg-white/90 text-slate-800 shadow-xs'
      }`}
    >
      {/* Brand logo & Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="bezel-outer p-1 rounded-2xl">
          <div
            className={`bezel-inner p-2 rounded-xl flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
            }`}
          >
            <Printer size={20} weight="duotone" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1
              className={`text-sm font-bold tracking-tight ${
                isDark ? 'text-zinc-100' : 'text-slate-900'
              }`}
            >
              Planche Express
            </h1>
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase rounded-full ${
                isDark
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}
            >
              A4 Studio
            </span>
          </div>
          <p
            className={`text-[11px] ${
              isDark ? 'text-zinc-500' : 'text-slate-500'
            }`}
          >
            Générateur d'imposition & traits de coupe
          </p>
        </div>
      </div>

      {/* Middle Controls & PWA Install Button */}
      <div className="hidden md:flex items-center gap-3">
        {/* PWA Install Button (If not already installed) */}
        {!isStandalone && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 border border-indigo-400/40 shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all group"
          >
            <DeviceMobile size={16} weight="fill" className="group-hover:scale-110 transition-transform" />
            <span>Installer l'App</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={isDark ? 'Passer en Mode Clair' : 'Passer en Mode Sombre'}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 ${
            isDark
              ? 'bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-amber-400'
              : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-indigo-600 shadow-xs'
          }`}
        >
          {isDark ? <Sun size={15} weight="fill" /> : <Moon size={15} weight="fill" />}
          <span>{isDark ? 'Mode Clair' : 'Mode Sombre'}</span>
        </button>

        {/* Reset All Button */}
        <button
          type="button"
          onClick={onResetSettings}
          title="Réinitialiser tous les réglages et visuels"
          className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ${
            isDark
              ? 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <ArrowCounterClockwise size={14} />
          <span>Réinitialiser</span>
        </button>

        {/* Demo Cards Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors ${
              isDark
                ? 'text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Sparkle size={14} className="text-amber-400" weight="fill" />
            <span>Exemples de Cartes</span>
            <CaretDown size={12} className={isDark ? 'text-zinc-500' : 'text-slate-400'} />
          </button>

          <AnimatePresence>
            {showDemoMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowDemoMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 w-64 p-2 rounded-2xl border shadow-2xl backdrop-blur-2xl z-30 flex flex-col gap-1 ${
                    isDark
                      ? 'bg-zinc-900/95 border-zinc-800 text-zinc-200'
                      : 'bg-white/95 border-slate-200 text-slate-800 shadow-xl'
                  }`}
                >
                  <div
                    className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      isDark ? 'text-zinc-500' : 'text-slate-400'
                    }`}
                  >
                    Charger une carte démo
                  </div>
                  {DEMO_CARDS.map((demo) => (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => {
                        onSelectDemoCard(demo);
                        setShowDemoMenu(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors group ${
                        isDark
                          ? 'hover:bg-zinc-800/80'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg shrink-0 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-inner"
                        style={{ backgroundColor: demo.accentColor }}
                      >
                        {demo.title[0]}
                      </div>
                      <div className="overflow-hidden">
                        <div
                          className={`text-xs font-semibold transition-colors truncate ${
                            isDark
                              ? 'text-zinc-200 group-hover:text-white'
                              : 'text-slate-800 group-hover:text-slate-950'
                          }`}
                        >
                          {demo.title}
                        </div>
                        <div
                          className={`text-[10px] truncate ${
                            isDark ? 'text-zinc-500' : 'text-slate-500'
                          }`}
                        >
                          {demo.subtitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Mobile Install Button */}
        {!isStandalone && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="md:hidden px-3 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 flex items-center gap-1.5"
          >
            <DeviceMobile size={16} />
            <span>App</span>
          </button>
        )}

        <motion.button
          type="button"
          onClick={onDownloadPdf}
          disabled={!hasImage || isGenerating}
          whileTap={hasImage && !isGenerating ? { scale: 0.97 } : {}}
          className={`group relative pl-4 pr-2 py-2 rounded-full font-semibold text-xs flex items-center gap-3 transition-all duration-300 ${
            hasImage && !isGenerating
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 cursor-pointer border border-indigo-400/30'
              : isDark
              ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          <span>
            {isGenerating
              ? 'Génération en cours…'
              : `Télécharger PDF (${totalCards})`}
          </span>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 ${
              hasImage && !isGenerating
                ? 'bg-white/20 text-white group-hover:scale-105 group-hover:bg-white/30'
                : isDark
                ? 'bg-zinc-800 text-zinc-600'
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            <DownloadSimple
              size={14}
              weight="bold"
              className={isGenerating ? 'animate-bounce' : ''}
            />
          </div>
        </motion.button>
      </div>

      {/* PWA Installation Instructions Modal */}
      <AnimatePresence>
        {showInstallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-lg p-6 rounded-3xl border shadow-2xl ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <DeviceMobile size={28} weight="duotone" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Installer Planche Express Studio</h3>
                  <p className="text-xs text-zinc-400">Application native PC, Mac, Android & iOS</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 flex items-start gap-3">
                  <Laptop size={20} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-indigo-300 block mb-0.5">Sur PC & Mac (Chrome, Edge, Brave) :</strong>
                    <span>Cliquez sur l'icône <strong>« Installer » (+)</strong> située dans la barre d'adresse du navigateur.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-700/50 flex items-start gap-3">
                  <DeviceMobile size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-300 block mb-0.5">Sur Android (Chrome) :</strong>
                    <span>Appuyez sur le menu <strong>⋮ (3 points)</strong> en haut à droite, puis sélectionnez <strong>« Installer l'application »</strong>.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-700/50 flex items-start gap-3">
                  <AppleLogo size={20} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 block mb-0.5">Sur iPhone & iPad (Safari) :</strong>
                    <span>Appuyez sur le bouton <strong>Partager ⎋</strong> en bas de Safari, puis sélectionnez <strong>« Sur l'écran d'accueil »</strong>.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowInstallModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  J'ai compris
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
