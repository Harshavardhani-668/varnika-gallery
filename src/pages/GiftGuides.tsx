import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingClouds from "@/components/effects/FloatingClouds";
import { usePageMeta } from "@/hooks/usePageMeta";

const guides = [
  {
    title: "Best Handmade Gift Ideas for Anniversaries",
    intent: "anniversary gifts personalized",
    points: [
      "How to choose meaningful couple-specific gifts",
      "Personalization options that add emotional value",
      "Budget planning for luxury handmade gifting"
    ]
  },
  {
    title: "Corporate Gifting with Custom Handmade Hampers",
    intent: "corporate gifts personalized",
    points: [
      "Bulk gifting strategy for teams and clients",
      "Branding ideas for handmade corporate gifts",
      "Delivery planning for festive campaigns"
    ]
  },
  {
    title: "Diwali and Festive Handmade Gift Trends 2026",
    intent: "Diwali handmade gifts online",
    points: [
      "Trending festive gift hamper themes",
      "Eco-friendly and reusable gifting materials",
      "How early to order custom festive gifts"
    ]
  }
];

const GiftGuides = () => {
  usePageMeta({
    title: "Gift Guides & Ideas | Handmade Gifting Blog | Varnika",
    description:
      "Read Varnika gift guides for handmade gifting ideas, personalized gift inspiration, and seasonal gifting trends.",
    keywords:
      "gift guide, handmade gift ideas, personalized gift blog, festive gifting trends, corporate gifting ideas"
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-32 pb-14 overflow-hidden">
        <FloatingClouds count={3} />
        <div className="varnika-container relative z-10 text-center">
          <span className="text-gold text-sm tracking-widest uppercase font-body">Content Hub</span>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mt-4 mb-4">
            Gift Guides and Inspiration
          </h1>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            SEO-focused guide outlines to help customers discover the best handmade gifting ideas.
          </p>
        </div>
      </section>

      <main className="pb-20">
        <div className="varnika-container max-w-5xl grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((guide) => (
            <article key={guide.title} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs uppercase tracking-widest text-gold font-body mb-2">
                Keyword Intent: {guide.intent}
              </p>
              <h2 className="font-display text-2xl text-foreground mb-3">{guide.title}</h2>
              <ul className="space-y-2 text-sm text-muted-foreground font-body list-disc pl-4">
                {guide.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GiftGuides;
