import ModernTemplate from './ModernTemplate'
import ClassicTemplate from './ClassicTemplate'
import CreativeTemplate from './CreativeTemplate'

export const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary with a gradient header',
    color: 'from-blue-500 to-indigo-600',
    component: ModernTemplate,
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless and elegant serif design',
    color: 'from-gray-700 to-gray-900',
    component: ClassicTemplate,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold two-column layout with sidebar',
    color: 'from-slate-700 to-emerald-600',
    component: CreativeTemplate,
  },
]

export { ModernTemplate, ClassicTemplate, CreativeTemplate }
