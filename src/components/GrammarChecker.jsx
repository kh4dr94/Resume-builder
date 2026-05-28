import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSpellCheck, FaTimes, FaCheck, FaExclamationCircle, FaExclamationTriangle } from 'react-icons/fa'

// Weak words and their stronger alternatives
const WEAK_WORDS = {
  'responsible for': ['managed', 'led', 'directed', 'oversaw'],
  'helped with': ['contributed to', 'facilitated', 'supported', 'enabled'],
  'worked on': ['developed', 'built', 'designed', 'engineered'],
  'in charge of': ['led', 'managed', 'directed', 'spearheaded'],
  'took care of': ['managed', 'maintained', 'administered'],
  'dealt with': ['resolved', 'handled', 'addressed', 'managed'],
  'was involved in': ['contributed to', 'participated in', 'drove'],
  'assisted with': ['supported', 'facilitated', 'enabled'],
  'did work on': ['developed', 'executed', 'implemented'],
  'made improvements': ['improved', 'optimized', 'enhanced', 'streamlined'],
}

// Passive voice patterns
const PASSIVE_PATTERNS = [
  { regex: /\b(was|were)\s+(managed|created|built|developed|designed|handled|processed|completed|assigned|given|told|asked|made|done)\b/gi, label: 'passive voice' },
  { regex: /\b(has|have|had)\s+been\s+\w+ed\b/gi, label: 'passive voice' },
  { regex: /\b(is|are|was|were)\s+being\s+\w+ed\b/gi, label: 'passive voice' },
]

// First-person pronouns
const PRONOUN_REGEX = /\b(I|me|my|myself|mine)\b/g

// Overused word detection threshold
const OVERUSE_THRESHOLD = 3

function getAllText(data) {
  const texts = []
  if (data.personalInfo?.summary) {
    texts.push({ section: 'Summary', text: data.personalInfo.summary })
  }
  if (data.experience) {
    data.experience.forEach((exp, idx) => {
      if (exp.description) {
        texts.push({ section: `Experience - ${exp.position || exp.company || `#${idx + 1}`}`, text: exp.description })
      }
    })
  }
  if (data.customSections) {
    data.customSections.forEach(sec => {
      if (sec.content) {
        texts.push({ section: `Custom - ${sec.title || 'Untitled'}`, text: sec.content })
      }
    })
  }
  return texts
}

function analyzeText(textEntries) {
  const issues = []

  textEntries.forEach(({ section, text }) => {
    const lines = text.split('\n').filter(l => l.trim())

    lines.forEach((line, lineIdx) => {
      const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim()
      if (!cleanLine) return

      // Check weak words
      Object.entries(WEAK_WORDS).forEach(([weak, alternatives]) => {
        const regex = new RegExp(`\\b${weak}\\b`, 'gi')
        if (regex.test(cleanLine)) {
          issues.push({
            id: `weak-${section}-${lineIdx}-${weak}`,
            type: 'weak-word',
            severity: 'warning',
            section,
            line: cleanLine,
            lineIndex: lineIdx,
            message: `"${weak}" is a weak phrase`,
            suggestion: `Replace with: ${alternatives.join(', ')}`,
            fix: { find: weak, replace: alternatives[0] },
          })
        }
      })

      // Check passive voice
      PASSIVE_PATTERNS.forEach(({ regex, label }) => {
        regex.lastIndex = 0
        const match = regex.exec(cleanLine)
        if (match) {
          issues.push({
            id: `passive-${section}-${lineIdx}-${match[0]}`,
            type: 'passive-voice',
            severity: 'warning',
            section,
            line: cleanLine,
            lineIndex: lineIdx,
            message: `Passive voice detected: "${match[0]}"`,
            suggestion: 'Rewrite using active voice with a strong action verb',
            fix: null,
          })
        }
      })

      // Check first-person pronouns
      const pronounMatch = cleanLine.match(PRONOUN_REGEX)
      if (pronounMatch) {
        issues.push({
          id: `pronoun-${section}-${lineIdx}`,
          type: 'pronoun',
          severity: 'critical',
          section,
          line: cleanLine,
          lineIndex: lineIdx,
          message: `First-person pronoun "${pronounMatch[0]}" found`,
          suggestion: 'Remove pronouns — resumes should not use I/me/my',
          fix: { find: pronounMatch[0], replace: '' },
        })
      }

      // Check missing periods at end of bullet points
      if (cleanLine.length > 15 && /^[A-Z]/.test(cleanLine) && !/[.!?]$/.test(cleanLine)) {
        issues.push({
          id: `period-${section}-${lineIdx}`,
          type: 'punctuation',
          severity: 'suggestion',
          section,
          line: cleanLine,
          lineIndex: lineIdx,
          message: 'Missing period at end of bullet point',
          suggestion: 'Add a period for consistency',
          fix: { find: cleanLine, replace: cleanLine + '.' },
        })
      }
    })
  })

  // Check for overused words across all text
  const allText = textEntries.map(t => t.text).join(' ').toLowerCase()
  const wordCounts = {}
  allText.replace(/[^a-z\s]/g, '').split(/\s+/).forEach(w => {
    if (w.length > 4) wordCounts[w] = (wordCounts[w] || 0) + 1
  })
  const overused = Object.entries(wordCounts)
    .filter(([, count]) => count >= OVERUSE_THRESHOLD)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  if (overused.length > 0) {
    overused.forEach(([word, count]) => {
      issues.push({
        id: `overuse-${word}`,
        type: 'overused',
        severity: 'suggestion',
        section: 'All Sections',
        line: '',
        lineIndex: -1,
        message: `"${word}" appears ${count} times across your resume`,
        suggestion: 'Use synonyms for variety',
        fix: null,
      })
    })
  }

  // Check tense consistency for non-current jobs
  textEntries.forEach(({ section, text }) => {
    if (!section.startsWith('Experience')) return
    const lines = text.split('\n').filter(l => l.replace(/^[•\-\*]\s*/, '').trim())
    const presentTense = /\b(manage|lead|develop|create|build|design|implement|drive|handle)\b/i
    const pastTense = /\b(managed|led|developed|created|built|designed|implemented|drove|handled)\b/i
    let hasPast = false
    let hasPresent = false
    lines.forEach(l => {
      if (pastTense.test(l)) hasPast = true
      if (presentTense.test(l)) hasPresent = true
    })
    if (hasPast && hasPresent) {
      issues.push({
        id: `tense-${section}`,
        type: 'tense',
        severity: 'warning',
        section,
        line: '',
        lineIndex: -1,
        message: 'Inconsistent tense — mixes past and present tense',
        suggestion: 'Use past tense for previous roles, present tense only for current position',
        fix: null,
      })
    }
  })

  return issues
}

export default function GrammarChecker({ data, darkMode, onFix }) {
  const [isOpen, setIsOpen] = useState(false)

  const textEntries = useMemo(() => getAllText(data), [data])
  const issues = useMemo(() => analyzeText(textEntries), [textEntries])

  const criticalCount = issues.filter(i => i.severity === 'critical').length
  const warningCount = issues.filter(i => i.severity === 'warning').length
  const suggestionCount = issues.filter(i => i.severity === 'suggestion').length

  const handleFix = (issue) => {
    if (!issue.fix || !onFix) return
    onFix(issue)
  }

  const severityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <FaExclamationCircle className="text-red-500" size={12} />
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" size={12} />
      default: return <FaExclamationTriangle className="text-blue-400" size={12} />
    }
  }

  const severityBadge = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50'
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50'
      default: return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50'
    }
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border relative ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-emerald-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-emerald-600'}`}
        title="Grammar & Spelling Checker"
      >
        <FaSpellCheck size={12} />
        {issues.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            {issues.length > 9 ? '9+' : issues.length}
          </span>
        )}
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
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaSpellCheck className="text-white" size={18} />
                  <div>
                    <h2 className="text-white font-bold text-lg">Grammar & Style Checker</h2>
                    <p className="text-white/70 text-xs">{issues.length} issue{issues.length !== 1 ? 's' : ''} found</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] scrollbar-thin">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className={`p-3 rounded-xl border text-center ${darkMode ? 'bg-red-900/20 border-red-800/40' : 'bg-red-50 border-red-200'}`}>
                    <p className="text-red-500 text-lg font-bold">{criticalCount}</p>
                    <p className={`text-[10px] font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Critical</p>
                  </div>
                  <div className={`p-3 rounded-xl border text-center ${darkMode ? 'bg-yellow-900/20 border-yellow-800/40' : 'bg-yellow-50 border-yellow-200'}`}>
                    <p className="text-yellow-500 text-lg font-bold">{warningCount}</p>
                    <p className={`text-[10px] font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>Warnings</p>
                  </div>
                  <div className={`p-3 rounded-xl border text-center ${darkMode ? 'bg-blue-900/20 border-blue-800/40' : 'bg-blue-50 border-blue-200'}`}>
                    <p className="text-blue-500 text-lg font-bold">{suggestionCount}</p>
                    <p className={`text-[10px] font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Suggestions</p>
                  </div>
                </div>

                {/* Issues List */}
                {issues.length === 0 ? (
                  <div className={`text-center py-10 rounded-xl border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <FaCheck className="mx-auto text-green-500 mb-2" size={24} />
                    <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No issues found!</p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Your resume looks great</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {issues.map(issue => (
                      <div
                        key={issue.id}
                        className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {severityIcon(issue.severity)}
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${severityBadge(issue.severity)}`}>
                                {issue.type.replace('-', ' ')}
                              </span>
                              <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {issue.section}
                              </span>
                            </div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {issue.message}
                            </p>
                            {issue.line && (
                              <p className={`text-xs mt-1 truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                &ldquo;{issue.line.slice(0, 80)}{issue.line.length > 80 ? '...' : ''}&rdquo;
                              </p>
                            )}
                            <p className={`text-xs mt-1.5 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              💡 {issue.suggestion}
                            </p>
                          </div>
                          {issue.fix && onFix && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleFix(issue)}
                              className="shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold"
                            >
                              Fix
                            </motion.button>
                          )}
                        </div>
                      </div>
                    ))}
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
