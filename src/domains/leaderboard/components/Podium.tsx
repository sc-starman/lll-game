import { Trophy, Gem } from "lucide-react";

type WeeklyEntry = {
    rank: number;
    id: string;
    telegram_id: number;
    display_name: string;
    total_score: number;
    total_jackpots: number;
};

export const WeeklyPodiumClassic: React.FC<{ entries: WeeklyEntry[] }> = ({
    entries,
}) => {
    if (!entries || entries.length === 0) return null;

    // بر اساس امتیاز مرتب، بعد 1 / 2 / 3 رو خودمون تعیین می‌کنیم
    const sorted = [...entries].sort((a, b) => {
        if (b.total_score !== a.total_score) return b.total_score - a.total_score;
        return (b.total_jackpots ?? 0) - (a.total_jackpots ?? 0);
    });

    const top3: WeeklyEntry[] = sorted.slice(0, 3);
    while (top3.length < 3) top3.push(top3[top3.length - 1] ?? sorted[0]);

    const [first, second, third] = top3;

    return (
        <section className="relative glass-card rounded-3xl px-3 py-4 gap-2 overflow-hidden">
            {/* هدر بالا */}
            <div className="relative flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-slate-400 mb-8 ">
                <span className="text-base font-bold font-orbitron bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-pink bg-clip-text text-transparent tracking-wide">Weekly Top Scorers</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[9px] ">
                    Live
                </span>
            </div>

            {/* خود پودیوم - 2 / 1 / 3 مثل تصویر */}
            <div className="relative mt-1 flex items-end justify-between gap-2 h-28">
                <PodiumColumn place={2} entry={second} imgSrc="/imgs/bcup.png" />
                <PodiumColumn place={1} entry={first} imgSrc="/imgs/dcup.png" />
                <PodiumColumn place={3} entry={third} imgSrc="/imgs/gcup.png" />
            </div>
        </section>
    );
};

type PodiumColumnProps = {
    place: 1 | 2 | 3;
    entry: WeeklyEntry;
    imgSrc: string;
};

const PodiumColumn: React.FC<PodiumColumnProps> = ({ place, entry, imgSrc }) => {
    // ارتفاع سکو مثل عکس: وسط بلندتر
    const stageHeight =
        place === 1 ? "h-16" : place === 2 ? "h-13" : "h-12";

    const avatarSize = place === 1 ? "w-14 h-14" : "w-12 h-12";

    const coinGradient =
        place === 1
            ? "from-yellow-300 via-amber-400 to-yellow-500" // طلا
            : place === 2
                ? "from-slate-200 via-slate-400 to-slate-600" // نقره
                : "from-orange-300 via-amber-500 to-orange-600"; // برنز

    const shortName =
        entry.display_name.length > 14
            ? entry.display_name.slice(0, 12) + "…"
            : entry.display_name;

    const placeLabel =
        place === 1 ? "1st PLACE" : place === 2 ? "2nd PLACE" : "3rd PLACE";

    const initial = entry.display_name?.charAt(0) ?? "?";

    return (
        <div className="flex-1 flex flex-col items-center h-full pb-4 mb-4">
            {/* آواتار/سکه بالای سکو */}
            <div className="relative mb-1">
                <div
                    className={`
            ${avatarSize} 
            flex items-center justify-center`}
                >
                    <img src={imgSrc} />
                </div>
                {/* مدال رنک روی آواتار */}
                <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full bg-black/85 border border-white/60 text-[8px] font-semibold text-slate-50">
                    #{place}
                </span>
            </div>

            {/* خود سکو (مکعب ساده مثل رفرنس) */}
            <div
                className={`
          relative w-full ${stageHeight}
          rounded-t-xl bg-[linear-gradient(180deg,rgba(15,23,42,0.7),rgba(15,23,42,0.95))]
          border border-slate-700/70 flex flex-col items-center justify-end pb-1
        `}
            >
                {/* شماره بزرگ محو روی سکو (1 / 2 / 3) */}
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-slate-500/10">
                    {place}
                </div>

                <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <span className="text-[9px] text-slate-500 uppercase tracking-[0.14em]">
                        {placeLabel}
                    </span>
                </div>
            </div>

            {/* متن زیر سکو */}
            <div className="mt-1 text-center">
                <p className="text-[10px] font-semibold text-slate-50 leading-tight">
                    {shortName}
                </p>
                <div className="text-[10px] text-slate-400">
                    <div className="flex items-center justify-center gap-1">
                        <Gem className="h-3 w-3 shrink-0 transition-transform duration-200 text-neon-cyan" />
                        SCORE{" "}
                        <span className="font-semibold text-slate-100 text-cyan-400 text-base">
                            {entry.total_score}
                        </span>
                    </div>

                </div>
                <div className="text-[9px] text-slate-400">
                                        <div className="flex items-center justify-center gap-1">
                        <Trophy className="h-3 w-3 shrink-0 transition-transform duration-200 text-neon-yellow" />
                        JACKPOTS{" "}
                        <span className="font-semibold text-slate-100 text-yellow-400 text-base">
                            {entry.total_jackpots}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};