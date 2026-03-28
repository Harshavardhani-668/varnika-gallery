import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useAnimations";
import FloatingClouds from "@/components/effects/FloatingClouds";
import { usePageMeta } from "@/hooks/usePageMeta";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
}

const faqItems: FAQItem[] = [
  {
    id: "what-is-varnika",
    category: "About Varnika",
    question: "What makes Varnika's handmade gifts special?",
    answer: "Every piece at Varnika is 100% handcrafted with love and attention to detail. We don't mass-produce—each gift is unique and can be customized to tell your personal story. Our artisans combine traditional techniques with modern design to create meaningful, one-of-a-kind gifts that your loved ones will treasure forever.",
    keywords: ["handmade gifts", "unique gifts", "artisan gifts"]
  },
  {
    id: "personalization",
    category: "Customization",
    question: "How can I personalize my gift?",
    answer: "You can customize gifts in multiple ways: choose colors, add names or dates, include personal messages, select specific materials, or request entirely custom designs. Simply describe your vision in the custom order form or contact us directly at varnika.atelier@gmail.com. Our team will work with you to create exactly what you imagine.",
    keywords: ["personalized gifts", "custom gifts", "customize gifts"]
  },
  {
    id: "custom-time",
    category: "Customization",
    question: "How long does it take to create a customized gift?",
    answer: "Standard personalized gifts take 7-10 business days from order confirmation. Rush orders (3-5 days) are available for an additional fee. Custom design consultations are completed within 48 hours. We always prioritize quality, so we never rush the handcrafting process. Check our custom orders page for specific timelines.",
    keywords: ["custom gift delivery", "personalized gift timeline", "rush orders"]
  },
  {
    id: "occasions",
    category: "Occasions & Uses",
    question: "What occasions are handmade gifts perfect for?",
    answer: "Handmade gifts are ideal for weddings, anniversaries, birthdays, engagements, retirements, corporate events, baby showers, housewarming parties, thank yous, and holiday celebrations. The personal touch makes them meaningful for any milestone. Many customers also gift them for 'no occasion'—just to show they care.",
    keywords: ["wedding gifts", "anniversary gifts", "birthday gifts", "corporate gifts"]
  },
  {
    id: "corporate-gifting",
    category: "Business & Corporate",
    question: "Do you offer corporate bulk gifting solutions?",
    answer: "Yes! We specialize in corporate gifting with discounted bulk orders (10+ gifts). Perfect for client appreciation, employee recognition, or holiday gifting. Contact us for bulk order quotes and customization options including company branding. We provide wholesale pricing and flexible delivery schedules.",
    keywords: ["corporate gifts", "bulk gifting", "business gifts", "wholesale"]
  },
  {
    id: "eco-friendly",
    category: "Sustainability",
    question: "Are Varnika's gifts eco-friendly?",
    answer: "We're committed to sustainable practices. We use eco-friendly materials whenever possible, minimize packaging waste, and support ethical sourcing. Many of our products are made from recycled or sustainable materials. For fully eco-conscious options, mention your preferences when ordering—we'll suggest the best options.",
    keywords: ["eco-friendly gifts", "sustainable gifts", "green gifts"]
  },
  {
    id: "pricing",
    category: "Pricing & Payment",
    question: "What's the price range for Varnika gifts?",
    answer: "Our gifts range from ₹1,500 to ₹25,000+, with most popular items between ₹2,500-₹7,500. Customization and premium materials may increase the price. We offer gifts at various price points to fit different budgets. Check our Collections page for specific pricing, or contact us for custom quotes.",
    keywords: ["gift prices", "affordable gifts", "luxury gifts", "budget gifts"]
  },
  {
    id: "delivery-india",
    category: "Shipping & Delivery",
    question: "Do you deliver pan-India? What are shipping costs?",
    answer: "Yes, we deliver across India! Standard delivery takes 5-7 business days after crafting. Shipping costs are calculated based on location (typically ₹200-₹500). Express delivery (2-3 days) is available for ₹800-₹1,500. Free shipping is available on orders above ₹10,000. Track your order via email updates.",
    keywords: ["delivery India", "shipping", "same-day delivery", "express shipping"]
  },
  {
    id: "international",
    category: "Shipping & Delivery",
    question: "Do you ship internationally?",
    answer: "We're expanding international shipping! We currently ship to select countries including USA, UK, Australia, Canada, UAE, and Singapore. International shipping takes 10-20 business days and costs vary by location. Visit our Help Center or email us for international shipping quotes and delivery times.",
    keywords: ["international shipping", "global delivery", "worldwide gifts"]
  },
  {
    id: "payment-methods",
    category: "Payment",
    question: "What payment methods do you accept?",
    answer: "We accept all major payment methods: credit/debit cards (Visa, Mastercard, Amex), digital wallets (GPay, Apple Pay, PayPal), bank transfers, and UPI. All transactions are secure and encrypted. For large corporate orders, we also arrange invoicing and NET terms.",
    keywords: ["payment options", "secure payment", "online payment"]
  },
  {
    id: "returns",
    category: "Returns & Issues",
    question: "What's your return and refund policy?",
    answer: "Since each gift is handcrafted to order, we don't accept returns on completed orders. However, if there's a defect or damage during shipping, we'll remake or refund your order within 7 days. Please report issues immediately with photos. Cancellations can be made within 48 hours with a 20% cancellation fee.",
    keywords: ["return policy", "refund policy", "damaged gift"]
  },
  {
    id: "gift-card",
    category: "Gift Options",
    question: "Do you offer gift cards or gift vouchers?",
    answer: "Yes! Our digital gift cards (₹1,000 to ₹50,000) are perfect for those who want to choose their own gift. They work for any product or custom order, never expire, and can be emailed instantly. Order gift cards on our Shop page—they're a thoughtful way to give the gift of choice.",
    keywords: ["gift card", "gift voucher", "discount code"]
  },
  {
    id: "local-artisan",
    category: "About Varnika",
    question: "Do you support local artisans and small businesses?",
    answer: "Absolutely. Varnika partners with local artisans and small craftspeople, ensuring fair wages and ethical practices. By purchasing from us, you support the artisan community and preserve traditional craftsmanship. We believe in slow, sustainable fashion over mass production.",
    keywords: ["support local", "artisan community", "fair trade", "ethical shopping"]
  },
  {
    id: "material-quality",
    category: "Products & Quality",
    question: "What materials do you use, and how do you ensure quality?",
    answer: "We use premium, carefully selected materials: organic fabrics, recycled paper, sustainable woods, ethically sourced metals, and non-toxic dyes. Quality is our priority—each piece undergoes rigorous inspection before shipping. Our artisans have 5+ years of experience, ensuring excellent craftsmanship.",
    keywords: ["premium quality", "material quality", "handmade quality", "sustainable materials"]
  },
  {
    id: "wedding-favors",
    category: "Occasions & Uses",
    question: "Can you help with wedding favors and bulk orders?",
    answer: "Yes, we specialize in custom wedding favors! Whether you need 50 or 500 personalized gifts, we can help. Common options: monogrammed items, custom boxes, date-engraved pieces. Bulk pricing applies. Contact our team for a consultation and quote tailored to your wedding theme and budget.",
    keywords: ["wedding favors", "wedding gifts", "bridal gifts", "bulk wedding orders"]
  },
  {
    id: "track-order",
    category: "Shipping & Delivery",
    question: "How do I track my order?",
    answer: "After ordering, you'll receive a confirmation email with an order number. Once your gift is handcrafted and shipped, you'll get a tracking link via email. You can also track orders from your account dashboard or contact our support team. We send SMS updates at each shipping milestone.",
    keywords: ["order tracking", "delivery status", "order updates"]
  },
  {
    id: "contact-support",
    category: "Support",
    question: "How can I contact customer support?",
    answer: "Reach us via: Email (varnika.atelier@gmail.com), Phone (6305193711), Instagram (@varnika_atelier), or our Contact form. Response time is usually within 24 hours. For urgent queries, call us during business hours. We're here to help with any questions!",
    keywords: ["customer support", "contact us", "help", "customer service"]
  },
  {
    id: "best-gifts-friends",
    category: "Gift Advice",
    question: "What are the best personalized gifts for friends?",
    answer: "Great personalized gift ideas for friends: monogrammed accessories, custom photo frames, engraved jewelry, personalized candles, custom art prints, embroidered items, or bespoke boxes. Choose something reflecting their personality, interests, or inside jokes. The personal touch—like adding their nickname or a favorite quote—makes it extra special.",
    keywords: ["gifts for friends", "friendship gifts", "personalized gifts for friends"]
  },
  {
    id: "seasonal-gifts",
    category: "Seasonal",
    question: "What are trending handmade gift ideas this season?",
    answer: "Current trends (2026): Minimalist personalized items, sustainable gifts, wellness hampers, custom photo books, monogrammed home decor, artisan subscription boxes, and experience gifts. Seasonal favorites: Diwali gift boxes, Christmas luxury hampers, Valentine's customized gifts. Check our Blog for detailed seasonal guides.",
    keywords: ["trending gifts", "seasonal gifts", "gift trends", "Diwali gifts", "Christmas gifts"]
  },
  {
    id: "learn-about",
    category: "About Varnika",
    question: "Where can I learn Varnika's story and values?",
    answer: "Visit our About page to learn how Varnika started and our commitment to handcrafted, meaningful gifting. We share artisan stories, our process, and why we believe in slow, sustainable craftsmanship. Follow us on Instagram (@varnika_atelier) for behind-the-scenes content and artisan highlights.",
    keywords: ["Varnika story", "about us", "our mission", "company values"]
  }
];

const FAQ = () => {
  usePageMeta({
    title: "FAQ - Handmade Gifts Questions Answered | Varnika",
    description: "Find answers to FAQs about Varnika handmade gifts: customization, shipping, pricing, bulk orders, and more.",
    keywords: "FAQ, frequently asked questions, handmade gifts help, custom gifts questions, shipping info"
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const sectionReveal = useScrollReveal<HTMLDivElement>();

  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  const filteredItems = faqItems.filter(item => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const schemas = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <FloatingClouds count={3} />
        <div className="varnika-container relative z-10 text-center">
          <span className="text-gold text-sm tracking-widest uppercase font-body">Got Questions?</span>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mt-4 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Find answers to common questions about our handmade gifts, customization, shipping, and more.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="py-8 bg-card border-b border-border">
        <div className="varnika-container">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-base"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20">
        <div className="varnika-container max-w-4xl">
          {/* Category Filter */}
          <div
            ref={sectionReveal.ref}
            className="mb-12 flex flex-wrap gap-2"
          >
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
              size="sm"
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full"
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-gold/40"
                  style={{
                    transitionDelay: `${index * 50}ms`
                  }}
                >
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="w-full px-6 py-4 md:px-8 md:py-5 flex items-start justify-between gap-4 hover:bg-card/50 transition-colors text-left group"
                  >
                    <div className="flex-1">
                      <span className="text-xs uppercase tracking-widest text-gold font-body">
                        {item.category}
                      </span>
                      <h3 className="font-display text-lg text-foreground mt-2 group-hover:text-gold transition-colors">
                        {item.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 mt-1",
                        expandedId === item.id && "rotate-180"
                      )}
                    />
                  </button>

                  {expandedId === item.id && (
                    <div className="px-6 py-4 md:px-8 md:py-5 bg-card/30 border-t border-border">
                      <p className="font-body text-foreground/80 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-body">
                  No FAQs found matching your search. Contact us at{" "}
                  <a href="mailto:varnika.atelier@gmail.com" className="text-gold hover:text-gold/80">
                    varnika.atelier@gmail.com
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground font-body mb-4">
              Didn't find your answer?
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(schemas)}
      </script>

      <Footer />
    </div>
  );
};

export default FAQ;
