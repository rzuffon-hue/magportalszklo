import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, CityStats } from '../../types';
import {
  Flame,
  Snowflake,
  Sparkles,
  Shield,
  Crown,
  ChevronUp,
  Heart,
  MessageSquare,
  Building2,
  Info,
  Maximize2,
  CheckCircle2,
  Lock,
  Wind,
  Pickaxe,
  Trees,
  Warehouse,
  Wrench,
  Home,
  HeartPulse,
  Wine,
  Users,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';

import furnaceImg from '../../assets/images/furnace_building_1784993760189.jpg';
import townhallImg from '../../assets/images/townhall_building_1784993772998.jpg';
import sawmillImg from '../../assets/images/sawmill_building_1784993783968.jpg';
import mineImg from '../../assets/images/mine_building_1784993810681.jpg';
import tavernImg from '../../assets/images/tavern_building_1784993820766.jpg';

interface MiniWhiteoutCityProps {
  cityName?: string;
  ownerName?: string;
  ownerRole?: UserRole;
  cityLevel?: number;
  cityStats?: CityStats;
  isReadOnly?: boolean;
  onUpgrade?: (nextLevel: number) => void;
  className?: string;
}

export interface BuildingData {
  id: string;
  name: string;
  type: string;
  level: number;
  bonus: string;
  image?: string;
  icon: any;
  posX: number; // percentage on isometric map
  posY: number; // percentage on isometric map
  reqLikesReceived: number;
  reqLikesGiven: number;
  reqComments: number;
  desc: string;
}

export interface LevelInfo {
  level: number;
  title: string;
  desc: string;
  reqLikesGiven: number;
  reqComments: number;
  reqLikesReceived: number;
}

export const CITY_LEVELS: LevelInfo[] = [
  { level: 1, title: 'Mała Osada Ocalałych', desc: 'Centralne palenisko + 2 małe drewniane chaty', reqLikesGiven: 15, reqComments: 5, reqLikesReceived: 10 },
  { level: 2, title: 'Schronienie i Magazyn', desc: 'Większe palenisko + magazyn surowców + lampiony', reqLikesGiven: 30, reqComments: 12, reqLikesReceived: 20 },
  { level: 3, title: 'Warsztat Rzemieślniczy', desc: 'Warsztat rzemieślniczy + dodatkowe domy + odśnieżone ścieżki', reqLikesGiven: 50, reqComments: 20, reqLikesReceived: 35 },
  { level: 4, title: 'Wieża Obserwacyjna', desc: 'Wieża strażnicza ze świetlnym reflektorem + kamienne podwaliny', reqLikesGiven: 80, reqComments: 32, reqLikesReceived: 55 },
  { level: 5, title: 'Główny Piec Ciepłowniczy', desc: 'Ciężki przemysłowy piec z dymiącym kominem i promieniowaniem ciepła', reqLikesGiven: 120, reqComments: 50, reqLikesReceived: 80 },
  { level: 6, title: 'Fortyfikacje Obronne', desc: 'Mury i częstokół chroniący osadę przed mroźnym wiatrem', reqLikesGiven: 170, reqComments: 70, reqLikesReceived: 115 },
  { level: 7, title: 'Rozwinięte Miasteczko', desc: 'Cieplarnie, stragany i oświetlone kamieniczki', reqLikesGiven: 230, reqComments: 95, reqLikesReceived: 160 },
  { level: 8, title: 'Zaawansowane Centrum', desc: 'Szpital polowy, brukowane aleje śnieżne, rzędy koksowników', reqLikesGiven: 300, reqComments: 125, reqLikesReceived: 210 },
  { level: 9, title: 'Wielkie Zimowe Miasto', desc: 'Rozległa metropolia lodu z wieżami strażniczymi i licznymi kominami', reqLikesGiven: 400, reqComments: 160, reqLikesReceived: 280 },
  { level: 10, title: 'Prestiżowa Stolica MaG', desc: 'Najwyższa potęga survivalu! Reaktor cieplny, zorza polarna, pomniki lodu', reqLikesGiven: 0, reqComments: 0, reqLikesReceived: 0 }
];

export const MiniWhiteoutCity: React.FC<MiniWhiteoutCityProps> = ({
  cityName,
  ownerName,
  ownerRole,
  cityLevel,
  cityStats,
  isReadOnly = false,
  onUpgrade,
  className = ''
}) => {
  const { profile, posts, reels, groups, setProfile } = useApp();

  const currentRole = ownerRole || profile.role;
  const currentName = ownerName || profile.name;
  const currentLevel = cityLevel || profile.cityData?.level || 1;

  // Selected Building ID for Inspector Popover Modal (dynamic derived view)
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  // Local Upgrade Guard & Animation State
  const [upgradingBuildingId, setUpgradingBuildingId] = useState<string | null>(null);
  const [animatingBuildingId, setAnimatingBuildingId] = useState<string | null>(null);
  const [userFeedback, setUserFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Per-building levels stored in local state or profile
  const [buildingLevels, setBuildingLevels] = useState<Record<string, number>>(() => {
    if (profile.cityData?.buildingLevels) {
      return profile.cityData.buildingLevels;
    }
    const lvl = Math.max(1, currentLevel);
    return {
      furnace: lvl,
      townhall: lvl,
      sawmill: Math.max(1, Math.floor(lvl * 0.9)),
      mine: Math.max(1, Math.floor(lvl * 0.8)),
      warehouse: Math.max(1, Math.floor(lvl * 0.8)),
      workshop: Math.max(1, Math.floor(lvl * 0.7)),
      houses: lvl,
      medical: Math.max(1, Math.floor(lvl * 0.6)),
      tavern: Math.max(1, Math.floor(lvl * 0.7)),
      alliance: Math.max(1, Math.floor(lvl * 0.8))
    };
  });

  // Keep buildingLevels synced if profile updates externally
  useEffect(() => {
    if (profile.cityData?.buildingLevels) {
      setBuildingLevels(profile.cityData.buildingLevels);
    }
  }, [profile.cityData?.buildingLevels]);

  // Calculate live social activity resources
  const activeStats = useMemo<CityStats>(() => {
    if (cityStats) return cityStats;

    let likesGiven = 0;
    posts.forEach((p) => {
      if (p.isLiked) likesGiven++;
    });
    reels.forEach((r) => {
      if (r.isLiked) likesGiven++;
    });
    groups.forEach((g) => {
      g.wallPosts.forEach((wp) => {
        if (wp.likes.includes(profile.id)) likesGiven++;
      });
    });

    let commentsWritten = 0;
    posts.forEach((p) => {
      p.comments.forEach((c) => {
        if (c.authorName === profile.name) commentsWritten++;
      });
    });
    reels.forEach((r) => {
      (r.commentList || []).forEach((c) => {
        if (c.authorId === profile.id || c.authorName === profile.name) commentsWritten++;
      });
    });
    groups.forEach((g) => {
      g.wallPosts.forEach((wp) => {
        wp.comments.forEach((c) => {
          if (c.authorId === profile.id || c.authorName === profile.name) commentsWritten++;
        });
      });
    });

    let likesReceived = 0;
    posts.forEach((p) => {
      if (p.authorName === profile.name || p.authorId === profile.id) {
        likesReceived += p.likes || 0;
      }
    });

    const baseStats = profile.cityData?.stats || { likesGiven: 35, commentsWritten: 15, likesReceived: 25 };

    return {
      likesGiven: Math.max(likesGiven, baseStats.likesGiven),
      commentsWritten: Math.max(commentsWritten, baseStats.commentsWritten),
      likesReceived: Math.max(likesReceived, baseStats.likesReceived)
    };
  }, [cityStats, posts, reels, groups, profile.id, profile.name, profile.cityData?.stats]);

  // All 10 graphical game buildings with exact placement coordinates on the winter map
  const buildings: BuildingData[] = useMemo(() => {
    return [
      {
        id: 'furnace',
        name: 'PIEC REAKTOROWY',
        type: 'Główne Źródło Ciepła',
        level: buildingLevels.furnace || 1,
        bonus: `+${(buildingLevels.furnace || 1) * 40}°C Ciepło w Osadzie • Ochrona Przed Zamiecią`,
        image: furnaceImg,
        icon: Flame,
        posX: 50,
        posY: 42,
        reqLikesReceived: (buildingLevels.furnace || 1) * 20,
        reqLikesGiven: (buildingLevels.furnace || 1) * 15,
        reqComments: (buildingLevels.furnace || 1) * 6,
        desc: 'Sercem osady jest potężny reaktor cieplny. Ogrzewa wszystkie budynki i chroni ocalałych przed zamarznięciem.'
      },
      {
        id: 'townhall',
        name: 'RATUSZ DOWÓDZTWA',
        type: 'Centrum Zarządzania',
        level: buildingLevels.townhall || 1,
        bonus: `+${(buildingLevels.townhall || 1) * 10}% Zasięg • Odblokowuje Nowe Budynki`,
        image: townhallImg,
        icon: Crown,
        posX: 50,
        posY: 18,
        reqLikesReceived: (buildingLevels.townhall || 1) * 25,
        reqLikesGiven: (buildingLevels.townhall || 1) * 18,
        reqComments: (buildingLevels.townhall || 1) * 8,
        desc: 'Główna siedziba dowództwa osady. Stąd wydawane są rozkazy rozbudowy i organizacji sojuszu MaG.'
      },
      {
        id: 'sawmill',
        name: 'TARTAK DREWNA',
        type: 'Pozyskiwanie Surowca',
        level: buildingLevels.sawmill || 1,
        bonus: `+${(buildingLevels.sawmill || 1) * 65} Drewna / godz.`,
        image: sawmillImg,
        icon: Trees,
        posX: 22,
        posY: 28,
        reqLikesReceived: (buildingLevels.sawmill || 1) * 12,
        reqLikesGiven: (buildingLevels.sawmill || 1) * 10,
        reqComments: (buildingLevels.sawmill || 1) * 4,
        desc: 'Przetwarza oszronione drwa z okolicznych lasów na deski potrzebne do budowy ciepłych domostw.'
      },
      {
        id: 'mine',
        name: 'KOPALNIA WĘGLA',
        type: 'Pozyskiwanie Paliwa',
        level: buildingLevels.mine || 1,
        bonus: `+${(buildingLevels.mine || 1) * 50} Węgla i Rudy / godz.`,
        image: mineImg,
        icon: Pickaxe,
        posX: 78,
        posY: 28,
        reqLikesReceived: (buildingLevels.mine || 1) * 14,
        reqLikesGiven: (buildingLevels.mine || 1) * 12,
        reqComments: (buildingLevels.mine || 1) * 5,
        desc: 'Wydobywa czarny węgiel i rudę metali z podziemnych szyfów mroźnego kanionu.'
      },
      {
        id: 'warehouse',
        name: 'MAGAZYN ZAPASÓW',
        type: 'Przechowywanie Surowców',
        level: buildingLevels.warehouse || 1,
        bonus: `Pojemność Magazynowa: ${(buildingLevels.warehouse || 1) * 10000} Zapasów`,
        icon: Warehouse,
        posX: 20,
        posY: 56,
        reqLikesReceived: (buildingLevels.warehouse || 1) * 15,
        reqLikesGiven: (buildingLevels.warehouse || 1) * 10,
        reqComments: (buildingLevels.warehouse || 1) * 5,
        desc: 'Zabezpieczone przed mrozem horyzontalne hale magazynowe mieszczą żywność i drewno.'
      },
      {
        id: 'workshop',
        name: 'WARSZTAT NARZĘDZIOWY',
        type: 'Produkcja Sprzętu',
        level: buildingLevels.workshop || 1,
        bonus: `+${(buildingLevels.workshop || 1) * 8}% Szybkość Pracy Inżynierów`,
        icon: Wrench,
        posX: 80,
        posY: 56,
        reqLikesReceived: (buildingLevels.workshop || 1) * 16,
        reqLikesGiven: (buildingLevels.workshop || 1) * 12,
        reqComments: (buildingLevels.workshop || 1) * 5,
        desc: 'Kuźnia i warsztat mechaniczny gdzie kowale wykuwają żelazne kilofy oraz piły do obróbki drewna.'
      },
      {
        id: 'houses',
        name: 'CHATY MIESZKAŃCÓW',
        type: 'Schronienie Ocalałych',
        level: buildingLevels.houses || 1,
        bonus: `Maks. Populacja: ${(buildingLevels.houses || 1) * 25} Ocalałych`,
        icon: Home,
        posX: 24,
        posY: 80,
        reqLikesReceived: (buildingLevels.houses || 1) * 10,
        reqLikesGiven: (buildingLevels.houses || 1) * 8,
        reqComments: (buildingLevels.houses || 1) * 3,
        desc: 'Ciepłe, ocieplone skórami drewniane domy dla rodzin ocalałych z wielkiego zamarznięcia.'
      },
      {
        id: 'medical',
        name: 'AMBULATORIUM',
        type: 'Opieka Medyczna',
        level: buildingLevels.medical || 1,
        bonus: `+${(buildingLevels.medical || 1) * 15}% Odporność na Choroby i Mróz`,
        icon: HeartPulse,
        posX: 42,
        posY: 82,
        reqLikesReceived: (buildingLevels.medical || 1) * 15,
        reqLikesGiven: (buildingLevels.medical || 1) * 12,
        reqComments: (buildingLevels.medical || 1) * 6,
        desc: 'Szpital polowy ogrzewany mosiężnym piecykiem, w którym lekarze opatrują odmrożenia.'
      },
      {
        id: 'tavern',
        name: 'GOSPODA "POD ZAMIEĆ"',
        type: 'Morale i Rekrutacja',
        level: buildingLevels.tavern || 1,
        bonus: `+${(buildingLevels.tavern || 1) * 12}% Morale Osady • Nowi Ocalali`,
        image: tavernImg,
        icon: Wine,
        posX: 76,
        posY: 80,
        reqLikesReceived: (buildingLevels.tavern || 1) * 18,
        reqLikesGiven: (buildingLevels.tavern || 1) * 15,
        reqComments: (buildingLevels.tavern || 1) * 7,
        desc: 'Gwarne miejsce przy kominku, gdzie ocalali piją gorący grzaniec, śpiewają i odpoczywają.'
      },
      {
        id: 'alliance',
        name: 'PLAC SOJUSZU MaG',
        type: 'Integracja i Zbiórki',
        level: buildingLevels.alliance || 1,
        bonus: `+${(buildingLevels.alliance || 1) * 10}% Wsparcie Braci Sojuszowych`,
        icon: Users,
        posX: 58,
        posY: 82,
        reqLikesReceived: (buildingLevels.alliance || 1) * 22,
        reqLikesGiven: (buildingLevels.alliance || 1) * 18,
        reqComments: (buildingLevels.alliance || 1) * 8,
        desc: 'Plac apelowy z powiewającymi proporcami Sojuszu MaG, miejsce narad i przysiąg bojowych.'
      }
    ];
  }, [buildingLevels]);

  // Derived selected building object (always up to date with buildingLevels)
  const selectedBuilding = useMemo(() => {
    if (!selectedBuildingId) return null;
    return buildings.find((b) => b.id === selectedBuildingId) || null;
  }, [selectedBuildingId, buildings]);

  // Atomic Upgrade Building Handler
  const handleUpgradeBuilding = (bld: BuildingData) => {
    if (isReadOnly) return;
    if (upgradingBuildingId) return; // Lock double clicks during execution

    setUpgradingBuildingId(bld.id);
    setUserFeedback(null);

    try {
      const canAfford =
        activeStats.likesReceived >= bld.reqLikesReceived &&
        activeStats.likesGiven >= bld.reqLikesGiven &&
        activeStats.commentsWritten >= bld.reqComments;

      if (!canAfford) {
        setUserFeedback({
          type: 'error',
          message: `Brak wystarczających zasobów do ulepszenia: ${bld.name}!`
        });
        return;
      }

      const nextBldLvl = bld.level + 1;
      const nextBuildingLevels = {
        ...buildingLevels,
        [bld.id]: nextBldLvl
      };

      // 1. Update building levels state
      setBuildingLevels(nextBuildingLevels);

      // 2. Determine highest building level to bump overall city level if appropriate
      const highestBldLvl = Math.max(...Object.values(nextBuildingLevels).map(Number));
      const nextCityLevel = Math.max(currentLevel, highestBldLvl);

      // 3. Persist to AppContext profile
      setProfile((prev) => ({
        ...prev,
        cityData: {
          ...prev.cityData,
          level: nextCityLevel,
          buildingLevels: nextBuildingLevels,
          stats: activeStats,
          lastUpgradedAt: new Date().toLocaleDateString('pl-PL')
        }
      }));

      if (onUpgrade && nextCityLevel > currentLevel) {
        onUpgrade(nextCityLevel);
      }

      // 4. Trigger localized time-bounded animation
      setAnimatingBuildingId(bld.id);
      setTimeout(() => {
        setAnimatingBuildingId(null);
      }, 1000);

      setUserFeedback({
        type: 'success',
        message: `Ulepszono ${bld.name} do Poziomu ${nextBldLvl}!`
      });

    } catch (err) {
      console.error('Upgrade building error:', err);
      setUserFeedback({
        type: 'error',
        message: 'Nie udało się ulepszyć budynku. Spróbuj ponownie.'
      });
    } finally {
      // Guaranteed atomic release of lock
      setUpgradingBuildingId(null);
    }
  };

  return (
    <div className={`relative w-full rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col ${className}`}>
      
      {/* 1. TOP COMPACT RESOURCE HUD BAR */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md z-20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-md shadow-cyan-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-white tracking-wide">
                {cityName || `OSADA ${currentName.toUpperCase()}`}
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                LVL {currentLevel}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Dowódca: <strong className="text-slate-200">{currentName}</strong> ({currentRole})
            </p>
          </div>
        </div>

        {/* Live Portal Activity Resources HUD */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-950/80 px-3.5 py-1.5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-1.5" title="Otrzymane Polubienia">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/30" />
            <span className="text-xs font-black text-rose-300 font-mono">{activeStats.likesReceived}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5" title="Rozdane Polubienia">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-black text-amber-300 font-mono">{activeStats.likesGiven}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5" title="Napisane Komentarze">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-black text-cyan-300 font-mono">{activeStats.commentsWritten}</span>
          </div>
        </div>
      </div>

      {/* 2. GRAPHICAL ISOMETRIC WINTER CITY MAP CANVAS */}
      <div className="relative w-full aspect-[16/11] sm:aspect-[16/9] min-h-[420px] bg-slate-950 overflow-hidden select-none">
        
        {/* Snowy Winter Terrain Image Background */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.7] contrast-[1.1]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.9) 100%), url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80')`
          }}
        />

        {/* Ambient Winter Fog Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-cyan-950/20 to-transparent pointer-events-none" />

        {/* Snow Paths connecting Central Furnace to all quarters */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyan-200/20 stroke-[2] stroke-dasharray-[4_4]">
          <line x1="50%" y1="42%" x2="50%" y2="18%" />
          <line x1="50%" y1="42%" x2="22%" y2="28%" />
          <line x1="50%" y1="42%" x2="78%" y2="28%" />
          <line x1="50%" y1="42%" x2="20%" y2="56%" />
          <line x1="50%" y1="42%" x2="80%" y2="56%" />
          <line x1="50%" y1="42%" x2="24%" y2="80%" />
          <line x1="50%" y1="42%" x2="42%" y2="82%" />
          <line x1="50%" y1="42%" x2="76%" y2="80%" />
          <line x1="50%" y1="42%" x2="58%" y2="82%" />
        </svg>

        {/* Warm Furnace Radius Heating Glow */}
        <div
          className="absolute rounded-full bg-amber-500/20 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-700 animate-pulse"
          style={{
            left: '50%',
            top: '42%',
            width: `${Math.min(380, 180 + (buildingLevels.furnace || 1) * 35)}px`,
            height: `${Math.min(380, 180 + (buildingLevels.furnace || 1) * 35)}px`
          }}
        />

        {/* MAP BUILDINGS PLACEMENT */}
        {buildings.map((bld) => {
          const Icon = bld.icon;
          const tier = bld.level >= 5 ? 3 : bld.level >= 3 ? 2 : 1;
          const isAnimatingThis = animatingBuildingId === bld.id;

          return (
            <div
              key={bld.id}
              onClick={() => {
                setUserFeedback(null);
                setSelectedBuildingId(bld.id);
              }}
              style={{ left: `${bld.posX}%`, top: `${bld.posY}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10 hover:z-30 transition-all duration-300"
            >
              {/* Localized Upgrade Flash Animation Overlay */}
              {isAnimatingThis && (
                <div className="absolute inset-0 rounded-2xl ring-4 ring-amber-400 animate-ping pointer-events-none z-40 shadow-[0_0_30px_rgba(245,158,11,0.9)]" />
              )}

              {/* Building Card Container */}
              <div
                className={`relative flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-2xl transition-all duration-300 transform group-hover:scale-110 shadow-2xl ${
                  isAnimatingThis
                    ? 'ring-4 ring-amber-400 bg-amber-950/80 scale-110'
                    : bld.id === 'furnace'
                    ? 'w-20 h-20 sm:w-28 sm:h-28 bg-slate-900/90 border-2 border-amber-500/80 ring-4 ring-amber-500/20'
                    : 'w-16 h-16 sm:w-22 sm:h-22 bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400 hover:ring-2 hover:ring-cyan-400/30'
                }`}
              >
                {/* Custom Image with onError Safe Fallback to Icon */}
                {bld.image && !failedImages[bld.id] ? (
                  <img
                    src={bld.image}
                    alt={bld.name}
                    referrerPolicy="no-referrer"
                    onError={() => setFailedImages((prev) => ({ ...prev, [bld.id]: true }))}
                    className="w-full h-full object-cover rounded-xl border border-slate-800"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/60 flex flex-col items-center justify-center p-1 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-400/10 rounded-bl-full pointer-events-none" />
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mb-0.5 ${bld.id === 'furnace' ? 'text-amber-400' : 'text-cyan-300'}`} />
                  </div>
                )}

                {/* Level Badge Overlay */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-amber-300 font-mono">
                  LVL {bld.level}
                </div>

                {/* Building Tier Sparkles / Glow for high tiers */}
                {tier >= 2 && (
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-60 pointer-events-none" />
                )}

                {/* Building Label Tag on Hover */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-slate-700 px-2.5 py-0.5 rounded-full whitespace-nowrap opacity-95 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none flex items-center gap-1">
                  <span className="text-[10px] font-extrabold text-white tracking-tight">{bld.name}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Animated Snowfall Particle Effect Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute top-2 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          <div className="absolute top-12 left-2/3 w-2 h-2 bg-cyan-100 rounded-full animate-ping delay-300" />
          <div className="absolute top-24 left-1/2 w-1 h-1 bg-white rounded-full animate-ping delay-700" />
          <div className="absolute top-36 left-4/5 w-1.5 h-1.5 bg-white rounded-full animate-ping delay-500" />
        </div>
      </div>

      {/* 3. INSPECTOR POPOVER MODAL WHEN CLICKING A BUILDING */}
      {selectedBuilding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-950 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <selectedBuilding.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{selectedBuilding.name}</h3>
                  <span className="text-xs text-amber-300 font-bold uppercase">{selectedBuilding.type}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setUserFeedback(null);
                  setSelectedBuildingId(null);
                }}
                className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Optional Status Banner */}
            {userFeedback && (
              <div
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                  userFeedback.type === 'error'
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                    : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                }`}
              >
                {userFeedback.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                )}
                <span>{userFeedback.message}</span>
              </div>
            )}

            {/* Building Image Preview */}
            {selectedBuilding.image && !failedImages[selectedBuilding.id] && (
              <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-slate-800">
                <img
                  src={selectedBuilding.image}
                  alt={selectedBuilding.name}
                  referrerPolicy="no-referrer"
                  onError={() => setFailedImages((prev) => ({ ...prev, [selectedBuilding.id]: true }))}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-amber-400 border border-amber-500/40">
                  POZIOM {selectedBuilding.level}
                </div>
              </div>
            )}

            {/* Description & Current Bonus */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 leading-relaxed">{selectedBuilding.desc}</p>
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 text-amber-300 font-bold">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <span>BONUS: {selectedBuilding.bonus}</span>
              </div>
            </div>

            {/* Upgrade Requirements */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-extrabold text-white flex items-center justify-between">
                <span>Wymagania Ulepszenia do Poziomu {selectedBuilding.level + 1}:</span>
                <span className="text-[10px] text-slate-400 font-normal">Zsynchronizowane z portalem</span>
              </h4>

              {/* Requirement 1: Likes Received */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> ❤️ Otrzymane Polubienia
                  </span>
                  <span className={`font-mono font-bold ${activeStats.likesReceived >= selectedBuilding.reqLikesReceived ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {activeStats.likesReceived} / {selectedBuilding.reqLikesReceived}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-rose-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (activeStats.likesReceived / selectedBuilding.reqLikesReceived) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Requirement 2: Likes Given */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 👍 Rozdane Polubienia
                  </span>
                  <span className={`font-mono font-bold ${activeStats.likesGiven >= selectedBuilding.reqLikesGiven ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {activeStats.likesGiven} / {selectedBuilding.reqLikesGiven}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (activeStats.likesGiven / selectedBuilding.reqLikesGiven) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Requirement 3: Comments Written */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> 💬 Napisane Komentarze
                  </span>
                  <span className={`font-mono font-bold ${activeStats.commentsWritten >= selectedBuilding.reqComments ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {activeStats.commentsWritten} / {selectedBuilding.reqComments}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (activeStats.commentsWritten / selectedBuilding.reqComments) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isReadOnly && (
              <button
                disabled={Boolean(upgradingBuildingId)}
                onClick={() => handleUpgradeBuilding(selectedBuilding)}
                className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  upgradingBuildingId === selectedBuilding.id
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    : activeStats.likesReceived >= selectedBuilding.reqLikesReceived &&
                      activeStats.likesGiven >= selectedBuilding.reqLikesGiven &&
                      activeStats.commentsWritten >= selectedBuilding.reqComments
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-black shadow-amber-500/20 active:scale-98'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:bg-slate-800'
                }`}
              >
                {upgradingBuildingId === selectedBuilding.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>ULEPSZANIE...</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4 stroke-[3]" />
                    <span>
                      {activeStats.likesReceived >= selectedBuilding.reqLikesReceived &&
                      activeStats.likesGiven >= selectedBuilding.reqLikesGiven &&
                      activeStats.commentsWritten >= selectedBuilding.reqComments
                        ? `ULEPSZ DO POZIOMU ${selectedBuilding.level + 1}`
                        : `BRAKUJE ZASOBÓW DO POZIOMU ${selectedBuilding.level + 1}`}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
