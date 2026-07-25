import React, { useState, useMemo, useEffect } from 'react';
import { CardSettings, GridInfo, DemoCardSample, ThemeMode } from './types';
import { generateA4Pdf } from './utils/pdfGenerator';
import { Header } from './components/Header';
import { SidebarControls } from './components/SidebarControls';
import { PreviewStage } from './components/PreviewStage';

const A4_PORTRAIT_WIDTH = 210;
const A4_PORTRAIT_HEIGHT = 297;

const STORAGE_KEY_SETTINGS = 'planche_express_settings_v3';
const STORAGE_KEY_RECTO = 'planche_express_recto_v3';
const STORAGE_KEY_VERSO = 'planche_express_verso_v3';
const STORAGE_KEY_THEME = 'planche_express_theme_v3';

const DEFAULT_SETTINGS: CardSettings = {
  presetId: 'eu-standard',
  width: 85,
  height: 55,
  margin: 10,
  spacingX: 0,
  spacingY: 0,
  orientation: 'portrait',
  showCropMarks: false,
  showRegistrationMarks: false,
  showNumbers: false,
  centerGrid: true,
  alignX: 'center',
  alignY: 'center',
  manualOffsetX: 0,
  manualOffsetY: 0,
  disabledSlots: [],
  fitModeRecto: 'contain',
  rotationRecto: 0,
  fitModeVerso: 'contain',
  rotationVerso: 0,
};

function getInitialSettings(): CardSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.error('Erreur chargement localStorage settings:', err);
  }
  return DEFAULT_SETTINGS;
}

function getInitialImage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    return null;
  }
}

function getInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (err) {
    // fallback
  }
  return 'dark';
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [settings, setSettings] = useState<CardSettings>(getInitialSettings);
  const [imageRecto, setImageRecto] = useState<string | null>(() => getInitialImage(STORAGE_KEY_RECTO));
  const [imageVerso, setImageVerso] = useState<string | null>(() => getInitialImage(STORAGE_KEY_VERSO));
  const [activeFace, setActiveFace] = useState<'recto' | 'verso'>('recto');
  const [isGenerating, setIsGenerating] = useState(false);

  // Save Theme preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (err) {
      console.error('Erreur sauvegarde theme:', err);
    }
  }, [theme]);

  // Auto-save Settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.error('Erreur sauvegarde settings:', err);
    }
  }, [settings]);

  // Auto-save Recto Image to localStorage
  useEffect(() => {
    try {
      if (imageRecto) {
        localStorage.setItem(STORAGE_KEY_RECTO, imageRecto);
      } else {
        localStorage.removeItem(STORAGE_KEY_RECTO);
      }
    } catch (err) {
      console.error('Erreur sauvegarde imageRecto:', err);
    }
  }, [imageRecto]);

  // Auto-save Verso Image to localStorage
  useEffect(() => {
    try {
      if (imageVerso) {
        localStorage.setItem(STORAGE_KEY_VERSO, imageVerso);
      } else {
        localStorage.removeItem(STORAGE_KEY_VERSO);
      }
    } catch (err) {
      console.error('Erreur sauvegarde imageVerso:', err);
    }
  }, [imageVerso]);

  // Compute Grid Placement Info on A4 Portrait Paper (210 x 297 mm)
  const grid = useMemo((): GridInfo => {
    const pageWidth = A4_PORTRAIT_WIDTH;
    const pageHeight = A4_PORTRAIT_HEIGHT;

    const availableW = Math.max(0, pageWidth - settings.margin * 2);
    const availableH = Math.max(0, pageHeight - settings.margin * 2);

    const cardW = Math.max(1, settings.width);
    const cardH = Math.max(1, settings.height);

    const cols = Math.max(
      1,
      Math.floor((availableW + settings.spacingX) / (cardW + settings.spacingX))
    );
    const rows = Math.max(
      1,
      Math.floor((availableH + settings.spacingY) / (cardH + settings.spacingY))
    );

    const totalWidth = cols * cardW + (cols - 1) * settings.spacingX;
    const totalHeight = rows * cardH + (rows - 1) * settings.spacingY;

    // Horizontal offset calculation on A4
    let offsetX = (pageWidth - totalWidth) / 2;
    if (settings.alignX === 'left') {
      offsetX = settings.margin;
    } else if (settings.alignX === 'right') {
      offsetX = pageWidth - settings.margin - totalWidth;
    }

    // Vertical offset calculation on A4
    let offsetY = (pageHeight - totalHeight) / 2;
    if (settings.alignY === 'top') {
      offsetY = settings.margin;
    } else if (settings.alignY === 'bottom') {
      offsetY = pageHeight - settings.margin - totalHeight;
    }

    const totalSlots = cols * rows;
    const disabledCount = (settings.disabledSlots || []).filter((idx) => idx < totalSlots).length;
    const activeCount = Math.max(0, totalSlots - disabledCount);

    const totalArea = activeCount * cardW * cardH;
    const pageArea = pageWidth * pageHeight;
    const coveragePercent = Math.round((totalArea / pageArea) * 100);

    return {
      cols,
      rows,
      totalWidth,
      totalHeight,
      offsetX,
      offsetY,
      pageWidth,
      pageHeight,
      coveragePercent,
      activeCount,
    };
  }, [
    settings.width,
    settings.height,
    settings.margin,
    settings.spacingX,
    settings.spacingY,
    settings.alignX,
    settings.alignY,
    settings.disabledSlots,
  ]);

  const handleToggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectDemoCard = (demo: DemoCardSample) => {
    setImageRecto(demo.dataUrlRecto);
    setImageVerso(demo.dataUrlVerso);
    setSettings((prev) => ({
      ...prev,
      rotationRecto: 0,
      rotationVerso: 0,
      fitModeRecto: 'contain',
      fitModeVerso: 'contain',
    }));
  };

  const handleToggleSlot = (index: number) => {
    setSettings((prev) => {
      const current = prev.disabledSlots || [];
      const isAlreadyDisabled = current.includes(index);
      const next = isAlreadyDisabled
        ? current.filter((i) => i !== index)
        : [...current, index];
      return { ...prev, disabledSlots: next };
    });
  };

  const handleResetSettings = () => {
    if (window.confirm('Réinitialiser tous les réglages et visuels ?')) {
      setSettings(DEFAULT_SETTINGS);
      setImageRecto(null);
      setImageVerso(null);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      localStorage.removeItem(STORAGE_KEY_RECTO);
      localStorage.removeItem(STORAGE_KEY_VERSO);
    }
  };

  const handleDownloadPdf = async () => {
    if (!imageRecto && !imageVerso) return;
    setIsGenerating(true);
    try {
      await generateA4Pdf({
        imageRecto,
        imageVerso,
        settings,
        grid,
      });
    } catch (err) {
      console.error('Erreur lors de la génération PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const hasAnyImage = Boolean(imageRecto || imageVerso);

  return (
    <div
      className={`h-screen w-screen flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#060609] text-zinc-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Floating Glass Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onSelectDemoCard={handleSelectDemoCard}
        onDownloadPdf={handleDownloadPdf}
        onResetSettings={handleResetSettings}
        isGenerating={isGenerating}
        hasImage={hasAnyImage}
        totalCards={grid.activeCount}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Sidebar Controls */}
        <SidebarControls
          theme={theme}
          settings={settings}
          onSettingsChange={setSettings}
          imageRecto={imageRecto}
          imageVerso={imageVerso}
          onImageRectoChange={setImageRecto}
          onImageVersoChange={setImageVerso}
          activeFace={activeFace}
          onActiveFaceChange={setActiveFace}
          onSelectDemoCard={handleSelectDemoCard}
          totalSlots={grid.cols * grid.rows}
        />

        {/* Right Interactive A4 Preview Stage */}
        <PreviewStage
          theme={theme}
          imageRecto={imageRecto}
          imageVerso={imageVerso}
          activeFace={activeFace}
          onActiveFaceChange={setActiveFace}
          settings={settings}
          grid={grid}
          onToggleSlot={handleToggleSlot}
        />
      </div>
    </div>
  );
}
