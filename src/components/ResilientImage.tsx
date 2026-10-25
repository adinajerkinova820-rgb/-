import React, { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#F5F2EC] to-[#EAE4D8] text-[#57524B] p-6 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-10 h-10 mb-3 text-[#7A582C] stroke-[1.25]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2v3m0 0c-1.8 0-3 1.2-3 2.8 0 1.4.9 2.4 1.5 3.7L8 19h8l-2.5-7.5c.6-1.3 1.5-2.3 1.5-3.7C15 6.2 13.8 5 12 5Z" />
          <path d="M6 19h12M12 19v3M9 22h6" />
        </svg>
        <span className="font-display text-lg font-semibold text-[#141312]">
          {fallbackTitle || alt}
        </span>
        <span className="text-xs text-[#6E675F] mt-1">Luxe Wedding Salon</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
