import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Instagram, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import FloatingClouds from "@/components/effects/FloatingClouds";
import { usePageMeta } from "@/hooks/usePageMeta";

const Contact = () => {
  usePageMeta({
    title: "Contact Varnika - Get in Touch | Handmade Gifts Support",
    description: "Contact Varnika for custom gift inquiries, bulk orders, or support. Phone, email, Instagram. We respond within 24 hours.",
    keywords: "contact varnika, customer support, bulk orders, custom gifts, handmade gifts contact"
  });

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setForm({ name: "", email: "", subject: "", message: "" });
    toast.success("Message sent!", { description: "We'll get back to you within 24 hours." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-32 pb-12 overflow-hidden">
        <FloatingClouds count={3} />
        <div className="varnika-container relative z-10 text-center">
          <span className="text-gold text-sm tracking-widest uppercase font-body">Get in Touch</span>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mt-4 mb-4">Contact Us</h1>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Have a question or want to customize a gift? We'd love to hear from you.
          </p>
        </div>
      </section>

      <main className="pb-20">
        <div className="varnika-container">
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "varnika.atelier@gmail.com", href: "mailto:varnika.atelier@gmail.com" },
                { icon: Phone, label: "Phone", value: "6305193711", href: "tel:6305193711" },
                { icon: Instagram, label: "Instagram", value: "@varnika_atelier", href: "https://www.instagram.com/varnika_atelier/" },
              ].map(item => (
                <Card key={item.label} className="border-border/50">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-muted-foreground">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-body text-foreground hover:text-gold transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-body text-foreground">{item.value}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-border/50">
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-body">Name</Label>
                        <Input
                          id="name" required value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Your name"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-body">Email</Label>
                        <Input
                          id="email" type="email" required value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="your@email.com"
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="font-body">Subject</Label>
                      <Input
                        id="subject" required value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        placeholder="How can we help?"
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-body">Message</Label>
                      <Textarea
                        id="message" required value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us about your requirements..."
                        className="min-h-[140px] rounded-xl resize-none"
                      />
                    </div>
                    <Button type="submit" variant="artisan" size="lg" disabled={loading} className="w-full sm:w-auto button-glow">
                      {loading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Send className="mr-2 w-4 h-4" />}
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
