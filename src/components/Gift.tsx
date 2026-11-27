import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check } from 'lucide-react';
import { useInvitation } from '../context/InvitationContext';
import { invitationData } from '../data/invitation';
import { Language } from '../types';
import { MixedText } from './FlourishText';
import { GiftIcon } from './Icons';
import { AnimatedLinkButton } from './AnimatedButton';

export const WA_PENGANTIN = "6285221244934";

async function copyTextSafe(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below for iOS Safari / In-App WebView / HTTP
    }
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

interface GiftProps {
  currentLang: Language;
  onShowToast: (message: string) => void;
}

export const Gift: React.FC<GiftProps> = ({ currentLang, onShowToast }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { bankAccounts: contextBankAccounts, showPhysicalGift } = useInvitation();
  const bankAccounts = contextBankAccounts?.length ? contextBankAccounts : invitationData.bankAccounts;

  const handleCopyAccount = async (accountNumber: string, _bankName: string, index: number) => {
    await copyTextSafe(accountNumber);
    setCopiedIdx(index);
    setTimeout(() => {
      setCopiedIdx((prev) => (prev === index ? null : prev));
    }, 2000);
    onShowToast(currentLang === 'id' ? 'Tersalin' : 'Copied');
  };

  return (
    <motion.section
      id="gift"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative z-20 w-full py-14 px-6 sm:px-8 bg-transparent text-center"
    >
      {/* Heading: Wedding Gift (without icon and without subtitle) */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mb-8 max-w-md mx-auto text-center"
      >
        <h3 className="text-[clamp(28px,6.5cqw,34px)] leading-tight text-[#EADBC8] text-center mx-auto">
          <MixedText text={currentLang === 'id' ? 'TANDA KASIH' : 'WEDDING GIFT'} />
        </h3>
      </motion.div>

      {/* Bank Options with Direct Copy Icon Button on each card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-md mx-auto space-y-6 text-center"
      >
        <div className="space-y-3">
          {bankAccounts.map((account, idx) => {
            const isCopied = copiedIdx === idx;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-white/15 bg-black/45 backdrop-blur-md hover:border-[#EADBC8]/50 transition-all text-left flex items-center justify-between gap-3 shadow-lg"
              >
                <div className="space-y-1">
                  <span className="font-['Arimo',sans-serif] font-semibold text-[13.5px] sm:text-[14px] text-white">
                    {account.bankName}
                  </span>
                  <p className="font-mono text-[14px] sm:text-[15px] text-[#EADBC8] font-medium tracking-wider">
                    {account.accountNumber}
                  </p>
                  <p className="font-['Arimo',sans-serif] text-[11px] sm:text-[11.5px] text-white/75">
                    a.n. {account.accountHolder}
                  </p>
                </div>

                {/* Direct Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopyAccount(account.accountNumber, account.bankName, idx)}
                  className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-full bg-white/10 hover:bg-[#EADBC8]/25 active:scale-95 border border-[#EADBC8]/40 hover:border-[#EADBC8] text-[#EADBC8] hover:text-white transition-all cursor-pointer shadow-md touch-manipulation"
                  aria-label={`Salin nomor rekening ${account.bankName}`}
                  title="Salin Nomor Rekening"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Physical Gift via WhatsApp */}
        {showPhysicalGift && (
          <div className="pt-6 border-t border-white/15 space-y-3 text-center">
            <p className="font-['Arimo',sans-serif] font-semibold text-[13.5px] sm:text-[14px] text-white/95 text-center">
              Kirim Kado Fisik
            </p>

            <p className="font-['Arimo',sans-serif] text-[11.5px] sm:text-[12px] text-white/75 leading-relaxed mx-auto text-center max-w-[50ch] sm:max-w-[54ch] px-1">
              Bagi kerabat yang ingin mengirimkan kado fisik,
              <br />
              silahkan konfirmasi dengan klik tombol di bawah
            </p>

            <div className="pt-0.5 flex justify-center">
              <AnimatedLinkButton
                href={`https://wa.me/${WA_PENGANTIN}?text=Halo%20Nida%20%26%20Yazid%2C%20saya%20ingin%20mengirimkan%20kado%20fisik%20untuk%20pernikahan%20kalian.`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Pengantin"
              >
                Konfirmasi via WA
              </AnimatedLinkButton>
            </div>
          </div>
        )}
      </motion.div>
    </motion.section>
  );
};
