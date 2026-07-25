import React, { useState } from 'react';
import {
  Printer,
  DownloadSimple,
  Sparkle,
  CaretDown,
  ArrowCounterClockwise,
  Sun,
  Moon,
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

  const isDark = theme === 'dark';

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

      {/* Middle Controls & Demo Loader */}
      <div className="hidden md:flex items-center gap-3">
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

      {/* Right Action Button: Button-in-Button CTA */}
      <div className="flex items-center gap-2">
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

          {/* Nested inner circle icon */}
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
    </header>
  );
}
