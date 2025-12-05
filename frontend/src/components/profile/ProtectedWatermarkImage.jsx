import React from 'react';

const ProtectedWatermarkImage = ({ src, alt, className, onError }) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };

  const handleSelectStart = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt}
        className={className}
        onError={onError}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onSelect={handleSelectStart}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      />
      {/* Invisible overlay to block interactions */}
      <div 
        className="absolute inset-0 cursor-not-allowed"
        style={{
          pointerEvents: 'auto'
        }}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
      />
    </div>
  );
};

export default ProtectedWatermarkImage;