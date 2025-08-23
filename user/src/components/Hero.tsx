import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const Hero: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.1,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const bgVariants = {
    hidden: { opacity: 0, scale: 1.2 },
    visible: {
      opacity: 0.1,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="home"
      className="bg-white relative overflow-hidden flex items-center justify-center min-h-screen h-full pt-8 md:pt-12 lg:pt-18"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100"
        variants={bgVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      ></motion.div>

      <motion.div
        ref={ref}
        className="relative z-10 max-w-4xl mx-auto px-4 text-center flex flex-col items-center justify-center min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div variants={containerVariants}>
          <motion.div
            variants={logoVariants}
            className="flex items-center justify-center mb-10"
          >
            <img
              className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-28 lg:w-60 lg:h-40 max-w-[80vw] max-h-[32vw] sm:max-w-[70vw] sm:max-h-[28vw] md:max-w-[60vw] md:max-h-[24vw] lg:max-w-[240px] lg:max-h-[160px] object-contain"
              src="/Logo D.svg"
              alt="Logo"
            />
          </motion.div>

          <motion.h1
            variants={textVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black"
          >
            Design Your Unique Identity
            <br />
            <br />
          </motion.h1>

          <motion.div variants={textVariants} className="mb-10">
            <span className="text-xl md:text-3xl lg:text-4xl font-bold text-black">
              ออกแบบอัตลักษณ์อย่างมี"เอกลักษณ์"
            </span>
          </motion.div>

          <motion.div
            variants={textVariants}
            className="bg-black backdrop-blur-sm p-6"
          >
            <div className="text-base md:text-lg mb-6 max-w-xl mx-auto leading-relaxed font-sans text-white">
              <motion.p variants={textVariants}>
                พวกเราคือกราฟิกดีไซน์เนอร์ที่เชี่ยวชาญด้านการออกแบบ
                <br />
                <strong>มีประสบการณ์มากกว่า 4 ปี</strong>
                <br />
                ที่สามารถช่วยส่งเสริมธุรกิจด้วยการออกแบบที่ดีที่สุดให้กับธุรกิจคุณ
              </motion.p>
              <motion.div variants={textVariants} className="my-6">
                <hr className="border-t-2 border-gray-300" />
              </motion.div>
              <motion.p variants={textVariants} className="mb-[-1.5rem]">
                เราเป็นทีมกราฟิกดีไซน์เนอร์ที่มีประสบการณ์
                <br />
                ช่วยสร้างอัตลักษณ์ที่โดดเด่นให้กับธุรกิจของคุณ
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
        <motion.div variants={textVariants} className="text-center mt-8 mb-8">
          <p className="text-gray-500 text-lg mb-4 italic">
            แอดไลน์เราเพื่อปรึกษาฟรี
          </p>
          <motion.a
            href="https://lin.ee/c2HxJS1"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-300"
          >
            Line เพิ่มเพื่อน
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
