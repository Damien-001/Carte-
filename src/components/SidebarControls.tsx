import React, { useRef } from 'react';
import {
  UploadSimple,
  CheckCircle,
  Scissors,
  GridFour,
  Sparkle,
  Trash,
  ArrowsOutLineHorizontal,
  ArrowsOutLineVertical,
  Selection,
  AlignLeft,
  AlignCenterHorizontal,
  AlignRight,
  AlignTop,
  AlignCenterVertical,
  AlignBottom,
  CheckSquare,
  Square,
  Hash,
  ArrowClockwise,
  FrameCorners,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { CardSettings, PresetCard, DemoCardSample, ThemeMode } from '../types';
import { CARD_PRESETS, DEMO_CARDS } from '../constants/presets';
import { NumInput } from './NumInput';
import { SliderInput } from './SliderInput';

interface SidebarControlsProps {
  theme: ThemeMode;
  settings: CardSettings;
  onSettingsChange: (newSettings: CardSettings) => void;
  imageRecto: string | null;
  imageVerso: string | null;
  onImageRectoChange: (img: string | null) => void;
  onImageVersoChange: (img: string | null) => void;
  activeFace: 'recto' | 'verso';
  onActiveFaceChange: (face: 'recto' | 'verso') => void;
  onSelectDemoCard: (demo: DemoCardSample) => void;
  totalSlots: number;
}

export function SidebarControls({
  theme,
  settings,
  onSettingsChange,
  imageRecto,
  imageVerso,
  onImageRectoChange,
  onImageVersoChange,
  activeFace,
  onActiveFaceChange,
  onSelectDemoCard,
  totalSlots,
}: SidebarControlsProps) {
  const isDark = theme === 'dark';
  const fileInputRectoRef = useRef<HTMLInputElement>(null);
  const fileInputVersoRef = useRef<HTMLInputElement>(null);

  const currentImage = activeFace === 'recto' ? imageRecto : imageVerso;
  const currentRotation = activeFace === 'recto' ? settings.rotationRecto : settings.rotationVerso;
  const currentFitMode = activeFace === 'recto' ? settings.fitModeRecto : settings.fitModeVerso;

  const handleSelectPreset = (preset: PresetCard) => {
    onSettingsChange({
      ...settings,
      presetId: preset.id,
      width: preset.width,
      height: preset.height,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, face: 'recto' | 'verso') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Seuls les fichiers image (PNG, JPG, SVG) sont supportés.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (face === 'recto') {
        onImageRectoChange(dataUrl);
      } else {
        onImageVersoChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRotate = () => {
    if (activeFace === 'recto') {
      const nextRot = (settings.rotationRecto + 90) % 360;
      onSettingsChange({ ...settings, rotationRecto: nextRot });
    } else {
      const nextRot = (settings.rotationVerso + 90) % 360;
      onSettingsChange({ ...settings, rotationVerso: nextRot });
    }
  };

  const handleFitModeChange = (mode: 'contain' | 'cover') => {
    if (activeFace === 'recto') {
      onSettingsChange({ ...settings, fitModeRecto: mode });
    } else {
      onSettingsChange({ ...settings, fitModeVerso: mode });
    }
  };

  const handleEnableAllSlots = () => {
    onSettingsChange({ ...settings, disabledSlots: [] });
  };

  const handleDisableAllSlots = () => {
    const all = Array.from({ length: totalSlots }, (_, i) => i);
    onSettingsChange({ ...settings, disabledSlots: all });
  };

  return (
    <aside
      className={`w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r flex flex-col lg:h-[calc(100vh-61px)] overflow-y-auto shrink-0 transition-colors duration-200 ${
        isDark
          ? 'bg-[#09090e] border-zinc-800/80 text-zinc-100'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="p-5 flex flex-col gap-6">

        {/* ── Section 1: Presets ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}
            >
              <GridFour size={14} className="text-indigo-500" />
              Formats Préréglés
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CARD_PRESETS.map((preset) => {
              const isSelected = settings.presetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? isDark
                        ? 'bg-indigo-600/15 border-indigo-500/50 text-zinc-100 ring-1 ring-indigo-500/30'
                        : 'bg-indigo-50 border-indigo-400 text-indigo-950 ring-1 ring-indigo-300'
                      : isDark
                      ? 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-semibold truncate">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-mono ${
                      isDark ? 'text-zinc-500' : 'text-slate-400'
                    }`}
                  >
                    {preset.width} × {preset.height} mm
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`h-px w-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`} />

        {/* ── Section 2: Dual Visuels (RECTO / VERSO) ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}
            >
              <Selection size={14} className="text-indigo-500" />
              Visuels de la Carte (Recto / Verso)
            </span>
          </div>

          {/* Tab Switcher: Recto / Verso */}
          <div
            className={`grid grid-cols-2 gap-1.5 p-1 rounded-xl border ${
              isDark
                ? 'bg-zinc-950 border-zinc-800'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => onActiveFaceChange('recto')}
              className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeFace === 'recto'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎴 RECTO (Face 1)</span>
              {imageRecto && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => onActiveFaceChange('verso')}
              className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeFace === 'verso'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🃏 VERSO (Face 2)</span>
              {imageVerso && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          </div>

          {/* Active Face Uploader Box */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (activeFace === 'recto') fileInputRectoRef.current?.click();
                else fileInputVersoRef.current?.click();
              }}
              className={`relative w-full rounded-2xl border border-dashed p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 overflow-hidden group ${
                currentImage
                  ? 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-500/60'
                  : isDark
                  ? 'border-zinc-700/80 hover:border-indigo-500/50 bg-zinc-950/40 hover:bg-zinc-900/30'
                  : 'border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-slate-100/70'
              }`}
            >
              <AnimatePresence mode="wait">
                {currentImage ? (
                  <motion.div
                    key="loaded"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-2.5 w-full"
                  >
                    <div
                      className={`relative w-full h-24 rounded-xl overflow-hidden border flex items-center justify-center ${
                        isDark
                          ? 'border-zinc-700 bg-zinc-900'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <img
                        src={currentImage}
                        alt="Aperçu carte"
                        style={{ transform: `rotate(${currentRotation}deg)` }}
                        className="w-full h-full object-contain transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-white">
                        Cliquer pour remplacer le {activeFace.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                        <CheckCircle size={15} weight="fill" />
                        <span>Visuel {activeFace.toUpperCase()} chargé</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeFace === 'recto') onImageRectoChange(null);
                          else onImageVersoChange(null);
                        }}
                        className="text-[10px] text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors font-medium"
                      >
                        <Trash size={12} />
                        Effacer
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-2 py-3 text-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                        isDark
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/40'
                          : 'bg-white border-slate-200 text-slate-500 group-hover:text-indigo-600 group-hover:border-indigo-300'
                      }`}
                    >
                      <UploadSimple size={20} />
                    </div>
                    <div>
                      <span
                        className={`text-xs font-semibold transition-colors block ${
                          isDark
                            ? 'text-zinc-300 group-hover:text-white'
                            : 'text-slate-700 group-hover:text-slate-900'
                        }`}
                      >
                        Importer l'image {activeFace.toUpperCase()}
                      </span>
                      <span
                        className={`text-[10px] block mt-0.5 ${
                          isDark ? 'text-zinc-500' : 'text-slate-400'
                        }`}
                      >
                        Glissez votre fichier PNG, JPG ou SVG
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                ref={fileInputRectoRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'recto')}
                className="hidden"
              />
              <input
                ref={fileInputVersoRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'verso')}
                className="hidden"
              />
            </button>

            {/* Active Face Adjustment Controls */}
            {currentImage && (
              <div
                className={`flex flex-col gap-2.5 p-3 mt-2 rounded-xl border ${
                  isDark
                    ? 'bg-zinc-950/70 border-zinc-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                      isDark ? 'text-zinc-300' : 'text-slate-700'
                    }`}
                  >
                    <ArrowClockwise size={13} className="text-indigo-500" />
                    Orientation ({activeFace.toUpperCase()}) :
                  </span>
                  <button
                    type="button"
                    onClick={handleRotate}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold text-indigo-500 flex items-center gap-1 transition-colors ${
                      isDark
                        ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700'
                        : 'bg-white hover:bg-slate-100 border-slate-300 shadow-2xs'
                    }`}
                  >
                    <ArrowClockwise size={12} />
                    {currentRotation}° → Pivoter
                  </button>
                </div>

                <div
                  className={`flex items-center justify-between gap-2 pt-1 border-t ${
                    isDark ? 'border-zinc-800/80' : 'border-slate-200'
                  }`}
                >
                  <span
                    className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                      isDark ? 'text-zinc-300' : 'text-slate-700'
                    }`}
                  >
                    <FrameCorners size={13} className="text-indigo-500" />
                    Ajustement :
                  </span>
                  <div
                    className={`grid grid-cols-2 gap-1 p-0.5 rounded-lg border ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleFitModeChange('contain')}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                        currentFitMode === 'contain'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : isDark
                          ? 'text-zinc-400 hover:text-white'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Proportions
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFitModeChange('cover')}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                        currentFitMode === 'cover'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : isDark
                          ? 'text-zinc-400 hover:text-white'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Remplir
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!imageRecto && !imageVerso && (
              <div className="flex flex-col gap-1.5 mt-2">
                <span
                  className={`text-[10px] font-medium ${
                    isDark ? 'text-zinc-500' : 'text-slate-400'
                  }`}
                >
                  Ou charger une démo complète Recto/Verso :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {DEMO_CARDS.map((demo) => (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => onSelectDemoCard(demo)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                        isDark
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-indigo-500/40 hover:bg-zinc-800'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 hover:border-indigo-300 hover:bg-slate-100'
                      }`}
                    >
                      <Sparkle size={10} className="text-amber-400" />
                      {demo.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`h-px w-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`} />

        {/* ── Section 3: Disposition & Alignement sur Papier A4 ── */}
        <div className="flex flex-col gap-3">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}
          >
            <AlignCenterHorizontal size={14} className="text-indigo-500" />
            Positionnement sur Papier A4
          </span>

          {/* Horizontal Align Buttons */}
          <div className="flex flex-col gap-1.5">
            <span
              className={`text-[10px] font-medium ${
                isDark ? 'text-zinc-500' : 'text-slate-400'
              }`}
            >
              Alignement Horizontal :
            </span>
            <div
              className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl border ${
                isDark
                  ? 'bg-zinc-950 border-zinc-800'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => onSettingsChange({ ...settings, alignX: 'left' })}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  settings.alignX === 'left'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <AlignLeft size={13} />
                Gauche
              </button>
              <button
                type="button"
                onClick={() => onSettingsChange({ ...settings, alignX: 'center' })}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  settings.alignX === 'center'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <AlignCenterHorizontal size={13} />
                Centré
              </button>
              <button
                type="button"
                onClick={() => onSettingsChange({ ...settings, alignX: 'right' })}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  settings.alignX === 'right'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <AlignRight size={13} />
                Droite
              </button>
            </div>
          </div>

          {/* Vertical Align Buttons */}
          <div className="flex flex-col gap-1.5">
            <span
              className={`text-[10px] font-medium ${
                isDark ? 'text-zinc-500' : 'text-slate-400'
              }`}
            >
              Alignement Vertical :
            </span>
            <div
              className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl border ${
                isDark
                  ? 'bg-zinc-950 border-zinc-800'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => onSettingsChange({ ...settings, alignY: 'top' })}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  settings.alignY === 'top'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <AlignTop size={13} />
                Haut
              </button>
              <button
                type="button"
                onClick={() => onSettingsChange({ ...settings, alignY: 'center' })}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  settings.alignY === 'center'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <AlignCenterVertical size={13} />
                Centré
              </button>
              <button
                type="button"
                onClick={() => onSettingsChange({ ...settings, alignY: 'bottom' })}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  settings.alignY === 'bottom'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <AlignBottom size={13} />
                Bas
              </button>
            </div>
          </div>

          {/* Slots Management */}
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-medium ${
                  isDark ? 'text-zinc-500' : 'text-slate-400'
                }`}
              >
                Gestion des emplacements sur l'A4 :
              </span>
              <span className="text-[10px] font-mono text-indigo-500 font-bold">
                {totalSlots - settings.disabledSlots.length} / {totalSlots} actifs
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleEnableAllSlots}
                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-emerald-500/40'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 hover:border-emerald-500'
                }`}
              >
                <CheckSquare size={13} className="text-emerald-500" />
                Tout activer
              </button>
              <button
                type="button"
                onClick={handleDisableAllSlots}
                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-rose-500/40'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 hover:border-rose-500'
                }`}
              >
                <Square size={13} className="text-rose-500" />
                Tout désactiver
              </button>
            </div>
          </div>
        </div>

        <div className={`h-px w-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`} />

        {/* ── Section 4: Dimensions de la carte ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}
            >
              <ArrowsOutLineHorizontal size={14} className="text-indigo-500" />
              Dimensions d'une carte (mm)
            </span>
            <button
              type="button"
              onClick={() =>
                onSettingsChange({
                  ...settings,
                  width: settings.height,
                  height: settings.width,
                  presetId: 'custom',
                })
              }
              className="text-[10px] text-indigo-500 hover:underline font-mono"
            >
              Inverser L × H
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumInput
              label="Largeur"
              value={settings.width}
              onChange={(w) =>
                onSettingsChange({ ...settings, width: w, presetId: 'custom' })
              }
              step={1}
              min={10}
              max={200}
              unit="mm"
            />
            <NumInput
              label="Hauteur"
              value={settings.height}
              onChange={(h) =>
                onSettingsChange({ ...settings, height: h, presetId: 'custom' })
              }
              step={1}
              min={10}
              max={280}
              unit="mm"
            />
          </div>
        </div>

        <div className={`h-px w-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`} />

        {/* ── Section 5: Espacement & Marges ── */}
        <div className="flex flex-col gap-4">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}
          >
            <ArrowsOutLineVertical size={14} className="text-indigo-500" />
            Marges & Espacements
          </span>

          <SliderInput
            label="Marge Extérieure"
            value={settings.margin}
            onChange={(m) => onSettingsChange({ ...settings, margin: m })}
            min={0}
            max={40}
            step={1}
            unit="mm"
          />

          <SliderInput
            label="Espace Horizontal"
            value={settings.spacingX}
            onChange={(sx) => onSettingsChange({ ...settings, spacingX: sx })}
            min={0}
            max={20}
            step={0.5}
            unit="mm"
          />

          <SliderInput
            label="Espace Vertical"
            value={settings.spacingY}
            onChange={(sy) => onSettingsChange({ ...settings, spacingY: sy })}
            min={0}
            max={20}
            step={0.5}
            unit="mm"
          />
        </div>

        <div className={`h-px w-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`} />

        {/* ── Section 6: Options d'impression ── */}
        <div className="flex flex-col gap-3">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}
          >
            <Scissors size={14} className="text-indigo-500" />
            Options d'Impression & Repères
          </span>

          {/* Numéros d'emplacement switch */}
          <label
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
              isDark
                ? 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Hash size={16} className={isDark ? 'text-zinc-400' : 'text-slate-500'} />
              <div className="flex flex-col">
                <span
                  className={`text-xs font-medium ${
                    isDark ? 'text-zinc-200' : 'text-slate-800'
                  }`}
                >
                  Numéros d'emplacements
                </span>
                <span
                  className={`text-[10px] ${
                    isDark ? 'text-zinc-500' : 'text-slate-400'
                  }`}
                >
                  Affiche #1, #2, #3 sur l'écran
                </span>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.showNumbers}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    showNumbers: e.target.checked,
                  })
                }
                className="sr-only"
              />
              <div
                className={`w-9 h-5 rounded-full transition-colors duration-200 ${
                  settings.showNumbers ? 'bg-indigo-600' : isDark ? 'bg-zinc-800' : 'bg-slate-300'
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  settings.showNumbers ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </label>

          {/* Crop marks switch */}
          <label
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
              isDark
                ? 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Scissors size={16} className={isDark ? 'text-zinc-400' : 'text-slate-500'} />
              <div className="flex flex-col">
                <span
                  className={`text-xs font-medium ${
                    isDark ? 'text-zinc-200' : 'text-slate-800'
                  }`}
                >
                  Traits de coupe
                </span>
                <span
                  className={`text-[10px] ${
                    isDark ? 'text-zinc-500' : 'text-slate-400'
                  }`}
                >
                  Repères d'angle pour le découpage
                </span>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.showCropMarks}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    showCropMarks: e.target.checked,
                  })
                }
                className="sr-only"
              />
              <div
                className={`w-9 h-5 rounded-full transition-colors duration-200 ${
                  settings.showCropMarks ? 'bg-indigo-600' : isDark ? 'bg-zinc-800' : 'bg-slate-300'
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  settings.showCropMarks ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </label>
        </div>

      </div>
    </aside>
  );
}
