import { useState, FC } from 'react';
import {
  Wand2,
  Globe,
  Layout,
  LayoutDashboard,
  Users,
  Briefcase,
  Smartphone,
  Monitor,
  Bot,
  Workflow,
  Sparkles,
  Image as ImageIcon,
  Video,
  Database,
  Code2,
  Server,
  Cpu,
  Container,
  GitBranch,
  Network,
  History,
  Layers,
  Zap,
} from 'lucide-react';
import { useCreatorStore } from '../store/useCreatorStore';
import { CREATOR_MODULES } from '../data/modulesAndTemplates';
import { ModuleCategory, ModuleId } from '../types/creator';
import { PromptBuilderBar } from './PromptBuilderBar';
import { TechSelector } from './TechSelector';
import { ProjectPreviewCanvas } from './ProjectPreviewCanvas';
import { HistoryPanel } from './HistoryPanel';
import { ModuleWizardModal } from './ModuleWizardModal';

export const CreatorStudioDashboard: FC = () => {
  const {
    activeModuleId,
    setActiveModuleId,
    activeCategory,
    setActiveCategory,
    openWizard,
  } = useCreatorStore();

  const [activeViewTab, setActiveViewTab] = useState<'studio' | 'history'>('studio');

  const renderModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'Layout': return <Layout className="w-5 h-5 text-sky-400" />;
      case 'LayoutDashboard': return <LayoutDashboard className="w-5 h-5 text-indigo-400" />;
      case 'Users': return <Users className="w-5 h-5 text-blue-400" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-emerald-400" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-purple-400" />;
      case 'Monitor': return <Monitor className="w-5 h-5 text-teal-400" />;
      case 'Bot': return <Bot className="w-5 h-5 text-rose-400" />;
      case 'Workflow': return <Workflow className="w-5 h-5 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-pink-400" />;
      case 'Image': return <ImageIcon className="w-5 h-5 text-violet-400" />;
      case 'Video': return <Video className="w-5 h-5 text-red-400" />;
      case 'Database': return <Database className="w-5 h-5 text-yellow-400" />;
      case 'Code2': return <Code2 className="w-5 h-5 text-cyan-300" />;
      case 'Server': return <Server className="w-5 h-5 text-green-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-orange-400" />;
      case 'Container': return <Container className="w-5 h-5 text-blue-500" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5 text-slate-300" />;
      case 'Network': return <Network className="w-5 h-5 text-emerald-300" />;
      default: return <Wand2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  const categories: { id: ModuleCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All 19 Modules' },
    { id: 'frontend_web', label: 'Frontend Web' },
    { id: 'enterprise_apps', label: 'Enterprise Apps' },
    { id: 'backend_data', label: 'Backend & Data' },
    { id: 'devops_cloud', label: 'DevOps & Cloud' },
    { id: 'ai_automation', label: 'AI & Automation' },
    { id: 'visual_creative', label: 'Visual & Media' },
  ];

  const filteredModules = CREATOR_MODULES.filter((m) =>
    activeCategory === 'all' ? true : m.category === activeCategory
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono uppercase tracking-wider">
              Phase 3 AI Creator Studio Live
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-cyan-400" />
            AI Creator Studio Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            19 specialized AI generators for Websites, CRMs, ERPs, Mobile Apps, AI Agents, APIs, Microservices, Databases, Docker, and Architecture Diagrams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveViewTab('studio')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeViewTab === 'studio'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Studio Generators
          </button>
          <button
            onClick={() => setActiveViewTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeViewTab === 'history'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History & Templates</span>
          </button>
        </div>
      </div>

      {activeViewTab === 'history' ? (
        <HistoryPanel />
      ) : (
        <div className="space-y-6">
          {/* Category Filters */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Module Selector Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto p-1">
            {filteredModules.map((mod) => {
              const isActive = activeModuleId === mod.id;

              return (
                <div
                  key={mod.id}
                  onClick={() => setActiveModuleId(mod.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/40 scale-[1.01]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                        {renderModuleIcon(mod.iconName)}
                      </div>
                      {mod.badge && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          {mod.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-100">{mod.name}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                      {mod.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{mod.defaultTechStack.length} Techs</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModuleId(mod.id);
                        openWizard();
                      }}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      Wizard →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive AI Prompt Bar */}
          <PromptBuilderBar />

          {/* Technology Selector Stack Badges */}
          <TechSelector />

          {/* Generated Architecture Live Canvas & File Tree Preview */}
          <ProjectPreviewCanvas />
        </div>
      )}

      {/* Module Wizard Modal */}
      <ModuleWizardModal />
    </div>
  );
};
