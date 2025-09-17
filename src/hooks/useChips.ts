import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useChips() {
  const [chips, setChips] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [canClaimDaily, setCanClaimDaily] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {

    try {
      const res = await fetch('/api/gateway/user-profile')
      const profile = await res.json()

      if (!res.ok) {
        console.error('Error loading user profile:', profile);
        return;
      }

      if (profile) {
        setChips(profile.chips);
        setReferralCode(profile.referral_code);

        // Check if can claim daily bonus
        const today = new Date().toDateString();
        const lastBonus = profile.last_daily_bonus ? new Date(profile.last_daily_bonus).toDateString() : null;
        setCanClaimDaily(lastBonus !== today);
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  const claimDailyBonus = async () => {

    setLoading(true);
    try {
      const res = await fetch('/api/gateway/claim-daily-bonus');

      if (!res.ok) {
        toast.error('Failed to claim daily bonus');
        return false;
      }

      const data = await res.json()

      if (data?.success) {
        toast.success(data.message);
        await loadUserProfile(); // Refresh profile data
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error('Error claiming daily bonus:', error);
      toast.error('Failed to claim daily bonus');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const processReferral = async (referralCodeInput: string) => {

    setLoading(true);
    try {
      const res = await fetch('/api/gateway/process_referral', {
        method: 'POST', body: JSON.stringify({
          referral_code_input: referralCodeInput
        })
      })

      if (!res.ok) {
        toast.error('Failed to process referral');
        return false;
      }

      const data = await res.json()

      if (data && data.length > 0) {
        const result = data[0];
        if (result.success) {
          toast.success(result.message);
          await loadUserProfile(); // Refresh profile data
          return true;
        } else {
          toast.error(result.message);
          return false;
        }
      }
    } catch (error) {
      console.error('Error processing referral:', error);
      toast.error('Failed to process referral');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getReferralLink = () => {
    if (!referralCode) return '';
    const baseUrl = 'https://t.me/';
    return `${baseUrl}${process.env["NEXT_PUBLIC_TELEGRAM_BOT_ID"]}?start=${referralCode}`;
  };

  return {
    chips,
    referralCode,
    canClaimDaily,
    loading,
    claimDailyBonus,
    processReferral,
    getReferralLink,
    refreshProfile: loadUserProfile,
  };
}