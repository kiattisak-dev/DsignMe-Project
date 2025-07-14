import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioItem } from '../../types/types';

// Animation variants for portfolio items
const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

// Animation variants for buttons
const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

// Animation variants for pagination buttons
const paginationButtonVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Animation variants for modal
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

// Animation variants for section scroll
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

interface PortfolioSectionProps {
  portfolioImages: PortfolioItem[];
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ portfolioImages }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const itemsPerPage = 10;

  const totalItems = useMemo(() => (showAll ? portfolioImages : portfolioImages.slice(0, 4)), [showAll, portfolioImages]);
  const totalPages = Math.ceil(totalItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = totalItems.slice(startIndex, startIndex + itemsPerPage);

  const openModal = (image: PortfolioItem) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <motion.section
      className="py-12 bg-white sm:py-16 lg:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            ผลงานของพวกเรา
          </h2>
        </motion.div>
        {portfolioImages.length === 0 ? (
          <div className="text-center text-gray-500 text-base sm:text-lg">
            ไม่มีผลงานที่สามารถแสดงได้
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <AnimatePresence>
              {currentItems.map((image) => (
                <motion.div
                  key={image.id}
                  className="relative overflow-hidden bg-gray-100 border border-gray-200 shadow-md transition-shadow duration-300 cursor-pointer"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover="hover"
                  onClick={() => openModal(image)}
                >
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={`${image.title}`}
                      className="w-full h-full object-cover aspect-square"
                      loading="lazy"
                      onError={() => console.warn(`Failed to load image: ${image.url}`)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm sm:text-base">
                      ไม่มีภาพ
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        <AnimatePresence>
          {!showAll && portfolioImages.length > 4 && (
            <motion.div
              className="text-center"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8 }}
              variants={buttonVariants}
            >
              <motion.button
                onClick={() => setShowAll(true)}
                className="bg-black text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300 text-sm sm:text-base"
                variants={buttonVariants}
                whileHover="hover"
              >
                ดูเพิ่มเติม
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        {showAll && totalPages > 1 && (
          <motion.div
            className="flex justify-center items-center space-x-2 mt-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base ${
                currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
              } transition-colors duration-300`}
              variants={paginationButtonVariants}
              whileHover={currentPage === 1 ? {} : { scale: 1.05 }}
              aria-label="Previous page"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1" />
              Previous
            </motion.button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base ${
                    currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors duration-300`}
                  variants={paginationButtonVariants}
                  whileHover={{ scale: 1.05 }}
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </motion.button>
              ))}
            </div>
            <motion.button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base ${
                currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
              } transition-colors duration-300`}
              variants={paginationButtonVariants}
              whileHover={currentPage === totalPages ? {} : { scale: 1.05 }}
              aria-label="Next page"
            >
              Next
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 inline-block ml-1" />
            </motion.button>
          </motion.div>
        )}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              onClick={closeModal}
            >
              <motion.div
                className="relative bg-white rounded-lg max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </button>
                {selectedImage.url ? (
                  <img
                    src={selectedImage.url}
                    alt={`${selectedImage.title}`}
                    className="w-full h-auto object-contain max-h-[80vh]"
                    loading="lazy"
                    onError={() => console.warn(`Failed to load image: ${selectedImage.url}`)}
                  />
                ) : (
                  <div className="w-full h-64 sm:h-80 flex items-center justify-center bg-gray-200 text-gray-500 text-base sm:text-lg">
                    ไม่มีภาพ
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default PortfolioSection;