import { PresetCard, DemoCardSample } from '../types';

export const CARD_PRESETS: PresetCard[] = [
  {
    id: 'eu-standard',
    name: 'Carte EU Standard',
    description: 'Format classique européen (85 × 55 mm)',
    width: 85,
    height: 55,
    category: 'standard',
  },
  {
    id: 'us-standard',
    name: 'Carte US Standard',
    description: 'Format américain classique (89 × 51 mm)',
    width: 89,
    height: 51,
    category: 'standard',
  },
  {
    id: 'credit-card',
    name: 'Format CB / ISO',
    description: 'Format carte bancaire (85.6 × 53.9 mm)',
    width: 85.6,
    height: 53.9,
    category: 'standard',
  },
  {
    id: 'square',
    name: 'Carte Carrée',
    description: 'Style moderne et créatif (55 × 55 mm)',
    width: 55,
    height: 55,
    category: 'creative',
  },
  {
    id: 'mini-tag',
    name: 'Mini Carte / Badge',
    description: 'Format étiquette compacte (85 × 25 mm)',
    width: 85,
    height: 25,
    category: 'mini',
  },
  {
    id: 'custom',
    name: 'Sur Mesure',
    description: 'Saisissez des dimensions personnalisées',
    width: 86,
    height: 56,
    category: 'custom',
  },
];

// Helper to create clean SVG data URLs for demo cards
function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
}

export const DEMO_CARDS: DemoCardSample[] = [
  {
    id: 'obsidian-studio',
    title: 'Studio Obsidian',
    subtitle: 'Carte Sombre Minimaliste',
    accentColor: '#818cf8',
    dataUrlRecto: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="850" height="550" viewBox="0 0 850 550">
        <rect width="850" height="550" fill="#0b0c10"/>
        <rect x="2" y="2" width="846" height="546" fill="none" stroke="#222634" stroke-width="4"/>
        <circle cx="750" cy="100" r="180" fill="#6366f1" opacity="0.12"/>
        <circle cx="100" cy="450" r="150" fill="#a855f7" opacity="0.08"/>
        
        <!-- Logo symbol -->
        <rect x="80" y="80" width="48" height="48" rx="12" fill="#6366f1"/>
        <path d="M96 96 L112 112 M112 96 L96 112" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        
        <!-- Brand -->
        <text x="145" y="104" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="28" fill="#ffffff" letter-spacing="3">KRONOS</text>
        <text x="145" y="124" font-family="Plus Jakarta Sans, sans-serif" font-weight="500" font-size="14" fill="#6366f1" letter-spacing="4">DESIGN STUDIO</text>
        
        <!-- Contact -->
        <text x="80" y="390" font-family="Plus Jakarta Sans, sans-serif" font-weight="600" font-size="32" fill="#f3f4f6">Alexandre Mercer</text>
        <text x="80" y="425" font-family="Plus Jakarta Sans, sans-serif" font-weight="400" font-size="20" fill="#9ca3af">Directeur Artistique &amp; UX Architect</text>
        
        <line x1="80" y1="455" x2="770" y2="455" stroke="#1f2937" stroke-width="2"/>
        
        <text x="80" y="495" font-family="JetBrains Mono, monospace" font-size="16" fill="#6b7280">hello@kronos-studio.io</text>
        <text x="500" y="495" font-family="JetBrains Mono, monospace" font-size="16" fill="#6b7280">+33 (0)1 84 90 22 10</text>
      </svg>
    `),
    dataUrlVerso: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="850" height="550" viewBox="0 0 850 550">
        <rect width="850" height="550" fill="#07080b"/>
        <rect x="2" y="2" width="846" height="546" fill="none" stroke="#6366f1" stroke-width="2" opacity="0.4"/>
        <circle cx="425" cy="275" r="220" fill="#6366f1" opacity="0.1"/>
        
        <!-- Large Centered Emblem Logo (VERSO) -->
        <rect x="385" y="200" width="80" height="80" rx="20" fill="#6366f1"/>
        <path d="M410 225 L440 255 M440 225 L410 255" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
        
        <text x="425" y="335" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="32" fill="#ffffff" letter-spacing="6">KRONOS</text>
        <text x="425" y="365" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="600" font-size="14" fill="#6366f1" letter-spacing="8">DESIGN STUDIO</text>
        <text x="425" y="470" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="14" fill="#4b5563">PARIS • TOKYO • NEW YORK</text>
      </svg>
    `),
  },
  {
    id: 'atelier-cream',
    title: 'Atelier Épuré',
    subtitle: 'Style Éditorial Luxueux',
    accentColor: '#d97706',
    dataUrlRecto: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="850" height="550" viewBox="0 0 850 550">
        <rect width="850" height="550" fill="#fbf9f5"/>
        <rect x="24" y="24" width="802" height="502" fill="none" stroke="#e5e0d8" stroke-width="2"/>
        
        <!-- Header -->
        <text x="70" y="100" font-family="Georgia, serif" font-style="italic" font-size="24" fill="#78716c">Atelier</text>
        <text x="70" y="145" font-family="Georgia, serif" font-weight="bold" font-size="44" fill="#1c1917" letter-spacing="2">LUMIÈRE</text>
        
        <!-- Subtle divider -->
        <line x1="70" y1="180" x2="200" y2="180" stroke="#d97706" stroke-width="3"/>
        
        <!-- Content -->
        <text x="70" y="380" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="30" fill="#1c1917">Éléonore de Saint-Germain</text>
        <text x="70" y="415" font-family="Georgia, serif" font-style="italic" font-size="20" fill="#78716c">Architecte d'Intérieur &amp; Design Mobilier</text>
        
        <text x="520" y="440" font-family="JetBrains Mono, monospace" font-size="15" fill="#44403c">www.lumiere-atelier.fr</text>
        <text x="520" y="470" font-family="JetBrains Mono, monospace" font-size="15" fill="#78716c">paris@lumiere-atelier.fr</text>
      </svg>
    `),
    dataUrlVerso: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="850" height="550" viewBox="0 0 850 550">
        <rect width="850" height="550" fill="#1c1917"/>
        <rect x="24" y="24" width="802" height="502" fill="none" stroke="#44403c" stroke-width="1"/>
        
        <text x="425" y="240" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="32" fill="#d97706">Atelier</text>
        <text x="425" y="295" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="54" fill="#fbf9f5" letter-spacing="4">LUMIÈRE</text>
        <text x="425" y="340" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#a8a29e" letter-spacing="6">ARCHITECTURE D'INTÉRIEUR</text>
      </svg>
    `),
  },
  {
    id: 'cyber-pulse',
    title: 'Cyber Pulse',
    subtitle: 'Néon Tech & Futuriste',
    accentColor: '#10b981',
    dataUrlRecto: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="850" height="550" viewBox="0 0 850 550">
        <rect width="850" height="550" fill="#040d12"/>
        <path d="M0 100 L850 100 M0 200 L850 200 M0 300 L850 300 M0 400 L850 400 M0 500 L850 500" stroke="#092635" stroke-width="1"/>
        <path d="M100 0 L100 550 M200 0 L200 550 M300 0 L300 550 M400 0 L400 550 M500 0 L500 550 M600 0 L600 550 M700 0 L700 550 M800 0 L800 550" stroke="#092635" stroke-width="1"/>
        
        <circle cx="700" cy="275" r="160" fill="#10b981" opacity="0.1"/>
        
        <rect x="70" y="70" width="16" height="16" fill="#10b981"/>
        <text x="100" y="85" font-family="JetBrains Mono, monospace" font-weight="700" font-size="22" fill="#10b981" letter-spacing="4">NEXUS AI</text>
        
        <text x="70" y="340" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="36" fill="#ecfdf5">DR. MARC VANE</text>
        <text x="70" y="380" font-family="JetBrains Mono, monospace" font-size="18" fill="#6ee7b7">&lt;Lead AI Research &amp; Neural Systems/&gt;</text>
        
        <rect x="70" y="430" width="710" height="1" fill="#10b981" opacity="0.4"/>
        <text x="70" y="475" font-family="JetBrains Mono, monospace" font-size="15" fill="#94a3b8">ID: 0x9482A // SECURITY CLEARANCE L5</text>
      </svg>
    `),
    dataUrlVerso: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="850" height="550" viewBox="0 0 850 550">
        <rect width="850" height="550" fill="#040d12"/>
        <circle cx="425" cy="275" r="180" fill="#10b981" opacity="0.15"/>
        <rect x="360" y="210" width="130" height="130" fill="none" stroke="#10b981" stroke-width="3" rx="16"/>
        <text x="425" y="290" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="44" fill="#10b981">[N]</text>
        <text x="425" y="390" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="700" font-size="24" fill="#ecfdf5" letter-spacing="8">NEXUS AI</text>
        <text x="425" y="430" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="14" fill="#6ee7b7">QUANTUM NEURAL NETWORKS</text>
      </svg>
    `),
  },
];
