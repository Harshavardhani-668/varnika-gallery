import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingClouds from "@/components/effects/FloatingClouds";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const colorOptions = ["Blush Pink", "Pastel Lavender", "Mint", "Ivory", "Gold", "Custom"];
const fontOptions = ["Elegant Script", "Modern Sans", "Serif Classic", "Handwritten", "Minimal"];

const CustomizeProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product } = useProduct(id || "");
  const { addToCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [textMessage, setTextMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedFont, setSelectedFont] = useState(fontOptions[0]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const minDeliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) {
      toast.error("Product not found", {
        description: "Please return and try customizing again.",
      });
      return;
    }

    setSubmitting(true);

    const customProductId = `${product.id}::custom::${Date.now()}`;

    const customizationData = {
      original_product_id: product.id,
      original_product_name: product.name,
      message_text: textMessage,
      color_selection: selectedColor,
      font_selection: selectedFont,
      additional_notes: additionalNotes || null,
      delivery_date: deliveryDate,
      uploaded_photo_name: photoFile?.name || null,
    };

    const { error } = await addToCart(
      customProductId,
      `${product.name} (Custom)` ,
      product.salePrice || product.regularPrice,
      1,
      product.imageUrl,
      {
        is_custom: true,
        customization_data: customizationData,
      }
    );

    setSubmitting(false);

    if (error) {
      return;
    }

    toast.success("Customization request captured", {
      description: "Your details are saved in your order.",
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <section className="relative overflow-hidden pb-6">
          <FloatingClouds count={3} />
          <div className="varnika-container relative z-10">
            <Link
              to={id ? `/product/${id}` : "/collections"}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Product
            </Link>

            <div className="max-w-3xl">
              <span className="text-gold text-sm tracking-widest uppercase font-body">Custom Order</span>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mt-3 mb-3">
                Customize This Product
              </h1>
              <p className="text-muted-foreground font-body">
                {product?.name
                  ? `Personalize ${product.name} exactly the way you want.`
                  : "Personalize your selected product exactly the way you want."}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="varnika-container">
            <Card className="border-border/50">
              <CardContent className="p-5 md:p-8">
                {submitted ? (
                  <div className="max-w-2xl mx-auto text-center py-8 space-y-6">
                    <h2 className="font-display text-3xl text-foreground">Request Received</h2>
                    <p className="font-body text-muted-foreground text-lg">
                      Your customization request has been received. Our artist will contact you shortly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href="https://wa.me/6305193711?text=Hi%20I%20have%20placed%20a%20custom%20order"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex"
                      >
                        <Button size="lg" className="w-full sm:w-auto bg-gold hover:bg-gold-light text-foreground font-semibold">
                          Chat on WhatsApp
                        </Button>
                      </a>
                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => navigate("/cart")}
                      >
                        Go to Cart
                      </Button>
                    </div>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="photo" className="font-body">Upload Photo</Label>
                      <div className="relative">
                        <Input
                          id="photo"
                          type="file"
                          accept="image/*"
                          className="h-12 rounded-xl file:mr-3 file:rounded-md file:border-0 file:bg-gold/15 file:px-3 file:py-1 file:text-foreground"
                          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                        />
                        <Upload className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {photoFile && (
                        <p className="text-xs text-muted-foreground font-body">Selected: {photoFile.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryDate" className="font-body">Delivery Date</Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        min={minDeliveryDate}
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="messageText" className="font-body">Text/Message</Label>
                    <Input
                      id="messageText"
                      type="text"
                      placeholder="Ex: Happy Anniversary, Aditi & Arjun"
                      value={textMessage}
                      onChange={(e) => setTextMessage(e.target.value)}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="color" className="font-body">Color Selection</Label>
                      <select
                        id="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm"
                        required
                      >
                        {colorOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="font" className="font-body">Font Selection</Label>
                      <select
                        id="font"
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm"
                        required
                      >
                        {fontOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="font-body">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Tell us any extra customization details, size preference, gift wrapping, etc."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="min-h-[130px] rounded-xl resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto bg-gold hover:bg-gold-light text-foreground font-semibold">
                      Submit Customization
                    </Button>
                    <Button type="button" size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => navigate(id ? `/product/${id}` : "/collections")}>
                      Cancel
                    </Button>
                  </div>
                </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CustomizeProduct;
