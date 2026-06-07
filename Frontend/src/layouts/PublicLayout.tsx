import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PracticalBar from '../components/layout/PracticalBar';
import PageTransition from '../components/common/PageTransition';
import PageBlocks from '../components/common/PageBlocks';

const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-cosmos-warm">
      <Header />
      <main id="main-content" className={`flex-1 ${isHomePage ? '' : 'pt-16 md:pt-20'}`}>
        <PageTransition>
          <Outlet />
        </PageTransition>
        {/* Blocs additionnels gérés depuis l'admin (Console → Blocs de page) */}
        <PageBlocks />
      </main>
      <PracticalBar />
      <Footer />
    </div>
  );
};

export default PublicLayout;
