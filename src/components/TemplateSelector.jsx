import { useState } from 'react'
import { FaPalette, FaCheck } from 'react-icons/fa'

export const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean single-column with blue accents',
    gradient: 'from-blue-500 to-blue-700',
    layout: 'single',
    primary: '#2563eb',
    accent: '#1d4ed8',
    headerBg: '#2563eb',
    headerText: '#ffffff',
    sectionBorder: '#bfdbfe',
    skillBg: '#eff6ff',
    skillBorder: '#bfdbfe',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#64748b',
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional serif with black borders',
    gradient: 'from-gray-700 to-gray-900',
    layout: 'single',
    primary: '#1a1a1a',
    accent: '#1a1a1a',
    headerBg: 'transparent',
    headerText: '#1a1a1a',
    sectionBorder: '#d1d5db',
    skillBg: '#f3f4f6',
    skillBorder: '#e5e7eb',
    textPrimary: '#1a1a1a',
    textSecondary: '#4b5563',
    textMuted: '#6b7280',
    fontFamily: "'Georgia', serif",
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold two-column with colorful sidebar',
    gradient: 'from-emerald-400 to-teal-600',
    layout: 'two-column',
    primary: '#0d9488',
    accent: '#14b8a6',
    headerBg: '#0d9488',
    headerText: '#ffffff',
    sectionBorder: '#99f6e4',
    skillBg: '#f0fdfa',
    skillBorder: '#99f6e4',
    textPrimary: '#134e4a',
    textSecondary: '#115e59',
    textMuted: '#6b7280',
    fontFamily: "'Poppins', sans-serif",
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean with plenty of whitespace',
    gradient: 'from-gray-200 to-gray-400',
    layout: 'single',
    primary: '#374151',
    accent: '#6b7280',
    headerBg: 'transparent',
    headerText: '#111827',
    sectionBorder: '#e5e7eb',
    skillBg: '#f9fafb',
    skillBorder: '#f3f4f6',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textMuted: '#9ca3af',
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Elegant navy with gold accents',
    gradient: 'from-indigo-800 to-blue-900',
    layout: 'single',
    primary: '#1e3a5f',
    accent: '#b8860b',
    headerBg: '#1e3a5f',
    headerText: '#ffffff',
    sectionBorder: '#c7d2fe',
    skillBg: '#eef2ff',
    skillBorder: '#c7d2fe',
    textPrimary: '#1e3a5f',
    textSecondary: '#334155',
    textMuted: '#64748b',
    fontFamily: "'Playfair Display', serif",
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Balanced layout with subtle styling',
    gradient: 'from-slate-600 to-slate-800',
    layout: 'single',
    primary: '#334155',
    accent: '#475569',
    headerBg: '#334155',
    headerText: '#ffffff',
    sectionBorder: '#cbd5e1',
    skillBg: '#f8fafc',
    skillBorder: '#e2e8f0',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Refined style with decorative elements',
    gradient: 'from-rose-400 to-pink-600',
    layout: 'single',
    primary: '#9f1239',
    accent: '#be123c',
    headerBg: 'transparent',
    headerText: '#9f1239',
    sectionBorder: '#fecdd3',
    skillBg: '#fff1f2',
    skillBorder: '#fecdd3',
    textPrimary: '#1c1917',
    textSecondary: '#57534e',
    textMuted: '#78716c',
    fontFamily: "'Playfair Display', serif",
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Bold two-column with dark sidebar',
    gradient: 'from-red-500 to-orange-600',
    layout: 'two-column',
    primary: '#dc2626',
    accent: '#ea580c',
    headerBg: '#1f2937',
    headerText: '#ffffff',
    sectionBorder: '#fca5a5',
    skillBg: '#fef2f2',
    skillBorder: '#fecaca',
    textPrimary: '#1f2937',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    fontFamily: "'Montserrat', sans-serif",
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Developer-friendly with monospace accents',
    gradient: 'from-violet-500 to-purple-700',
    layout: 'single',
    primary: '#7c3aed',
    accent: '#6d28d9',
    headerBg: '#7c3aed',
    headerText: '#ffffff',
    sectionBorder: '#c4b5fd',
    skillBg: '#f5f3ff',
    skillBorder: '#ddd6fe',
    textPrimary: '#1e1b4b',
    textSecondary: '#4c1d95',
    textMuted: '#6b7280',
    fontFamily: "'JetBrains Mono', monospace",
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Scholarly style for academia',
    gradient: 'from-amber-600 to-yellow-700',
    layout: 'single',
    primary: '#92400e',
    accent: '#b45309',
    headerBg: 'transparent',
    headerText: '#78350f',
    sectionBorder: '#fde68a',
    skillBg: '#fffbeb',
    skillBorder: '#fde68a',
    textPrimary: '#1c1917',
    textSecondary: '#44403c',
    textMuted: '#78716c',
    fontFamily: "'Merriweather', serif",
  },
  {
    id: 'infographic',
    name: 'Infographic',
    description: 'Visual style with progress bars and icons',
    gradient: 'from-cyan-400 to-blue-500',
    layout: 'two-column',
    primary: '#0891b2',
    accent: '#06b6d4',
    headerBg: '#0891b2',
    headerText: '#ffffff',
    sectionBorder: '#a5f3fc',
    skillBg: '#ecfeff',
    skillBorder: '#a5f3fc',
    textPrimary: '#164e63',
    textSecondary: '#155e75',
    textMuted: '#6b7280',
    fontFamily: "'Nunito', sans-serif",
  },
  {
    id: 'darkmode',
    name: 'Dark Mode',
    description: 'Dark background with vibrant accents',
    gradient: 'from-gray-800 to-gray-950',
    layout: 'single',
    primary: '#e2e8f0',
    accent: '#60a5fa',
    headerBg: '#111827',
    headerText: '#f9fafb',
    sectionBorder: '#374151',
    skillBg: '#1f2937',
    skillBorder: '#374151',
    textPrimary: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    fontFamily: "'Inter', sans-serif",
    bgColor: '#111827',
  },
]

export default function TemplateSelector({ activeTemplateId, onSelect }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
            <FaPalette size={12} className="text-purple-600" />
          </div>
          Choose Template
          <span className="text-xs font-normal text-gray-400">12 professional designs</span>
        </h3>
        {activeTemplateId && (
          <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full font-medium capitalize">
            {templates.find(t => t.id === activeTemplateId)?.name}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
              activeTemplateId === template.id
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95'
            }`}
          >
            <div
              className={`w-full aspect-[3/4] rounded-lg bg-gradient-to-br ${template.gradient} relative overflow-hidden`}
            >
              {/* Mini preview lines */}
              <div className="absolute inset-1.5 flex flex-col gap-0.5">
                <div className="h-2 bg-white/30 rounded-sm w-3/4 mx-auto" />
                <div className="h-1 bg-white/20 rounded-sm w-1/2 mx-auto" />
                <div className="flex-1 mt-1 space-y-0.5">
                  <div className="h-0.5 bg-white/20 rounded-sm w-full" />
                  <div className="h-0.5 bg-white/20 rounded-sm w-5/6" />
                  <div className="h-0.5 bg-white/20 rounded-sm w-4/6" />
                  <div className="h-0.5 bg-white/15 rounded-sm w-full mt-1" />
                  <div className="h-0.5 bg-white/15 rounded-sm w-5/6" />
                </div>
              </div>
              {activeTemplateId === template.id && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaCheck size={10} className="text-white" />
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-600 leading-tight text-center font-medium">
              {template.name}
            </span>
          </button>
        ))}
      </div>
      {activeTemplateId && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          {templates.find(t => t.id === activeTemplateId)?.description}
        </p>
      )}
    </div>
  )
}
