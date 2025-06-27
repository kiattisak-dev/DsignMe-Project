import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const CTASection: React.FC<CTASectionProps> = ({ title, description, buttonText }) => {
  return (
    <section className="py-20 bg-gray-50">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl p-8 border border-blue-500/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{title}</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2">
              <span>{buttonText}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/#contact"
              className="text-gray-600 hover:text-gray-900 px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:border-gray-400 transition-all duration-300"
            >
              Get Free Consultation
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;