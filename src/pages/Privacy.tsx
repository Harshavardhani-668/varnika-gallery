import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="varnika-container max-w-3xl">
          <h1 className="font-display text-4xl text-foreground mb-6">Privacy Policy</h1>
          <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
            <p>
              We value your privacy. This page explains how Varnika collects and uses information to process
              orders, provide support, and improve your experience.
            </p>
            <section>
              <h2 className="font-display text-2xl text-foreground mb-2">Information We Collect</h2>
              <p>
                We may collect details such as your name, email, phone number, shipping address, and order
                preferences when you place an order or contact us.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-foreground mb-2">How We Use Data</h2>
              <p>
                Your data is used only to fulfill orders, send order updates, respond to support requests,
                and maintain account functionality.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-foreground mb-2">Contact</h2>
              <p>
                For privacy requests, reach us at varnika.atelier@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
