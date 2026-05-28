import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChartBar, FaTimes, FaCheck, FaArrowRight, FaPen } from 'react-icons/fa'

// Patterns that detect vague statements
const VAGUE_PATTERNS = [
  {
    regex: /\b(led|managed|supervised)\s+(a\s+)?team\b/i,
    question: 'How many people were on the team?',
    template: (original, answer) => original.replace(/\b(led|managed|supervised)\s+(a\s+)?team\b/i, `$1 a team of ${answer} people`),
  },
  {
    regex: /\b(improved|increased|boosted|enhanced|grew)\s+\w*\s*(performance|efficiency|productivity|speed|revenue|sales|growth)\b/i,
    question: 'By what percentage or amount did it improve?',
    template: (original, answer) => original.replace(/(improved|increased|boosted|enhanced|grew)/i, `$1 by ${answer}`),
  },
  {
    regex: /\b(reduced|decreased|cut|lowered)\s+\w*\s*(costs?|time|errors?|bugs?|latency|downtime)\b/i,
    question: 'By what percentage or amount was it reduced?',
    template: (original, answer) => original.replace(/(reduced|decreased|cut|lowered)/i, `$1 by ${answer}`),
  },
  {
    regex: /\b(serving|supporting|handling|impacting|reaching)\s+(users?|customers?|clients?|people)\b/i,
    question: 'How many users/customers were served?',
    template: (original, answer) => original.replace(/(serving|supporting|handling|impacting|reaching)\s+(users?|customers?|clients?|people)/i, `$1 ${answer}+ $2`),
  },
  {
    regex: /\b(built|developed|created|designed|launched)\s+(a\s+)?(platform|system|application|app|tool|product|feature)\b/i,
    question: 'What scale did it reach? (users, transactions, etc.)',
    template: (original, answer) => original + ` serving ${answer}`,
  },
  {
    regex: /\b(trained|mentored|coached|onboarded)\s+(new\s+)?(employees?|engineers?|developers?|staff|members?|hires?)\b/i,
    question: 'How many people did you train/mentor?',
    template: (original, answer) => original.replace(/(trained|mentored|coached|onboarded)\s+(new\s+)?/i, `$1 ${answer} `),
  },
  {
    regex: /\b(generated|saved|delivered)\b.*\b(revenue|savings?|value|results?)\b/i,
    question: 'What was the dollar amount or percentage?',
    template: (original, answer) => original.replace(/(generated|saved|delivered)/i, `$1 $${answer} in`),
  },
  {
    regex: /\bprocessing\b/i,
    question: 'What volume was being processed? (e.g., 10M events/day)',
    template: (original, answer) => original.replace(/processing/i, `processing ${answer}`),
  },
]

function findVagueStatements(text) {
  if (!text) return []
  const lines = text.split('\n').filter(l => l.trim())
  const results = []

  lines.forEach((line, lineIdx) => {
    const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim()
    if (!cleanLine) return

    // Skip lines that already have numbers/percentages
    if (/\d+[%+KMBk]|\$\d/.test(cleanLine)) return

    VAGUE_PATTERNS.forEach((pattern) => {
      if (pattern.regex.test(cleanLine)) {
        // Avoid duplicates for the same line
        if (!results.find(r => r.lineIndex === lineIdx)) {
          results.push({
            id: `${lineIdx}-${pattern.question}`,
            line: cleanLine,
            fullLine: line,
            lineIndex: lineIdx,
            question: pattern.question,
            template: pattern.template,
            answer: '',
          })
        }
      }
    })
  })

  return results
}

export default function AchievementQuantifier({ data, darkMode, onUpdateExperience }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedExpIdx, setSelectedExpIdx] = useState(0)
  const [statements, setStatements] = useState([])
  const [appliedCount, setAppliedCount] = useState(0)

  const experiences = useMemo(() => {
    return (data.experience || []).filter(exp => exp.description && exp.description.trim())
  }, [data])

  const handleOpen = () => {
    setIsOpen(true)
    setSelectedExpIdx(0)
    setAppliedCount(0)
    if (experiences.length > 0) {
      const found = findVagueStatements(experiences[0].description)
      setStatements(found)
    }
  }

  const handleSelectExperience = (idx) => {
    setSelectedExpIdx(idx)
    const found = findVagueStatements(experiences[idx]?.description || '')
    setStatements(found)
  }

  const handleAnswerChange = (stmtId, value) => {
    setStatements(prev => prev.map(s => s.id === stmtId ? { ...s, answer: value } : s))
  }

  const handleApply = (stmt) => {
    if (!stmt.answer.trim() || !onUpdateExperience) return
    const exp = experiences[selectedExpIdx]
    if (!exp) return

    const newLine = stmt.template(stmt.fullLine, stmt.answer.trim())
    const lines = exp.description.split('\n')
    lines[stmt.lineIndex] = newLine

    onUpdateExperience(exp.id, lines.join('\n'))
    setAppliedCount(prev => prev + 1)

    // Remove applied statement
    setStatements(prev => prev.filter(s => s.id !== stmt.id))
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-orange-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-orange-600'}`}
        title="Achievement Quantifier"
      >
        <FaChartBar size={12} />
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
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaChartBar className="text-white" size={18} />
                  <div>
                    <h2 className="text-white font-bold text-lg">Achievement Quantifier</h2>
                    <p className="text-white/70 text-xs">Add numbers to make your bullets more impactful</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] scrollbar-thin">
                {experiences.length === 0 ? (
                  <div className={`text-center py-10 rounded-xl border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Add experience with descriptions to get quantification suggestions.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Experience Selector */}
                    <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
                      {experiences.map((exp, idx) => (
                        <button
                          key={exp.id}
                          onClick={() => handleSelectExperience(idx)}
                          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                            selectedExpIdx === idx
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400'
                              : darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {exp.position || exp.company || `Experience ${idx + 1}`}
                        </button>
                      ))}
                    </div>

                    {/* Applied Count */}
                    {appliedCount > 0 && (
                      <div className={`mb-4 p-3 rounded-xl border flex items-center gap-2 ${darkMode ? 'bg-green-900/20 border-green-800/40' : 'bg-green-50 border-green-200'}`}>
                        <FaCheck className="text-green-500" size={12} />
                        <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                          {appliedCount} bullet{appliedCount !== 1 ? 's' : ''} quantified!
                        </span>
                      </div>
                    )}

                    {/* Statements */}
                    {statements.length === 0 ? (
                      <div className={`text-center py-8 rounded-xl border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <FaCheck className="mx-auto text-green-500 mb-2" size={24} />
                        <p className={`font-medium text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          All bullets are well-quantified!
                        </p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          No vague statements detected for this experience.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {statements.length} vague bullet{statements.length !== 1 ? 's' : ''} detected — add numbers to strengthen them:
                        </p>
                        {statements.map(stmt => (
                          <motion.div
                            key={stmt.id}
                            layout
                            className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-orange-50/50 border-orange-200'}`}
                          >
                            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              <FaPen size={9} className="inline mr-2 text-orange-500" />
                              &ldquo;{stmt.line}&rdquo;
                            </p>
                            <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                              {stmt.question}
                            </p>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={stmt.answer}
                                onChange={e => handleAnswerChange(stmt.id, e.target.value)}
                                placeholder="e.g., 12, 50%, $2M"
                                className={`flex-1 px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-800 placeholder:text-gray-400'} focus:outline-none focus:ring-2 focus:ring-orange-500/30`}
                              />
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleApply(stmt)}
                                disabled={!stmt.answer.trim()}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                              >
                                Apply <FaArrowRight size={9} />
                              </motion.button>
                            </div>
                            {stmt.answer.trim() && (
                              <p className={`text-[11px] mt-2 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Preview: &ldquo;{stmt.template(stmt.fullLine, stmt.answer.trim()).replace(/^[•\-\*]\s*/, '')}&rdquo;
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
