import React from 'react';
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
  // Animation variants for the content
  const contentVariants = {
    hidden: { height: 0, opacity: 0, y: -10 },
    visible: {
      height: 'auto',
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 20,
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
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
          <ChevronDown className="w-5 h-5" />
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
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collapsible;