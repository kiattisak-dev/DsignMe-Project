import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PortfolioItem } from "../../types/types";
import MediaItem from "./PortfolioSection/MediaItem";
import ModalContent from "./PortfolioSection/ModalContent";

// Animation variants for section scroll
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Animation variants for buttons
const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

// Animation variants for pagination buttons
const paginationButtonVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hover: { backgroundColor: "#f3f4f6", transition: { duration: 0.2 } },
};

interface PortfolioSectionProps {
  portfolioImages: PortfolioItem[];
  isFetchingMore: boolean;
  onFetchMore: () => void;
  hasMore: boolean;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  portfolioImages,
  isFetchingMore,
  onFetchMore,
  hasMore,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const itemsPerPage = 8;
  const initialItems = 4;

  // คำนวณ totalItems โดยใช้ portfolioImages ทั้งหมด
  const totalItems = portfolioImages;
  const totalPages = Math.ceil(totalItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = totalItems.slice(startIndex, startIndex + itemsPerPage);

  const openModal = (item: PortfolioItem) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1));
  };

  const handleFetchMore = () => {
    setShowAll(true);
    onFetchMore();
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
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            ผลงานของพวกเรา
          </h3>
        </motion.div>

        {portfolioImages.length === 0 ? (
          <div className="text-center text-gray-500 text-base sm:text-lg">
            ไม่มีผลงานที่สามารถแสดงได้
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
            key={currentPage}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <AnimatePresence mode="wait">
              {currentItems.map((item, index) => (
                <MediaItem
                  key={item.id || `fallback-${index}`}
                  item={item}
                  onClick={() => openModal(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {hasMore && !showAll && totalItems.length <= initialItems && (
            <motion.div
              className="text-center"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8 }}
              variants={buttonVariants}
            >
              <motion.button
                onClick={handleFetchMore}
                disabled={isFetchingMore}
                className={`bg-black text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold transition-colors duration-300 text-sm sm:text-base ${
                  isFetchingMore ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
                }`}
                variants={buttonVariants}
                whileHover={isFetchingMore ? {} : "hover"}
              >
                {isFetchingMore ? "กำลังโหลด..." : "ดูเพิ่มเติม"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {isFetchingMore && (
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">กำลังโหลดผลงานเพิ่มเติม...</p>
          </motion.div>
        )}

        {totalPages > 1 && (
          <motion.div
            className="flex justify-center items-center space-x-2 mt-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.button
              onClick={goToPreviousPage}
              disabled={totalPages === 1}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base ${
                totalPages === 1
                  ? "bg-gray-200 text-gray-900 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-100"
              } border border-black transition-colors duration-300`}
              variants={paginationButtonVariants}
              whileHover={totalPages === 1 ? {} : "hover"}
              aria-label="Previous page"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1" />
            </motion.button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base ${
                    currentPage === index + 1
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  } border border-black transition-colors duration-300`}
                  variants={paginationButtonVariants}
                  whileHover="hover"
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={goToNextPage}
              disabled={totalPages === 1}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base ${
                totalPages === 1
                  ? "bg-gray-200 text-gray-900 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-100"
              } border border-black transition-colors duration-300`}
              variants={paginationButtonVariants}
              whileHover={totalPages === 1 ? {} : "hover"}
              aria-label="Next page"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 inline-block ml-1" />
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {selectedItem && (
            <ModalContent item={selectedItem} onClose={closeModal} />
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default PortfolioSection;