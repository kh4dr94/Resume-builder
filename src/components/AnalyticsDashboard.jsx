import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChartBar, FaChevronDown, FaChevronUp } from 'react-icons/fa'

function getWordCount(text) {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

function getAllText(data) {
  const parts = []
  if (data?.personalInfo?.summary) parts.push(data.personalInfo.summary)
  ;(data?.experience || []).forEach(e => {
    if (e.description) parts.push(e.description)
    if (e.position) parts.push(e.position)
    if (e.company) parts.push(e.company)
  })
  ;(data?.education || []).forEach(e => {
    if (e.institution) parts.push(e.institution)
    if (e.degree) parts.push(e.degree)
    if (e.field) parts.push(e.field)
  })
  ;(data?.skills || []).forEach(s => { if (s.trim()) parts.push(s) })
  ;(data?.certifications || []).forEach(c => { if (c.name) parts.push(c.name) })
  return parts.join(' ')
}

function getActionVerbs(text) {
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'built', 'designed', 'implemented', 'improved', 'increased', 'reduced', 'achieved', 'delivered', 'launched', 'established', 'orchestrated', 'spearheaded', 'optimized', 'streamlined', 'mentored', 'architected', 'automated', 'contributed', 'coordinated', 'engineered', 'executed', 'generated', 'initiated', 'maintained', 'pioneered', 'resolved', 'transformed', 'utilized']
  const words = text.toLowerCase().split(/\s+/)
  let count = 0
  const found = new Set()
  words.forEach(w => {
    const clean = w.replace(/[^a-z]/g, '')
    if (actionVerbs.includes(clean)) {
      count++
      found.add(clean)
    }
  })
  return { count, verbs: [...found] }
}

function getKeywordDensity(text) {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'it', 'its', 'i', 'my', 'me', 'we', 'our', 'you', 'your', 'he', 'she', 'his', 'her', 'they', 'them', 'their', 'as', 'if', 'not', 'no', 'so', 'up', 'out', 'about', 'into', 'over', 'after', 'than', 'then', 'also'])
  const words = text.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9+#]/g, '')).filter(w => w.length > 2 && !stopWords.has(w))
  const freq = {}
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8)
}

export default function AnalyticsDashboard({ data, darkMode }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const analytics = useMemo(() => {
    const sections = {
      'Summary': getWordCount(data?.personalInfo?.summary),
      'Experience': (data?.experience || []).reduce((acc, e) => acc + getWordCount(e.description) + getWordCount(e.position) + getWordCount(e.company), 0),
      'Education': (data?.education || []).reduce((acc, e) => acc + getWordCount(e.institution) + getWordCount(e.degree) + getWordCount(e.field), 0),
      'Skills': (data?.skills || []).filter(s => s.trim()).length,
    }

    const totalWords = Object.values(sections).reduce((a, b) => a + b, 0)
    const maxWords = Math.max(...Object.values(sections), 1)

    const allText = getAllText(data)
    const { count: actionVerbCount, verbs } = getActionVerbs(allText)
    const keywords = getKeywordDensity(allText)

    // Completeness
    const completeness = {
      'Name': !!data?.personalInfo?.fullName,
      'Title': !!data?.personalInfo?.title,
      'Email': !!data?.personalInfo?.email,
      'Summary': !!data?.personalInfo?.summary,
      'Experience': (data?.experience || []).some(e => e.company && e.position),
      'Education': (data?.education || []).some(e => e.institution),
      'Skills': (data?.skills || []).some(s => s.trim()),
    }
    const completenessPercent = Math.round((Object.values(completeness).filter(Boolean).length / Object.keys(completeness).length) * 100)

    return { sections, totalWords, maxWords, actionVerbCount, verbs, keywords, completeness, completenessPercent }
  }, [data])

  return (
    <motion.div
      layout
      className={`rounded-xl border overflow-hidden transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${darkMode ? 'bg-purple-900/50' : 'bg-purple-50'}`}>
            <FaChartBar className="text-purple-500" size={12} />
          </div>
          <span className={`text-[13px] font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Resume Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            analytics.completenessPercent >= 80
              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
              : analytics.completenessPercent >= 50
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
          }`}>
            {analytics.completenessPercent}% complete
          </span>
          {isExpanded ? <FaChevronUp size={10} className="text-gray-400" /> : <FaChevronDown size={10} className="text-gray-400" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`px-4 pb-4 space-y-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              {/* Word Count Per Section */}
              <div className="pt-3">
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Words per Section ({analytics.totalWords} total)
                </p>
                <div className="space-y-1.5">
                  {Object.entries(analytics.sections).map(([name, count]) => (
                    <div key={name} className="flex items-center gap-2">
                      <span className={`text-[10px] w-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{name}</span>
                      <div className={`flex-1 h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / analytics.maxWords) * 100}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                        />
                      </div>
                      <span className={`text-[10px] w-8 text-right font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Verbs */}
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Action Verbs Found: {analytics.actionVerbCount}
                </p>
                {analytics.verbs.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {analytics.verbs.slice(0, 10).map((v, i) => (
                      <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded-full capitalize ${darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'}`}>
                        {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Keyword Density */}
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Top Keywords
                </p>
                {analytics.keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {analytics.keywords.map(([word, count], i) => (
                      <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                        {word} ({count})
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Add more content to see keywords</p>
                )}
              </div>

              {/* Completeness */}
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Section Completeness
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(analytics.completeness).map(([name, filled]) => (
                    <div key={name} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${filled ? 'bg-green-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                      <span className={`text-[10px] ${filled ? (darkMode ? 'text-gray-200' : 'text-gray-700') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
