import React, { useEffect, useState } from "react";
import { WeeklyPodiumClassic } from "./components/Podium";

type SpinEntry = {
  rank: number;
  id: string;
  telegram_id: number;
  display_name: string;
  spins: number;
  score: number;
  jackpots: number;
  last_played_time: string;
};

type WeeklyEntry = {
  rank: number;
  id: string;
  telegram_id: number;
  display_name: string;
  total_score: number;
  total_jackpots: number;
};

type ReferralEntry = {
  rank: number;
  id: string;
  telegram_id: number;
  display_name: string;
  referrals: number;
};

type LeaderboardsResponse = {
  spins: {
    top10: SpinEntry[];
    me: SpinEntry | null;
  };
  weekly_score: {
    top3: WeeklyEntry[];
    me: WeeklyEntry | null;
  };
  referrals: {
    top10: ReferralEntry[];
    me: ReferralEntry | null;
  };
};

type Props = {
};

type TabKey = "spins" | "referrals";

const LeaderboardsPage: React.FC<Props> = () => {
  const [data, setData] = useState<LeaderboardsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("spins");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `/api/gateway/leaderboard`
        );
        if (!res.ok) throw new Error("Failed to load leaderboards");
        const json = (await res.json()) as LeaderboardsResponse;
        setData(json);
      } catch (e: any) {
        setError(e.message ?? "Unexpected error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-slate-100">
        <div className="max-w-sm mx-auto px-3 py-4 space-y-3">
          <Header />
          <SkeletonBox />
          <SkeletonBox />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#050816] text-slate-100">
        <div className="max-w-sm mx-auto px-3 py-4 space-y-3">
          <Header />
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2">
            Failed to load leaderboards: {error}
          </p>
        </div>
      </div>
    );
  }

  const { spins, weekly_score, referrals } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] via-[#050816] to-[#020617] text-slate-50 pb-[max(94px,env(safe-area-inset-bottom))]">
      <div className="max-w-sm mx-auto px-3 space-y-4">
        <Header />

        {/* Weekly Podium (Top 3 High Scores) */}
        <PodiumTopThree entries={weekly_score.top3} />

        {/* Tabs */}
        <LeaderboardTabs active={tab} onChange={setTab} />

        {/* Subtitle */}
        <p className="text-xs text-slate-400 text-center">
          {tab === "spins"
            ? "In lossless mode, every spin is a win."
            : "Safe to play, easy to win — squad up."}
        </p>

        {/* List for active tab */}
        {tab === "spins" ? (
          <LeaderboardList
            kind="spins"
            entries={spins.top10}
            me={spins.me}
          />
        ) : (
          <LeaderboardList
            kind="referrals"
            entries={referrals.top10}
            me={referrals.me}
          />
        )}
      </div>
    </div>
  );
};

/* ---------- Subcomponents ---------- */

const Header: React.FC = () => (
  <header className="space-y-1">
    <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-pink bg-clip-text text-transparent tracking-wide pt-4">
      Leaderboards
    </h1>
    <p className="text-xs text-slate-400">
      No losses here. Invite the crew and climb together.
    </p>
  </header>
);

const SkeletonBox: React.FC = () => (
  <div className="h-36 rounded-3xl bg-slate-700/40 animate-pulse" />
);

/* === Weekly Podium === */

const PodiumTopThree: React.FC<{ entries: WeeklyEntry[] }> = ({ entries }) => {
  return <WeeklyPodiumClassic entries={entries} />;
};


/* === Tabs === */

const LeaderboardTabs: React.FC<{
  active: TabKey;
  onChange: (t: TabKey) => void;
}> = ({ active, onChange }) => {
  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-sm p-1 rounded-full bg-white/10">
        <button
          onClick={() => onChange("spins")}
          className={`flex-1 text-center text-[11px] font-semibold py-1.5 rounded-full transition
          ${active === "spins"
              ? "bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-900 shadow-lg shadow-cyan-500/30"
              : "text-slate-200/80 hover:text-slate-50"
            }`}
        >
          Top Spinners
        </button>
        <button
          onClick={() => onChange("referrals")}
          className={`flex-1 text-center text-[11px] font-semibold py-1.5 rounded-full transition
          ${active === "referrals"
              ? "bg-gradient-to-r from-lime-300 to-emerald-400 text-slate-900 shadow-lg shadow-lime-400/30"
              : "text-slate-200/80 hover:text-slate-50"
            }`}
        >
          Top Referrers
        </button>
      </div>
    </div>
  );
};

/* === List + Row === */

type LeaderboardListProps =
  | {
    kind: "spins";
    entries: SpinEntry[];
    me: SpinEntry | null;
  }
  | {
    kind: "referrals";
    entries: ReferralEntry[];
    me: ReferralEntry | null;
  };

const LeaderboardList: React.FC<LeaderboardListProps> = (props) => {
  const { entries, kind, me } = props as any;

  const isMe = (entry: any) =>
    me && (me.id === entry.id || me.telegram_id === entry.telegram_id);

  const inTop = me && entries.some((e: any) => isMe(e));

  return (
    <section className="space-y-2">
      <div className="space-y-2">
        {entries.map((entry: any) => (
          <LeaderboardRow
            key={entry.id}
            kind={kind}
            entry={entry}
            highlight={isMe(entry)}
            showYourRankPill={isMe(entry)}
          />
        ))}
      </div>

      {/* Your rank card (if not in top list but rank exists) */}
      {!inTop && me && (
        <div className="pt-1">
          <p className="text-[10px] text-slate-400 mb-1">Your Rank</p>
          <LeaderboardRow
            kind={kind}
            entry={me}
            highlight
            showYourRankPill
          />
        </div>
      )}
    </section>
  );
};

const LeaderboardRow: React.FC<{
  kind: "spins" | "referrals";
  entry: any;
  highlight?: boolean;
  showYourRankPill?: boolean;
}> = ({ kind, entry, highlight, showYourRankPill }) => {
  const label =
    kind === "spins" ? <>{entry.jackpots > 0 && (<Stat label="JACKPOTS" value={entry.jackpots} small />)}</>
      : <>{1 > 0 && (<Stat label="DAILY REFERRAL" value={0} small />)}</>;

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl px-3 py-2
      bg-white/5 border border-white/10
      ${highlight
          ? "border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.45)]"
          : "shadow-[0_0_12px_rgba(15,23,42,0.8)]"
        }`}
    >
      {/* left side */}
      <div className="flex items-center gap-2 min-w-0">


        {/* avatar + name */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-[11px] text-slate-200">
            <img className="rounded-full" src={entry?.photo_url} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {entry.display_name}
              </p>
              {showYourRankPill && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/60">
                  YOUR RANK
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-[0.16em]">
              {label}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* right side numbers */}
        <div className="text-right shrink-0">
          {kind === "spins" ? (
            <div className="space-y-0.5">
              <Stat label="SPINS" value={entry.spins} divider />
            </div>
          ) : (
            <Stat label="ALL REFERRALS" value={entry.referrals} divider />
          )}
        </div>
        {/* rank badge */}
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-semibold
          ${entry.rank === 1
              ? "bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-900"
              : entry.rank === 2
                ? "bg-gradient-to-br from-yellow-300 to-amber-500 text-slate-900"
                : entry.rank === 3
                  ? "bg-gradient-to-br from-orange-300 to-orange-500 text-slate-900"
                  : "bg-slate-900 border border-slate-500 text-slate-100"
            }`}
        >
          #{entry.rank}
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{
  label: string;
  value: number;
  small?: boolean;
  divider?: boolean;
}> = ({ label, value, small, divider }) => (
  <div>
    <span className="text-[9px] text-slate-400 tracking-[0.18em]">
      {label}
    </span>
    {divider ? <br /> : " "}
    <span
      className={`${small ? "text-xs" : "text-sm"
        } font-semibold ${divider ? "text-purple-400" : "text-yellow-400"} `}
    >
      {value}
    </span>
  </div>
);

export default LeaderboardsPage;
