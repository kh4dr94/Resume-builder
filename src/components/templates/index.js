import ModernTemplate from './ModernTemplate'
import ClassicTemplate from './ClassicTemplate'
import CreativeTemplate from './CreativeTemplate'
import MinimalTemplate from './MinimalTemplate'
import ExecutiveTemplate from './ExecutiveTemplate'
import ProfessionalTemplate from './ProfessionalTemplate'
import ElegantTemplate from './ElegantTemplate'

export const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean gradient header with blue accents',
    color: 'from-blue-500 to-indigo-600',
    component: ModernTemplate,
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless serif typography, elegant layout',
    color: 'from-gray-700 to-gray-900',
    component: ClassicTemplate,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold two-column with dark sidebar',
    color: 'from-slate-700 to-emerald-600',
    component: CreativeTemplate,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean with monospace accents',
    color: 'from-gray-200 to-gray-400',
    component: MinimalTemplate,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium dark header with gold accents',
    color: 'from-[#1a1a2e] to-[#d4a853]',
    component: ExecutiveTemplate,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Teal accents with sidebar skills panel',
    color: 'from-teal-500 to-cyan-600',
    component: ProfessionalTemplate,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Rose accents with decorative serif style',
    color: 'from-rose-300 to-pink-500',
    component: ElegantTemplate,
  },
]

export { ModernTemplate, ClassicTemplate, CreativeTemplate, MinimalTemplate, ExecutiveTemplate, ProfessionalTemplate, ElegantTemplate }
