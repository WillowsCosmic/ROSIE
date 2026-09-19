'use client';

interface FlourishProps {
  className?: string;
}

export function HandDrawnVine({ className = '' }: FlourishProps) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 280 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hand-drawn organic leaf vine curve */}
      <path
        d="M10 45 C 50 15, 90 55, 140 30 C 190 5, 230 45, 270 20"
        stroke="#E8A33D"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Vine leaves */}
      <path
        d="M60 28 Q 65 18 75 22 Q 68 32 60 28 Z"
        fill="#8FB8A0"
        fillOpacity="0.35"
        stroke="#E8A33D"
        strokeOpacity="0.3"
      />
      <path
        d="M130 32 Q 138 42 148 38 Q 140 28 130 32 Z"
        fill="#8FB8A0"
        fillOpacity="0.35"
        stroke="#E8A33D"
        strokeOpacity="0.3"
      />
      <path
        d="M210 20 Q 215 10 225 15 Q 218 25 210 20 Z"
        fill="#8FB8A0"
        fillOpacity="0.35"
        stroke="#E8A33D"
        strokeOpacity="0.3"
      />
      {/* Star dots */}
      <circle cx="270" cy="20" r="2.5" fill="#E8A33D" fillOpacity="0.8" />
      <circle cx="10" cy="45" r="2" fill="#D97B6C" fillOpacity="0.8" />
    </svg>
  );
}

export function HandDrawnStar({ className = '' }: FlourishProps) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2 L13.8 8.2 L20 10 L13.8 11.8 L12 18 L10.2 11.8 L4 10 L10.2 8.2 Z"
        stroke="#E8A33D"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
