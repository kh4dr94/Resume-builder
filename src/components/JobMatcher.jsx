import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBriefcase, FaBullseye, FaTimes, FaCheckCircle, FaExclamationTriangle, FaPlus } from 'react-icons/fa'

// Common stop words to ignore in matching
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall',
  'can', 'this', 'that', 'these', 'those', 'it', 'its', 'we', 'you', 'they', 'he', 'she',
  'our', 'your', 'their', 'my', 'his', 'her', 'as', 'if', 'then', 'than', 'so', 'no',
  'not', 'only', 'very', 'just', 'also', 'about', 'up', 'out', 'all', 'more', 'some',
  'any', 'each', 'every', 'both', 'few', 'most', 'other', 'into', 'over', 'such',
  'after', 'before', 'between', 'under', 'above', 'through', 'during', 'without',
  'again', 'further', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
  'what', 'which', 'who', 'whom', 'while', 'able', 'etc', 'per', 'via',
  'experience', 'required', 'preferred', 'requirements', 'responsibilities',
  'position', 'role', 'looking', 'work', 'working', 'team', 'join', 'company',
  'opportunity', 'strong', 'excellent', 'good', 'great', 'well', 'must', 'need',
  'including', 'ability', 'skills', 'knowledge', 'using', 'new', 'year', 'years',
])

function extractKeywords(text) {
  if (!text) return []
  const words = text.toLowerCase()
    .replace(/[^a-z0-9+#.\-/\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))

  // Also detect multi-word terms (2-word phrases)
  const phrases = []
  const cleanWords = text.toLowerCase().replace(/[^a-z0-9+#.\-/\s]/g, ' ').split(/\s+/)
  for (let i = 0; i < cleanWords.length - 1; i++) {
    const phrase = cleanWords[i] + ' ' + cleanWords[i + 1]
    if (!STOP_WORDS.has(cleanWords[i]) && !STOP_WORDS.has(cleanWords[i + 1]) && cleanWords[i].length > 2 && cleanWords[i + 1].length > 2) {
      phrases.push(phrase)
    }
  }

  // Count frequency
  const freq = {}
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })
  phrases.forEach(p => { freq[p] = (freq[p] || 0) + 1 })

  // Return sorted by frequency, top keywords
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([word]) => word)
}

function getResumeText(data) {
  const parts = []
  if (data.personalInfo) {
    parts.push(data.personalInfo.title || '')
    parts.push(data.personalInfo.summary || '')
  }
  if (data.experience) {
    data.experience.forEach(exp => {
      parts.push(exp.position || '')
      parts.push(exp.description || '')
    })
  }
  if (data.education) {
    data.education.forEach(edu => {
      parts.push(edu.degree || '')
      parts.push(edu.field || '')
    })
  }
  if (data.skills) {
    parts.push(data.skills.join(' '))
  }
  if (data.certifications) {
    data.certifications.forEach(cert => {
      parts.push(cert.name || '')
    })
  }
  if (data.customSections) {
    data.customSections.forEach(sec => {
      parts.push(sec.title || '')
      parts.push(sec.content || '')
    })
  }
  return parts.join(' ').toLowerCase()
}

export default function JobMatcher({ data, darkMode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [jobDescription, setJobDescription] = useState('')

  const analysis = useMemo(() => {
    if (!jobDescription.trim()) return null

    const jobKeywords = extractKeywords(jobDescription)
    const resumeText = getResumeText(data)

    const matched = []
    const missing = []

    jobKeywords.forEach(keyword => {
      if (resumeText.includes(keyword)) {
        matched.push(keyword)
      } else {
        missing.push(keyword)
      }
    })

    const score = jobKeywords.length > 0
      ? Math.round((matched.length / jobKeywords.length) * 100)
      : 0

    return { jobKeywords, matched, missing, score }
  }, [jobDescription, data])

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-500'
    if (score >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBg = (score) => {
    if (score >= 75) return 'from-green-500 to-emerald-600'
    if (score >= 50) return 'from-yellow-500 to-amber-600'
    return 'from-red-500 to-rose-600'
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-cyan-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-cyan-600'}`}
        title="Job Description Matcher"
      >
        <FaBullseye size={12} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              {/* Header */}
              <div className={`sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FaBullseye className="text-white" size={14} />
                  </div>
                  <div>
                    <h2 className={`text-[15px] font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Job Description Matcher</h2>
                    <p className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Paste a job posting to see how well your resume matches</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Input */}
                <div>
                  <label className={`block text-[12px] font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl border text-sm resize-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-cyan-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-cyan-500'} focus:ring-2 focus:ring-cyan-500/20`}
                  />
                </div>

                {/* Results */}
                {analysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Score */}
                    <div className={`p-5 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[12px] font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Match Score</span>
                        <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}%</span>
                      </div>
                      <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.score}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-gradient-to-r ${getScoreBg(analysis.score)}`}
                        />
                      </div>
                      <p className={`text-[11px] mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {analysis.matched.length} of {analysis.jobKeywords.length} keywords found in your resume
                      </p>
                    </div>

                    {/* Matched Keywords */}
                    {analysis.matched.length > 0 && (
                      <div>
                        <h3 className={`text-[12px] font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                          <FaCheckCircle size={11} />
                          Matched Keywords ({analysis.matched.length})
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.matched.map((kw, i) => (
                            <span key={i} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${darkMode ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Keywords */}
                    {analysis.missing.length > 0 && (
                      <div>
                        <h3 className={`text-[12px] font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                          <FaExclamationTriangle size={11} />
                          Missing Keywords ({analysis.missing.length}) — Consider Adding
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.missing.map((kw, i) => (
                            <span key={i} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${darkMode ? 'bg-amber-900/30 text-amber-400 border border-amber-800/50' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions */}
                    <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-blue-50/50 border-blue-100'}`}>
                      <h3 className={`text-[12px] font-semibold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                        💡 Suggestions
                      </h3>
                      <ul className={`text-[11px] space-y-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {analysis.score < 50 && <li>• Your resume needs significant updates to match this job posting</li>}
                        {analysis.score >= 50 && analysis.score < 75 && <li>• Good match! Add a few more relevant keywords to improve your chances</li>}
                        {analysis.score >= 75 && <li>• Excellent match! Your resume is well-aligned with this job</li>}
                        {analysis.missing.length > 0 && (
                          <li>• Add these skills to your resume: <strong>{analysis.missing.slice(0, 5).join(', ')}</strong></li>
                        )}
                        {analysis.missing.length > 5 && (
                          <li>• Consider tailoring your experience descriptions to include more relevant keywords</li>
                        )}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
