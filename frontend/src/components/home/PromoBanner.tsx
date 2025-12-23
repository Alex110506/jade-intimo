import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import categorySwimwear from '@/assets/category-swimwear.jpg';

const PromoBanner = () => {
  return (
    <section className="relative h-[500px] overflow-hidden md:h-[600px]">
      <img
        src={categorySwimwear}
        alt="Summer Collection"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
      
      <div className="container-custom absolute inset-0 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-md"
        >
          <span className="mb-4 inline-block rounded-sm bg-pink px-3 py-1 text-xs font-medium uppercase tracking-wider">
            Limited Edition
          </span>
          <h2 className="font-heading text-3xl font-semibold text-background md:text-4xl lg:text-5xl">
            Summer Swim Collection
          </h2>
          <p className="mt-4 text-background/90">
            Dive into summer with our new swimwear collection. Designed for comfort and style.
          </p>
          <Link
            to="/women/bathing-suits"
            className="mt-8 inline-flex items-center gap-2 bg-background px-6 py-3 text-sm font-medium uppercase tracking-wider text-foreground transition-all hover:bg-background/90 hover:shadow-hover"
          >
            Shop Swimwear
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoBanner;
