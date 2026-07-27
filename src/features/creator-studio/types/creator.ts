export type ModuleCategory =
  | 'frontend_web'
  | 'enterprise_apps'
  | 'backend_data'
  | 'devops_cloud'
  | 'ai_automation'
  | 'visual_creative';

export type ModuleId =
  | 'website'
  | 'saas'
  | 'mobile'
  | 'dashboard'
  | 'crm'
  | 'erp'
  | 'lms'
  | 'hrm'
  | 'pos'
  | 'cms'
  | 'admin'
  | 'portfolio'
  | 'resume'
  | 'logo'
  | 'image'
  | 'video_prompt'
  | 'workflow'
  | 'api'
  | 'database'
  | 'landing'
  | 'desktop'
  | 'agent'
  | 'backend'
  | 'microservice'
  | 'docker'
  | 'github_repo'
  | 'architecture';

export type TechnologyOption =
  | 'react'
  | 'nextjs'
  | 'angular'
  | 'vue'
  | 'fastapi'
  | 'express'
  | 'nestjs'
  | 'springboot'
  | 'laravel'
  | 'postgresql'
  | 'mongodb'
  | 'redis'
  | 'docker'
  | 'kubernetes'
  | 'stripe'
  | 'firebase'
  | 'tailwind';

export interface AISettings {
  model: string;
  temperature: number;
  reasoningEnabled: boolean;
  multiStepPlanning: boolean;
  systemPrompt: string;
  theme: 'dark' | 'light' | 'cyberpunk' | 'emerald' | 'amber';
}

export interface PlanningStep {
  step: number;
  title: string;
  detail: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface ModuleDefinition {
  id: ModuleId;
  name: string;
  category: ModuleCategory;
  description: string;
  iconName: string;
  badge?: string;
  defaultTechStack: TechnologyOption[];
  allowedTechStacks: TechnologyOption[];
  subModules?: string[];
  wizardSteps: {
    title: string;
    description: string;
    fields: {
      id: string;
      label: string;
      type: 'text' | 'select' | 'multiselect' | 'textarea' | 'toggle';
      options?: string[];
      defaultValue?: any;
    }[];
  }[];
}

export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  code: string;
}

export interface CodeFile {
  path: string;
  language: string;
  content: string;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
}

export interface ProjectTemplate {
  id: string;
  moduleId: ModuleId;
  name: string;
  description: string;
  techStack: TechnologyOption[];
  thumbnailUrl?: string;
  tags: string[];
  defaultPrompt: string;
  subType?: string;
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: string;
  prompt: string;
  moduleName: string;
  techStack: TechnologyOption[];
  summary: string;
  filesCount: number;
  version?: string;
}

export interface GeneratedProject {
  id: string;
  moduleId: ModuleId;
  title: string;
  description: string;
  techStack: TechnologyOption[];
  createdAt: string;
  prompt: string;
  fileTree: FileTreeNode[];
  files: CodeFile[];
  previewHtml?: string;
  architectureDiagramMarkdown?: string;
  apiDocsJson?: string;
  dockerComposeYaml?: string;
  planningSteps?: PlanningStep[];
  components?: ComponentItem[];
  theme?: string;
}
