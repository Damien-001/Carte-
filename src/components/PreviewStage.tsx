import React, { useState } from 'react';
import {
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ArrowsOut,
  Image as PhImage,
  Columns,
  Rows,
  BoundingBox,
  Prohibit,
  Copy,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { CardSettings, GridInfo, ThemeMode } from '../types';

interface PreviewStageProps {
  theme: ThemeMode;
  imageRecto: string | null;
  imageVerso: string | null;
  activeFace: 'recto' | 'verso';
  onActiveFaceChange: (face: 'recto' | 'verso') => void;
  settings: CardSettings;
  grid: GridInfo;
  onToggleSlot: (index: number) => void;
}

export function PreviewStage({
  theme,
  imageRecto,
  imageVerso,
  activeFace,
  onActiveFaceChange,
  settings,
  grid,
  onToggleSlot,
}: PreviewStageProps) {
  const isDark = theme === 'dark';
  const [zoom, setZoom] = useState(1);

  const totalCards = grid.cols * grid.rows;
  const disabledSet = new Set(settings.disabledSlots || []);
  const isPortrait = grid.pageWidth < grid.pageHeight;

  const currentImage = activeFace === 'recto' ? imageRecto : imageVerso;
  const currentRotation = activeFace === 'recto' ? settings.rotationRecto : settings.rotationVerso;
  const currentFitMode = activeFace === 'recto' ? settings.fitModeRecto : settings.fitModeVerso;

  const handleZoomIn = () => setZoom((z) => Math.min(2, z + 0.15));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, z - 0.15));
  const handleResetZoom = () => setZoom(1);

  return (
    <main
      className={`flex-1 flex flex-col relative overflow-hidden h-full select-none min-h-0 transition-colors duration-200 ${
        isDark ? 'bg-[#1a1a1e]' : 'bg-[#e2e8f0]'
      }`}
    >
      {/* Studio Backdrop grid texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `
            : `
              linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
            `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Stage Top Bar: Page Selection (Recto / Verso) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div
          className={`p-1 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-1 ${
            isDark
              ? 'bg-zinc-900/95 border-zinc-800'
              : 'bg-white/95 border-slate-200 shadow-md'
          }`}
        >
          <button
            type="button"
            onClick={() => onActiveFaceChange('recto')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
              activeFace === 'recto'
                ? 'bg-indigo-600 text-white shadow-md'
                : isDark
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>PAGE 1 : RECTO</span>
            {imageRecto && <span className="text-[10px] opacity-75">(Chargé)</span>}
          </button>

          <button
            type="button"
            onClick={() => onActiveFaceChange('verso')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
              activeFace === 'verso'
                ? 'bg-indigo-600 text-white shadow-md'
                : isDark
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Copy size={13} />
            <span>PAGE 2 : VERSO</span>
            {imageVerso && <span className="text-[10px] opacity-75">(Chargé)</span>}
          </button>
        </div>
      </div>

      {/* Floating Toolbar: Zoom & View controls */}
      <div
        className={`absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-2xl border shadow-2xl backdrop-blur-xl ${
          isDark
            ? 'bg-zinc-900/90 border-zinc-800/80 text-zinc-300'
            : 'bg-white/90 border-slate-200 text-slate-700 shadow-md'
        }`}
      >
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom arrière"
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MagnifyingGlassMinus size={16} />
        </button>

        <button
          type="button"
          onClick={handleResetZoom}
          className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-xl transition-colors ${
            isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-800' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom avant"
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MagnifyingGlassPlus size={16} />
        </button>

        <div className={`w-px h-4 my-auto mx-1 ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />

        <button
          type="button"
          onClick={handleResetZoom}
          title="Ajuster l'affichage"
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ArrowsOut size={16} />
        </button>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-auto relative min-h-0">
        <div
          className="transition-transform duration-300 ease-out flex items-center justify-center py-6"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Pristine Clean White A4 Paper Sheet */}
          <div
            className={`relative bg-white transition-all duration-300 rounded-[1px] shrink-0 ${
              isDark ? 'shadow-[0_20px_60px_rgba(0,0,0,0.7)]' : 'shadow-[0_15px_45px_rgba(0,0,0,0.18)] border border-slate-200'
            }`}
            style={{
              width: isPortrait ? 'min(68vw, 540px)' : 'min(82vw, 760px)',
              aspectRatio: `${grid.pageWidth} / ${grid.pageHeight}`,
            }}
          >
            {/* Card Grid Placement on A4 Paper */}
            <div
              className="absolute"
              style={{
                left: `${(grid.offsetX / grid.pageWidth) * 100}%`,
                top: `${(grid.offsetY / grid.pageHeight) * 100}%`,
                width: `${(grid.totalWidth / grid.pageWidth) * 100}%`,
                height: `${(grid.totalHeight / grid.pageHeight) * 100}%`,
                display: 'grid',
                gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
                gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
                columnGap: grid.totalWidth > 0 ? `${(settings.spacingX / grid.totalWidth) * 100}%` : '0%',
                rowGap: grid.totalHeight > 0 ? `${(settings.spacingY / grid.totalHeight) * 100}%` : '0%',
              }}
            >
              {Array.from({ length: totalCards }).map((_, i) => {
                const isDisabled = disabledSet.has(i);
                return (
                  <div
                    key={i}
                    onClick={() => onToggleSlot(i)}
                    title={isDisabled ? `Emplacement #${i + 1} désactivé — Cliquer pour activer` : `Emplacement #${i + 1} actif — Cliquer pour désactiver`}
                    style={{ aspectRatio: `${settings.width} / ${settings.height}` }}
                    className={`relative overflow-hidden cursor-pointer transition-all duration-200 flex items-center justify-center group ${
                      isDisabled
                        ? 'bg-slate-100/80 border border-dashed border-slate-300 opacity-30 hover:opacity-70'
                        : currentImage
                        ? 'bg-white hover:ring-2 hover:ring-indigo-500/50'
                        : 'bg-slate-50 border border-dashed border-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {!isDisabled ? (
                      <AnimatePresence mode="wait">
                        {currentImage ? (
                          <motion.img
                            key={`card-img-${activeFace}`}
                            src={currentImage}
                            alt=""
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            style={{
                              transform: `rotate(${currentRotation}deg)`,
                              objectFit: currentFitMode === 'contain' ? 'contain' : currentFitMode === 'cover' ? 'cover' : 'fill',
                            }}
                            className="w-full h-full block"
                          />
                        ) : (
                          <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full h-full flex flex-col items-center justify-center p-1 text-center"
                          >
                            <PhImage size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            <span className="text-[9px] font-mono font-semibold text-indigo-600 mt-1 uppercase">
                              {activeFace} #{i + 1}
                            </span>
                            <span className="text-[8px] font-mono text-slate-400">
                              {settings.width}×{settings.height}mm
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-0.5 text-slate-400">
                        <Prohibit size={14} />
                        <span className="text-[8px] font-mono font-bold">DÉSACTIVÉ</span>
                      </div>
                    )}

                    {/* Slot Position Number Badge */}
                    {settings.showNumbers && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/90 text-white font-mono text-[8px] font-bold z-20 pointer-events-none shadow-xs">
                        #{i + 1}
                      </div>
                    )}

                    {/* Crop marks preview overlay */}
                    {settings.showCropMarks && !isDisabled && (
                      <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-slate-700" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-slate-700" />
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-slate-700" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-slate-700" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Fixed Bottom Bar: Live Statistics */}
      <footer
        className={`w-full px-6 py-3 border-t backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 shrink-0 sticky bottom-0 z-30 transition-colors duration-200 ${
          isDark
            ? 'border-zinc-800/80 bg-[#07070a]/95 text-zinc-300'
            : 'border-slate-200 bg-white/95 text-slate-700 shadow-md'
        }`}
      >
        <div className="flex items-center gap-4 text-xs font-mono">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
              isDark
                ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <Columns size={14} className="text-indigo-500" />
            <span>{grid.cols} cols</span>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
              isDark
                ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <Rows size={14} className="text-indigo-500" />
            <span>{grid.rows} rangées</span>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold ${
              isDark
                ? 'bg-indigo-950/40 border-indigo-800/50 text-indigo-300'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}
          >
            <BoundingBox size={14} className="text-indigo-500" />
            <span>{grid.activeCount} / {totalCards} cartes ({activeFace.toUpperCase()})</span>
          </div>
        </div>

        <div
          className={`flex items-center gap-4 text-xs font-mono ${
            isDark ? 'text-zinc-500' : 'text-slate-400'
          }`}
        >
          <span>
            Surface occupée :{' '}
            <strong className={isDark ? 'text-zinc-300 font-semibold' : 'text-slate-800 font-semibold'}>
              {grid.coveragePercent}%
            </strong>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            A4 Portrait : {grid.pageWidth} × {grid.pageHeight} mm
          </span>
        </div>
      </footer>
    </main>
  );
}
