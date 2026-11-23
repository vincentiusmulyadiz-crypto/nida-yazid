import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { motion } from 'motion/react';
import { useInvitation } from '../context/InvitationContext';
import { invitationData, MEDIA } from '../data/invitation';
import { Language } from '../types';
import { SwashHeading } from './FlourishText';
import { EntranceVipIcon } from './Icons';
import { generateGuestPassId } from '../utils/guestCode';

interface AccessCardProps {
  currentLang: Language;
}

export const AccessCard: React.FC<AccessCardProps> = ({ currentLang }) => {
  const [passId, setPassId] = useState('JOY-SJ-088');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  // Read couple, events, guestName, guestCode, guestQuota, and accessCardPhoto from context
  const { couple, akad, reception, showHolyMatrimony, showReception, accessCardPhoto, coverImage, guestName, guestCode, guestQuota } = useInvitation();
  const primaryEvent = !showHolyMatrimony && showReception ? reception : akad;
  const t = invitationData.translations[currentLang];
  const photoSrc = accessCardPhoto || coverImage || MEDIA.accessCardPhoto || MEDIA.poster;
  const quota = guestQuota || 2;

  const guestSalutation =
    currentLang === 'id' ? `Kepada Yth. Bpk/Ibu/Sdr/i ${guestName}` : `Dear Mr./Mrs./Ms. ${guestName}`;

  useEffect(() => {
    setPassId(generateGuestPassId(guestName, couple.groom.name, couple.bride.name));
  }, [guestName, couple.groom.name, couple.bride.name]);

  useEffect(() => {
    const qrPayload = JSON.stringify({
      event: `${couple.groom.name} & ${couple.bride.name} Wedding`,
      guest: guestName,
      passId,
      ...(guestCode ? { code: guestCode } : {}),
      date: primaryEvent.date,
      validity: `Valid for (${quota}) person(s)`,
    });

    QRCode.toDataURL(
      qrPayload,
      {
        width: 260,
        margin: 1,
        color: {
          dark: '#0A0A0A',
          light: '#FFFFFF',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [guestName, guestCode, passId, couple, primaryEvent, quota]);

  const handleDownloadCard = () => {
    if (!qrDataUrl) return;

    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 1040;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White rounded card background
    ctx.fillStyle = '#FFFFFF';
    ctx.roundRect(40, 40, canvas.width - 80, canvas.height - 80, 24);
    ctx.fill();

    // Subtle border
    ctx.strokeStyle = '#E4E4E7';
    ctx.lineWidth = 2;
    ctx.roundRect(40, 40, canvas.width - 80, canvas.height - 80, 24);
    ctx.stroke();

    // Dark VVIP badge
    ctx.fillStyle = '#18181B';
    ctx.roundRect(canvas.width - 190, 70, 110, 36, 18);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VVIP ACCESS', canvas.width - 135, 93);

    // Label
    ctx.fillStyle = '#71717A';
    ctx.font = '14px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Entrance Access Card', 80, 95);

    // Couple names
    ctx.fillStyle = '#18181B';
    ctx.font = 'bold 28px Arial, Helvetica, sans-serif';
    ctx.fillText(`${couple.groom.name} & ${couple.bride.name}`, 80, 150);

    // Venue & Date
    ctx.fillStyle = '#52525B';
    ctx.font = '15px Arial, Helvetica, sans-serif';
    ctx.fillText(`${primaryEvent.venueName} · ${primaryEvent.date}`, 80, 180);

    // Thin separator
    ctx.strokeStyle = '#E4E4E7';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 210);
    ctx.lineTo(canvas.width - 80, 210);
    ctx.stroke();

    // Draw QR Code
    const qrImg = new Image();
    qrImg.onload = () => {
      const qrSize = 340;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = 260;

      ctx.strokeStyle = '#18181B';
      ctx.lineWidth = 1.5;
      ctx.roundRect(qrX - 16, qrY - 16, qrSize + 32, qrY + 32, 16);
      ctx.stroke();

      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      ctx.fillStyle = '#18181B';
      ctx.font = 'bold 20px Arial, Helvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(guestSalutation, canvas.width / 2, 700);

      ctx.fillStyle = '#52525B';
      ctx.font = '15px Arial, Helvetica, sans-serif';
      ctx.fillText(`Valid for (${quota}) person(s)`, canvas.width / 2, 740);

      ctx.fillStyle = '#71717A';
      ctx.font = '13px Arial, Helvetica, sans-serif';
      ctx.fillText(passId, canvas.width / 2, 775);

      ctx.fillStyle = '#A1A1AA';
      ctx.font = '13px Arial, Helvetica, sans-serif';
      ctx.fillText('Please present this card at the reception table upon arrival.', canvas.width / 2, 890);

      const link = document.createElement('a');
      link.download = `Access-Pass-${guestName.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    qrImg.src = qrDataUrl;
  };

  return (
    <motion.section
      id="access"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative w-full py-16 px-5 sm:px-8 bg-transparent text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mb-8 text-center mx-auto"
      >
        <div className="flex justify-center mb-2.5 text-white/85">
          <EntranceVipIcon className="w-8 h-8 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] icon-wiggle" />
        </div>
        <SwashHeading text={t.accessCard} className="mx-auto text-center" />
      </motion.div>

      {/* The ONLY Light Element */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative max-w-[320px] mx-auto bg-white text-zinc-900 rounded-[16px] overflow-hidden shadow-2xl text-left"
      >
        {/* Photo Header */}
        <div className="relative h-28 w-full overflow-hidden bg-zinc-800">
          <img
            src={photoSrc}
            alt="Ceremony Venue Preview"
            className="w-full h-full object-cover object-center filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-zinc-900/90 text-white text-[11px] font-arial font-semibold rounded-full backdrop-blur-sm border border-white/20">
            VVIP
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-3.5 font-arial">
          <div>
            <p className="font-arial text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
              {t.accessCard}
            </p>
            <h4 className="font-arial text-[17px] sm:text-[18px] text-zinc-900 font-semibold leading-snug">
              {couple.groom.name} &amp; {couple.bride.name}
            </h4>
            <p className="font-arial text-[12.5px] text-zinc-500 leading-snug pt-0.5">
              {primaryEvent.venueName} · {primaryEvent.date}
            </p>
          </div>

          <div className="flex justify-center py-1">
            <div className="p-2.5 border border-zinc-900 rounded-[12px] bg-white">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Access Code for ${guestName}`}
                  className="w-32 h-32 object-contain"
                  width={128}
                  height={128}
                />
              ) : (
                <div className="w-32 h-32 bg-zinc-100 flex items-center justify-center text-xs text-zinc-400 font-arial">
                  Generating...
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-0.5 pt-1.5 border-t border-zinc-100">
            <p className="font-arial text-[15px] sm:text-[16px] text-zinc-900 font-semibold leading-tight">
              {guestSalutation}
            </p>
            <p className="font-arial text-[13px] text-zinc-600">
              Valid for ({quota}) person(s)
            </p>
            <p className="font-arial text-[11.5px] text-zinc-400 tracking-wider">
              {passId}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 space-y-3.5 font-text max-w-xs mx-auto">
        <p className="text-[var(--fs-body)] text-[#F7F5F0]/85 leading-[var(--lh-body)] text-pretty">
          {t.accessSubtitle}
        </p>

        <div>
          <button
            onClick={handleDownloadCard}
            className="btn-pill-transparent font-arial text-[13.5px] sm:text-[14px]"
            aria-label={t.downloadPass}
          >
            {t.downloadPass}
          </button>
        </div>
      </div>
    </motion.section>
  );
};
