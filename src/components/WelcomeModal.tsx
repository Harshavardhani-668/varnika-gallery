import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Chrome, X } from 'lucide-react';

export const WelcomeModal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Check if user is not logged in and hasn't dismissed the modal
    if (!user) {
      const hasDismissed = localStorage.getItem('welcome-modal-dismissed');
      if (!hasDismissed) {
        // Show modal after a short delay for better UX
        setTimeout(() => {
          setIsOpen(true);
          setShowAnimation(true);
        }, 1000);
      }
    }
  }, [user]);

  const handleClose = () => {
    setIsOpen(false);
    // Remember that user dismissed the modal (for current session)
    localStorage.setItem('welcome-modal-dismissed', 'true');
  };

  const handleSignUp = () => {
    setIsOpen(false);
    navigate('/signup');
  };

  const handleSignIn = () => {
    setIsOpen(false);
    navigate('/login');
  };

  const handleGoogleSignIn = async () => {
    setIsOpen(false);
    navigate('/login');
  };

  if (user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] border-2 border-pastel-lavender/30 overflow-hidden p-0">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pastel-pink/20 via-pastel-lavender/20 to-pastel-peach/20 animate-gradient-shift" />
        
        {/* Floating hearts animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className={`absolute text-pastel-pink/20 animate-float-heart`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
              size={16 + Math.random() * 16}
            />
          ))}
        </div>

        <div className="relative p-8 space-y-6">
          {/* Header with sparkle animation */}
          <DialogHeader className="text-center space-y-4">
            <div className={`flex justify-center ${showAnimation ? 'animate-bounce-in' : ''}`}>
              <div className="relative">
                <Sparkles className="w-16 h-16 text-pastel-pink animate-pulse" />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Sparkles className="w-16 h-16 text-pastel-lavender" />
                </div>
              </div>
            </div>
            
            <DialogTitle className={`font-display text-4xl text-espresso ${showAnimation ? 'animate-slide-down' : ''}`}>
              Welcome to Varnika! 💝
            </DialogTitle>
            
            <DialogDescription className={`text-lg text-muted-foreground leading-relaxed ${showAnimation ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.2s' }}>
              Join our handmade gifting community and unlock exclusive features:
            </DialogDescription>
          </DialogHeader>

          {/* Features list with staggered animation */}
          <div className="space-y-3">
            {[
              { icon: '🛒', text: 'Save your favorite items to cart' },
              { icon: '📦', text: 'Track your orders in real-time' },
              { icon: '🎨', text: 'Get personalized recommendations' },
              { icon: '💌', text: 'Early access to new collections' },
            ].map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm ${showAnimation ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-sm text-espresso font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Action buttons with animation */}
          <div className={`space-y-3 pt-2 ${showAnimation ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.7s' }}>
            <Button
              onClick={handleSignUp}
              className="w-full bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-peach bg-size-200 animate-gradient-x hover:shadow-lg text-white font-semibold py-6 text-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Free Account
            </Button>

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full border-2 border-pastel-lavender/30 hover:bg-pastel-pink/5 py-6 text-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={handleSignIn}
                  className="text-pastel-pink hover:underline font-semibold transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>

          {/* Skip button */}
          <div className={`text-center ${showAnimation ? 'animate-fade-in' : ''}`} style={{ animationDelay: '0.9s' }}>
            <button
              onClick={handleClose}
              className="text-xs text-muted-foreground hover:text-espresso transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
