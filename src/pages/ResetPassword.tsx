import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  // Check for recovery token in URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      // No recovery token — user may have landed here directly
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await updatePassword(password);
    if (!updateError) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } else {
      setError(updateError.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-4">
        <div className="varnika-container max-w-md mx-auto">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-2xl font-display text-foreground">Set New Password</CardTitle>
              <CardDescription className="font-body">Choose a new password for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-sage mx-auto mb-4" />
                  <p className="font-body text-foreground">Password updated! Redirecting…</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password" type="password" placeholder="••••••••" minLength={6}
                      value={password} onChange={(e) => setPassword(e.target.value)} required
                      className="border-border focus:border-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword" type="password" placeholder="••••••••"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                      className="border-border focus:border-gold"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive font-body">{error}</p>}
                  <Button type="submit" disabled={loading} variant="artisan" className="w-full button-glow">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
