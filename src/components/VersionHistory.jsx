import { useState } from 'react'
import { FaHistory, FaChevronDown, FaChevronUp, FaTrash, FaUndo } from 'react-icons/fa'
import { useTranslation } from '../TranslationContext'

export default function VersionHistory({ versions, onRestore, onDelete }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <FaHistory size={14} className="text-orange-600" />
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold text-gray-800">{t('version.title')}</span>
            <p className="text-xs text-gray-500">
              {versions.length} {t('version.savedVersions')}
            </p>
          </div>
        </div>
        {expanded ? (
          <FaChevronUp className="text-gray-400" size={12} />
        ) : (
          <FaChevronDown className="text-gray-400" size={12} />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          {versions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              {t('version.noVersions')}
            </p>
          ) : (
            <div className="space-y-2">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Version {versions.length - index}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(version.timestamp)}
                      {version.label && ` - ${version.label}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onRestore(version)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 active:bg-blue-100"
                      title="Restore this version"
                    >
                      <FaUndo size={11} />
                    </button>
                    <button
                      onClick={() => onDelete(version.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 active:bg-red-100"
                      title="Delete this version"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
