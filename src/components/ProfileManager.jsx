import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaTrash, FaUser, FaCheck, FaTimes, FaCopy } from 'react-icons/fa'

export default function ProfileManager({
  profiles,
  activeProfileId,
  onSwitch,
  onCreate,
  onDuplicate,
  onDelete,
  onRename,
}) {
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleCreate = () => {
    if (newName.trim()) {
      onCreate(newName.trim())
      setNewName('')
      setIsCreating(false)
    }
  }

  const handleRename = (id) => {
    if (editName.trim()) {
      onRename(id, editName.trim())
      setEditingId(null)
      setEditName('')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-50 to-indigo-100/80 rounded-xl flex items-center justify-center ring-1 ring-blue-100/50">
            <FaUser className="text-blue-600" size={14} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-[13px]">Resume Profiles</h3>
            <p className="text-[11px] text-gray-400">{profiles.length} profile{profiles.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreating(true)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          title="Create new profile"
        >
          <FaPlus size={12} />
        </motion.button>
      </div>

      <div className="p-4">
        {/* Profile list */}
        <div className="space-y-1.5">
          <AnimatePresence>
            {profiles.map((profile) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  profile.id === activeProfileId
                    ? 'bg-blue-50 border border-blue-200 shadow-sm'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                {editingId === profile.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(profile.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      className="flex-1 px-2.5 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleRename(profile.id)}
                      className="text-green-600 hover:text-green-700 p-1"
                    >
                      <FaCheck size={11} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <FaTimes size={11} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      onClick={() => onSwitch(profile.id)}
                      onDoubleClick={() => {
                        setEditingId(profile.id)
                        setEditName(profile.name)
                      }}
                      className={`text-sm flex-1 truncate ${
                        profile.id === activeProfileId
                          ? 'font-semibold text-blue-700'
                          : 'text-gray-700'
                      }`}
                      title="Click to switch, double-click to rename"
                    >
                      {profile.name}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDuplicate(profile.id)
                        }}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
                        title="Duplicate profile"
                      >
                        <FaCopy size={10} />
                      </button>
                      {profiles.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(profile.id)
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded"
                          title="Delete profile"
                        >
                          <FaTrash size={10} />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Create new profile */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate()
                    if (e.key === 'Escape') {
                      setIsCreating(false)
                      setNewName('')
                    }
                  }}
                  placeholder="Profile name..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleCreate}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false)
                    setNewName('')
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <FaTimes size={13} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-[10px] text-gray-400 mt-3 text-center">
          Double-click a profile name to rename it
        </p>
      </div>
    </div>
  )
}
