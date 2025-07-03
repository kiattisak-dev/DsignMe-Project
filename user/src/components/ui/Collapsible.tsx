import React, { useRef, useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  isCollapsible?: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  isOpen = false,
  onToggle,
  icon: Icon,
  isCollapsible = true,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  // Measure content height dynamically with a slight delay to ensure rendering
  useEffect(() => {
    if (contentRef.current && isOpen) {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      const updateHeight = () => {
        const height = contentRef.current?.scrollHeight || 0;
        setContentHeight(height);
      };
      const timeout = setTimeout(() => {
        requestAnimationFrame(updateHeight);
      }, 0);
      return () => clearTimeout(timeout);
    } else {
      setContentHeight(0);
    }
  }, [isOpen]);

  // Animation variants for the content
  const contentVariants = {
    hidden: { height: 0, opacity: 0, y: -10 },
    visible: {
      height: contentHeight || 'auto',
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 180, // Increased for snappier response
        damping: 30, // Higher damping to minimize bounce
        mass: 0.7, // Slightly reduced for quicker animation
        duration: 0.3, // Shortened duration for responsiveness
        ease: 'easeOut',
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.25, // Slightly faster exit for smoothness
        ease: 'easeIn',
      },
    },
  };

  return (
    <div className="bg-gray-100 border-b-2 hover:shadow-lg transition-shadow duration-300">
      {isCollapsible ? (
        <button
          onClick={onToggle}
          className="w-full text-left p-4 font-semibold text-gray-900 flex justify-between items-center"
          aria-expanded={isOpen}
          aria-label={`Toggle ${title}`}
        >
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="w-5 h-5" />}
            <span>{title}</span>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      ) : (
        <div
          className="w-full text-left p-4 font-semibold text-gray-900 flex justify-between items-center"
          aria-label={title}
        >
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="w-5 h-5" />}
            <span>{title}</span>
          </div>
          {isCollapsible && <ChevronDown className="w-5 h-5" />}
        </div>
      )}
      <AnimatePresence>
        {(!isCollapsible || isOpen) && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-4 text-gray-600 border-t border-gray-200 overflow-hidden"
            ref={contentRef}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collapsible;