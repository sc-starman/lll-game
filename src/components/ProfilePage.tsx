import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGameData } from "@/hooks/useGameData";
import { useProfile } from "@/hooks/useProfile";

export function ProfilePage() {  
  const { userProfile: telegramUser } = useProfile()
  const { userStats } = useGameData();


  const winRate = userStats.totalSpins > 0 ?
    ((userStats.totalJackpots / userStats.totalSpins) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <h1 className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent font-orbitron">
            Profile
          </h1>
        </div>

        {/* User Profile Section */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={telegramUser?.photo_url}
                  alt={`${telegramUser?.first_name}'s Avatar`}
                />
                <AvatarFallback className="text-xl bg-gradient-cyber text-white">
                  {telegramUser?.first_name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">
                  {telegramUser?.first_name} {telegramUser?.last_name}
                </h2>
                {telegramUser?.username && (
                  <p className="text-muted-foreground">@{telegramUser?.username}</p>
                )}
                <Badge variant="secondary" className="mt-2">
                  Crypto Miner
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-neon-green">
                {userStats.totalJackpots}
              </div>
              <p className="text-sm text-muted-foreground">Jackpots Won</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-neon-cyan">
                {userStats.totalSpins.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Total Spins</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Statistics */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-neon-cyan">Game Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Win Rate</span>
              <span className="font-semibold text-neon-green">{winRate}%</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Best Score</span>
              <span className="font-semibold text-neon-yellow">
                {userStats.bestScore.toLocaleString()}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Score</span>
              <span className="font-semibold text-bitcoin">
                {userStats.totalScore.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-neon-cyan">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neon-yellow/20 flex items-center justify-center">
                <span className="text-neon-yellow">🎰</span>
              </div>
              <div>
                <p className="font-medium">
                  {userStats.totalJackpots > 0 ? "Jackpot Winner!" : "First Jackpot"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {userStats.totalJackpots > 0
                    ? `Hit ${userStats.totalJackpots} jackpots`
                    : "Hit your first 3x L combination"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center">
                <span className="text-neon-purple">💎</span>
              </div>
              <div>
                <p className="font-medium">
                  {userStats.totalSpins >= 100 ? "Dedicated Player" : "Getting Started"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {userStats.totalSpins >= 100
                    ? `${userStats.totalSpins} spins completed`
                    : "Keep spinning to unlock this achievement"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}