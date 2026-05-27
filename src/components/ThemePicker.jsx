import { FaPalette, FaCheck } from 'react-icons/fa'

export const themes = [
  {
    id: 'classic',
    name: 'Classic',
    primary: '#1a1a1a',
    accent: '#1a1a1a',
    headerBorder: '#1f2937',
    sectionBorder: '#d1d5db',
    skillBg: '#f3f4f6',
    skillBorder: '#e5e7eb',
    textPrimary: '#1a1a1a',
    textSecondary: '#4b5563',
    textMuted: '#6b7280',
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    primary: '#1e40af',
    accent: '#1e40af',
    headerBorder: '#1e40af',
    sectionBorder: '#93c5fd',
    skillBg: '#eff6ff',
    skillBorder: '#bfdbfe',
    textPrimary: '#1e3a5f',
    textSecondary: '#3b6fa0',
    textMuted: '#64748b',
  },
  {
    id: 'forest',
    name: 'Forest Green',
    primary: '#166534',
    accent: '#166534',
    headerBorder: '#166534',
    sectionBorder: '#86efac',
    skillBg: '#f0fdf4',
    skillBorder: '#bbf7d0',
    textPrimary: '#14532d',
    textSecondary: '#3f6212',
    textMuted: '#6b7280',
  },
  {
    id: 'wine',
    name: 'Wine Red',
    primary: '#7f1d1d',
    accent: '#991b1b',
    headerBorder: '#991b1b',
    sectionBorder: '#fca5a5',
    skillBg: '#fef2f2',
    skillBorder: '#fecaca',
    textPrimary: '#450a0a',
    textSecondary: '#7f1d1d',
    textMuted: '#6b7280',
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    primary: '#581c87',
    accent: '#6b21a8',
    headerBorder: '#6b21a8',
    sectionBorder: '#c4b5fd',
    skillBg: '#faf5ff',
    skillBorder: '#e9d5ff',
    textPrimary: '#3b0764',
    textSecondary: '#6b21a8',
    textMuted: '#6b7280',
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    primary: '#9a3412',
    accent: '#c2410c',
    headerBorder: '#c2410c',
    sectionBorder: '#fdba74',
    skillBg: '#fff7ed',
    skillBorder: '#fed7aa',
    textPrimary: '#431407',
    textSecondary: '#9a3412',
    textMuted: '#6b7280',
  },
  {
    id: 'teal',
    name: 'Teal',
    primary: '#115e59',
    accent: '#0f766e',
    headerBorder: '#0f766e',
    sectionBorder: '#5eead4',
    skillBg: '#f0fdfa',
    skillBorder: '#99f6e4',
    textPrimary: '#042f2e',
    textSecondary: '#115e59',
    textMuted: '#6b7280',
  },
  {
    id: 'slate',
    name: 'Modern Slate',
    primary: '#334155',
    accent: '#475569',
    headerBorder: '#475569',
    sectionBorder: '#cbd5e1',
    skillBg: '#f8fafc',
    skillBorder: '#e2e8f0',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
  },
]

export default function ThemePicker({ activeThemeId, onSelect }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
        <FaPalette size={12} className="text-purple-600" />
        Color Theme
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className={`relative flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
              activeThemeId === theme.id
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            title={theme.name}
          >
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: theme.primary }}
            />
            <span className="text-[10px] text-gray-600 leading-tight text-center">
              {theme.name}
            </span>
            {activeThemeId === theme.id && (
              <FaCheck
                size={8}
                className="absolute top-1 right-1 text-blue-500"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
