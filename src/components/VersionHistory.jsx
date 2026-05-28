import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHistory, FaClock, FaUndo, FaSave, FaChevronDown, FaTrash } from 'react-icons/fa'

const STORAGE_KEY = 'resumeBuilder_versionHistory'
const MAX_VERSIONS = 10
const AUTO_SAVE_INTERVAL = 5 * 60 * 1000 // 5 minutes

function loadVersions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {}
  return []
}

function saveVersions(versions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(versions))
  } catch (e) {}
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function VersionHistory({ data, onRestore, darkMode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [versions, setVersions] = useState(loadVersions)

  // Auto-save every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      saveVersion('Auto-save')
    }, AUTO_SAVE_INTERVAL)
    return () => clearInterval(interval)
  }, [data])

  const saveVersion = useCallback((label = 'Manual save') => {
    setVersions(prev => {
      const newVersion = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        timestamp: Date.now(),
        label,
        data: data,
        preview: data?.personalInfo?.fullName || 'Untitled',
      }
      const updated = [newVersion, ...prev].slice(0, MAX_VERSIONS)
      saveVersions(updated)
      return updated
    })
  }, [data])

  const handleRestore = (version) => {
    if (window.confirm('Restore this version? Your current changes will be replaced.')) {
      onRestore(version.data)
    }
  }

  const handleDelete = (id) => {
    setVersions(prev => {
      const updated = prev.filter(v => v.id !== id)
      saveVersions(updated)
      return updated
    })
  }

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200/80'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50'}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <FaHistory className="text-white" size={12} />
          </div>
          <div className="text-left">
            <span className={`font-semibold text-[13px] ${darkMode ? 'text-white' : 'text-gray-800'}`}>Version History</span>
            <span className={`block text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {versions.length} saved version{versions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`w-6 h-6 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        >
          <FaChevronDown className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={10} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className={`px-4 pb-4 pt-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              {/* Save button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => saveVersion('Manual save')}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-semibold mb-3 transition-all ${darkMode ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30' : 'bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100'}`}
              >
                <FaSave size={11} />
                Save Version
              </motion.button>

              {/* Version list */}
              {versions.length === 0 ? (
                <p className={`text-[11px] text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  No versions saved yet. Click "Save Version" or wait for auto-save.
                </p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {versions.map((version, index) => (
                    <motion.div
                      key={version.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative p-3 rounded-xl border group ${darkMode ? 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50' : 'bg-gray-50/80 border-gray-200/60 hover:bg-gray-100/80'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${version.label === 'Auto-save' ? 'bg-blue-400' : 'bg-purple-500'}`} />
                          <div>
                            <p className={`text-[11px] font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                              {version.label}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <FaClock size={8} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                              <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {formatTime(version.timestamp)}
                              </span>
                            </div>
                            <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {version.preview}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleRestore(version)}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center ${darkMode ? 'hover:bg-gray-600 text-green-400' : 'hover:bg-green-100 text-green-600'}`}
                            title="Restore this version"
                          >
                            <FaUndo size={9} />
                          </button>
                          <button
                            onClick={() => handleDelete(version.id)}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center ${darkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-red-100 text-red-500'}`}
                            title="Delete version"
                          >
                            <FaTrash size={9} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
