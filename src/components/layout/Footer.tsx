import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, Heart } from "lucide-react";
import { useScrollReveal } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";

const Footer = () => {
  const footerReveal = useScrollReveal<HTMLElement>();

  return (
    <footer
      ref={footerReveal.ref}
      className="bg-foreground text-primary-foreground pt-20 pb-8">
      
      <div className="varnika-container">
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 transition-all duration-700 ease-boutique",
            footerReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
          
          <div className="lg:col-span-1">
            <h2 className="font-display text-3xl mb-4">Varnika</h2>
            <p className="text-primary-foreground/70 font-body text-sm leading-relaxed mb-6">
              Every piece tells a story. Handcrafted with love, each creation carries warmth and waits to become part of your memories.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/varnika_atelier/"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-foreground transition-all duration-300"
                aria-label="Instagram @varnika_atelier"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Varnika on Facebook"
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-foreground transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg mb-6 text-gold">Explore</h3>
            <ul className="space-y-3">
              {["Gallery", "Collections", "About"].map((item) =>
              <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300 text-sm font-body">
                    {item}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg mb-6 text-gold">Support</h3>
            <ul className="space-y-3">
              {["Custom Orders", "Shipping Info", "Returns", "FAQ"].map((item) =>
              <li key={item}>
                  <Link to="/contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300 text-sm font-body">
                    {item}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg mb-6 text-gold">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-gold shrink-0" />
                <a
                  href="https://www.instagram.com/varnika_atelier/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-foreground/70 hover:text-primary-foreground text-sm font-body transition-colors"
                >
                  @varnika_atelier
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <a href="tel:6305193711" className="text-primary-foreground/70 hover:text-primary-foreground text-sm font-body transition-colors">
                  6305193711
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <a href="mailto:varnika.atelier@gmail.com" className="text-primary-foreground/70 hover:text-primary-foreground text-sm font-body transition-colors">
                  varnika.atelier@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/50 text-sm font-body flex items-center gap-1">
              © 2025 Varnika. Made with <Heart className="w-3 h-3 text-terracotta fill-terracotta" /> handmade love.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-primary-foreground/50 hover:text-primary-foreground text-sm font-body transition-colors">Privacy</Link>
              <Link to="/terms" className="text-primary-foreground/50 hover:text-primary-foreground text-sm font-body transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;