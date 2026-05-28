import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaMagic, FaBullseye, FaTimes, FaCheckCircle, FaTimesCircle, FaArrowRight, FaArrowLeft, FaPlus, FaCheck } from 'react-icons/fa'

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

function extractTopKeywords(text, count = 10) {
  if (!text) return []
  const words = text.toLowerCase()
    .replace(/[^a-z0-9+#.\-/\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))

  const freq = {}
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })

  // Also detect 2-word phrases
  const cleaned = text.toLowerCase().replace(/[^a-z0-9+#.\-/\s]/g, ' ').split(/\s+/)
  for (let i = 0; i < cleaned.length - 1; i++) {
    if (!STOP_WORDS.has(cleaned[i]) && !STOP_WORDS.has(cleaned[i + 1]) && cleaned[i].length > 2 && cleaned[i + 1].length > 2) {
      const phrase = `${cleaned[i]} ${cleaned[i + 1]}`
      freq[phrase] = (freq[phrase] || 0) + 1
    }
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word, count]) => ({ word, count }))
}

function getResumeText(data) {
  const parts = []
  if (data.personalInfo) {
    parts.push(data.personalInfo.title || '', data.personalInfo.summary || '')
  }
  if (data.experience) {
    data.experience.forEach(exp => {
      parts.push(exp.position || '', exp.description || '')
    })
  }
  if (data.education) {
    data.education.forEach(edu => {
      parts.push(edu.degree || '', edu.field || '')
    })
  }
  if (data.skills) parts.push(data.skills.join(' '))
  if (data.certifications) {
    data.certifications.forEach(cert => parts.push(cert.name || ''))
  }
  return parts.join(' ').toLowerCase()
}

function generateSuggestion(keyword) {
  const skillSuggestions = [
    `Add "${keyword}" to your Skills section`,
    `Include "${keyword}" in a bullet point describing your technical expertise`,
  ]
  const bulletSuggestions = [
    `Leveraged ${keyword} to deliver scalable solutions and drive business outcomes`,
    `Applied ${keyword} methodology to improve team productivity and project delivery`,
    `Utilized ${keyword} to build robust systems serving high-traffic production environments`,
  ]
  return {
    keyword,
    whereToAdd: Math.random() > 0.5 ? 'Skills' : 'Experience',
    suggestion: Math.random() > 0.5 ? skillSuggestions[0] : skillSuggestions[1],
    sampleBullet: bulletSuggestions[Math.floor(Math.random() * bulletSuggestions.length)],
  }
}

export default function TailoringWizard({ data, darkMode, onApplySuggestions }) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [jobDescription, setJobDescription] = useState('')
  const [keywords, setKeywords] = useState([])
  const [matched, setMatched] = useState([])
  const [missing, setMissing] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [appliedCount, setAppliedCount] = useState(0)

  const handleAnalyze = () => {
    const topKW = extractTopKeywords(jobDescription, 10)
    setKeywords(topKW)
    setStep(2)
  }

  const handleMatchCheck = () => {
    const resumeText = getResumeText(data)
    const m = []
    const miss = []
    keywords.forEach(kw => {
      if (resumeText.includes(kw.word)) {
        m.push(kw)
      } else {
        miss.push(kw)
      }
    })
    setMatched(m)
    setMissing(miss)
    setSuggestions(miss.map(kw => generateSuggestion(kw.word)))
    setStep(3)
  }

  const handleApplyAll = () => {
    if (!onApplySuggestions) return
    const skillsToAdd = suggestions
      .filter(s => s.whereToAdd === 'Skills')
      .map(s => s.keyword)
    const bulletsToAdd = suggestions
      .filter(s => s.whereToAdd === 'Experience')
      .map(s => s.sampleBullet)

    onApplySuggestions({ skillsToAdd, bulletsToAdd })
    setAppliedCount(suggestions.length)
    setStep(4)
  }

  const score = keywords.length > 0 ? Math.round((matched.length / keywords.length) * 100) : 0
  const improvedScore = keywords.length > 0 ? Math.round(((matched.length + appliedCount) / keywords.length) * 100) : 0

  const handleReset = () => {
    setStep(1)
    setJobDescription('')
    setKeywords([])
    setMatched([])
    setMissing([])
    setSuggestions([])
    setAppliedCount(0)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setIsOpen(true); handleReset() }}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-violet-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-violet-600'}`}
        title="Resume Tailoring Wizard"
      >
        <FaBullseye size={12} />
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaMagic className="text-white" size={18} />
                  <div>
                    <h2 className="text-white font-bold text-lg">Resume Tailoring Wizard</h2>
                    <p className="text-white/70 text-xs">Step {step} of 4</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className={`h-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 4) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)] scrollbar-thin">
                {/* Step 1: Paste Job Description */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-violet-50 border-violet-200'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Paste a job description below and we&apos;ll identify the top keywords to help you tailor your resume.
                      </p>
                    </div>
                    <textarea
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here..."
                      rows={10}
                      className={`w-full px-4 py-3 rounded-xl border text-sm resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'} focus:outline-none focus:ring-2 focus:ring-violet-500/30`}
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAnalyze}
                      disabled={!jobDescription.trim()}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Analyze Keywords <FaArrowRight size={12} />
                    </motion.button>
                  </div>
                )}

                {/* Step 2: Show Keywords */}
                {step === 2 && (
                  <div className="space-y-4">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Top 10 keywords identified from the job description:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((kw, i) => (
                        <motion.span
                          key={kw.word}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${darkMode ? 'bg-violet-900/30 text-violet-300 border-violet-700/50' : 'bg-violet-50 text-violet-700 border-violet-200'}`}
                        >
                          {kw.word} <span className="opacity-60 text-xs">×{kw.count}</span>
                        </motion.span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className={`flex-1 py-2.5 rounded-xl border text-sm font-medium ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        <FaArrowLeft size={10} className="inline mr-2" /> Back
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleMatchCheck}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        Check My Resume <FaArrowRight size={12} />
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Step 3: Show matches and suggestions */}
                {step === 3 && (
                  <div className="space-y-5">
                    {/* Score */}
                    <div className={`p-4 rounded-xl border text-center ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Tailoring Score</p>
                      <p className={`text-3xl font-bold ${score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>{score}%</p>
                    </div>

                    {/* Matched */}
                    {matched.length > 0 && (
                      <div>
                        <p className={`text-xs font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                          <FaCheckCircle size={11} /> Already in your resume ({matched.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {matched.map(kw => (
                            <span key={kw.word} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${darkMode ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                              {kw.word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing with suggestions */}
                    {suggestions.length > 0 && (
                      <div>
                        <p className={`text-xs font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                          <FaTimesCircle size={11} /> Missing keywords — suggestions ({suggestions.length})
                        </p>
                        <div className="space-y-2">
                          {suggestions.map((s, i) => (
                            <div key={i} className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-amber-50/50 border-amber-200'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{s.keyword}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-md ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-white border border-gray-200 text-gray-500'}`}>
                                  → {s.whereToAdd}
                                </span>
                              </div>
                              <p className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {s.suggestion}
                              </p>
                              <p className={`text-[11px] italic mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                Sample: &ldquo;{s.sampleBullet}&rdquo;
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(2)}
                        className={`flex-1 py-2.5 rounded-xl border text-sm font-medium ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        <FaArrowLeft size={10} className="inline mr-2" /> Back
                      </button>
                      {suggestions.length > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleApplyAll}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2"
                        >
                          <FaPlus size={10} /> Apply All Suggestions
                        </motion.button>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Done */}
                {step === 4 && (
                  <div className="text-center py-8 space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <FaCheck className="mx-auto text-green-500" size={40} />
                    </motion.div>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Tailoring Complete!
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Applied {appliedCount} suggestions to your resume.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Before</p>
                        <p className="text-xl font-bold text-yellow-500">{score}%</p>
                      </div>
                      <FaArrowRight className="text-gray-400" />
                      <div className="text-center">
                        <p className="text-xs text-gray-500">After</p>
                        <p className="text-xl font-bold text-green-500">{Math.min(improvedScore, 100)}%</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsOpen(false)}
                      className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm"
                    >
                      Done
                    </motion.button>
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
