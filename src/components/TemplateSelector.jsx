import { useState } from 'react'
import { FaPalette, FaCheck } from 'react-icons/fa'
import { useTranslation } from '../TranslationContext'

export const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Single column, centered header, blue accents',
    gradient: 'from-blue-500 to-blue-700',
    layout: 'single-center',
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
    description: 'Single column, serif font, traditional borders',
    gradient: 'from-gray-700 to-gray-900',
    layout: 'single-traditional',
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
    description: 'Two-column with colored left sidebar (35/65)',
    gradient: 'from-emerald-400 to-teal-600',
    layout: 'sidebar-left',
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
    description: 'Ultra-clean, left-aligned, lots of whitespace',
    gradient: 'from-gray-200 to-gray-400',
    layout: 'minimal',
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
    description: 'Full-width dark header banner, gold accents',
    gradient: 'from-indigo-800 to-blue-900',
    layout: 'banner',
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
    description: 'Banner header, two-tone design',
    gradient: 'from-slate-600 to-slate-800',
    layout: 'banner',
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
    description: 'Centered script-style header, decorative dividers',
    gradient: 'from-rose-400 to-pink-600',
    layout: 'elegant',
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
    description: 'Two-column with dark left sidebar, bright accent',
    gradient: 'from-red-500 to-orange-600',
    layout: 'sidebar-left-dark',
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
    description: 'Monospace header, left-border accents, terminal style',
    gradient: 'from-violet-500 to-purple-700',
    layout: 'tech',
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
    description: 'Traditional academic CV, numbered sections, serif',
    gradient: 'from-amber-600 to-yellow-700',
    layout: 'academic',
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
    description: 'Two-column with right sidebar (65/35), icons prominent',
    gradient: 'from-cyan-400 to-blue-500',
    layout: 'sidebar-right',
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
    description: 'Full dark background, neon accent colors',
    gradient: 'from-gray-800 to-gray-950',
    layout: 'dark',
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
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Left timeline line connecting all experience entries',
    gradient: 'from-green-500 to-emerald-700',
    layout: 'timeline',
    primary: '#059669',
    accent: '#10b981',
    headerBg: 'transparent',
    headerText: '#064e3b',
    sectionBorder: '#a7f3d0',
    skillBg: '#ecfdf5',
    skillBorder: '#a7f3d0',
    textPrimary: '#064e3b',
    textSecondary: '#065f46',
    textMuted: '#6b7280',
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Dense, small font, maximum content in one page',
    gradient: 'from-zinc-500 to-zinc-700',
    layout: 'compact',
    primary: '#27272a',
    accent: '#3f3f46',
    headerBg: 'transparent',
    headerText: '#18181b',
    sectionBorder: '#d4d4d8',
    skillBg: '#f4f4f5',
    skillBorder: '#e4e4e7',
    textPrimary: '#18181b',
    textSecondary: '#3f3f46',
    textMuted: '#71717a',
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: 'magazine',
    name: 'Magazine',
    description: 'Large header image area, editorial style, large name',
    gradient: 'from-fuchsia-500 to-pink-600',
    layout: 'magazine',
    primary: '#a21caf',
    accent: '#c026d3',
    headerBg: '#fdf4ff',
    headerText: '#701a75',
    sectionBorder: '#f0abfc',
    skillBg: '#fdf4ff',
    skillBorder: '#f0abfc',
    textPrimary: '#1c1917',
    textSecondary: '#44403c',
    textMuted: '#78716c',
    fontFamily: "'Playfair Display', serif",
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Gradient header that fades to white, modern curves',
    gradient: 'from-sky-400 to-indigo-500',
    layout: 'gradient-header',
    primary: '#4f46e5',
    accent: '#6366f1',
    headerBg: '#4f46e5',
    headerText: '#ffffff',
    sectionBorder: '#c7d2fe',
    skillBg: '#eef2ff',
    skillBorder: '#c7d2fe',
    textPrimary: '#1e1b4b',
    textSecondary: '#312e81',
    textMuted: '#6366f1',
    fontFamily: "'Inter', sans-serif",
    accentGradient: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
  },
  {
    id: 'split',
    name: 'Split',
    description: 'Exact 50/50 split, left info, right content',
    gradient: 'from-orange-400 to-red-500',
    layout: 'split-50',
    primary: '#ea580c',
    accent: '#f97316',
    headerBg: '#7c2d12',
    headerText: '#ffffff',
    sectionBorder: '#fed7aa',
    skillBg: '#fff7ed',
    skillBorder: '#fed7aa',
    textPrimary: '#1c1917',
    textSecondary: '#44403c',
    textMuted: '#78716c',
    fontFamily: "'Poppins', sans-serif",
  },
  {
    id: 'metro',
    name: 'Metro',
    description: 'Card-based layout, each section in its own card',
    gradient: 'from-teal-400 to-green-500',
    layout: 'metro-cards',
    primary: '#0f766e',
    accent: '#14b8a6',
    headerBg: '#f0fdfa',
    headerText: '#134e4a',
    sectionBorder: '#99f6e4',
    skillBg: '#f0fdfa',
    skillBorder: '#99f6e4',
    textPrimary: '#134e4a',
    textSecondary: '#115e59',
    textMuted: '#6b7280',
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: 'ribbon',
    name: 'Ribbon',
    description: 'Colored ribbon/tab for each section heading',
    gradient: 'from-blue-600 to-purple-600',
    layout: 'ribbon',
    primary: '#4338ca',
    accent: '#6366f1',
    headerBg: '#4338ca',
    headerText: '#ffffff',
    sectionBorder: '#a5b4fc',
    skillBg: '#eef2ff',
    skillBorder: '#c7d2fe',
    textPrimary: '#1e1b4b',
    textSecondary: '#312e81',
    textMuted: '#6b7280',
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: 'asymmetric',
    name: 'Asymmetric',
    description: 'Staggered layout, alternating left/right alignment',
    gradient: 'from-lime-400 to-green-600',
    layout: 'asymmetric',
    primary: '#15803d',
    accent: '#22c55e',
    headerBg: 'transparent',
    headerText: '#14532d',
    sectionBorder: '#bbf7d0',
    skillBg: '#f0fdf4',
    skillBorder: '#bbf7d0',
    textPrimary: '#14532d',
    textSecondary: '#166534',
    textMuted: '#6b7280',
    fontFamily: "'Inter', sans-serif",
  },
]

const TEMPLATE_NAMES_I18N = {
  'en-US': { modern: 'Modern', classic: 'Classic', creative: 'Creative', minimal: 'Minimal', executive: 'Executive', professional: 'Professional', elegant: 'Elegant', bold: 'Bold', tech: 'Tech', academic: 'Academic', infographic: 'Infographic', darkmode: 'Dark Mode', timeline: 'Timeline', compact: 'Compact', magazine: 'Magazine', gradient: 'Gradient', split: 'Split', metro: 'Metro', ribbon: 'Ribbon', asymmetric: 'Asymmetric' },
  'es': { modern: 'Moderno', classic: 'Clásico', creative: 'Creativo', minimal: 'Minimalista', executive: 'Ejecutivo', professional: 'Profesional', elegant: 'Elegante', bold: 'Audaz', tech: 'Tecnológico', academic: 'Académico', infographic: 'Infográfico', darkmode: 'Modo Oscuro', timeline: 'Línea de Tiempo', compact: 'Compacto', magazine: 'Revista', gradient: 'Degradado', split: 'Dividido', metro: 'Metro', ribbon: 'Cinta', asymmetric: 'Asimétrico' },
  'fr': { modern: 'Moderne', classic: 'Classique', creative: 'Créatif', minimal: 'Minimaliste', executive: 'Exécutif', professional: 'Professionnel', elegant: 'Élégant', bold: 'Audacieux', tech: 'Technique', academic: 'Académique', infographic: 'Infographie', darkmode: 'Mode Sombre', timeline: 'Chronologie', compact: 'Compact', magazine: 'Magazine', gradient: 'Dégradé', split: 'Divisé', metro: 'Métro', ribbon: 'Ruban', asymmetric: 'Asymétrique' },
  'de': { modern: 'Modern', classic: 'Klassisch', creative: 'Kreativ', minimal: 'Minimalistisch', executive: 'Führungskraft', professional: 'Professionell', elegant: 'Elegant', bold: 'Kühn', tech: 'Technisch', academic: 'Akademisch', infographic: 'Infografik', darkmode: 'Dunkelmodus', timeline: 'Zeitleiste', compact: 'Kompakt', magazine: 'Magazin', gradient: 'Verlauf', split: 'Geteilt', metro: 'Metro', ribbon: 'Band', asymmetric: 'Asymmetrisch' },
  'ja': { modern: 'モダン', classic: 'クラシック', creative: 'クリエイティブ', minimal: 'ミニマル', executive: 'エグゼクティブ', professional: 'プロ', elegant: 'エレガント', bold: 'ボールド', tech: 'テック', academic: 'アカデミック', infographic: 'インフォ', darkmode: 'ダーク', timeline: 'タイムライン', compact: 'コンパクト', magazine: 'マガジン', gradient: 'グラデーション', split: 'スプリット', metro: 'メトロ', ribbon: 'リボン', asymmetric: '非対称' },
  'zh': { modern: '现代', classic: '经典', creative: '创意', minimal: '极简', executive: '高管', professional: '专业', elegant: '优雅', bold: '大胆', tech: '科技', academic: '学术', infographic: '信息图', darkmode: '深色', timeline: '时间线', compact: '紧凑', magazine: '杂志', gradient: '渐变', split: '分割', metro: '卡片', ribbon: '丝带', asymmetric: '不对称' },
  'ko': { modern: '모던', classic: '클래식', creative: '크리에이티브', minimal: '미니멀', executive: '임원', professional: '프로', elegant: '엘레강스', bold: '볼드', tech: '테크', academic: '학술', infographic: '인포', darkmode: '다크', timeline: '타임라인', compact: '컴팩트', magazine: '매거진', gradient: '그라디언트', split: '스플릿', metro: '메트로', ribbon: '리본', asymmetric: '비대칭' },
  'ar': { modern: 'حديث', classic: 'كلاسيكي', creative: 'إبداعي', minimal: 'بسيط', executive: 'تنفيذي', professional: 'مهني', elegant: 'أنيق', bold: 'جريء', tech: 'تقني', academic: 'أكاديمي', infographic: 'إنفو', darkmode: 'داكن', timeline: 'زمني', compact: 'مضغوط', magazine: 'مجلة', gradient: 'تدرج', split: 'مقسم', metro: 'بطاقات', ribbon: 'شريط', asymmetric: 'غير متماثل' },
  'ru': { modern: 'Современный', classic: 'Классика', creative: 'Креатив', minimal: 'Минимал', executive: 'Руководитель', professional: 'Профи', elegant: 'Элегант', bold: 'Смелый', tech: 'Тех', academic: 'Академ', infographic: 'Инфо', darkmode: 'Тёмный', timeline: 'Хронология', compact: 'Компакт', magazine: 'Журнал', gradient: 'Градиент', split: 'Сплит', metro: 'Метро', ribbon: 'Лента', asymmetric: 'Асимметрия' },
}

function getTemplateName(templateId, lang) {
  const langKey = lang?.startsWith('en-') ? 'en-US' : lang?.startsWith('es') ? 'es' : lang?.startsWith('fr') ? 'fr' : (TEMPLATE_NAMES_I18N[lang] ? lang : 'en-US')
  return TEMPLATE_NAMES_I18N[langKey]?.[templateId] || templateId
}

function TemplatePreviewMini({ layoutId }) {
  const line = "h-0.5 bg-white/20 rounded-sm"
  const thickLine = "h-1 bg-white/25 rounded-sm"
  const header = "h-2 bg-white/30 rounded-sm"

  // Sidebar left (creative, bold)
  if (['creative', 'bold', 'split'].includes(layoutId)) {
    return (
      <div className="absolute inset-0 flex">
        <div className="w-[35%] bg-black/20 p-1.5 space-y-1">
          <div className="h-1.5 bg-white/30 rounded-sm w-full" />
          <div className="h-0.5 bg-white/15 rounded-sm w-3/4" />
          <div className="mt-1.5 space-y-0.5">
            <div className="h-0.5 bg-white/15 rounded-sm w-full" />
            <div className="h-0.5 bg-white/15 rounded-sm w-2/3" />
          </div>
        </div>
        <div className="flex-1 p-1.5 space-y-1">
          <div className={`${thickLine} w-full`} />
          <div className={`${line} w-5/6`} />
          <div className={`${line} w-4/6`} />
          <div className={`${thickLine} w-full mt-1`} />
          <div className={`${line} w-5/6`} />
        </div>
      </div>
    )
  }

  // Sidebar right (infographic)
  if (layoutId === 'infographic') {
    return (
      <div className="absolute inset-0 flex">
        <div className="flex-1 p-1.5 space-y-1">
          <div className="h-2 bg-white/30 rounded-sm w-full" />
          <div className={`${line} w-5/6`} />
          <div className={`${line} w-4/6`} />
          <div className={`${thickLine} w-full mt-1`} />
          <div className={`${line} w-5/6`} />
        </div>
        <div className="w-[35%] bg-black/20 p-1.5 space-y-1">
          <div className="h-0.5 bg-white/15 rounded-sm w-full" />
          <div className="h-0.5 bg-white/15 rounded-sm w-2/3" />
          <div className="mt-1 space-y-0.5">
            <div className="h-0.5 bg-white/15 rounded-sm w-full" />
            <div className="h-0.5 bg-white/15 rounded-sm w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  // Banner header (executive, professional, magazine)
  if (['executive', 'professional', 'magazine'].includes(layoutId)) {
    return (
      <div className="absolute inset-0 flex flex-col">
        <div className="bg-black/20 p-1.5 pb-2">
          <div className="h-2 bg-white/35 rounded-sm w-3/4" />
          <div className="h-0.5 bg-white/20 rounded-sm w-1/2 mt-0.5" />
        </div>
        <div className="flex-1 p-1.5 space-y-0.5">
          <div className={`${thickLine} w-full`} />
          <div className={`${line} w-5/6`} />
          <div className={`${line} w-4/6`} />
          <div className={`${thickLine} w-full mt-1`} />
          <div className={`${line} w-5/6`} />
        </div>
      </div>
    )
  }

  // Gradient header (gradient)
  if (layoutId === 'gradient') {
    return (
      <div className="absolute inset-0 flex flex-col">
        <div className="bg-black/15 p-1.5 pb-2 rounded-b-lg">
          <div className="h-2 bg-white/35 rounded-sm w-3/4" />
          <div className="h-0.5 bg-white/20 rounded-sm w-1/2 mt-0.5" />
        </div>
        <div className="flex-1 p-1.5 space-y-0.5">
          <div className={`${thickLine} w-full`} />
          <div className={`${line} w-5/6`} />
          <div className={`${line} w-4/6`} />
        </div>
      </div>
    )
  }

  // Timeline (timeline)
  if (layoutId === 'timeline') {
    return (
      <div className="absolute inset-1.5 flex flex-col">
        <div className="h-2 bg-white/30 rounded-sm w-3/4 mx-auto mb-1" />
        <div className="flex-1 flex">
          <div className="w-1 flex flex-col items-center mx-1">
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="w-0.5 flex-1 bg-white/20" />
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="w-0.5 flex-1 bg-white/20" />
            <div className="w-1 h-1 rounded-full bg-white/40" />
          </div>
          <div className="flex-1 space-y-1">
            <div className={`${line} w-full`} />
            <div className={`${line} w-4/5`} />
            <div className={`${line} w-full mt-1`} />
            <div className={`${line} w-4/5`} />
            <div className={`${line} w-full mt-1`} />
          </div>
        </div>
      </div>
    )
  }

  // Metro cards
  if (layoutId === 'metro') {
    return (
      <div className="absolute inset-1.5 flex flex-col gap-1">
        <div className="bg-white/15 rounded p-1 space-y-0.5">
          <div className="h-1.5 bg-white/25 rounded-sm w-3/4" />
          <div className="h-0.5 bg-white/15 rounded-sm w-1/2" />
        </div>
        <div className="bg-white/15 rounded p-1 space-y-0.5">
          <div className="h-1 bg-white/25 rounded-sm w-2/3" />
          <div className="h-0.5 bg-white/15 rounded-sm w-full" />
          <div className="h-0.5 bg-white/15 rounded-sm w-4/5" />
        </div>
        <div className="bg-white/15 rounded p-1 space-y-0.5">
          <div className="h-1 bg-white/25 rounded-sm w-1/2" />
          <div className="h-0.5 bg-white/15 rounded-sm w-full" />
        </div>
      </div>
    )
  }

  // Ribbon
  if (layoutId === 'ribbon') {
    return (
      <div className="absolute inset-1.5 flex flex-col gap-0.5">
        <div className="h-2 bg-white/30 rounded-sm w-3/4 mx-auto" />
        <div className="h-1 bg-white/20 rounded-sm w-1/2 mx-auto mb-1" />
        <div className="h-1 bg-white/40 rounded-r-sm w-1/3 -ml-0.5" />
        <div className={`${line} w-full`} />
        <div className={`${line} w-4/5`} />
        <div className="h-1 bg-white/40 rounded-r-sm w-2/5 -ml-0.5 mt-0.5" />
        <div className={`${line} w-full`} />
        <div className={`${line} w-4/5`} />
      </div>
    )
  }

  // Asymmetric
  if (layoutId === 'asymmetric') {
    return (
      <div className="absolute inset-1.5 flex flex-col gap-0.5">
        <div className="h-2 bg-white/30 rounded-sm w-3/4 ml-auto" />
        <div className="h-0.5 bg-white/15 rounded-sm w-1/2 ml-auto mb-1" />
        <div className={`${thickLine} w-full`} />
        <div className={`${line} w-5/6`} />
        <div className={`${thickLine} w-full mt-1 ml-6`} />
        <div className={`${line} w-5/6 ml-6`} />
        <div className={`${thickLine} w-full mt-1`} />
        <div className={`${line} w-4/5`} />
      </div>
    )
  }

  // Compact
  if (layoutId === 'compact') {
    return (
      <div className="absolute inset-1 flex flex-col gap-0">
        <div className="flex justify-between mb-0.5">
          <div className="h-1.5 bg-white/30 rounded-sm w-1/3" />
          <div className="space-y-0 text-right">
            <div className="h-0.5 bg-white/15 rounded-sm w-8" />
            <div className="h-0.5 bg-white/15 rounded-sm w-6 ml-auto" />
          </div>
        </div>
        <div className="space-y-0.5">
          <div className={`${line} w-full`} />
          <div className={`${line} w-5/6`} />
          <div className={`${line} w-4/6`} />
          <div className={`${line} w-full`} />
          <div className={`${line} w-5/6`} />
          <div className={`${line} w-3/6`} />
          <div className={`${line} w-full`} />
          <div className={`${line} w-4/6`} />
        </div>
      </div>
    )
  }

  // Dark mode
  if (layoutId === 'darkmode') {
    return (
      <div className="absolute inset-0 bg-gray-900/50 flex flex-col p-1.5 gap-0.5">
        <div className="h-2 bg-blue-400/40 rounded-sm w-3/4 mx-auto" />
        <div className="h-1 bg-white/15 rounded-sm w-1/2 mx-auto mb-1" />
        <div className="h-0.5 bg-blue-400/30 rounded-sm w-2/3" />
        <div className="h-0.5 bg-white/10 rounded-sm w-full" />
        <div className="h-0.5 bg-white/10 rounded-sm w-5/6" />
        <div className="h-0.5 bg-blue-400/30 rounded-sm w-2/3 mt-1" />
        <div className="h-0.5 bg-white/10 rounded-sm w-full" />
      </div>
    )
  }

  // Minimal
  if (layoutId === 'minimal') {
    return (
      <div className="absolute inset-2 flex flex-col gap-0.5">
        <div className="h-3 bg-white/25 rounded-sm w-2/3 mb-1" />
        <div className="h-0.5 bg-white/10 rounded-sm w-1/3 mb-2" />
        <div className={`${line} w-full`} />
        <div className={`${line} w-5/6`} />
        <div className={`${line} w-4/6 mt-2`} />
        <div className={`${line} w-5/6`} />
      </div>
    )
  }

  // Elegant
  if (layoutId === 'elegant') {
    return (
      <div className="absolute inset-1.5 flex flex-col items-center gap-0.5">
        <div className="h-2.5 bg-white/30 rounded-sm w-2/3 italic" />
        <div className="h-0.5 bg-white/15 rounded-sm w-1/3" />
        <div className="flex items-center gap-1 my-1">
          <div className="w-4 h-[1px] bg-white/30" />
          <div className="w-1 h-1 rounded-full bg-white/30" />
          <div className="w-4 h-[1px] bg-white/30" />
        </div>
        <div className={`${line} w-full`} />
        <div className={`${line} w-5/6`} />
        <div className={`${line} w-4/6`} />
      </div>
    )
  }

  // Tech
  if (layoutId === 'tech') {
    return (
      <div className="absolute inset-1.5 flex flex-col gap-0.5">
        <div className="h-2 bg-white/30 rounded-sm w-3/4 font-mono" />
        <div className="h-0.5 bg-white/15 rounded-sm w-1/2 mb-1" />
        <div className="flex gap-0.5">
          <div className="w-0.5 h-3 bg-white/40 rounded-sm" />
          <div className="space-y-0.5 flex-1">
            <div className={`${line} w-full`} />
            <div className={`${line} w-4/5`} />
            <div className={`${line} w-3/5`} />
          </div>
        </div>
        <div className="flex gap-0.5 mt-0.5">
          <div className="w-0.5 h-3 bg-white/40 rounded-sm" />
          <div className="space-y-0.5 flex-1">
            <div className={`${line} w-full`} />
            <div className={`${line} w-4/5`} />
          </div>
        </div>
      </div>
    )
  }

  // Default: single column centered (modern, classic, academic)
  return (
    <div className="absolute inset-1.5 flex flex-col gap-0.5">
      <div className="h-2 bg-white/30 rounded-sm w-3/4 mx-auto" />
      <div className="h-1 bg-white/20 rounded-sm w-1/2 mx-auto" />
      <div className="flex-1 mt-1 space-y-0.5">
        <div className={`${line} w-full`} />
        <div className={`${line} w-5/6`} />
        <div className={`${line} w-4/6`} />
        <div className={`${thickLine} w-full mt-1`} />
        <div className={`${line} w-5/6`} />
        <div className={`${line} w-4/6`} />
      </div>
    </div>
  )
}

export default function TemplateSelector({ activeTemplateId, onSelect }) {
  const { t, language } = useTranslation()
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
            <FaPalette size={12} className="text-purple-600" />
          </div>
          {t('template.title')}
          <span className="text-xs font-normal text-gray-400">20 {t('template.designs')}</span>
        </h3>
        {activeTemplateId && (
          <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full font-medium capitalize">
            {getTemplateName(activeTemplateId, language)}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
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
              {/* Layout-specific mini preview */}
              <TemplatePreviewMini layoutId={template.id} />
              {activeTemplateId === template.id && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaCheck size={10} className="text-white" />
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-600 leading-tight text-center font-medium">
              {getTemplateName(template.id, language)}
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
