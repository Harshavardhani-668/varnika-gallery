import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleClick = () => {
    const message = encodeURIComponent(
      "Hi! I'm interested in your handmade gifts. Can you help me?"
    );
    window.open(`https://wa.me/916305193711?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-[60] w-14 h-14 rounded-full bg-[#25D366] text-white shadow-elevated flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
      aria-label="Contact us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
    </button>
  );
};

export default WhatsAppButton;
