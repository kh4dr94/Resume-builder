import { motion } from 'framer-motion'
import { FaPalette, FaCheck } from 'react-icons/fa'

export const COLOR_THEMES = [
  { id: 'default', name: 'Default Blue', primary: '#2563eb' },
  { id: 'indigo', name: 'Indigo', primary: '#4f46e5' },
  { id: 'emerald', name: 'Emerald', primary: '#059669' },
  { id: 'rose', name: 'Rose', primary: '#e11d48' },
  { id: 'amber', name: 'Amber', primary: '#d97706' },
  { id: 'violet', name: 'Violet', primary: '#7c3aed' },
  { id: 'cyan', name: 'Cyan', primary: '#0891b2' },
  { id: 'slate', name: 'Slate', primary: '#475569' },
]

export default function ThemePicker({ colorTheme, onSelect, darkMode }) {
  const activeTheme = colorTheme || COLOR_THEMES[0]

  return (
    <div className={`rounded-xl border p-4 transition-colors ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${darkMode ? 'bg-rose-900/50' : 'bg-rose-50'}`}>
          <FaPalette className="text-rose-500" size={12} />
        </div>
        <h3 className={`text-[13px] font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Color Theme
        </h3>
      </div>
      <p className={`text-[11px] mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Pick an accent color for your resume
      </p>

      <div className="grid grid-cols-4 gap-2">
        {COLOR_THEMES.map((theme) => (
          <motion.button
            key={theme.id}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelect(theme)}
            className={`relative flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
              activeTheme.id === theme.id
                ? darkMode ? 'border-white/30 bg-gray-700' : 'border-gray-400 bg-gray-50'
                : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-100 hover:border-gray-300'
            }`}
            title={theme.name}
          >
            <div
              className="w-7 h-7 rounded-full shadow-sm flex items-center justify-center"
              style={{ backgroundColor: theme.primary }}
            >
              {activeTheme.id === theme.id && (
                <FaCheck size={10} className="text-white" />
              )}
            </div>
            <span className={`text-[9px] font-medium truncate w-full text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {theme.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
