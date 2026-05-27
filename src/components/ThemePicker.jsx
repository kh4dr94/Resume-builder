import { motion } from 'framer-motion'
import { FaPalette, FaCheck, FaUndo } from 'react-icons/fa'

export const colorThemes = [
  {
    id: 'default',
    name: 'Default',
    description: 'Use template default colors',
    primary: null,
    accent: null,
    preview: 'from-gray-400 to-gray-600',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep blue professional tones',
    primary: '#1e40af',
    accent: '#2563eb',
    preview: 'from-blue-500 to-blue-700',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green earth tones',
    primary: '#166534',
    accent: '#15803d',
    preview: 'from-green-500 to-emerald-700',
  },
  {
    id: 'wine',
    name: 'Wine',
    description: 'Rich burgundy elegance',
    primary: '#7f1d1d',
    accent: '#991b1b',
    preview: 'from-red-700 to-rose-900',
  },
  {
    id: 'royal',
    name: 'Royal',
    description: 'Regal purple sophistication',
    primary: '#581c87',
    accent: '#6b21a8',
    preview: 'from-purple-600 to-violet-800',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange and amber',
    primary: '#9a3412',
    accent: '#c2410c',
    preview: 'from-orange-500 to-amber-700',
  },
  {
    id: 'teal',
    name: 'Teal',
    description: 'Cool teal and cyan',
    primary: '#115e59',
    accent: '#0f766e',
    preview: 'from-teal-500 to-cyan-700',
  },
  {
    id: 'slate',
    name: 'Slate',
    description: 'Modern neutral gray',
    primary: '#334155',
    accent: '#475569',
    preview: 'from-slate-500 to-slate-700',
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Soft rose pink',
    primary: '#9f1239',
    accent: '#be123c',
    preview: 'from-rose-500 to-pink-700',
  },
  {
    id: 'indigo',
    name: 'Indigo',
    description: 'Deep indigo blue',
    primary: '#3730a3',
    accent: '#4338ca',
    preview: 'from-indigo-500 to-indigo-800',
  },
]

export default function ThemePicker({ activeThemeId, onSelect }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-fuchsia-50 to-purple-100/80 rounded-xl flex items-center justify-center ring-1 ring-purple-100/50">
            <FaPalette className="text-fuchsia-600" size={14} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-[13px]">Color Theme</h3>
            <p className="text-[11px] text-gray-400">Customize accent colors</p>
          </div>
        </div>
        {activeThemeId !== 'default' && (
          <button
            onClick={() => onSelect('default')}
            className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-700 transition-colors"
            title="Reset to template default"
          >
            <FaUndo size={9} />
            Reset
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="grid grid-cols-5 gap-2">
          {colorThemes.map((theme) => (
            <motion.button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                activeThemeId === theme.id
                  ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
              }`}
              title={theme.description}
            >
              <div
                className={`w-7 h-7 rounded-full bg-gradient-to-br ${theme.preview} shadow-sm ring-2 ring-white`}
              />
              <span className="text-[9px] text-gray-600 leading-tight text-center font-medium truncate w-full">
                {theme.name}
              </span>
              {activeThemeId === theme.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white"
                >
                  <FaCheck size={6} className="text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-3 text-center">
          {colorThemes.find((t) => t.id === activeThemeId)?.description || 'Select a color theme'}
        </p>
      </div>
    </div>
  )
}
