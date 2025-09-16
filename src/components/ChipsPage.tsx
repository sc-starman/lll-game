import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Coins, Gift, Share2, Twitter, Send, Users, Copy, Check } from 'lucide-react';
import { useChips } from '@/hooks/useChips';
import { toast } from 'sonner';

export function ChipsPage() {
  const { chips, referralCode, canClaimDaily, loading, claimDailyBonus, processReferral, getReferralLink } = useChips();
  const [referralInput, setReferralInput] = useState('');
  const [copied, setCopied] = useState(false);

  // Check for referral code in URL on mount and auto-process
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode && !referralInput) {
      setReferralInput(refCode);
      // Auto-process if user just landed with referral code
      setTimeout(() => {
        processReferral(refCode);
      }, 1000);
    }
  }, [processReferral, referralInput]);

  const handleClaimDaily = async () => {
    await claimDailyBonus();
  };

  const handleProcessReferral = async () => {
    if (!referralInput.trim()) {
      toast.error('Please enter a referral code');
      return;
    }

    const success = await processReferral(referralInput.trim());
    if (success) {
      setReferralInput('');
    }
  };

  const copyReferralLink = async () => {
    const link = getReferralLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareToTelegram = () => {
    const link = getReferralLink();
    const text = `🎰 Join me on Loss Loss Lottery! Use my referral code and we both get chips to play! ${link}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-orbitron text-foreground">Get More Chips</h1>
          <p className="text-muted-foreground">Earn chips to play the slot machine</p>
        </div>

        {/* Current Chips */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader className="text-center pb-3">
            <CardTitle className="flex items-center justify-center gap-2">
              <Coins className="h-6 w-6 text-primary" />
              Your Chips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{chips}</div>
            <p className="text-sm text-muted-foreground">Available to play</p>
          </CardContent>
        </Card>

        {/* Ways to Earn Chips */}
        <div className="space-y-4">
          {/* Daily Bonus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-500" />
                Daily Bonus
              </CardTitle>
              <CardDescription>Get 3 free chips every day</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleClaimDaily}
                disabled={!canClaimDaily || loading}
                className="w-full"
                variant={canClaimDaily ? "default" : "outline"}
              >
                {canClaimDaily ? 'Claim 3 Chips' : 'Already Claimed Today'}
              </Button>
            </CardContent>
          </Card>

          {/* Referral System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Invite Friends
              </CardTitle>
              <CardDescription>
                Both you and your friend get 5 chips when they join with your code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Referral Code:</label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-lg px-4 py-2 font-mono">
                    {referralCode}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Share Your Link:</label>
                <div className="flex gap-2">
                  <Button onClick={copyReferralLink} variant="outline" className="flex-1">
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                  <Button onClick={shareToTelegram} variant="outline">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enter Referral Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-purple-500" />
                Have a Referral Code?
              </CardTitle>
              <CardDescription>Enter a friend&apos;s code to get bonus chips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                placeholder="Enter referral code"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                className="font-mono"
              />
              <Button
                onClick={handleProcessReferral}
                disabled={!referralInput.trim() || loading}
                className="w-full"
              >
                Submit Code
              </Button>
            </CardContent>
          </Card>

          {/* Social Media Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Follow Us</CardTitle>
              <CardDescription>More ways to earn chips coming soon!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" disabled>
                <Twitter className="h-4 w-4 mr-2" />
                Follow on Twitter (Coming Soon)
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Send className="h-4 w-4 mr-2" />
                Join Telegram Channel (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}