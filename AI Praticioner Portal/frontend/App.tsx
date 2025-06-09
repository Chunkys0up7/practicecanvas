
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './constants';
import DashboardPage from './pages/DashboardPage';
import ComponentLibraryPage from './pages/ComponentLibraryPage';
import AgentBuilderPage from './pages/AgentBuilderPage';
import CodeGeneratorPage from './pages/CodeGeneratorPage';
import DeploymentPage from './pages/DeploymentPage';
import { Layers } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <aside className="w-64 bg-gray-800 p-4 space-y-4 border-r border-gray-700 flex flex-col">
        <div className="text-2xl font-bold text-white flex items-center mb-6">
          <Layers size={28} className="mr-2 text-indigo-400" />
          AI Canvas
        </div>
        <nav className="flex-grow">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="text-xs text-gray-500 mt-auto">
          Version 0.1.0
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/components" element={<ComponentLibraryPage />} />
          <Route path="/builder" element={<AgentBuilderPage />} />
          <Route path="/codegen" element={<CodeGeneratorPage />} />
          <Route path="/deploy" element={<DeploymentPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
