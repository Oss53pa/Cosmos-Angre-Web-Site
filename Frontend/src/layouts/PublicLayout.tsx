import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/common/PageTransition';

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
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
