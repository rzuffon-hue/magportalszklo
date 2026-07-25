import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { FracturedPortalHome } from './components/FracturedPortal/FracturedPortalHome';
import { ScianaView } from './components/Views/ScianaView';
import { CzatyView } from './components/Views/CzatyView';
import { ReelsView } from './components/Views/ReelsView';
import { GrupyView } from './components/Views/GrupyView';
import { GryView } from './components/Views/GryView';
import { WydarzeniaView } from './components/Views/WydarzeniaView';
import { ProfilView } from './components/Views/ProfilView';
import { AdminPanelView } from './components/Views/AdminPanelView';

const MainContent: React.FC = () => {
  const { activeView, isAuthenticated } = useApp();

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#030508] text-slate-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col overscroll-none">
      <Header />

      <main className="relative z-10 flex-1 min-h-0 w-full overflow-hidden flex flex-col">
        {!isAuthenticated || activeView === 'home' ? (
          <FracturedPortalHome />
        ) : (
          <div className="flex-1 min-h-0 w-full app-scroll-container pt-14">
            {activeView === 'sciana' && <ScianaView />}
            {activeView === 'czaty' && <CzatyView />}
            {activeView === 'reels' && <ReelsView />}
            {activeView === 'grupy' && <GrupyView />}
            {activeView === 'gry' && <GryView />}
            {activeView === 'wydarzenia' && <WydarzeniaView />}
            {activeView === 'profil' && <ProfilView />}
            {activeView === 'admin' && <AdminPanelView />}
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
