import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaRobot } from 'react-icons/fa'

function calculateATSScore(data) {
  let score = 0
  const breakdown = []

  // Has full name (+10)
  if (data.personalInfo.fullName && data.personalInfo.fullName.trim().length > 0) {
    score += 10
    breakdown.push({ label: 'Full name', points: 10, earned: true })
  } else {
    breakdown.push({ label: 'Full name', points: 10, earned: false })
  }

  // Has email (+10)
  if (data.personalInfo.email && data.personalInfo.email.trim().length > 0) {
    score += 10
    breakdown.push({ label: 'Email address', points: 10, earned: true })
  } else {
    breakdown.push({ label: 'Email address', points: 10, earned: false })
  }

  // Has phone (+5)
  if (data.personalInfo.phone && data.personalInfo.phone.trim().length > 0) {
    score += 5
    breakdown.push({ label: 'Phone number', points: 5, earned: true })
  } else {
    breakdown.push({ label: 'Phone number', points: 5, earned: false })
  }

  // Has professional summary between 30-60 words (+15)
  const summaryWords = (data.personalInfo.summary || '').trim().split(/\s+/).filter(w => w.length > 0)
  if (summaryWords.length >= 30 && summaryWords.length <= 60) {
    score += 15
    breakdown.push({ label: 'Summary (30-60 words)', points: 15, earned: true })
  } else {
    breakdown.push({ label: 'Summary (30-60 words)', points: 15, earned: false })
  }

  // Has at least 2 work experiences (+15)
  const filledExperiences = (data.experience || []).filter(e => e.company || e.position)
  if (filledExperiences.length >= 2) {
    score += 15
    breakdown.push({ label: '2+ work experiences', points: 15, earned: true })
  } else {
    breakdown.push({ label: '2+ work experiences', points: 15, earned: false })
  }

  // Each experience has description (+5 each, max 10)
  let descPoints = 0
  filledExperiences.forEach(e => {
    if (e.description && e.description.trim().length > 0 && descPoints < 10) {
      descPoints += 5
    }
  })
  score += descPoints
  breakdown.push({ label: 'Experience descriptions', points: 10, earned: descPoints >= 10 })

  // Has at least 3 skills (+10)
  const filledSkills = (data.skills || []).filter(s => s && s.trim() !== '')
  if (filledSkills.length >= 3) {
    score += 10
    breakdown.push({ label: '3+ skills', points: 10, earned: true })
  } else {
    breakdown.push({ label: '3+ skills', points: 10, earned: false })
  }

  // Has education (+10)
  const filledEducation = (data.education || []).filter(e => e.institution || e.degree)
  if (filledEducation.length > 0) {
    score += 10
    breakdown.push({ label: 'Education', points: 10, earned: true })
  } else {
    breakdown.push({ label: 'Education', points: 10, earned: false })
  }

  // Has LinkedIn (+5)
  if (data.personalInfo.linkedin && data.personalInfo.linkedin.trim().length > 0) {
    score += 5
    breakdown.push({ label: 'LinkedIn profile', points: 5, earned: true })
  } else {
    breakdown.push({ label: 'LinkedIn profile', points: 5, earned: false })
  }

  // Has certifications (+10)
  const filledCerts = (data.certifications || []).filter(c => c.name && c.name.trim() !== '')
  if (filledCerts.length > 0) {
    score += 10
    breakdown.push({ label: 'Certifications', points: 10, earned: true })
  } else {
    breakdown.push({ label: 'Certifications', points: 10, earned: false })
  }

  return { score: Math.min(score, 100), breakdown }
}

function CircularProgress({ score, size = 80, strokeWidth = 7 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s > 70) return { stroke: '#22c55e', text: 'text-green-600' }
    if (s >= 40) return { stroke: '#eab308', text: 'text-yellow-600' }
    return { stroke: '#ef4444', text: 'text-red-600' }
  }

  const colors = getColor(score)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-bold ${colors.text}`}>{score}</span>
      </div>
    </div>
  )
}

export default function ATSScore({ data, darkMode }) {
  const { score, breakdown } = useMemo(() => calculateATSScore(data), [data])
  const [expanded, setExpanded] = useState(false)

  const getScoreLabel = (s) => {
    if (s > 70) return 'Great'
    if (s >= 40) return 'Needs Work'
    return 'Low'
  }

  const getScoreColor = (s) => {
    if (s > 70) return 'bg-green-100 text-green-700'
    if (s >= 40) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className={`rounded-2xl border overflow-hidden transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/80'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50/50'}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-50 to-purple-100/80 rounded-xl flex items-center justify-center ring-1 ring-indigo-100/50">
            <FaRobot className="text-indigo-500" size={14} />
          </div>
          <div className="text-left">
            <h3 className={`font-semibold text-[13px] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>ATS Score</h3>
            <p className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Applicant Tracking System readiness
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getScoreColor(score)}`}>
          {score}/100
        </span>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className={`px-5 pb-4 border-t pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center gap-4 mb-4">
              <CircularProgress score={score} />
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {getScoreLabel(score)}
                </p>
                <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {score > 70
                    ? 'Your resume is well-optimized for ATS systems.'
                    : score >= 40
                    ? 'Some improvements needed for better ATS compatibility.'
                    : 'Add more details to improve your ATS score.'}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              {breakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.earned ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={`text-[11px] ${item.earned ? (darkMode ? 'text-gray-300' : 'text-gray-700') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono ${item.earned ? 'text-green-600' : (darkMode ? 'text-gray-600' : 'text-gray-300')}`}>
                    +{item.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
