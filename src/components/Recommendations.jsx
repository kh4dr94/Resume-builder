import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaLightbulb, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa'

const allTips = [
  {
    id: 'summary-length',
    category: 'summary',
    type: 'tip',
    title: 'Keep your summary concise',
    text: 'Aim for 2-4 sentences highlighting your key value proposition. Recruiters spend ~6 seconds scanning resumes.',
    check: (data) => !data.personalInfo.summary || data.personalInfo.summary.length < 300,
  },
  {
    id: 'summary-exists',
    category: 'summary',
    type: 'warning',
    title: 'Add a professional summary',
    text: 'A compelling summary at the top helps recruiters quickly understand your expertise and career goals.',
    check: (data) => !!data.personalInfo.summary && data.personalInfo.summary.length > 20,
  },
  {
    id: 'experience-bullets',
    category: 'experience',
    type: 'tip',
    title: 'Use bullet points with action verbs',
    text: 'Start each bullet with verbs like "Led", "Developed", "Increased", "Managed". Quantify results when possible (e.g., "Increased revenue by 25%").',
    check: (data) => true,
  },
  {
    id: 'skills-count',
    category: 'skills',
    type: 'tip',
    title: 'Include 8-12 relevant skills',
    text: 'Focus on skills mentioned in job descriptions you\'re targeting. Mix technical and soft skills for a well-rounded profile.',
    check: (data) => {
      const filled = data.skills.filter(s => s.trim() !== '')
      return filled.length >= 8 && filled.length <= 12
    },
  },
  {
    id: 'skills-few',
    category: 'skills',
    type: 'warning',
    title: 'Add more skills',
    text: 'Having fewer than 5 skills may make your resume look sparse. Include both technical skills and tools you use daily.',
    check: (data) => data.skills.filter(s => s.trim() !== '').length >= 5,
  },
  {
    id: 'contact-complete',
    category: 'contact',
    type: 'warning',
    title: 'Complete your contact information',
    text: 'Include at least email, phone, and location. LinkedIn profile is highly recommended for professional roles.',
    check: (data) => !!(data.personalInfo.email && data.personalInfo.phone && data.personalInfo.location),
  },
  {
    id: 'linkedin',
    category: 'contact',
    type: 'tip',
    title: 'Add your LinkedIn profile',
    text: '87% of recruiters use LinkedIn to evaluate candidates. Make sure your LinkedIn matches your resume.',
    check: (data) => !!data.personalInfo.linkedin,
  },
  {
    id: 'experience-dates',
    category: 'experience',
    type: 'tip',
    title: 'Show career progression',
    text: 'List experiences in reverse chronological order. Show growth through increasingly responsible roles.',
    check: (data) => true,
  },
  {
    id: 'education-gpa',
    category: 'education',
    type: 'tip',
    title: 'GPA guidance',
    text: 'Only include GPA if it\'s 3.5+ or you graduated within the last 2-3 years. Otherwise, it may work against you.',
    check: (data) => true,
  },
  {
    id: 'certifications',
    category: 'certifications',
    type: 'tip',
    title: 'Certifications boost credibility',
    text: 'Industry certifications show commitment to professional development. Prioritize ones relevant to your target role.',
    check: (data) => true,
  },
]

export default function Recommendations({ data }) {
  const [dismissed, setDismissed] = useState([])
  const [expanded, setExpanded] = useState(true)

  const activeTips = allTips.filter(
    (tip) => !dismissed.includes(tip.id)
  )

  // Separate into warnings (action needed) and tips (general advice)
  const warnings = activeTips.filter((tip) => tip.type === 'warning' && !tip.check(data))
  const tips = activeTips.filter((tip) => tip.type === 'tip')
  const passed = allTips.filter((tip) => tip.type === 'warning' && tip.check(data))

  const score = Math.min(100, Math.round((passed.length / allTips.filter(t => t.type === 'warning').length) * 100))

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-50 to-orange-100/80 rounded-xl flex items-center justify-center ring-1 ring-amber-100/50">
            <FaLightbulb className="text-amber-500" size={14} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 text-[13px]">Smart Recommendations</h3>
            <p className="text-[11px] text-gray-400">
              {warnings.length > 0
                ? `${warnings.length} improvement${warnings.length > 1 ? 's' : ''} suggested`
                : 'Looking great!'}
            </p>
          </div>
        </div>
        {/* Score badge */}
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          score >= 80 ? 'bg-green-100 text-green-700' :
          score >= 50 ? 'bg-amber-100 text-amber-700' :
          'bg-red-100 text-red-700'
        }`}>
          {score}%
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 border-t border-gray-100 pt-3 space-y-2 max-h-64 overflow-y-auto">
              {/* Warnings first */}
              {warnings.map((tip) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-start gap-2.5 p-2.5 bg-amber-50 rounded-lg border border-amber-100 group"
                >
                  <FaExclamationTriangle className="text-amber-500 mt-0.5 shrink-0" size={12} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{tip.title}</p>
                    <p className="text-[10px] text-gray-600 leading-relaxed mt-0.5">{tip.text}</p>
                  </div>
                  <button
                    onClick={() => setDismissed([...dismissed, tip.id])}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <FaTimes size={10} />
                  </button>
                </motion.div>
              ))}

              {/* Passed checks */}
              {passed.map((tip) => (
                <div
                  key={tip.id}
                  className="flex items-center gap-2.5 p-2 bg-green-50 rounded-lg border border-green-100"
                >
                  <FaCheckCircle className="text-green-500 shrink-0" size={12} />
                  <p className="text-[10px] text-green-700 font-medium">{tip.title}</p>
                </div>
              ))}

              {/* General tips */}
              {tips.slice(0, 3).map((tip) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2.5 p-2.5 bg-blue-50 rounded-lg border border-blue-100 group"
                >
                  <FaInfoCircle className="text-blue-500 mt-0.5 shrink-0" size={12} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{tip.title}</p>
                    <p className="text-[10px] text-gray-600 leading-relaxed mt-0.5">{tip.text}</p>
                  </div>
                  <button
                    onClick={() => setDismissed([...dismissed, tip.id])}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <FaTimes size={10} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
