import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaColumns, FaTimes, FaExchangeAlt } from 'react-icons/fa'

function ProfileCard({ profile, darkMode }) {
  if (!profile) return null
  const { data } = profile

  return (
    <div className={`flex-1 min-w-0 rounded-xl border p-4 space-y-3 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
      <div className="text-center pb-2 border-b border-gray-200 dark:border-gray-600">
        <p className={`text-[14px] font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{profile.name}</p>
      </div>

      <Section label="Name" value={data?.personalInfo?.fullName} darkMode={darkMode} />
      <Section label="Title" value={data?.personalInfo?.title} darkMode={darkMode} />
      <Section label="Email" value={data?.personalInfo?.email} darkMode={darkMode} />
      <Section label="Location" value={data?.personalInfo?.location} darkMode={darkMode} />
      <Section label="Summary" value={data?.personalInfo?.summary} darkMode={darkMode} truncate />

      <div>
        <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Experience ({data?.experience?.length || 0})</p>
        {(data?.experience || []).filter(e => e.company).map((exp, i) => (
          <p key={i} className={`text-[11px] ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            • {exp.position} at {exp.company}
          </p>
        ))}
      </div>

      <div>
        <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Skills ({data?.skills?.filter(s => s.trim()).length || 0})</p>
        <div className="flex flex-wrap gap-1">
          {(data?.skills || []).filter(s => s.trim()).slice(0, 8).map((s, i) => (
            <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Education ({data?.education?.length || 0})</p>
        {(data?.education || []).filter(e => e.institution).map((edu, i) => (
          <p key={i} className={`text-[11px] ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            • {edu.degree} {edu.field ? `in ${edu.field}` : ''} — {edu.institution}
          </p>
        ))}
      </div>
    </div>
  )
}

function Section({ label, value, darkMode, truncate }) {
  if (!value) return null
  return (
    <div>
      <p className={`text-[10px] font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
      <p className={`text-[12px] ${darkMode ? 'text-gray-200' : 'text-gray-700'} ${truncate ? 'line-clamp-3' : ''}`}>{value}</p>
    </div>
  )
}

function getDifferences(profileA, profileB) {
  if (!profileA?.data || !profileB?.data) return []
  const diffs = []
  const a = profileA.data
  const b = profileB.data

  if (a.personalInfo?.fullName !== b.personalInfo?.fullName) diffs.push('Name')
  if (a.personalInfo?.title !== b.personalInfo?.title) diffs.push('Title')
  if (a.personalInfo?.summary !== b.personalInfo?.summary) diffs.push('Summary')
  if ((a.skills || []).join(',') !== (b.skills || []).join(',')) diffs.push('Skills')
  if ((a.experience || []).length !== (b.experience || []).length) diffs.push('Experience count')
  if ((a.education || []).length !== (b.education || []).length) diffs.push('Education count')
  if (a.personalInfo?.email !== b.personalInfo?.email) diffs.push('Email')
  if (a.personalInfo?.location !== b.personalInfo?.location) diffs.push('Location')

  return diffs
}

export default function ComparisonView({ profiles, darkMode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [leftId, setLeftId] = useState('')
  const [rightId, setRightId] = useState('')

  const handleOpen = () => {
    if (profiles.length >= 2) {
      setLeftId(profiles[0].id)
      setRightId(profiles[1].id)
    }
    setIsOpen(true)
  }

  const leftProfile = profiles.find(p => p.id === leftId)
  const rightProfile = profiles.find(p => p.id === rightId)
  const differences = getDifferences(leftProfile, rightProfile)

  if (profiles.length < 2) return null

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${
          darkMode
            ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-cyan-400'
            : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-cyan-600'
        }`}
        title="Compare profiles"
      >
        <FaColumns size={12} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl border overflow-hidden flex flex-col ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <FaExchangeAlt className="text-white" size={14} />
                  </div>
                  <div>
                    <h3 className={`text-[15px] font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Compare Profiles</h3>
                    <p className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      View differences between two resumes
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'}`}>
                  <FaTimes size={14} />
                </button>
              </div>

              {/* Selectors */}
              <div className={`px-6 py-3 flex items-center gap-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <select
                  value={leftId}
                  onChange={(e) => setLeftId(e.target.value)}
                  className={`flex-1 text-[12px] px-3 py-1.5 rounded-lg border outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <FaExchangeAlt size={11} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                <select
                  value={rightId}
                  onChange={(e) => setRightId(e.target.value)}
                  className={`flex-1 text-[12px] px-3 py-1.5 rounded-lg border outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Differences badge */}
              {differences.length > 0 && leftId !== rightId && (
                <div className={`px-6 py-2 ${darkMode ? 'bg-gray-700/50' : 'bg-yellow-50'}`}>
                  <p className={`text-[11px] font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    Differences found in: {differences.join(', ')}
                  </p>
                </div>
              )}

              {/* Side by side */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {leftId === rightId ? (
                  <p className={`text-center text-[13px] py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Select two different profiles to compare
                  </p>
                ) : (
                  <div className="flex gap-4">
                    <ProfileCard profile={leftProfile} darkMode={darkMode} />
                    <ProfileCard profile={rightProfile} darkMode={darkMode} />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
