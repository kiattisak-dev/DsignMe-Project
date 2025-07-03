import React from 'react';
import { motion } from 'framer-motion';
import Collapsible from './Collapsible';
import { ProcessStep } from '../../types/types';

interface ProcessSectionProps {
  process: ProcessStep[];
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ process }) => {
  // Animation variants for the section header
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Animation variants for collapsible items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.2, ease: 'easeOut' },
    }),
  };

  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">ขั้นตอนการให้บริการ</h2>
        </motion.div>
        <div>
          {process.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
            >
              <Collapsible
                title={`Step ${step.step}: ${step.title}`}
                isCollapsible={false}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{step.description}</p>
                </motion.div>
              </Collapsible>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;