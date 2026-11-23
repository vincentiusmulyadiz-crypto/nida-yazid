import React from 'react';
import { motion } from 'motion/react';
import { useInvitation } from '../context/InvitationContext';
import { Language } from '../types';
import { SwashHeading } from './FlourishText';
import { LoveStoryIcon } from './Icons';

interface StoryProps {
  currentLang: Language;
}

export const Story: React.FC<StoryProps> = ({ currentLang }) => {
  const { storyMilestones } = useInvitation();
  const isId = currentLang === 'id';

  return (
    <motion.section
      id="story"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative w-full py-16 px-4 sm:px-6 bg-transparent text-center"
    >
      {/* Header Stack (Strictly Centered) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="space-y-2 mb-12 max-w-[34ch] mx-auto text-center"
      >
        <div className="flex justify-center mb-2.5 text-white/85">
          <LoveStoryIcon className="w-8 h-8 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] icon-wiggle" />
        </div>

        <p className="font-text text-[var(--fs-lead)] text-[#F7F5F0]/80 mx-auto text-center">
          {isId ? 'Setiap kisah cinta memiliki awal mula...' : 'Every love has a beginning...'}
        </p>

        <SwashHeading
          text={isId ? 'KISAH KAMI' : 'Ours became forever'}
          className="mx-auto text-center"
        />
      </motion.div>

      {/* Timeline entries in Zig-Zag format (1st: Left, 2nd: Right, 3rd: Left, 4th: Right...) */}
      <div className="space-y-8 sm:space-y-10 w-full max-w-md mx-auto px-2 sm:px-4 font-text flex flex-col">
        {storyMilestones.map((milestone, idx) => {
          const isRight = idx % 2 === 1; // odd index (2nd, 4th...) = right, even index (1st, 3rd...) = left

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.7, delay: idx * 0.08, ease: 'easeOut' }}
              className={`w-[82%] sm:w-[80%] flex flex-col ${
                isRight
                  ? 'ml-auto items-end text-right'
                  : 'mr-auto items-start text-left'
              }`}
            >
              {/* Moment title with 1px semi-transparent underline matching title width */}
              <div
                className={`border-b border-white/40 pb-1 inline-block ${
                  isRight ? 'text-right' : 'text-left'
                }`}
              >
                <h4
                  className={`font-title text-[var(--fs-title)] text-[#ffffff] font-normal leading-[var(--lh-title)] drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] ${
                    isRight ? 'text-right' : 'text-left'
                  }`}
                >
                  {milestone.title}
                  {milestone.year ? ` (${milestone.year.replace(/^[a-zA-Z\s]+/, '') || milestone.year})` : ''}
                </h4>
              </div>

              {/* Description underneath (max 2 lines, bounded to 70-75% width) */}
              <p
                className={`font-text text-[var(--fs-body)] text-[#F7F5F0]/85 leading-[var(--lh-body)] text-pretty drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] mt-2 ${
                  isRight ? 'text-right' : 'text-left'
                }`}
              >
                {milestone.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};
