import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PortfolioItem } from '../../types/types';

interface PortfolioSectionProps {
  portfolioImages: PortfolioItem[];
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ portfolioImages }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const itemsPerPage = 10;

  const totalItems = useMemo(() => (showAll ? portfolioImages : portfolioImages.slice(0, 4)), [showAll, portfolioImages]);
  const totalPages = Math.ceil(totalItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = totalItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">ผลงานของพวกเรา</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentItems.map((image) => (
            <motion.div
              key={image.id}
              className="relative overflow-hidden bg-gray-100 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 aspect-square"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <img
                src={image.url}
                alt={`${image.title}: ${image.description}`}
                className="w-full h-full object-cover absolute inset-0"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
        {!showAll && portfolioImages.length > 4 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
            >
              View More
            </button>
          </div>
        )}
        {showAll && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
              } transition-colors duration-300`}
              aria-label="Previous page"
            >
              <ArrowLeft className="w-5 h-5 inline-block mr-1" />
              Previous
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors duration-300`}
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
              } transition-colors duration-300`}
              aria-label="Next page"
            >
              Next
              <ArrowRight className="w-5 h-5 inline-block ml-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;