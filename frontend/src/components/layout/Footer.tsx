import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container-custom py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="font-heading text-2xl font-semibold tracking-wide">Jade Intimo</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Premium intimates and loungewear crafted with the finest materials for the modern woman and man.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/women/new" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/women/bras" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Bras
                </Link>
              </li>
              <li>
                <Link to="/women/lingerie" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Lingerie
                </Link>
              </li>
              <li>
                <Link to="/women/pajamas" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Sleepwear
                </Link>
              </li>
              <li>
                <Link to="/women/bathing-suits" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Swimwear
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Help</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Customer Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Stay Connected</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <div className="mt-4 flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 border-b border-border bg-transparent py-2 text-sm focus:border-foreground focus:outline-none"
              />
              <button className="ml-2 p-2 text-foreground transition-opacity hover:opacity-70">
                <Mail size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">
              © 2024 Jade Intimo. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
