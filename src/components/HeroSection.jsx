import { motion } from 'framer-motion';

export default function HeroSection() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: i * 0.2,
      },
    }),
  };

  const floatingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#F8F3EE' }}>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8F3EE] via-[#FAF7F2] to-[#F3EDDE]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Section */}
          <motion.div
            className="flex flex-col space-y-6 md:space-y-8"
            initial="hidden"
            animate="visible"
          >
            {/* Main Title */}
            <motion.h1
              custom={0}
              variants={fadeUpVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight"
            >
              Varnika – Where Every Gift Becomes a Memory
            </motion.h1>

            {/* Subheading */}
            <motion.p
              custom={1}
              variants={fadeUpVariants}
              className="text-lg sm:text-xl text-gray-700 font-light leading-relaxed max-w-lg"
            >
              Handcrafted with intention and wrapped in emotion — our creations are designed to celebrate feelings, not just occasions.
            </motion.p>

            {/* Supporting Line */}
            <motion.p
              custom={2}
              variants={fadeUpVariants}
              className="text-base sm:text-lg text-gray-600 italic leading-relaxed max-w-lg"
            >
              From birthdays to once-in-a-lifetime moments, Varnika transforms love into something you can hold.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={3}
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-lg font-semibold text-base sm:text-lg transition-shadow duration-300 shadow-lg hover:shadow-2xl"
              >
                Explore Collections
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 sm:py-4 border-2 border-gray-900 text-gray-900 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:bg-gray-50"
              >
                Customize Your Gift
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Hero Image Section */}
          <motion.div
            className="relative h-96 sm:h-[500px] md:h-[600px] flex items-center justify-center"
            initial="hidden"
            animate="visible"
            variants={floatingVariants}
          >
            <motion.div
              animate="float"
              variants={floatingVariants}
              className="w-full h-full rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200&q=80"
                alt="Handcrafted Varnika Gifts"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl opacity-40"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-3xl opacity-30"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom Accent */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      />
    </section>
  );
}