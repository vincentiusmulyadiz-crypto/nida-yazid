import React from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  icon?: 'arrow' | 'location' | 'calendar';
}

const ArrowPath = () => (
  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
);

const LocationPath = () => (
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
);

const CalendarPath = () => (
  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
);

const renderIcon = (icon: 'arrow' | 'location' | 'calendar') => {
  if (icon === 'location') return <LocationPath />;
  if (icon === 'calendar') return <CalendarPath />;
  return <ArrowPath />;
};

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = '',
  icon = 'arrow',
  ...props
}) => {
  return (
    <button className={`animated-button ${className}`.trim()} {...props}>
      {/* Circle animation back-layer */}
      <span className="circle" aria-hidden="true" />

      {/* Button label text */}
      <span className="text">{children}</span>

      {/* Primary forward icon (slides out right on hover) */}
      <svg
        className="arr-1"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {renderIcon(icon)}
      </svg>

      {/* Secondary incoming icon (slides in from left on hover) */}
      <svg
        className="arr-2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {renderIcon(icon)}
      </svg>
    </button>
  );
};

interface AnimatedLinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
  icon?: 'arrow' | 'location' | 'calendar';
}

export const AnimatedLinkButton: React.FC<AnimatedLinkButtonProps> = ({
  children,
  className = '',
  icon = 'arrow',
  ...props
}) => {
  return (
    <a className={`animated-button ${className}`.trim()} {...props}>
      <span className="circle" aria-hidden="true" />
      <span className="text">{children}</span>
      <svg
        className="arr-1"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {renderIcon(icon)}
      </svg>
      <svg
        className="arr-2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {renderIcon(icon)}
      </svg>
    </a>
  );
};
