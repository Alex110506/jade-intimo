import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGender } from '@/context/GenderContext';
import heroWomen from '@/assets/hero-women.jpg';
import heroMen from '@/assets/hero-men.jpg';

const Hero = () => {
  const { gender } = useGender();
  const heroImage = gender === 'women' ? heroWomen : heroMen;

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <motion.div
        key={gender}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
      >
        <img
          src={heroImage}
          alt={`${gender === 'women' ? 'Women' : 'Men'}'s collection hero`}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="container-custom relative flex h-full items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl"
        >
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            New Collection
          </span>
          <h1 className="font-heading text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            {gender === 'women' ? (
              <>
                Embrace Your
                <br />
                <span className="text-pink-accent">jade-intimo</span>
              </>
            ) : (
              <>
                Redefine
                <br />
                <span className="text-pink-accent">Comfort</span>
              </>
            )}
          </h1>
          <p className="mt-6 text-base text-muted-foreground md:text-lg">
            {gender === 'women'
              ? 'Discover our curated collection of luxurious intimates designed to make you feel confident and beautiful.'
              : 'Premium essentials crafted for the modern man. Comfort meets sophistication.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to={`/${gender}/noutati`} className="btn-primary inline-flex items-center gap-2">
              Shop New Arrivals
              <ArrowRight size={16} />
            </Link>
            <Link to={`/${gender}`} className="btn-secondary">
              Explore Categories
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Scroll
          </span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-foreground to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
