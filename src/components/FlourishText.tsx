import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface MixedTextProps {
  text: string;
  className?: string;
  color?: string;
}

/**
 * Editorial Mixed Typography for Section Headings & Single Words:
 * ONLY the VERY FIRST letter of the entire phrase/heading is in flowing script (Great Vibes),
 * while ALL the remaining letters (including subsequent words) are in refined Cormorant Garamond serif.
 *
 * Example:
 * "YOUR RSVP" -> "Y" (Great Vibes) + "our rsvp" (Cormorant Garamond lowercase)
 * "OUR GALLERY" -> "O" (Great Vibes) + "ur gallery" (Cormorant Garamond lowercase)
 * "WEDDING GIFT" -> "W" (Great Vibes) + "edding gift" (Cormorant Garamond lowercase)
 */
export const MixedText: React.FC<MixedTextProps> = ({ text, className = '', color = 'text-[#EADBC8]' }) => {
  if (!text || text.trim() === '') return null;

  const trimmed = text.trim();

  // Special case: "Akad & Resepsi keluarga" (hanya huruf pertama A yang script, huruf R tetap kapital menggunakan font kedua Cormorant Garamond)
  if (trimmed.toLowerCase().startsWith('akad & resepsi')) {
    const firstLetter = trimmed.charAt(0).toUpperCase(); // 'A' (Great Vibes)
    const remaining = trimmed.slice(1); // "kad & Resepsi keluarga" (Cormorant Garamond)

    return (
      <span
        className={`inline-flex items-baseline justify-center tracking-normal select-none ${className}`}
      >
        <span
          className={`font-['Great_Vibes',cursive] font-normal text-[1.38em] leading-none -mr-[0.02em] ${color} drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]`}
          style={{ transform: 'translateY(0.03em)' }}
        >
          {firstLetter}
        </span>
        <span className={`font-['Cormorant_Garamond',serif] italic text-[1.04em] tracking-[0.01em] font-medium ${color} drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]`}>
          {remaining}
        </span>
      </span>
    );
  }

  const firstLetter = trimmed.charAt(0).toUpperCase();
  const remaining = trimmed.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-baseline justify-center tracking-normal select-none ${className}`}
    >
      <span
        className={`font-['Great_Vibes',cursive] font-normal text-[1.38em] leading-none -mr-[0.02em] ${color}`}
        style={{ transform: 'translateY(0.03em)' }}
      >
        {firstLetter}
      </span>
      <span className={`font-['Cormorant_Garamond',serif] italic text-[1.04em] lowercase tracking-[0.01em] font-medium ${color}`}>
        {remaining}
      </span>
    </span>
  );
};

export const SwashHeading: React.FC<{
  text?: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ text, children, className = '' }) => {
  const content = text || (typeof children === 'string' ? children : '');

  return (
    <h3
      className={`text-[clamp(28px,6.5cqw,34px)] leading-tight text-[#EADBC8] select-none ${className}`}
    >
      {typeof content === 'string' && content.length > 0 ? (
        <MixedText text={content} />
      ) : (
        children
      )}
    </h3>
  );
};

/**
 * Couple Name in Mixed Typography:
 * Seno -> S (Great Vibes capital) + eno (Cormorant Garamond lowercase)
 * & -> Cormorant Garamond italic ampersand
 * Jattu -> J (Great Vibes capital) + attu (Cormorant Garamond lowercase)
 */
export const CoupleName: React.FC<{
  groom: string;
  bride: string;
  className?: string;
}> = ({ groom, bride, className = '' }) => {
  return (
    <span className={`inline-flex items-baseline justify-center select-none ${className}`}>
      <MixedText text={groom} />
      <span
        className="font-['Cormorant_Garamond',serif] italic text-[0.78em] font-normal text-[#EADBC8] mx-2.5 sm:mx-3 inline-block align-baseline"
      >
        &amp;
      </span>
      <MixedText text={bride} />
    </span>
  );
};

export const FlourishText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  if (text.includes('&')) {
    const [groom, bride] = text.split('&').map((p) => p.trim());
    return <CoupleName groom={groom} bride={bride} className={className} />;
  }

  return <MixedText text={text} className={className} />;
};

/**
 * Letter-by-letter handwriting animation component for standard text/quotes.
 * Recreates the authentic visual appearance of an invisible fountain pen
 * writing each character sequentially onto the screen.
 */
export const HandwrittenText: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  trigger?: 'view' | 'animate';
}> = ({ text, className = '', delay = 0, speed = 0.035, trigger = 'view' }) => {
  const prefersReduced = useReducedMotion();
  if (!text || text.trim() === '') return null;

  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: speed,
        delayChildren: delay,
      },
    },
  };

  const charVariant = {
    hidden: {
      opacity: 0,
      y: 3,
      filter: 'blur(2px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.16,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      {...(trigger === 'animate'
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport: { once: true, margin: '-20px' } })}
      className={`inline-block ${className}`}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={charVariant}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </motion.span>
  );
};

/**
 * Letter-by-letter handwriting animation for Mixed Typography headings.
 */
export const HandwrittenMixedText: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  trigger?: 'view' | 'animate';
}> = ({ text, className = '', delay = 0, trigger = 'view' }) => {
  const prefersReduced = useReducedMotion();
  if (!text || text.trim() === '') return null;

  if (prefersReduced) {
    return <MixedText text={text} className={className} />;
  }

  const trimmed = text.trim();
  const isSpecial = trimmed.toLowerCase().startsWith('akad & resepsi');

  const firstLetter = trimmed.charAt(0).toUpperCase();
  const remaining = isSpecial ? trimmed.slice(1) : trimmed.slice(1).toLowerCase();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      },
    },
  };

  const charVariant = {
    hidden: { opacity: 0, y: 3, filter: 'blur(2px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.16, ease: 'easeOut' as const },
    },
  };

  const words = remaining.split(' ');

  return (
    <motion.span
      variants={container}
      initial="hidden"
      {...(trigger === 'animate'
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport: { once: true, margin: '-20px' } })}
      className={`inline-flex items-baseline justify-center tracking-normal select-none flex-wrap ${className}`}
    >
      <motion.span
        variants={charVariant}
        className="font-['Great_Vibes',cursive] font-normal text-[1.38em] leading-none -mr-[0.02em] text-[#EADBC8] inline-block"
        style={{ transform: 'translateY(0.03em)' }}
      >
        {firstLetter}
      </motion.span>

      <span className="font-['Cormorant_Garamond',serif] italic text-[1.04em] tracking-[0.01em] font-medium text-[#EADBC8] inline-block">
        {words.map((word, wIdx) => (
          <span key={wIdx} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, cIdx) => (
              <motion.span
                key={cIdx}
                variants={charVariant}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
            {wIdx < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </span>
    </motion.span>
  );
};

/**
 * Letter-by-letter handwriting animation for Couple Names (Seno & Jattu).
 */
export const HandwrittenCoupleName: React.FC<{
  groom: string;
  bride: string;
  className?: string;
  delay?: number;
  trigger?: 'view' | 'animate';
}> = ({ groom, bride, className = '', delay = 0, trigger = 'view' }) => {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return <CoupleName groom={groom} bride={bride} className={className} />;
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.045,
        delayChildren: delay,
      },
    },
  };

  const charVariant = {
    hidden: { opacity: 0, y: 3, filter: 'blur(2px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.16, ease: 'easeOut' as const },
    },
  };

  const groomFirst = groom.charAt(0).toUpperCase();
  const groomRest = groom.slice(1).toLowerCase();

  const brideFirst = bride.charAt(0).toUpperCase();
  const brideRest = bride.slice(1).toLowerCase();

  return (
    <motion.span
      variants={container}
      initial="hidden"
      {...(trigger === 'animate'
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport: { once: true, margin: '-20px' } })}
      className={`inline-flex items-baseline justify-center pl-[0.08em] select-none ${className}`}
    >
      {/* Groom first letter */}
      <motion.span
        variants={charVariant}
        className="font-['Great_Vibes',cursive] font-normal text-[1.38em] leading-none -mr-[0.02em] text-[#EADBC8] inline-block"
        style={{ transform: 'translateY(0.03em)' }}
      >
        {groomFirst}
      </motion.span>
      {/* Groom remaining */}
      <span className="font-['Cormorant_Garamond',serif] italic text-[1.04em] tracking-[0.01em] font-medium text-[#EADBC8] inline-block">
        {Array.from(groomRest).map((char, i) => (
          <motion.span key={i} variants={charVariant} className="inline-block">
            {char}
          </motion.span>
        ))}
      </span>

      {/* & ampersand */}
      <motion.span
        variants={charVariant}
        className="font-['Cormorant_Garamond',serif] italic text-[0.78em] font-normal text-[#EADBC8] mx-2.5 sm:mx-3 inline-block align-baseline"
      >
        &amp;
      </motion.span>

      {/* Bride first letter */}
      <motion.span
        variants={charVariant}
        className="font-['Great_Vibes',cursive] font-normal text-[1.38em] leading-none -mr-[0.02em] text-[#EADBC8] inline-block"
        style={{ transform: 'translateY(0.03em)' }}
      >
        {brideFirst}
      </motion.span>
      {/* Bride remaining */}
      <span className="font-['Cormorant_Garamond',serif] italic text-[1.04em] tracking-[0.01em] font-medium text-[#EADBC8] inline-block">
        {Array.from(brideRest).map((char, i) => (
          <motion.span key={i} variants={charVariant} className="inline-block">
            {char}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
};
