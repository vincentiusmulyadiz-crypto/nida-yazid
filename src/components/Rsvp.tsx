import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useInvitation } from '../context/InvitationContext';
import { Language, Wish } from '../types';
import { CONFIG, APP_MODE, invitationData } from '../data/invitation';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { RedDotRadio } from './DecorLayer';
import { MixedText } from './FlourishText';
import { getInitialGuestMaxPax, isGuestLockedFromUrl, isGroupInvitationFromUrl, decodeGuestQuota } from '../utils/guestCode';

interface RsvpProps {
  currentLang: Language;
  onShowToast: (message: string) => void;
}

const INITIAL_WISHES: Wish[] = [
  {
    id: 'w-1',
    name: 'Dimas & Nadia',
    attendance: 'attending',
    guestCount: 2,
    message: 'Wishing both of you a lifetime of endless laughter, serene mornings, and beautiful creations together. Cannot wait to celebrate with you in Jakarta!',
    createdAt: '2 hours ago',
  },
  {
    id: 'w-2',
    name: 'Auntie Dewi & Om Surya',
    attendance: 'attending',
    guestCount: 2,
    message: 'Selamat menempuh hidup baru untuk Alif dan Lakshita tercinta. Kiranya Tuhan senantiasa memberkahi pernikahan kalian dengan cinta dan kedamaian.',
    createdAt: 'Yesterday',
  },
  {
    id: 'w-3',
    name: 'Kenji Takahashi',
    attendance: 'not_attending',
    guestCount: 1,
    message: 'Sending all our warmest congratulations from Kyoto! Still remembering that afternoon by Kamo River. Wishing you the happiest marriage!',
    createdAt: '2 days ago',
  },
];

function formatRelativeTime(isoString: string, lang: Language): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', { numeric: 'auto' });
    const absSec = Math.abs(diffSec);
    if (absSec < 60) return rtf.format(diffSec, 'second');
    const diffMin = Math.round(diffSec / 60);
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    const diffHours = Math.round(diffMin / 60);
    if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
    const diffDays = Math.round(diffHours / 24);
    if (Math.abs(diffDays) < 30) return rtf.format(diffDays, 'day');
    const diffMonths = Math.round(diffDays / 30);
    if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, 'month');
    return rtf.format(Math.round(diffMonths / 12), 'year');
  } catch {
    return isoString;
  }
}

export const Rsvp: React.FC<RsvpProps> = ({ currentLang, onShowToast }) => {
  const { guestName, guestCode, guestQuota, setGuestQuota, isLockedGuest: contextIsLocked, showHolyMatrimony, showReception } = useInvitation();
  const t = invitationData.translations[currentLang];
  const isLockedGuest = contextIsLocked || isGuestLockedFromUrl();
  const isGroupInvite = isGroupInvitationFromUrl();
  const isGuestBlocked = APP_MODE === 'final' && !isLockedGuest;

  // Wishes state: sample wishes appear only in demo mode
  const [wishes, setWishes] = useState<Wish[]>(() => {
    if (APP_MODE === 'demo') {
      return INITIAL_WISHES;
    }
    return [];
  });

  const [isLoadingWishes, setIsLoadingWishes] = useState<boolean>(false);

  // Form states — individual links pre-fill default guestName (editable); group (&g=1) links start empty
  const [maxPax, setMaxPax] = useState<number>(() => guestQuota || getInitialGuestMaxPax());
  const [name, setName] = useState<string>(() =>
    isGuestBlocked ? 'Khusus Tamu Undangan' : isGroupInvite ? '' : guestName
  );
  const [hasManuallyEditedName, setHasManuallyEditedName] = useState<boolean>(false);
  const [attendance, setAttendance] = useState<'attending' | 'not_attending' | 'undecided'>('attending');
  const [guestCount, setGuestCount] = useState<number>(() => guestQuota || getInitialGuestMaxPax());
  const [message, setMessage] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRecentlySubmitted, setIsRecentlySubmitted] = useState<boolean>(false);
  const [submissionCount, setSubmissionCount] = useState<number>(0);

  // Follow guestName for individual links until guest edits manually
  useEffect(() => {
    if (!hasManuallyEditedName && !isGuestBlocked && !isGroupInvite) {
      setName(guestName);
    }
  }, [guestName, hasManuallyEditedName, isGuestBlocked, isGroupInvite]);

  // Sync guest quota and real name from Supabase in FINAL mode (never pre-fill group links)
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured || typeof window === 'undefined') return;
    try {
      const p = new URLSearchParams(window.location.search);
      const c = (p.get('c') || p.get('code') || '').trim();
      const to = (p.get('to') || p.get('guest') || p.get('name') || '').trim();
      if (!c && !to && (!guestName || guestName === 'Guest' || guestName === 'John Doe')) return;
      const urlQuota = decodeGuestQuota(c || to);
      const hasUrlPax = Boolean(p.get('pax') || p.get('quota') || p.get('max') || p.get('guests') || urlQuota);

      const lookupByName = (nm: string) => {
        if (!nm || nm === 'Guest' || nm === 'John Doe') return;
        supabase!.from('guests').select('name, code').eq('customer_id', CONFIG.customerId).ilike('name', nm.trim()).limit(1).then((res: any) => {
          const rw = res?.data?.[0];
          if (rw) {
            if (rw.name && !isGuestBlocked && !isGroupInvite && !hasManuallyEditedName) setName(rw.name.trim());
            if (!hasUrlPax) {
              const dq = decodeGuestQuota(rw.code);
              if (dq) {
                setMaxPax(dq);
                setGuestCount(dq);
                if (setGuestQuota) setGuestQuota(dq);
              }
            }
          }
        });
      };

      if (c) {
        supabase.from('guests').select('name, code').eq('customer_id', CONFIG.customerId).eq('code', c).limit(1).then((res: any) => {
          const rw = res?.data?.[0];
          if (rw) {
            if (rw.name && !isGuestBlocked && !isGroupInvite && !hasManuallyEditedName) setName(rw.name.trim());
            if (!hasUrlPax) {
              const dq = decodeGuestQuota(rw.code);
              if (dq) {
                setMaxPax(dq);
                setGuestCount(dq);
                if (setGuestQuota) setGuestQuota(dq);
              }
            }
          } else {
            lookupByName(to || guestName);
          }
        });
      } else {
        lookupByName(to || guestName);
      }
    } catch {}
  }, [guestName, isGuestBlocked, isGroupInvite, hasManuallyEditedName]);

  // Load public wishes in FINAL mode
  useEffect(() => {
    if (APP_MODE !== 'final' || !supabase || !isSupabaseConfigured) return;

    let active = true;
    setIsLoadingWishes(true);

    async function fetchWishes() {
      try {
        const { data, error } = await supabase!.rpc('public_wishes', { p_customer: CONFIG.customerId });
        if (!active) return;
        if (!error && Array.isArray(data)) {
          setWishes(
            data
              .map((item: any, i: number) => ({
                id: `rpc-${i}-${item.created_at}`,
                name: String(item.name || ''),
                message: String(item.message || '').replace(/^\[Hadir:[^\]]+\]\s*/i, '').trim(),
                createdAt: formatRelativeTime(item.created_at, currentLang),
              }))
              .filter((w) => w.message.length > 0)
          );
          return;
        }

        // Direct table query fallback
        const { data: tableData, error: tableError } = await supabase!
          .from('rsvps')
          .select('id, name, message, created_at')
          .eq('customer_id', CONFIG.customerId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!active) return;
        if (!tableError && Array.isArray(tableData)) {
          setWishes(
            tableData
              .map((item: any) => ({
                id: `tbl-${item.id || item.created_at}`,
                name: String(item.name || ''),
                message: String(item.message || '').replace(/^\[Hadir:[^\]]+\]\s*/i, '').trim(),
                createdAt: formatRelativeTime(item.created_at, currentLang),
              }))
              .filter((w) => w.message.length > 0)
          );
        }
      } catch (err: any) {
        console.error('Failed to load wishes:', err?.message || err);
      } finally {
        if (active) setIsLoadingWishes(false);
      }
    }

    fetchWishes();

    return () => {
      active = false;
    };
  }, [currentLang]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isGuestBlocked) {
      onShowToast(
        currentLang === 'id'
          ? 'Form RSVP hanya dapat diisi melalui tautan undangan resmi.'
          : 'RSVP can only be submitted via an official guest invitation link.'
      );
      return;
    }

    if (submissionCount >= 3) {
      onShowToast(t.maxSubmissions || (currentLang === 'id' ? 'Batas pengiriman tercapai.' : 'Maximum submissions reached.'));
      return;
    }

    if (isSubmitting || isRecentlySubmitted) return;

    // Honeypot detection: pretend success and send nothing
    if (honeypot.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setMessage('');
        setIsRecentlySubmitted(true);
        setTimeout(() => setIsRecentlySubmitted(false), 5000);
        setSubmissionCount((c) => c + 1);
        onShowToast(t.rsvpThankYou || (currentLang === 'id' ? 'Terima kasih! Konfirmasi & ucapan Anda telah tersimpan.' : 'Thank you! Your RSVP & wishes have been received.'));
      }, 600);
      return;
    }

    // Collapse whitespace and trim
    const cleanName = name.replace(/\s+/g, ' ').trim().slice(0, 100);
    const cleanMessage = message.replace(/\s+/g, ' ').trim().slice(0, 500);

    if (!cleanName) {
      onShowToast(
        currentLang === 'id'
          ? 'Mohon isi nama Anda terlebih dahulu.'
          : 'Please enter your name first.'
      );
      return;
    }

    const normalizedGroupName = guestName.replace(/\s+/g, ' ').trim().toLowerCase();
    if (isGroupInvite && normalizedGroupName && normalizedGroupName !== 'guest' && cleanName.toLowerCase() === normalizedGroupName) {
      onShowToast(
        currentLang === 'id'
          ? 'Mohon isi dengan nama pribadi Anda (bukan nama grup).'
          : 'Please enter your personal name (not the group name).'
      );
      return;
    }

    if (!cleanMessage) return;

    setIsSubmitting(true);

    // Resolve guest identifier/code to store in guest_param
    const urlCode = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('c') ||
        new URLSearchParams(window.location.search).get('code') ||
        new URLSearchParams(window.location.search).get('to')
      : null;
    const finalGuestParam = isGroupInvite
      ? `GROUP:${guestName}`
      : (guestCode || urlCode || cleanName);

    const attendanceMap = {
      attending:
        showHolyMatrimony && !showReception
          ? 'hadir_pemberkatan'
          : !showHolyMatrimony && showReception
          ? 'hadir_resepsi'
          : 'hadir',
      not_attending: 'tidak_hadir',
      undecided: 'belum_pasti',
    } as const;

    const mappedAttendance = attendanceMap[attendance];
    const eventTag =
      attendance === 'attending'
        ? showHolyMatrimony && !showReception
          ? '[Hadir: Akad]'
          : !showHolyMatrimony && showReception
          ? '[Hadir: Resepsi]'
          : ''
        : '';

    const effectiveGuests = attendance === 'attending'
      ? Math.max(1, Math.min(guestCount, maxPax))
      : 1;

    // Send to Supabase database if configured
    if (supabase && isSupabaseConfigured) {
      const payload = {
        customer_id: CONFIG.customerId,
        name: cleanName,
        attendance: mappedAttendance,
        guests: effectiveGuests,
        message: cleanMessage,
        guest_param: finalGuestParam,
      };

      try {
        let { error } = await supabase.from('rsvps').insert(payload);

        // Fallback if DB rsvps_attendance_check only permits ('hadir', 'tidak_hadir', 'belum_pasti')
        if (error && mappedAttendance.startsWith('hadir') && mappedAttendance !== 'hadir') {
          const retry = await supabase.from('rsvps').insert({
            ...payload,
            attendance: 'hadir',
            message: eventTag ? `${eventTag} ${cleanMessage}` : cleanMessage,
          });
          error = retry.error;
        }

        if (error) {
          console.error('RSVP submission error:', error.code, error.message);
          if (APP_MODE === 'final') {
            onShowToast(t.rsvpError || (currentLang === 'id' ? 'Gagal mengirim konfirmasi. Silakan coba lagi.' : 'Failed to send RSVP. Please try again.'));
            setIsSubmitting(false);
            return;
          }
        }
      } catch (err: any) {
        console.error('RSVP submission exception:', err?.code, err?.message || err);
        if (APP_MODE === 'final') {
          onShowToast(t.rsvpError || (currentLang === 'id' ? 'Gagal mengirim konfirmasi. Silakan coba lagi.' : 'Failed to send RSVP. Please try again.'));
          setIsSubmitting(false);
          return;
        }
      }
    }

    // Success: toast notification, clear input message (and name for group links), and append wish to board
    onShowToast(t.rsvpThankYou || (currentLang === 'id' ? 'Terima kasih! Konfirmasi & ucapan Anda telah tersimpan.' : 'Thank you! Your RSVP & wishes have been received.'));
    setMessage('');
    if (isGroupInvite) {
      setName('');
      setHasManuallyEditedName(false);
    }
    setWishes((prev) => [
      {
        id: `rsvp-${Date.now()}`,
        name: cleanName,
        attendance,
        guestCount: attendance === 'attending' ? effectiveGuests : 0,
        message: cleanMessage,
        createdAt: currentLang === 'id' ? 'Baru saja' : 'Just now',
      },
      ...prev,
    ]);
    setIsRecentlySubmitted(true);
    setTimeout(() => setIsRecentlySubmitted(false), 5000);
    setSubmissionCount((c) => c + 1);
    setIsSubmitting(false);
  };

  const attendanceOptions = useMemo(() => {
    let attendLabel = 'Attend';
    if (showHolyMatrimony && !showReception) {
      attendLabel = currentLang === 'id' ? 'Hadir (Akad)' : 'Attend (Akad)';
    } else if (!showHolyMatrimony && showReception) {
      attendLabel = currentLang === 'id' ? 'Hadir (Resepsi)' : 'Attend (Reception)';
    } else {
      attendLabel = currentLang === 'id' ? 'Hadir' : 'Attend';
    }

    const notSureLabel = currentLang === 'id' ? 'Belum Pasti' : 'Not sure';
    const notAttendLabel = currentLang === 'id' ? 'Tidak Hadir' : 'Not attend';

    return [
      { key: 'attending' as const, label: attendLabel },
      { key: 'undecided' as const, label: notSureLabel },
      { key: 'not_attending' as const, label: notAttendLabel },
    ];
  }, [showHolyMatrimony, showReception, currentLang]);

  return (
    <motion.section
      id="rsvp"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative w-full py-16 px-4 sm:px-6 bg-transparent text-center font-arial"
    >
      {/* Glass Box Container matching Wedding Gift card style */}
      <div className="max-w-sm mx-auto rounded-2xl p-6 sm:p-7 border border-white/15 bg-black/45 backdrop-blur-md hover:border-[#EADBC8]/40 transition-all shadow-lg">
        {/* Header Stack */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-8 text-center"
        >
          <h3 className="text-[clamp(28px,6.5cqw,34px)] leading-tight text-[#EADBC8] text-center mx-auto">
            <MixedText text={currentLang === 'id' ? 'RSVP' : 'YOUR RSVP'} />
          </h3>
        </motion.div>

        {/* RSVP Form */}
        <motion.form
          onSubmit={submitHandler}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-6 text-left bg-transparent font-arial"
        >
        {/* Hidden Honeypot Input */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
          style={{ display: 'none' }}
        />

        {/* Name Input: underline only (required, max 100) */}
        <div>
          <label className="block font-arial text-[12px] sm:text-[12.5px] text-white/80 mb-1">
            {t.yourNameLabel}
          </label>
          <input
            type="text"
            required
            maxLength={100}
            value={isGuestBlocked ? 'Khusus Tamu Undangan' : name}
            readOnly={isGuestBlocked}
            onChange={(e) => {
              if (isGuestBlocked) return;
              setName(e.target.value);
              setHasManuallyEditedName(true);
            }}
            placeholder={
              isGroupInvite
                ? currentLang === 'id'
                  ? `Ketik Nama Lengkap Anda (Anggota ${guestName})`
                  : `Enter Your Full Name (Member of ${guestName})`
                : currentLang === 'id'
                ? 'Ketik nama lengkap Anda'
                : 'Enter your full name'
            }
            className={`w-full py-1.5 border-b border-white/20 focus:border-[#EADBC8] focus:outline-none font-arial text-[12.5px] sm:text-[13px] placeholder:text-white/40 transition-colors rounded-none ${
              isGuestBlocked
                ? 'bg-white/10 px-2.5 text-white/65 cursor-not-allowed'
                : 'bg-transparent text-white'
            }`}
          />
          {isGuestBlocked && (
            <p className="mt-1.5 font-arial text-[11px] text-[#EADBC8]/80">
              {currentLang === 'id'
                ? 'Form RSVP & ucapan hanya dapat diisi melalui tautan undangan resmi.'
                : 'RSVP & wishes can only be submitted via an official guest invitation link.'}
            </p>
          )}
        </div>

        {/* Attendance Selection with Custom 22px Ring + Red Dot */}
        <div>
          <label className="block font-arial text-[12px] sm:text-[12.5px] text-white/80 mb-1.5">
            {t.attendanceLabel}
          </label>
          <div className="space-y-1.5 pt-0.5">
            {attendanceOptions.map((opt: { key: 'attending' | 'undecided' | 'not_attending'; label: string }) => {
              const isSelected = attendance === opt.key;
              return (
                <div
                  key={opt.key}
                  onClick={() => setAttendance(opt.key)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      setAttendance(opt.key);
                    }
                  }}
                  className="min-h-[38px] flex items-center gap-2.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white select-none group"
                >
                  <RedDotRadio selected={isSelected} />
                  <span
                    className={`font-arial text-[12px] sm:text-[12.5px] transition-colors ${
                      isSelected ? 'text-white font-medium' : 'text-white/75'
                    }`}
                  >
                    {opt.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guests Select 1..maxPax (only when attending) */}
        {attendance === 'attending' && (
          <div>
            <label className="block font-arial text-[12px] sm:text-[12.5px] text-white/80 mb-1.5">
              {t.guestCountLabel}
            </label>
            <div className="relative">
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full py-2 px-3 bg-black/50 border border-white/20 rounded text-white font-arial text-[12px] sm:text-[12.5px] focus:border-[#EADBC8] focus:outline-none cursor-pointer appearance-none"
              >
                {Array.from({ length: maxPax }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num} className="bg-zinc-900 text-white">
                    {num} {currentLang === 'id' ? 'Orang' : (num === 1 ? 'Person' : 'Persons')}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/60">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Wishes / Notes Textarea (required, max 500, counter) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block font-arial text-[12px] sm:text-[12.5px] text-white/80">
              {t.yourWishLabel}
            </label>
            <span className="font-arial text-[10.5px] text-white/60">
              {message.length}/500
            </span>
          </div>
          <textarea
            required
            maxLength={500}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              currentLang === 'id'
                ? 'Tuliskan doa dan harapan Anda di sini...'
                : 'Write your prayers and kind words here...'
            }
            className="w-full p-2.5 bg-transparent border border-white/20 focus:border-[#EADBC8] focus:outline-none text-white font-arial text-[12px] sm:text-[12.5px] placeholder:text-white/40 transition-colors resize-none rounded-none leading-relaxed"
          />
        </div>

        {/* Submit Button: Tombol kotak biasa dengan teks "Konfirmasi Kehadiran" */}
        <div className="pt-2 text-center">
          <button
            type="submit"
            disabled={isGuestBlocked || isSubmitting || isRecentlySubmitted || submissionCount >= 3}
            className={`w-full py-3 px-6 rounded-none bg-[#EADBC8]/90 hover:bg-[#EADBC8] text-[#1E1611] font-['Arimo',sans-serif] font-semibold text-[13.5px] tracking-wide transition-all shadow-lg active:scale-[0.98] ${
              isGuestBlocked || isSubmitting || isRecentlySubmitted || submissionCount >= 3
                ? 'opacity-55 cursor-not-allowed'
                : 'cursor-pointer'
            }`}
            aria-label={isGuestBlocked ? 'Khusus Tamu Undangan' : 'Konfirmasi Kehadiran'}
          >
            {isGuestBlocked
              ? 'Khusus Tamu Undangan'
              : isSubmitting
              ? 'Mengirimkan...'
              : isRecentlySubmitted
              ? '✓ Terkirim'
              : submissionCount >= 3
              ? 'Batas Pengiriman Tercapai'
              : 'Konfirmasi Kehadiran'}
          </button>
        </div>
      </motion.form>

      {/* Wishes Display List in Arial */}
      <div className="mt-14 max-w-sm mx-auto space-y-4 font-arial text-left">
        <h4 className="text-[clamp(24px,5.5cqw,28px)] leading-tight text-center text-[#EADBC8] mb-6 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
          <MixedText text={currentLang === 'id' ? 'DOA & UCAPAN' : 'YOUR WISHES'} />
        </h4>

        {isLoadingWishes && (
          <p className="text-center font-arial text-[13px] text-white/50 py-3">
            {t.loadingWishes || (currentLang === 'id' ? 'Memuat doa & ucapan...' : 'Loading wishes...')}
          </p>
        )}

        {!isLoadingWishes && wishes.length === 0 && (
          <p className="text-center font-arial text-[13px] text-white/50 py-3">
            {t.noWishesYet || (currentLang === 'id' ? 'Belum ada ucapan. Jadilah yang pertama memberikan doa restu!' : 'No wishes yet. Be the first to send your blessings!')}
          </p>
        )}

        {wishes.length > 0 && (
          <div className="wishes-scroll max-h-[340px] sm:max-h-[380px] overflow-y-auto pt-5 pb-9 pr-1">
            {wishes.map((w, index) => (
              <div
                key={w.id || `wish-${index}`}
                className="p-4 border-b border-white/15 last:border-b-0 space-y-1.5 bg-transparent"
              >
                <div className="flex items-center justify-between text-[13.5px] gap-2">
                  <span className="font-arial text-white font-medium text-[14px] truncate">{w.name}</span>
                  <span className="font-arial text-[12px] text-white/50 shrink-0">{w.createdAt}</span>
                </div>
                <p className="font-arial text-[13.5px] text-white/85 leading-relaxed break-words">
                  {(w.message || '').replace(/^\[Hadir:[^\]]+\]\s*/i, '')}
                </p>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </motion.section>
  );
};
