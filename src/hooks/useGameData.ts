import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  score: number;
  username: string;
  first_name: string;
  telegram_id: number;
}

export function useGameData() {
  // const [userStats, setUserStats] = useState({
  //   totalScore: 0,
  //   totalSpins: 0,
  //   totalJackpots: 0,
  //   bestScore: 0,
  // });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // loadUserStats();
    loadLeaderboard();
  }, []);

  // const loadUserStats = async () => {

  //   try {
  //     const res = await fetch('/api/gateway/user-stats')
  //     const data = await res.json()

  //     if (!res.ok) {
  //       console.error('Error loading user stats:', data);
  //       return;
  //     }

  //     const { totalScore, totalSpins, totalJackpots, bestScore } = data
  //     setUserStats({
  //       totalScore,
  //       totalSpins,
  //       totalJackpots,
  //       bestScore,
  //     });

  //   } catch (error) {
  //     console.error('Error in loadUserStats:', error);
  //   }
  // };

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      // Use the new secure leaderboard function
      const res = await fetch('/api/gateway/leaderboard')
      const data = await res.json()

      if (!res.ok) {
        console.error('Error loading leaderboard:', data);
        return;
      }

      if (data) {
        // Map to the expected format
        const formattedData = data.map((entry: any) => ({
          score: entry.score,
          username: entry.username,
          first_name: entry.first_name,
          telegram_id: 0, // No longer expose telegram_id for privacy
        }));

        setLeaderboard(formattedData);
      }
    } catch (error) {
      console.error('Error in loadLeaderboard:', error);
    }
  };

  return {
    // userStats,
    leaderboard,
    loading,
    refreshData: () => {
      // loadUserStats();
      loadLeaderboard();
    },
  };
}