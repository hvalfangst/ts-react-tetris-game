import React from 'react';

interface MobileControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onPause: () => void;
  isGameActive: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  onPause,
  isGameActive,
}) => {
  const handleTouchStart = (callback: () => void) => (e: React.TouchEvent) => {
    e.preventDefault();
    callback();
  };

  return (
    <div className="mobile-controls">
      <div className="mobile-controls-top">
        <button
          className="mobile-btn pause-btn"
          onTouchStart={handleTouchStart(onPause)}
          disabled={!isGameActive}
        >
          ⏸️
        </button>
        <button
          className="mobile-btn rotate-btn"
          onTouchStart={handleTouchStart(onRotate)}
          disabled={!isGameActive}
        >
          🔄
        </button>
      </div>
      
      <div className="mobile-controls-main">
        <div className="mobile-controls-left">
          <button
            className="mobile-btn move-btn"
            onTouchStart={handleTouchStart(onMoveLeft)}
            disabled={!isGameActive}
          >
            ⬅️
          </button>
        </div>
        
        <div className="mobile-controls-center">
          <button
            className="mobile-btn drop-btn hard-drop"
            onTouchStart={handleTouchStart(onHardDrop)}
            disabled={!isGameActive}
          >
            ⬇️⬇️
          </button>
          <button
            className="mobile-btn drop-btn soft-drop"
            onTouchStart={handleTouchStart(onSoftDrop)}
            disabled={!isGameActive}
          >
            ⬇️
          </button>
        </div>
        
        <div className="mobile-controls-right">
          <button
            className="mobile-btn move-btn"
            onTouchStart={handleTouchStart(onMoveRight)}
            disabled={!isGameActive}
          >
            ➡️
          </button>
        </div>
      </div>
    </div>
  );
};