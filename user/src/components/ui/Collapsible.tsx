import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children, isOpen, onToggle, icon: Icon }) => {
  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
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