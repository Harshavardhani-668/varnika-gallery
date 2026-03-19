import { Palette, Upload, Eye, Truck } from "lucide-react";
import { useScrollReveal } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Palette,
    step: "01",
    title: "Choose Design",
    desc: "Browse our collection or tell us your idea.",
  },
  {
    icon: Upload,
    step: "02",
    title: "Upload Your Photo",
    desc: "Share the images you'd like us to work with.",
  },
  {
    icon: Eye,
    step: "03",
    title: "Artist Confirms",
    desc: "Our artist crafts a preview for your approval.",
  },
  {
    icon: Truck,
    step: "04",
    title: "Delivered",
    desc: "Carefully packaged and shipped with love.",
  },
];

const HowItWorks = () => {
  const reveal = useScrollReveal<HTMLElement>();

  return (
    <section ref={reveal.ref} className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-gold/3 blur-3xl" />
      </div>

      <div className="varnika-container relative z-10">
        <div
          className={cn(
            "text-center mb-14 transition-all duration-700 ease-boutique",
            reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-gold text-sm tracking-widest uppercase font-body">
            Simple Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-4">
            How Custom Gifts Work
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-body">
            From your idea to a handcrafted masterpiece — in just 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className={cn(
                "relative text-center group transition-all duration-700 ease-boutique",
                reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${(i + 1) * 150}ms` }}
            >
              {/* Connector line (hidden on mobile single col) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-gold/30 to-transparent" />
              )}

              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-500">
                <s.icon className="w-8 h-8 text-gold" />
              </div>
              <span className="text-gold/40 text-xs tracking-widest font-body uppercase">
                Step {s.step}
              </span>
              <h3 className="font-display text-lg text-foreground mt-2 mb-2">
                {s.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
