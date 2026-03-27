import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="varnika-container max-w-3xl">
          <h1 className="font-display text-4xl text-foreground mb-6">Terms and Conditions</h1>
          <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
            <p>
              By using Varnika, you agree to these terms for browsing, purchasing, and interacting with our
              services.
            </p>
            <section>
              <h2 className="font-display text-2xl text-foreground mb-2">Orders and Payments</h2>
              <p>
                Orders are confirmed after successful payment and availability checks. Product colors and
                handcrafted details may vary slightly.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-foreground mb-2">Cancellations and Returns</h2>
              <p>
                Cancellation and return eligibility depends on order status and product customization.
                Contact support quickly for assistance.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-foreground mb-2">Contact</h2>
              <p>
                For questions regarding these terms, email varnika.atelier@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
