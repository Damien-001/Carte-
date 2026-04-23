import { ChangeEvent, useState, useRef, useMemo } from 'react';
import { 
  Upload, 
  Download, 
  Settings, 
  Maximize2, 
  Scissors, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { jsPDF } from 'jspdf';
import { CardSettings, GridInfo } from './types';

const A4_WIDTH = 210;
const A4_HEIGHT = 297;

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  // Internal values are in mm; UI displays cm (÷10)
  // +1mm bleed on each side: 87mm wide, 57mm tall
  // 2 cols × 5 rows = 10 cards on A4
  // 2×87 + 1×3 = 177mm wide (centred) | 5×57 + 4×3 = 297mm tall (no vertical margin)
  const [settings, setSettings] = useState<CardSettings>({
    width: 87,   // 8.7 cm
    height: 57,  // 5.7 cm
    margin: 0,   // 0 cm — no margin needed to fit 5 rows
    spacing: 3,  // 0.3 cm
    showCropMarks: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const grid = useMemo((): GridInfo => {
    const availableWidth = A4_WIDTH - (settings.margin * 2);
    const availableHeight = A4_HEIGHT - (settings.margin * 2);

    const rawCols = Math.floor((availableWidth + settings.spacing) / (settings.width + settings.spacing));
    const rawRows = Math.floor((availableHeight + settings.spacing) / (settings.height + settings.spacing));

    // Maximum 10 cards total, ideally in a balanced way if possible
    // But we prioritize the dimensions set by the user
    const cols = rawCols;
    const rows = rawRows;

    const totalWidth = cols * settings.width + (cols - 1) * settings.spacing;
    const totalHeight = rows * settings.height + (rows - 1) * settings.spacing;

    const offsetX = (A4_WIDTH - totalWidth) / 2;
    const offsetY = (A4_HEIGHT - totalHeight) / 2;

    return { cols, rows, totalWidth, totalHeight, offsetX, offsetY };
  }, [settings.width, settings.height, settings.margin, settings.spacing]);

  const theoreticalMax = grid.cols * grid.rows;

  // Always use all available slots on the grid

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Pour l'instant, seuls les formats PNG et JPG sont supportés.");
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!image) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      });

      const { cols, rows, offsetX, offsetY } = grid;
      let cardCount = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (cardCount >= theoreticalMax) break;
          
          const x = offsetX + c * (settings.width + settings.spacing);
          const y = offsetY + r * (settings.height + settings.spacing);

          // Add card image
          pdf.addImage(image, 'JPEG', x, y, settings.width, settings.height);

          // Add crop marks
          if (settings.showCropMarks) {
            pdf.setDrawColor(200, 200, 200);
            pdf.setLineWidth(0.1);
            const markLen = 3;
            
            // Vertical marks
            pdf.line(x, y - markLen, x, y - 0.5); // top left
            pdf.line(x + settings.width, y - markLen, x + settings.width, y - 0.5); // top right
            pdf.line(x, y + settings.height + 0.5, x, y + settings.height + markLen); // bottom left
            pdf.line(x + settings.width, y + settings.height + 0.5, x + settings.width, y + settings.height + markLen); // bottom right

            // Horizontal marks
            pdf.line(x - markLen, y, x - 0.5, y); // left top
            pdf.line(x - markLen, y + settings.height, x - 0.5, y + settings.height); // left bottom
            pdf.line(x + settings.width + 0.5, y, x + settings.width + markLen, y); // right top
            pdf.line(x + settings.width + 0.5, y + settings.height, x + settings.width + markLen, y + settings.height); // right bottom
          }
          
          cardCount++;
        }
        if (cardCount >= theoreticalMax) break;
      }

      pdf.save('planche-cartes-visite.pdf');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-gray-900">
      {/* Sidebar / Controls */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 p-6 flex flex-col gap-8 shadow-sm h-screen overflow-y-auto z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
            <Maximize2 size={22} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">Planche Express</h1>
        </div>

        <section className="flex flex-col gap-4">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <Settings size={14} /> Configuration
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Largeur (cm)</label>
              <input 
                type="number"
                step="0.1"
                value={+(settings.width / 10).toFixed(2)}
                onChange={(e) => setSettings({...settings, width: Math.round(Number(e.target.value) * 10)})}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Hauteur (cm)</label>
              <input 
                type="number"
                step="0.1"
                value={+(settings.height / 10).toFixed(2)}
                onChange={(e) => setSettings({...settings, height: Math.round(Number(e.target.value) * 10)})}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Marge (cm)</label>
              <input 
                type="number"
                step="0.1"
                value={+(settings.margin / 10).toFixed(2)}
                onChange={(e) => setSettings({...settings, margin: Math.round(Number(e.target.value) * 10)})}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Espacement (cm)</label>
              <input 
                type="number"
                step="0.1"
                value={+(settings.spacing / 10).toFixed(2)}
                onChange={(e) => setSettings({...settings, spacing: Math.round(Number(e.target.value) * 10)})}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 justify-end">
              <span className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-tighter">Cartes sur la planche : {theoreticalMax}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="cropMarks"
              checked={settings.showCropMarks}
              onChange={(e) => setSettings({...settings, showCropMarks: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="cropMarks" className="text-sm font-medium text-gray-700 flex items-center gap-1.5 cursor-pointer">
              <Scissors size={14} className="text-gray-400" /> Traits de coupe
            </label>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <Upload size={14} /> Fichier Source
          </label>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full py-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${image ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'}`}
          >
            {image ? (
              <>
                <CheckCircle2 className="text-green-500" size={32} />
                <span className="text-sm font-semibold text-green-700">Image chargée</span>
                <span className="text-xs text-green-600 px-4 text-center">Cliquez pour changer</span>
              </>
            ) : (
              <>
                <Upload className="text-gray-400" size={32} />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-gray-700">Importer une carte</span>
                  <span className="text-xs text-gray-500">PNG, JPG</span>
                </div>
              </>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              className="hidden"
            />
          </button>
        </section>

        <div className="mt-auto pt-6 border-t border-gray-100">
           <div className="bg-blue-50 p-4 rounded-lg mb-4 flex gap-3">
              <AlertCircle className="text-blue-500 shrink-0" size={18} />
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-bold">Planche :</span> {theoreticalMax} cartes ({grid.cols} col. × {grid.rows} rangées).
              </p>
           </div>

          <button 
            onClick={handleDownloadPDF}
            disabled={!image || isGenerating}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Settings size={20} />
                </motion.div>
                Génération...
              </span>
            ) : (
              <>
                <Download size={20} />
                Télécharger PDF
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-auto h-screen bg-gray-100">
        <div 
          className="bg-white shadow-2xl relative overflow-hidden transition-all duration-300"
          style={{
            width: `${A4_WIDTH * 2.5}px`,
            height: `${A4_HEIGHT * 2.5}px`,
            aspectRatio: '210/297',
          }}
        >
          {/* A4 Sheet Mockup */}
          <div className="absolute inset-0 border-8 border-white"></div>
          
          {/* Grid Render */}
          <div 
            className="absolute"
            style={{
              left: `${grid.offsetX * 2.5}px`,
              top: `${grid.offsetY * 2.5}px`,
              width: `${grid.totalWidth * 2.5}px`,
              height: `${grid.totalHeight * 2.5}px`,
              display: 'grid',
              gridTemplateColumns: `repeat(${grid.cols}, ${settings.width * 2.5}px)`,
              gridTemplateRows: `repeat(${grid.rows}, ${settings.height * 2.5}px)`,
              columnGap: `${settings.spacing * 2.5}px`,
              rowGap: `${settings.spacing * 2.5}px`,
            }}
          >
            {Array.from({ length: grid.cols * grid.rows }).map((_, i) => (
              <div 
                key={i} 
                className={`relative bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden transition-opacity duration-300 opacity-100`}
              >
                {image ? (
                  <img 
                    src={image} 
                    alt="Card preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ImageIcon className="text-gray-200" size={24} />
                )}

                {/* Crop Marks Preview (Simplified) */}
                {settings.showCropMarks && (
                  <>
                    <div className="absolute top-[-5px] left-[-0.5px] w-[1px] h-[4px] bg-indigo-300" />
                    <div className="absolute top-[-5px] right-[-0.5px] w-[1px] h-[4px] bg-indigo-300" />
                    <div className="absolute bottom-[-5px] left-[-0.5px] w-[1px] h-[4px] bg-indigo-300" />
                    <div className="absolute bottom-[-5px] right-[-0.5px] w-[1px] h-[4px] bg-indigo-300" />
                    
                    <div className="absolute left-[-5px] top-[-0.5px] w-[4px] h-[1px] bg-indigo-300" />
                    <div className="absolute left-[-5px] bottom-[-0.5px] w-[4px] h-[1px] bg-indigo-300" />
                    <div className="absolute right-[-5px] top-[-0.5px] w-[4px] h-[1px] bg-indigo-300" />
                    <div className="absolute right-[-5px] bottom-[-0.5px] w-[4px] h-[1px] bg-indigo-300" />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Guidelines */}
          <div 
            className="absolute border border-indigo-100 border-dashed pointer-events-none"
            style={{
              left: `${settings.margin * 2.5}px`,
              top: `${settings.margin * 2.5}px`,
              right: `${settings.margin * 2.5}px`,
              bottom: `${settings.margin * 2.5}px`
            }}
          />
        </div>

        {/* Floating helper for small screens (scroll to top) */}
        <div className="fixed bottom-4 right-4 md:hidden">
          <button 
            className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
             <Settings size={28} />
          </button>
        </div>
      </main>
    </div>
  );
}
