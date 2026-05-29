import { useState } from 'react'
import { FaChartBar, FaChevronDown, FaChevronUp, FaCheck, FaExclamationTriangle } from 'react-icons/fa'

function calculateCompletion(data) {
  const checks = []

  // Personal Info
  if (data.personalInfo.fullName) checks.push({ label: 'Full name', done: true })
  else checks.push({ label: 'Full name', done: false })

  if (data.personalInfo.title) checks.push({ label: 'Professional title', done: true })
  else checks.push({ label: 'Professional title', done: false })

  if (data.personalInfo.email) checks.push({ label: 'Email address', done: true })
  else checks.push({ label: 'Email address', done: false })

  if (data.personalInfo.phone) checks.push({ label: 'Phone number', done: true })
  else checks.push({ label: 'Phone number', done: false })

  if (data.personalInfo.location) checks.push({ label: 'Location', done: true })
  else checks.push({ label: 'Location', done: false })

  if (data.personalInfo.summary && data.personalInfo.summary.length > 20)
    checks.push({ label: 'Professional summary', done: true })
  else checks.push({ label: 'Professional summary (min 20 chars)', done: false })

  // Experience
  const hasExperience = data.experience.some((exp) => exp.company && exp.position)
  checks.push({ label: 'Work experience', done: hasExperience })

  // Education
  const hasEducation = data.education.some((edu) => edu.institution && edu.degree)
  checks.push({ label: 'Education', done: hasEducation })

  // Skills
  const hasSkills = data.skills.some((s) => s.trim() !== '')
  checks.push({ label: 'Skills (at least 1)', done: hasSkills })

  // LinkedIn
  if (data.personalInfo.linkedin) checks.push({ label: 'LinkedIn profile', done: true })
  else checks.push({ label: 'LinkedIn profile', done: false })

  const completed = checks.filter((c) => c.done).length
  const total = checks.length
  const percentage = Math.round((completed / total) * 100)

  return { checks, completed, total, percentage }
}

export default function ResumeAnalytics({ data }) {
  const [expanded, setExpanded] = useState(false)
  const { checks, completed, total, percentage } = calculateCompletion(data)

  const getColor = () => {
    if (percentage >= 80) return 'green'
    if (percentage >= 50) return 'yellow'
    return 'red'
  }

  const color = getColor()
  const colorClasses = {
    green: { bg: 'bg-green-500', text: 'text-green-600', badge: 'bg-green-100 text-green-700', bar: 'bg-green-500' },
    yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700', bar: 'bg-yellow-500' },
    red: { bg: 'bg-red-500', text: 'text-red-600', badge: 'bg-red-100 text-red-700', bar: 'bg-red-500' },
  }

  const c = colorClasses[color]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <FaChartBar size={14} className="text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-gray-800">Resume Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${c.badge}`}>
            {percentage}% complete
          </span>
          {expanded ? (
            <FaChevronUp className="text-gray-400" size={12} />
          ) : (
            <FaChevronDown className="text-gray-400" size={12} />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${c.bar}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-xs text-gray-500 mb-3">
            {completed} of {total} items completed
          </p>

          {/* Checklist */}
          <div className="space-y-1.5">
            {checks.map((check, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  check.done ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                {check.done ? (
                  <FaCheck size={10} className="text-green-500" />
                ) : (
                  <FaExclamationTriangle size={10} className="text-yellow-500" />
                )}
                <span className={check.done ? 'text-green-700' : 'text-gray-600'}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
