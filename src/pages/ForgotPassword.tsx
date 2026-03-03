import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    if (!error) setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-4">
        <div className="varnika-container max-w-md mx-auto">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-2xl font-display text-foreground">Reset Password</CardTitle>
              <CardDescription className="font-body">
                {sent ? "Check your inbox for a reset link." : "Enter your email to receive a password reset link."}
              </CardDescription>
            </CardHeader>
            {!sent ? (
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email" type="email" placeholder="your@email.com"
                      value={email} onChange={(e) => setEmail(e.target.value)} required
                      className="border-border focus:border-gold"
                    />
                  </div>
                  <Button type="submit" disabled={loading} variant="artisan" className="w-full button-glow">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                  </Button>
                </form>
              </CardContent>
            ) : (
              <CardContent className="text-center py-8">
                <Mail className="w-12 h-12 text-gold mx-auto mb-4" />
                <p className="font-body text-muted-foreground">
                  We sent a reset link to <strong>{email}</strong>. Check your email and follow the instructions.
                </p>
              </CardContent>
            )}
            <CardFooter className="flex justify-center">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground font-body inline-flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
