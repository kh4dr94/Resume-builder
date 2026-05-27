import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaFileWord, FaExclamationTriangle } from 'react-icons/fa'

function countWords(data) {
  let text = ''

  // Personal info
  text += ' ' + (data.personalInfo.fullName || '')
  text += ' ' + (data.personalInfo.title || '')
  text += ' ' + (data.personalInfo.summary || '')
  text += ' ' + (data.personalInfo.location || '')

  // Experience
  ;(data.experience || []).forEach(exp => {
    text += ' ' + (exp.company || '')
    text += ' ' + (exp.position || '')
    text += ' ' + (exp.description || '')
  })

  // Education
  ;(data.education || []).forEach(edu => {
    text += ' ' + (edu.institution || '')
    text += ' ' + (edu.degree || '')
    text += ' ' + (edu.field || '')
  })

  // Skills
  text += ' ' + (data.skills || []).join(' ')

  // Certifications
  ;(data.certifications || []).forEach(cert => {
    text += ' ' + (cert.name || '')
    text += ' ' + (cert.issuer || '')
  })

  // Languages
  ;(data.languages || []).forEach(lang => {
    text += ' ' + (lang.language || '')
    text += ' ' + (lang.proficiency || '')
  })

  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  return words.length
}

export default function WordCount({ data, darkMode }) {
  const wordCount = useMemo(() => countWords(data), [data])
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 400))
  const isOverTwoPages = estimatedPages > 2

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border mb-3 ${
        darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200/80'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <FaFileWord className={`${darkMode ? 'text-blue-400' : 'text-blue-500'}`} size={12} />
        <span className={`text-[11px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {wordCount} words
        </span>
        <div className={`h-3 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <span className={`text-[11px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          ~{estimatedPages} {estimatedPages === 1 ? 'page' : 'pages'}
        </span>
      </div>

      {isOverTwoPages && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200"
        >
          <FaExclamationTriangle className="text-amber-500" size={9} />
          <span className="text-[10px] font-semibold text-amber-700">Over 2 pages</span>
        </motion.div>
      )}
    </motion.div>
  )
}
