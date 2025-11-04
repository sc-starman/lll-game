import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useProfileService() {
  const [profile, setProfile] = useState({
    username: '@',
    firstName: '...',
    lastName: '',
    photoUrl: undefined,
    chips: 0,
    score: 0,
    spins: 0,
    referral_count: 0,
    jackpots: 0,
    is_x_verified: false,
    is_telegram_verified: false,
    losses: 0,
    wins: 0
  });
  const [referralCode, setReferralCode] = useState('');
  const [canClaimDaily, setCanClaimDaily] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    loadUserProfile();
  }, []);

  const toggleNavigation = () => {
    setShowNavigation(!showNavigation)
  }

  const updateStats = (chips: number, score: number, spins: number, jackpots: number, losses: number, wins: number) => {
    setProfile({
      ...profile,
      chips: chips,
      score: score,
      spins: spins,
      jackpots: jackpots,
      losses: losses,
      wins: wins,
    });
  }

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gateway/user-profile')
      const profile = await res.json()

      if (!res.ok) {
        console.error('Error loading user profile:', profile);
        return;
      }

      if (profile) {
        setProfile({
          chips: profile.chips,
          score: profile.score,
          spins: profile.spins,
          jackpots: profile.jackpots,
          is_x_verified: profile.is_x_verified,
          is_telegram_verified: profile.is_telegram_verified,
          losses: profile.losses,
          wins: profile.wins,
          referral_count: profile.referral_count || 0,
          username: profile.username,
          firstName: profile.first_name,
          lastName: profile.last_name,
          photoUrl: profile.photo_url,
        });
        setReferralCode(profile.referral_code);

        // Check if can claim daily bonus
        const today = new Date().toDateString();
        const lastBonus = profile.last_daily_bonus ? new Date(profile.last_daily_bonus).toDateString() : null;
        setCanClaimDaily(lastBonus !== today);
        setLoading(false)
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

  // const processReferral = async (referralCodeInput: string) => {

  //   setLoading(true);
  //   try {
  //     const res = await fetch('/api/gateway/process_referral', {
  //       method: 'POST', body: JSON.stringify({
  //         referral_code_input: referralCodeInput
  //       })
  //     })

  //     if (!res.ok) {
  //       toast.error('Failed to process referral');
  //       return false;
  //     }

  //     const data = await res.json()

  //     if (data && data.length > 0) {
  //       const result = data[0];
  //       if (result.success) {
  //         toast.success(result.message);
  //         await loadUserProfile(); // Refresh profile data
  //         return true;
  //       } else {
  //         toast.error(result.message);
  //         return false;
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error processing referral:', error);
  //     toast.error('Failed to process referral');
  //     return false;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getReferralLink = () => {
    if (!referralCode) return '';
    const baseUrl = 'https://t.me/';
    return `${baseUrl}${process.env["NEXT_PUBLIC_TELEGRAM_BOT_ID"]}?start=${referralCode}`;
  };

  return {
    profile,
    referralCode,
    canClaimDaily,
    loading,
    showNavigation,
    claimDailyBonus,
    toggleNavigation,
    getReferralLink,
    refreshProfile: loadUserProfile,
    updateStats
  };
}
