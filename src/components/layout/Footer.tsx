import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-espresso text-cream pt-20 pb-8">
      <div className="varnika-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="font-display text-3xl mb-4">Varnika</h2>
            <p className="text-cream/70 font-body text-sm leading-relaxed mb-6">
              Every piece tells a story. Handcrafted with love, each artwork carries the soul of its maker and waits to become part of your home's narrative.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg mb-6 text-gold">Explore</h3>
            <ul className="space-y-3">
              {["Gallery", "Collections", "Featured", "New Arrivals", "Stories"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-cream/70 hover:text-cream transition-colors duration-300 text-sm font-body"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display text-lg mb-6 text-gold">Support</h3>
            <ul className="space-y-3">
              {["Custom Orders", "Shipping Info", "Returns", "Care Guide", "FAQ"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-cream/70 hover:text-cream transition-colors duration-300 text-sm font-body"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg mb-6 text-gold">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="text-cream/70 text-sm font-body">
                  Studio 12, Artisan's Lane<br />
                  Mumbai, Maharashtra
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <span className="text-cream/70 text-sm font-body">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <span className="text-cream/70 text-sm font-body">hello@varnika.art</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream/50 text-sm font-body">
              © 2024 Varnika. All artworks are handmade with love.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-cream/50 hover:text-cream text-sm font-body transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-cream/50 hover:text-cream text-sm font-body transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
