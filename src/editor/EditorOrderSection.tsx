import React, { useState, useRef } from 'react';
import { Archive, Download, Upload, ClipboardCheck, Loader2, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { downloadOrderZip } from './zipExport';
import { importOrderZip } from './zipImport';
import { parseAndValidateOrderCode } from './orderCode';
import { EDITOR_BUNDLE_MARKER } from './index';

interface EditorOrderSectionProps {
  currentLang: 'id' | 'en';
  context: any;
  isOpen: boolean;
  onToggle: () => void;
}

export const EditorOrderSection: React.FC<EditorOrderSectionProps> = ({
  currentLang,
  context,
  isOpen,
  onToggle,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [pasteCode, setPasteCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Retain bundle marker
  if (typeof window !== 'undefined') {
    (window as any).__ebm_comp = EDITOR_BUNDLE_MARKER;
  }

  const showToast = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const filename = await downloadOrderZip(context);
      showToast(
        currentLang === 'id'
          ? `Berkas ${filename} berhasil diunduh!`
          : `Order file ${filename} downloaded successfully!`,
        'success'
      );
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || 'Gagal membuat file zip', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      setIsImporting(true);
      await importOrderZip(file, context);
      showToast(
        currentLang === 'id'
          ? 'Berkas pesanan berhasil diimpor ke Customizer!'
          : 'Order zip imported successfully into Customizer!',
        'success'
      );
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || 'Gagal mengimpor file zip', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleApplyCode = () => {
    if (!pasteCode.trim()) {
      showToast(
        currentLang === 'id' ? 'Masukkan kode pesanan terlebih dahulu' : 'Please paste an order code first',
        'error'
      );
      return;
    }

    try {
      const sanitized = parseAndValidateOrderCode(pasteCode);
      context.applyImportedState(sanitized);
      setPasteCode('');
      showToast(
        currentLang === 'id' ? 'Kode pesanan berhasil dimuat!' : 'Order code applied successfully!',
        'success'
      );
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || 'Kode pesanan tidak valid', 'error');
    }
  };

  const isId = currentLang === 'id';

  return (
    <div className="border border-red-500/30 rounded-lg overflow-hidden bg-red-950/10 mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3.5 text-left font-serif-display italic text-sm text-white hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Archive className="w-3.5 h-3.5 text-red-400" />
          <span className="font-semibold text-red-200">
            {isId ? 'Berkas Pesanan (Order File - Editor)' : 'Order File (Editor Only)'}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-red-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-4 pt-1 space-y-4 border-t border-red-500/20 text-xs">
          {/* Status Message / Inline Toast */}
          {statusMessage && (
            <div
              className={`p-2.5 rounded flex items-start gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/80 border border-rose-500/30 text-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              )}
              <span className="text-[11px] leading-relaxed break-words">{statusMessage.text}</span>
            </div>
          )}

          {/* 1. Download Order File (.zip) */}
          <div className="space-y-1.5">
            <p className="font-semibold text-white/90">
              {isId ? '1. Unduh Berkas Pesanan (.zip)' : '1. Download Order File (.zip)'}
            </p>
            <p className="text-[11px] text-white/60 leading-relaxed">
              {isId
                ? 'Membuat arsip zip di memori berisi order.json, gambar & video kustom (jika ada), dan README.txt.'
                : 'Builds an in-memory zip archive with order.json, user-uploaded media, and README.txt.'}
            </p>
            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="w-full py-2.5 px-3 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isId ? 'Sedang Memproses...' : 'Building Zip...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{isId ? 'Unduh Berkas Pesanan (.zip)' : 'Download order file (.zip)'}</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Import Order File (.zip) */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <p className="font-semibold text-white/90">
              {isId ? '2. Impor Berkas Pesanan' : '2. Import Order File'}
            </p>
            <p className="text-[11px] text-white/60 leading-relaxed">
              {isId
                ? 'Muat kembali file zip hasil unduhan untuk memeriksa atau mengedit ulang data.'
                : 'Load a previously downloaded zip archive back into the Customizer.'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,application/zip"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="w-full py-2.5 px-3 rounded bg-white/10 hover:bg-white/15 border border-white/20 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isId ? 'Membaca Zip...' : 'Reading Zip...'}</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isId ? 'Pilih File .zip untuk Diimpor' : 'Import order file (.zip)'}</span>
                </>
              )}
            </button>
          </div>

          {/* 3. Paste Order Code */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <p className="font-semibold text-white/90">
              {isId ? '3. Tempel Kode Pesanan' : '3. Paste Order Code'}
            </p>
            <p className="text-[11px] text-white/60 leading-relaxed">
              {isId
                ? 'Dekode kode pesanan teks dari pesan WhatsApp ke dalam form kustomizer.'
                : 'Decode compressed base64url order text from WhatsApp directly into state.'}
            </p>
            <textarea
              rows={2}
              value={pasteCode}
              onChange={(e) => setPasteCode(e.target.value)}
              placeholder={isId ? 'Tempel kode pesanan di sini...' : 'Paste order code here...'}
              className="w-full p-2 bg-black/60 border border-white/20 rounded text-[11px] text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-red-400"
            />
            <button
              onClick={handleApplyCode}
              className="w-full py-2 px-3 rounded bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>{isId ? 'Muat Kode Pesanan' : 'Paste order code'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorOrderSection;
