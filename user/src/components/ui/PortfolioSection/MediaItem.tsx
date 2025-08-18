import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { PortfolioItem } from '../../../types/types';

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

interface MediaItemProps {
  item: PortfolioItem;
  onClick: () => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ item, onClick }) => {
  const mediaUrl = item.videoUrl || item.url || '';
  const mediaType = item.mediaType || "image";
  const aspectClass = mediaType === 'image' ? 'aspect-square' : 'aspect-video';

  return (
    <motion.div
      className={`relative overflow-hidden bg-gray-100 border shadow-sm ${aspectClass} cursor-pointer`}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
    >
      {mediaType === 'image' && (
        <img
          src={mediaUrl}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
      {mediaType === 'video' && (
        <div className="relative w-full h-full flex items-center justify-center bg-black text-white">
          ▶ วิดีโอ
        </div>
      )}
      {mediaType === 'youtube' && (
        <div className="relative w-full h-full flex items-center justify-center bg-black text-white">
          ▶ YouTube
        </div>
      )}
    </motion.div>
  );
};

export default memo(MediaItem);