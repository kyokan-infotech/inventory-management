'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { translations } from '@/lib/translations';
import { login } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, LogIn, Warehouse } from 'lucide-react';

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const { locale: localeParam } = React.use(params);
  const locale = (localeParam || 'en') as 'en' | 'ja';
  const t = translations.auth;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await login(formData.email, formData.password);
      if (response.success && response.data) {
        localStorage.setItem('stockmate_token', response.data.token);
        router.push(`/${locale}/dashboard`);
      } else {
        setError(response.message || t.error[locale]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.error[locale]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <Warehouse className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">StockMate</h1>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest px-2 py-0.5 border border-border/50 rounded bg-muted/30">
            Professional Inventory
          </p>
        </div>

        <Card className="border-border shadow-none bg-background animate-in zoom-in-95 duration-500">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{t.loginTitle[locale]}</CardTitle>
            <CardDescription>
              {t.loginSubtitle[locale]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium">
                  {t.email[locale]}
                </Label>
                <Input
                  id="identifier"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t.password[locale]}</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 font-medium mt-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.loggingIn[locale]}
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    {t.loginButton[locale]}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground whitespace-nowrap">
                  {t.noAccount[locale]}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={() => router.push(`/${locale}/register`)}
              disabled={isLoading}
            >
              {t.registerLink[locale]}
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground/60 animate-in fade-in duration-1000">
          &copy; {new Date().getFullYear()} StockMate Inventory Systems.
        </p>
      </div>
    </div>
  );
}