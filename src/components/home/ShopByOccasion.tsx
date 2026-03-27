'use client';

import { motion } from 'framer-motion';

const categories = [
  {
    title: 'Birthday',
    subtitle: 'Make Their Day Special',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176',
  },
  {
    title: 'Anniversary',
    subtitle: 'Celebrate Love',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486',
  },
  {
    title: 'Wedding',
    subtitle: 'Forever Begins Here',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf',
  },
  {
    title: 'Love',
    subtitle: 'For Your Special One',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7',
  },
  {
    title: 'Baby',
    subtitle: 'Welcome Little Joy',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  },
  {
    title: 'Festivals',
    subtitle: 'Celebrate Every Moment',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db',
  },
  {
    title: 'Home',
    subtitle: 'New Beginnings',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  },
  {
    title: 'Personalized',
    subtitle: 'Made Just for Them',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
  },
];

const ShopByOccasion = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
          Shop by Occasion
        </h2>
        <p className="text-gray-500 mt-2 text-base md:text-lg">
          Thoughtfully curated for every special moment
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.96 }}
            animate="float"
            custom={index}
            className="relative rounded-2xl overflow-hidden h-48 md:h-64 cursor-pointer group"
          >
            {/* Background Image */}
            <motion.img
              src={category.image}
              alt={`${category.title} occasion handmade gift collection image`}
              loading="lazy"
              className="absolute inset-0 w-full h-full max-w-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <motion.div
              className="absolute bottom-4 left-4 z-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <h3 className="text-white text-lg md:text-xl font-semibold">
                {category.title}
              </h3>
              <p className="text-white/80 text-sm">{category.subtitle}</p>
            </motion.div>

            {/* Soft Glow on Hover */}
            <motion.div
              className="absolute inset-0 ring-1 ring-white/10 rounded-2xl pointer-events-none"
              whileHover={{
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ShopByOccasion;
