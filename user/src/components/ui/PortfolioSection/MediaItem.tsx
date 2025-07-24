import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { PortfolioItem } from '../../../types/types';

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

// Helper function to detect media type
const detectMediaType = (item: PortfolioItem): 'image' | 'video' | 'youtube' => {
  if (item.mediaType) {
    return item.mediaType;
  }
  
  const url = item.videoUrl || item.url || '';
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  
  return item.videoUrl ? 'video' : 'image';
};

// Helper function to get YouTube thumbnail
const getYouTubeThumbnail = (url: string): string => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  if (match) {
    return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
  }
  return '';
};

// Video Player Component
const VideoPlayer: React.FC<{ src: string; title: string }> = ({ src, title }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err: any) => console.warn(`Failed to play video: ${src}, Error: ${err.message || 'Unknown error'}`));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div 
      className="relative w-full h-full group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted={isMuted}
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e: any) => console.warn(`Failed to load video: ${src}, Error: ${e.message || 'Unknown error'}`)}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      
      {showControls && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-4">
            <button
              onClick={togglePlay}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all duration-300"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-gray-800" />
              ) : (
                <Play className="w-6 h-6 text-gray-800" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all duration-300"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-gray-800" />
              ) : (
                <Volume2 className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// YouTube Preview Component
const YouTubePreview: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const thumbnailUrl = getYouTubeThumbnail(url);
  
  return (
    <div className="relative w-full h-full group">
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => console.warn(`Failed to load YouTube thumbnail: ${thumbnailUrl}`)}
      />
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
        <div className="bg-red-600 rounded-full p-4 group-hover:bg-red-700 transition-colors duration-300">
          <Play className="w-8 h-8 text-white ml-1" />
        </div>
      </div>
    </div>
  );
};

interface MediaItemProps {
  item: PortfolioItem;
  onClick: () => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ item, onClick }) => {
  const mediaUrl = item.videoUrl || item.url || '';
  const mediaType = detectMediaType(item);
  const aspectClass = mediaType === 'image' ? 'aspect-square' : 'aspect-video';
  
  return (
    <motion.div
      className={`relative overflow-hidden bg-gray-100 border border-gray-200 shadow-md transition-shadow duration-300 cursor-pointer ${aspectClass}`}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      onClick={onClick}
    >
      {mediaUrl ? (
        <>
          {mediaType === 'image' && (
            <img
              src={mediaUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => console.warn(`Failed to load image: ${mediaUrl}, ID: ${item.id}`)}
            />
          )}
          {mediaType === 'video' && (
            <VideoPlayer src={mediaUrl} title={item.title} />
          )}
          {mediaType === 'youtube' && (
            <YouTubePreview url={mediaUrl} title={item.title} />
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-500 text-sm sm:text-base p-4">
          <div className="text-center">
            <div className="mb-2">ไม่สามารถโหลดสื่อได้</div>
            <div className="text-xs opacity-75">
              ID: {item.id}
            </div>
            <div className="text-xs opacity-75">
              Title: {item.title}
            </div>
            <div className="text-xs opacity-75">
              MediaType: {mediaType || 'ไม่ระบุ'}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MediaItem;