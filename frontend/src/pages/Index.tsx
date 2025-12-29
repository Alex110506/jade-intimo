import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import NewArrivals from '@/components/home/NewArrivals';
import Bestsellers from '@/components/home/Bestsellers';
import SEO from '@/components/SEO';

const Index = () => {
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Jade Intimo - Premium Intimates & Loungewear',
    description: 'Discover luxurious intimates, lingerie, and loungewear designed for the modern woman and man.',
    url: 'https://jade-intimo.com',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Women\'s Collection', url: 'https://jade-intimo.com/women' },
        { '@type': 'ListItem', position: 2, name: 'Men\'s Collection', url: 'https://jade-intimo.com/men' },
        { '@type': 'ListItem', position: 3, name: 'Lingerie', url: 'https://jade-intimo.com/women/lingerie' },
        { '@type': 'ListItem', position: 4, name: 'Swimwear', url: 'https://jade-intimo.com/women/bathing-suits' },
      ],
    },
  };

  return (
    <>
      <SEO 
        title="Jade Intimo | Premium Intimates & Loungewear"
        description="Discover luxurious intimates, lingerie, and loungewear designed for the modern woman and man. Shop bras, panties, pajamas, and swimwear with free shipping over $100."
        url="https://jade-intimo.com"
        schema={homeSchema}
      />
      <div className="min-h-screen">
        <Navbar />
        <main role="main">
          <Hero />
          <FeaturedCategories />
          <NewArrivals />
          <Bestsellers />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
