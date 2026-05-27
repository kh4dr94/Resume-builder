import { motion, AnimatePresence } from 'framer-motion'
import { FaKeyboard, FaTimes } from 'react-icons/fa'

const shortcuts = [
  { keys: ['Ctrl', 'Z'], description: 'Undo' },
  { keys: ['Ctrl', 'Y'], description: 'Redo' },
  { keys: ['Ctrl', 'P'], description: 'Download PDF' },
  { keys: ['Ctrl', 'D'], description: 'Toggle dark mode' },
]

export default function KeyboardShortcuts({ isOpen, onClose, darkMode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-md rounded-2xl border shadow-2xl ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-50 to-indigo-100/80 rounded-xl flex items-center justify-center ring-1 ring-blue-100/50">
                  <FaKeyboard className="text-blue-500" size={14} />
                </div>
                <div>
                  <h2 className={`text-[15px] font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Keyboard Shortcuts
                  </h2>
                  <p className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Speed up your workflow
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Shortcuts list */}
            <div className="px-6 py-4 space-y-3">
              {shortcuts.map((shortcut, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl ${
                    darkMode ? 'bg-gray-750 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <span className={`text-[13px] font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {shortcut.description}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {shortcut.keys.map((key, kIdx) => (
                      <kbd
                        key={kIdx}
                        className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg border shadow-sm ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-gray-300'
                            : 'bg-white border-gray-200 text-gray-600'
                        }`}
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className={`px-6 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <p className={`text-[10px] text-center ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                Press <kbd className={`px-1.5 py-0.5 rounded border text-[10px] font-mono ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>?</kbd> to toggle this modal
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
