import React from 'react';
import { motion } from 'framer-motion';
import { ContactInfo } from '../../types/types';

// Animation variants for the container (staggered children)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

// Animation variants for individual elements
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Animation variants for buttons
const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

interface HeroSectionProps {
  title: string;
  description: string;
  contactInfo: ContactInfo[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, description, contactInfo }) => {
  return (
    <section className="pt-28 pb-16 bg-gradient-to-br from-gray-200 via-white to-gray-300 relative overflow-hidden flex items-center justify-center min-h-screen">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-400/30 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gray-500/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mt-10 mb-10" variants={itemVariants}>
          <motion.h1 className="text-4xl md:text-6xl font-bold mb-5 text-gray-800" variants={itemVariants}>
            {title}
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed" variants={itemVariants}>
            {description}
          </motion.p>
        </motion.div>
        <motion.div className="text-center mb-4 mt-2 bg-black py-4 rounded-xl mx-auto max-w-sm" variants={itemVariants}>
          <h2 className="text-xl md:text-2xl font-medium text-white font-sans tracking-tight">
            ขั้นตอน & บริการ
          </h2>
        </motion.div>
        <motion.div className="text-center mb-4 mt-2 py-5 rounded-lg mx-auto max-w-4xl border border-white/20" variants={itemVariants}>
          <h2 className="text-xl md:text-2xl font-medium mb-4 text-black">ติดต่อเรา</h2>
          <div className="flex flex-row justify-center items-center gap-8 mx-auto max-w-md">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={`https://${info.detail.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-white rounded-full border border-black shadow-md hover:bg-gray-200 hover:scale-105 transition-all duration-300"
                variants={buttonVariants}
                aria-label={`Contact via ${info.title}`}
              >
                <info.icon className="w-6 h-6 text-black" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;