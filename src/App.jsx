import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SupplementManager from './components/SupplementManager';
import SupplementInfo from './components/SupplementInfo';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import { SupProvider } from './context/SupContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'supplements':
        return <SupplementManager />;
      case 'supinfo':
        return <SupplementInfo />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SupProvider>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
    </SupProvider>
  );
}

export default App;
