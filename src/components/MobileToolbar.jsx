import { useState, useEffect, useRef } from 'react'
import {
  FaFilePdf,
  FaPalette,
  FaUser,
  FaGripVertical,
  FaTimes,
  FaCheck,
  FaPlus,
  FaTrash,
} from 'react-icons/fa'
import { themes } from './ThemePicker'

function BottomSheet({ isOpen, onClose, title, children }) {
  const sheetRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      {/* Sheet */}
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200"
          >
            <FaTimes size={14} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-[env(safe-area-inset-bottom,16px)]">
          {children}
        </div>
      </div>
    </div>
  )
}

function ThemeSheet({ activeThemeId, onSelect, onClose }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => {
            onSelect(theme.id)
            onClose()
          }}
          className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all active:scale-95 ${
            activeThemeId === theme.id
              ? 'border-blue-500 bg-blue-50 shadow-sm'
              : 'border-gray-200 active:border-gray-300 active:bg-gray-50'
          }`}
        >
          <div
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: theme.primary }}
          />
          <span className="text-[11px] text-gray-600 leading-tight text-center font-medium">
            {theme.name}
          </span>
          {activeThemeId === theme.id && (
            <FaCheck size={10} className="absolute top-1.5 right-1.5 text-blue-500" />
          )}
        </button>
      ))}
    </div>
  )
}

function ProfileSheet({
  profiles,
  activeProfileId,
  onSwitch,
  onCreate,
  onDelete,
  onRename,
  onClose,
}) {
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const handleCreate = () => {
    if (newName.trim()) {
      onCreate(newName.trim())
      setNewName('')
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-2">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
            profile.id === activeProfileId
              ? 'bg-blue-50 border-2 border-blue-200'
              : 'bg-gray-50 border-2 border-transparent active:bg-gray-100'
          }`}
        >
          <button
            onClick={() => {
              onSwitch(profile.id)
              onClose()
            }}
            className="flex-1 text-left"
          >
            <span
              className={`text-sm font-medium ${
                profile.id === activeProfileId ? 'text-blue-700' : 'text-gray-700'
              }`}
            >
              {profile.name}
            </span>
            {profile.id === activeProfileId && (
              <span className="ml-2 text-xs text-blue-500">(active)</span>
            )}
          </button>
          {profiles.length > 1 && (
            <button
              onClick={() => onDelete(profile.id)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-red-400 active:bg-red-50 active:text-red-600"
            >
              <FaTrash size={12} />
            </button>
          )}
        </div>
      ))}

      {isCreating ? (
        <div className="flex items-center gap-2 mt-3">
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
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg active:bg-blue-700 font-medium"
          >
            Create
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 active:bg-gray-50 font-medium text-sm"
        >
          <FaPlus size={12} />
          New Profile
        </button>
      )}
    </div>
  )
}

function ReorderSheet({ sectionOrder, sectionLabels, onReorder, onClose }) {
  const [order, setOrder] = useState(sectionOrder)

  const moveUp = (index) => {
    if (index === 0) return
    const newOrder = [...order]
    ;[newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]]
    setOrder(newOrder)
  }

  const moveDown = (index) => {
    if (index === order.length - 1) return
    const newOrder = [...order]
    ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
    setOrder(newOrder)
  }

  const handleApply = () => {
    onReorder(order)
    onClose()
  }

  return (
    <div className="space-y-2">
      {order.map((sectionId, index) => (
        <div
          key={sectionId}
          className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
        >
          <FaGripVertical className="text-gray-400" size={12} />
          <span className="flex-1 text-sm font-medium text-gray-700">
            {sectionLabels[sectionId]}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => moveUp(index)}
              disabled={index === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-30 active:bg-gray-100"
            >
              <span className="text-xs font-bold">&uarr;</span>
            </button>
            <button
              onClick={() => moveDown(index)}
              disabled={index === order.length - 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-30 active:bg-gray-100"
            >
              <span className="text-xs font-bold">&darr;</span>
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={handleApply}
        className="w-full mt-4 px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl active:bg-blue-700 shadow-md"
      >
        Apply Order
      </button>
    </div>
  )
}

export default function MobileToolbar({
  onPrint,
  activeThemeId,
  onSelectTheme,
  profiles,
  activeProfileId,
  onSwitchProfile,
  onCreateProfile,
  onDeleteProfile,
  onRenameProfile,
  sectionOrder,
  sectionLabels,
  onReorder,
}) {
  const [activeSheet, setActiveSheet] = useState(null)

  const closeSheet = () => setActiveSheet(null)

  const tools = [
    {
      id: 'pdf',
      label: 'PDF',
      icon: FaFilePdf,
      color: 'text-red-500',
      action: () => {
        onPrint()
      },
    },
    {
      id: 'theme',
      label: 'Theme',
      icon: FaPalette,
      color: 'text-purple-500',
      action: () => setActiveSheet('theme'),
    },
    {
      id: 'profiles',
      label: 'Profiles',
      icon: FaUser,
      color: 'text-blue-500',
      action: () => setActiveSheet('profiles'),
    },
    {
      id: 'reorder',
      label: 'Reorder',
      icon: FaGripVertical,
      color: 'text-green-500',
      action: () => setActiveSheet('reorder'),
    },
  ]

  return (
    <>
      {/* Quick-tools bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[9990] lg:hidden">
        <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={tool.action}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl active:bg-gray-100 transition-colors min-w-[60px]"
              >
                <tool.icon size={20} className={tool.color} />
                <span className="text-[11px] font-medium text-gray-600">
                  {tool.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sheets */}
      <BottomSheet
        isOpen={activeSheet === 'theme'}
        onClose={closeSheet}
        title="Color Theme"
      >
        <ThemeSheet
          activeThemeId={activeThemeId}
          onSelect={onSelectTheme}
          onClose={closeSheet}
        />
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'profiles'}
        onClose={closeSheet}
        title="Resume Profiles"
      >
        <ProfileSheet
          profiles={profiles}
          activeProfileId={activeProfileId}
          onSwitch={onSwitchProfile}
          onCreate={onCreateProfile}
          onDelete={onDeleteProfile}
          onRename={onRenameProfile}
          onClose={closeSheet}
        />
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'reorder'}
        onClose={closeSheet}
        title="Section Order"
      >
        <ReorderSheet
          sectionOrder={sectionOrder}
          sectionLabels={sectionLabels}
          onReorder={onReorder}
          onClose={closeSheet}
        />
      </BottomSheet>
    </>
  )
}
