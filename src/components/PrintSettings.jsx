import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCog } from 'react-icons/fa'

const MARGIN_OPTIONS = [
  { id: 'compact', label: 'Compact', description: '8mm margins' },
  { id: 'standard', label: 'Standard', description: '15mm margins' },
  { id: 'wide', label: 'Wide', description: '22mm margins' },
]

export default function PrintSettings({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [margin, setMargin] = useState(() => {
    try {
      return localStorage.getItem('resumeBuilder_printMargin') || 'standard'
    } catch (e) {
      return 'standard'
    }
  })
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarginChange = (id) => {
    setMargin(id)
    try {
      localStorage.setItem('resumeBuilder_printMargin', id)
    } catch (e) {}
    // Apply margin class to resume content
    const resumeEl = document.querySelector('[style*="width: 210mm"][style*="min-height"]')
    if (resumeEl) {
      resumeEl.classList.remove('print-margin-compact', 'print-margin-standard', 'print-margin-wide')
      resumeEl.classList.add(`print-margin-${id}`)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-indigo-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-indigo-600'}`}
        title="Print Settings"
      >
        <FaCog size={12} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className={`absolute right-0 top-10 w-56 rounded-xl shadow-xl border z-50 overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          >
            <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Print Settings
              </h3>
            </div>

            <div className="p-3 space-y-3">
              {/* Paper size indicator */}
              <div>
                <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Paper Size</label>
                <div className={`mt-1 px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                  A4 (210 × 297 mm)
                </div>
              </div>

              {/* Margin */}
              <div>
                <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Margins</label>
                <div className="mt-1 space-y-1">
                  {MARGIN_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleMarginChange(opt.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                        margin === opt.id
                          ? darkMode ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-700' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="font-medium">{opt.label}</span>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{opt.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
