import React, { useState, useRef } from 'react';

/**
 * Simple Tooltip Component
 * 
 * @example
 * ```tsx
 * <Tooltip content="This is a tooltip">
 *   <span>Hover me</span>
 * </Tooltip>
 * ```
 */

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  asBlock?: boolean; // Add option to render as block instead of inline-block
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = '',
  asBlock = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative ${asBlock ? 'block' : 'inline-block'} ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && content && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[9999] pointer-events-none whitespace-nowrap">
          <div className="bg-primary-700 text-primary-100 px-2 py-1 rounded text-xs shadow-lg">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
