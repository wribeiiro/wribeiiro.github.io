const Icon = ({
  name,
  size = 32,
  className = "",
  alt = "",
  "data-testid": testId
}) => {
  const iconMap = {
    'github': '/assets/icons/w2k_internet_document.ico',
    'linkedin': '/assets/icons/w2k_internet_document.ico',
    'email': '/assets/icons/w98_envelope_closed.ico',
    'devto': '/assets/icons/w98_newspaper.ico',
    'gear': '/assets/icons/w98_gears.ico',
  };

  const src = iconMap[name] || '/assets/icons/w98_executable.ico';

  return (
    <img
      src={src}
      alt={alt || name}
      width={size}
      height={size}
      className={`win98-icon ${className}`}
      style={{ imageRendering: 'pixelated', imageRendering: 'crisp-edges' }}
      data-testid={testId || `icon-${name}`}
      draggable={false}
    />
  );
};

export default Icon;
