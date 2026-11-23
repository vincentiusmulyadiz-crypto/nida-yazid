import React from 'react';
import { useInvitation } from '../context/InvitationContext';

interface CoverImageProps {
  className?: string;
}

export const CoverImage: React.FC<CoverImageProps> = ({ className = '' }) => {
  const { coverImage, isPreview } = useInvitation();

  return (
    <img
      src={coverImage}
      alt="Wedding Cover"
      className={`absolute inset-0 w-full h-full object-cover object-center ${
        isPreview ? 'pointer-events-none select-none' : ''
      } ${className}`}
      loading="eager"
      onContextMenu={(e) => {
        if (isPreview) e.preventDefault();
      }}
      onDragStart={(e) => {
        if (isPreview) e.preventDefault();
      }}
    />
  );
};
