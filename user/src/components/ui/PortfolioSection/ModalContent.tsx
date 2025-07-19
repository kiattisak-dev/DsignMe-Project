import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { PortfolioItem } from "../../../types/types";

// Animation variants for modal
// Overlay fade only
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// Modal content fade + pop
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// Helper function to detect media type
const detectMediaType = (
  item: PortfolioItem
): "image" | "video" | "youtube" => {
  if (item.mediaType) {
    return item.mediaType;
  }

  const url = item.videoUrl || item.url || "";

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }

  return item.videoUrl ? "video" : "image";
};

// Helper function to get YouTube embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  const regex =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
};

interface ModalContentProps {
  item: PortfolioItem;
  onClose: () => void;
}

const ModalContent: React.FC<ModalContentProps> = ({ item, onClose }) => {
  const mediaUrl = item.videoUrl || item.url || "";
  const mediaType = detectMediaType(item);
  const cleanedTitle =
    item.title.replace(/logo project/i, "").trim() || "Untitled";

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={overlayVariants}
      onClick={onClose}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
    >
      <motion.div
        className="relative bg-black bg-opacity-40 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300 z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>

        <div className="p-4">
          {mediaUrl ? (
            <>
              {mediaType === "image" && (
                <img
                  src={mediaUrl}
                  alt={cleanedTitle}
                  className="w-full h-auto object-contain max-h-[70vh]"
                  loading="lazy"
                  onError={(e) =>
                    console.warn(
                      `Failed to load modal image: ${mediaUrl}, ID: ${item.id}`
                    )
                  }
                />
              )}
              {mediaType === "video" && (
                <video
                  className="w-full h-auto object-contain max-h-[70vh]"
                  controls
                  preload="metadata"
                  onError={(e) =>
                    console.warn(
                      `Failed to load modal video: ${mediaUrl}, ID: ${item.id}`
                    )
                  }
                >
                  <source src={mediaUrl} type="video/mp4" />
                  <source src={mediaUrl} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              )}
              {mediaType === "youtube" && (
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src={getYouTubeEmbedUrl(mediaUrl)}
                    title={cleanedTitle}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    onError={(e) =>
                      console.warn(
                        `Failed to load YouTube video: ${mediaUrl}, ID: ${item.id}`
                      )
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-64 sm:h-80 flex flex-col items-center justify-center bg-gray-200 text-gray-500 text-base sm:text-lg">
              <div className="text-center">
                <div className="mb-4">ไม่สามารถโหลดสื่อได้</div>
                <div className="text-sm opacity-75 space-y-1">
                  <div>ID: {item.id}</div>
                  <div>Title: {cleanedTitle}</div>
                  <div>Category: {item.category}</div>
                  <div>URL: {item.url || "ไม่มี"}</div>
                  <div>VideoURL: {item.videoUrl || "ไม่มี"}</div>
                  <div>MediaType: {mediaType || "ไม่ระบุ"}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModalContent;
