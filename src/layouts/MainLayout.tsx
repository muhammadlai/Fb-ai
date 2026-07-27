import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';
import { ToastContainer } from '../components/common/ToastContainer';
import { EnterpriseDock } from '../components/dock/EnterpriseDock';
import { FloatingAIAssistant } from '../components/assistant/FloatingAIAssistant';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#080711] text-slate-100 flex overflow-hidden cyber-grid-bg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Background glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-[120px] pointer-events-none" />

        {/* Top Navigation */}
        <TopNavigation />

        {/* Page Outlet Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-28 md:pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Persistent Enterprise Floating AI Assistant */}
      <FloatingAIAssistant />

      {/* Persistent Enterprise Bottom Dock */}
      <EnterpriseDock />

      {/* Global Toast System */}
      <ToastContainer />
    </div>
  );
}
