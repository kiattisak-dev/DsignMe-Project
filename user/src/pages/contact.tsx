import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLine,
} from "react-icons/fa";

const ContactPage: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      id="contact"
      className="py-4 sm:py-6 md:py-8 lg:py-10 bg-white w-full min-h-screen flex items-center"
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-10 w-full">
        {/* Contact Information */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-4 md:space-x-6 lg:space-x-12 w-full"
          variants={containerVariants}
        >
          {/* Left Column - QR Code with Title */}
          <motion.div
            variants={itemVariants}
            className="flex-shrink-0 text-center w-full sm:w-auto"
          >
            <h2 className="text-sm sm:text-lg md:text-xl lg:text-4xl font-medium text-gray-800 mb-2 sm:mb-4">
              สแกนเพื่อติดต่อเรา
            </h2>
            <img
              src="https://qr-official.line.me/gs/M_472lvzyx_BW.png?oat_content=qr"
              alt="QR Code"
              className="w-24 sm:w-28 md:w-32 lg:w-52 h-24 sm:h-28 md:h-32 lg:h-52 mx-auto"
            />
          </motion.div>

          {/* Right Column - Contact Details */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-col space-y-3 sm:space-y-4 w-full sm:w-auto text-center sm:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-3 lg:space-x-4 border-b-2 border-gray-200 pb-2"
            >
              <button className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800">
                <FaLine className="w-6 h-6" />
              </button>
              <a
                href="https://lin.ee/c2HxJS1"
                className="text-sm sm:text-base md:text-lg lg:text-3xl text-gray-800 hover:underline"
                target="_blank"
              >
                @DsignMe
              </a>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-3 lg:space-x-6 border-b-2 border-gray-200 pb-2"
            >
              <button className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800">
                <FaEnvelope className="w-6 h-6" />
              </button>
              <div className="flex flex-col items-start justify-center">
                <a
                  href="mailto:dsignme18@gmail.com"
                  className="text-sm sm:text-base md:text-lg lg:text-3xl text-gray-800 hover:underline"
                >
                  dsignme18@gmail.com
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-3 lg:space-x-4 border-b-2 border-gray-200 pb-2"
            >
              <button className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800">
                <FaFacebook className="w-6 h-6" />
              </button>
              <a
                href="https://www.facebook.com/profile.php?id=61561907601448&mibextid=ZbWKwL"
                className="text-sm sm:text-base md:text-lg lg:text-3xl text-gray-800 hover:underline"
                target="_blank"
              >
                DesignMe
              </a>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-3 lg:space-x-4 border-b-2 border-gray-200 pb-2"
            >
              <button className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800">
                <FaInstagram className="w-6 h-6" />
              </button>
              <a
                href="https://www.instagram.com/dee_signme?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                className="text-sm sm:text-base md:text-lg lg:text-3xl text-gray-800 hover:underline"
                target="_blank"
              >
                DsignMe
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactPage;