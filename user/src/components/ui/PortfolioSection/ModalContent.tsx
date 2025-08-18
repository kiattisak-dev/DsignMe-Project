import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { PortfolioItem } from "../../../types/types";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const getYouTubeEmbedUrl = (url: string): string => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

interface ModalContentProps {
  item: PortfolioItem;
  onClose: () => void;
}

const ModalContent: React.FC<ModalContentProps> = ({ item, onClose }) => {
  const mediaUrl = item.videoUrl || item.url || "";
  const mediaType = item.mediaType || "image";
  const cleanedTitle = item.title.replace(/logo project/i, "").trim() || "Untitled";

  const [playYouTube, setPlayYouTube] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={overlayVariants}
      onClick={onClose}
    >
      <motion.div
        className="relative bg-black/80 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="p-4">
          {mediaType === "image" && (
            <img
              src={mediaUrl}
              alt={cleanedTitle}
              className="w-full h-auto object-contain max-h-[70vh]"
              loading="lazy"
            />
          )}
          {mediaType === "video" && (
            <video
              className="w-full h-auto object-contain max-h-[70vh]"
              controls
              preload="none"
            >
              <source src={mediaUrl} type="video/mp4" />
              <source src={mediaUrl} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          )}
          {mediaType === "youtube" && (
            <div className="relative pb-[56.25%] h-0">
              {!playYouTube ? (
                <div
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 cursor-pointer"
                  onClick={() => setPlayYouTube(true)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${mediaUrl.split("v=")[1]}/hqdefault.jpg`}
                    alt={cleanedTitle}
                    className="absolute w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="bg-red-600 rounded-full p-4">
                    <X className="w-8 h-8 text-white" />
                  </div>
                </div>
              ) : (
                <iframe
                  src={getYouTubeEmbedUrl(mediaUrl)}
                  title={cleanedTitle}
                  className="absolute top-0 left-0 w-full h-full"
                  loading="lazy"
                  allowFullScreen
                />
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(ModalContent);