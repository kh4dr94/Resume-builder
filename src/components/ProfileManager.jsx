import { useState } from 'react'
import { FaPlus, FaTrash, FaUser, FaCheck, FaTimes } from 'react-icons/fa'
import { useTranslation } from '../TranslationContext'

export default function ProfileManager({
  profiles,
  activeProfileId,
  onSwitch,
  onCreate,
  onDelete,
  onRename,
}) {
  const { t } = useTranslation()
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FaUser size={12} className="text-blue-600" />
          {t('profile.profiles')}
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="text-blue-600 hover:text-blue-700 transition-colors"
          title="Create new profile"
        >
          <FaPlus size={14} />
        </button>
      </div>

      {/* Profile list */}
      <div className="space-y-1.5">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer ${
              profile.id === activeProfileId
                ? 'bg-blue-50 border border-blue-200'
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
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => handleRename(profile.id)}
                  className="text-green-600 hover:text-green-700"
                >
                  <FaCheck size={12} />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={12} />
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
                  className={`text-sm flex-1 ${
                    profile.id === activeProfileId
                      ? 'font-semibold text-blue-700'
                      : 'text-gray-700'
                  }`}
                  title="Click to switch, double-click to rename"
                >
                  {profile.name}
                  {profile.id === activeProfileId && (
                    <span className="ml-2 text-xs text-blue-500">({t('profile.activeProfile').toLowerCase()})</span>
                  )}
                </span>
                {profiles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(profile.id)
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 ml-2"
                    title="Delete profile"
                  >
                    <FaTrash size={11} />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Create new profile */}
      {isCreating && (
        <div className="mt-3 flex items-center gap-2">
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
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <button
            onClick={handleCreate}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('profile.create')}
          </button>
          <button
            onClick={() => {
              setIsCreating(false)
              setNewName('')
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={14} />
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2">
        {t('profile.doubleClickRename')}
      </p>
    </div>
  )
}
