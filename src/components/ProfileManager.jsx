import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser, FaPlus, FaTrash, FaPen, FaCheck, FaTimes, FaFolder } from 'react-icons/fa'

const PROFILES_KEY = 'resumeBuilder_profiles'
const ACTIVE_PROFILE_KEY = 'resumeBuilder_activeProfile'

export function loadProfiles() {
  try {
    const saved = localStorage.getItem(PROFILES_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Validate it's an array of profiles with expected shape
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].data) {
        return parsed
      }
    }
  } catch (e) {
    // Corrupted data - clear it
    try { localStorage.removeItem(PROFILES_KEY) } catch (err) {}
  }
  return null
}

export function saveProfiles(profiles) {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  } catch (e) {}
}

export function loadActiveProfileId() {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY) || null
  } catch (e) {}
  return null
}

export function saveActiveProfileId(id) {
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id)
  } catch (e) {}
}

export default function ProfileManager({ profiles, activeProfileId, onSwitch, onCreate, onDelete, onRename, darkMode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [newName, setNewName] = useState('')
  const [showNewInput, setShowNewInput] = useState(false)

  const activeProfile = profiles.find(p => p.id === activeProfileId)

  const handleStartRename = (profile) => {
    setEditingId(profile.id)
    setEditName(profile.name)
  }

  const handleFinishRename = () => {
    if (editName.trim() && editingId) {
      onRename(editingId, editName.trim())
    }
    setEditingId(null)
    setEditName('')
  }

  const handleCreate = () => {
    if (newName.trim()) {
      onCreate(newName.trim())
      setNewName('')
      setShowNewInput(false)
    }
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
          darkMode
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 text-gray-200'
            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
        }`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'}`}>
          <FaFolder className="text-indigo-500" size={13} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[11px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Profile</p>
          <p className="text-[13px] font-semibold truncate">{activeProfile?.name || 'Default'}</p>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          {profiles.length}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border shadow-xl overflow-hidden ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="max-h-[280px] overflow-y-auto p-2">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg mb-1 transition-all cursor-pointer group ${
                    profile.id === activeProfileId
                      ? darkMode ? 'bg-indigo-900/30 border border-indigo-700/50' : 'bg-indigo-50 border border-indigo-100'
                      : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => { if (editingId !== profile.id) { onSwitch(profile.id); setIsOpen(false) } }}
                >
                  <FaUser size={10} className={profile.id === activeProfileId ? 'text-indigo-500' : 'text-gray-400'} />
                  
                  {editingId === profile.id ? (
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleFinishRename(); if (e.key === 'Escape') setEditingId(null) }}
                        className={`flex-1 text-[12px] px-2 py-0.5 rounded border outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button onClick={(e) => { e.stopPropagation(); handleFinishRename() }} className="text-green-500 hover:text-green-600 p-1">
                        <FaCheck size={10} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setEditingId(null) }} className="text-gray-400 hover:text-gray-500 p-1">
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={`flex-1 text-[12px] font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {profile.name}
                      </span>
                      <div className="hidden group-hover:flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStartRename(profile) }}
                          className="text-gray-400 hover:text-blue-500 p-1"
                          title="Rename"
                        >
                          <FaPen size={9} />
                        </button>
                        {profiles.length > 1 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDelete(profile.id) }}
                            className="text-gray-400 hover:text-red-500 p-1"
                            title="Delete"
                          >
                            <FaTrash size={9} />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className={`border-t p-2 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              {showNewInput ? (
                <div className="flex items-center gap-2 px-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowNewInput(false) }}
                    placeholder="Profile name..."
                    className={`flex-1 text-[12px] px-3 py-1.5 rounded-lg border outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'}`}
                    autoFocus
                  />
                  <button onClick={handleCreate} className="text-green-500 hover:text-green-600 p-1.5"><FaCheck size={11} /></button>
                  <button onClick={() => setShowNewInput(false)} className="text-gray-400 hover:text-gray-500 p-1.5"><FaTimes size={11} /></button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewInput(true)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
                    darkMode ? 'text-indigo-400 hover:bg-gray-700' : 'text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <FaPlus size={10} />
                  New Profile
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
