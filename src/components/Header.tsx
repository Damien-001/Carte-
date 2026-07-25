import React, { useState } from 'react';
import {
  Printer,
  DownloadSimple,
  Sparkle,
  CaretDown,
  ArrowCounterClockwise,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { DemoCardSample } from '../types';
import { DEMO_CARDS } from '../constants/presets';

interface HeaderProps {
  onSelectDemoCard: (demo: DemoCardSample) => void;
  onDownloadPdf: () => void;
  onResetSettings: () => void;
  isGenerating: boolean;
  hasImage: boolean;
  totalCards: number;
}

export function Header({
  onSelectDemoCard,
  onDownloadPdf,
  onResetSettings,
  isGenerating,
  hasImage,
  totalCards,
}: HeaderProps) {
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  return (
    <header className="w-full px-4 lg:px-8 py-3.5 border-b border-zinc-800/80 bg-[#07070a]/90 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between gap-4">
      {/* Brand logo & Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="bezel-outer p-1 rounded-2xl">
          <div className="bezel-inner p-2 rounded-xl flex items-center justify-center bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Printer size={20} weight="duotone" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-zinc-100 tracking-tight">
              Planche Express
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              A4 Studio
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Générateur d'imposition & traits de coupe
          </p>
        </div>
      </div>

      {/* Middle Controls & Demo Loader */}
      <div className="hidden md:flex items-center gap-3">
        {/* Reset All Button */}
        <button
          type="button"
          onClick={onResetSettings}
          title="Réinitialiser tous les réglages et visuels"
          className="px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 flex items-center gap-1.5 transition-colors"
        >
          <ArrowCounterClockwise size={14} />
          <span>Réinitialiser</span>
        </button>

        {/* Demo Cards Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 flex items-center gap-2 transition-colors"
          >
            <Sparkle size={14} className="text-amber-400" weight="fill" />
            <span>Exemples de Cartes</span>
            <CaretDown size={12} className="text-zinc-500" />
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
                  className="absolute right-0 mt-2 w-64 p-2 rounded-2xl bg-zinc-900/95 border border-zinc-800 shadow-2xl backdrop-blur-2xl z-30 flex flex-col gap-1"
                >
                  <div className="px-2 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
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
                      className="w-full p-2.5 rounded-xl text-left hover:bg-zinc-800/80 flex items-center gap-3 transition-colors group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg shrink-0 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-inner"
                        style={{ backgroundColor: demo.accentColor }}
                      >
                        {demo.title[0]}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                          {demo.title}
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate">
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
              : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
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
                : 'bg-zinc-800 text-zinc-600'
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
