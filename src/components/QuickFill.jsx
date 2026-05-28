import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBolt, FaTimes, FaClipboardList } from 'react-icons/fa'

function extractData(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const result = { name: '', title: '', summary: '', skills: [] }

  // Try to extract name (first line that looks like a name - 2-4 capitalized words)
  for (const line of lines.slice(0, 5)) {
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(line) && !result.name) {
      result.name = line
      continue
    }
  }

  // Try to extract title (common job title patterns)
  const titlePatterns = /\b(senior|junior|lead|principal|staff|chief|head of|director|manager|engineer|developer|designer|analyst|consultant|architect|specialist|coordinator|vp|cto|ceo|cfo)\b/i
  for (const line of lines.slice(0, 10)) {
    if (titlePatterns.test(line) && line.length < 80 && line !== result.name && !result.title) {
      result.title = line.replace(/^[-•|]\s*/, '')
      break
    }
  }

  // Extract skills from lines with common skill patterns
  const skillKeywords = /\b(javascript|typescript|react|angular|vue|node|python|java|c\+\+|c#|go|rust|ruby|php|swift|kotlin|sql|nosql|mongodb|postgresql|mysql|aws|azure|gcp|docker|kubernetes|git|agile|scrum|html|css|sass|graphql|rest|api|machine learning|ai|data science|figma|sketch|photoshop|jira|confluence|terraform|jenkins|ci\/cd)\b/gi
  const foundSkills = new Set()
  for (const line of lines) {
    const matches = line.match(skillKeywords)
    if (matches) {
      matches.forEach(s => foundSkills.add(s.charAt(0).toUpperCase() + s.slice(1)))
    }
  }
  result.skills = [...foundSkills].slice(0, 12)

  // Extract summary - look for "about" section or longest paragraph
  const aboutIdx = lines.findIndex(l => /^about\s*(me)?$/i.test(l) || /^summary$/i.test(l) || /^profile$/i.test(l))
  if (aboutIdx >= 0) {
    const summaryLines = []
    for (let i = aboutIdx + 1; i < lines.length && i < aboutIdx + 6; i++) {
      if (/^(experience|education|skills|certifications|projects)/i.test(lines[i])) break
      summaryLines.push(lines[i])
    }
    result.summary = summaryLines.join(' ')
  } else {
    // Use longest line/paragraph as summary
    const longest = lines.filter(l => l.length > 50).sort((a, b) => b.length - a.length)[0]
    if (longest) result.summary = longest
  }

  return result
}

export default function QuickFill({ onApply, darkMode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [preview, setPreview] = useState(null)

  const handleParse = () => {
    if (!text.trim()) return
    const extracted = extractData(text)
    setPreview(extracted)
  }

  const handleApply = () => {
    if (preview) {
      onApply(preview)
      setIsOpen(false)
      setText('')
      setPreview(null)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setText('')
    setPreview(null)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all border ${
          darkMode
            ? 'bg-amber-900/30 border-amber-700/50 text-amber-400 hover:bg-amber-900/50'
            : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
        }`}
      >
        <FaBolt size={11} />
        Quick Fill
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <FaClipboardList className="text-white" size={14} />
                  </div>
                  <div>
                    <h3 className={`text-[15px] font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Fill</h3>
                    <p className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Paste text from LinkedIn, a bio, or job posting
                    </p>
                  </div>
                </div>
                <button onClick={handleClose} className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'}`}>
                  <FaTimes size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-4 space-y-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your LinkedIn About section, bio, or any text with your professional info here..."
                  rows={6}
                  className={`w-full rounded-xl border px-4 py-3 text-[13px] resize-none outline-none transition-colors ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500'
                      : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-amber-400'
                  }`}
                />

                {!preview && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleParse}
                    disabled={!text.trim()}
                    className={`w-full py-2.5 rounded-xl font-semibold text-[13px] transition-all ${
                      text.trim()
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Extract Information
                  </motion.button>
                )}

                {preview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl border p-4 space-y-2 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <p className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Extracted Data</p>
                    {preview.name && (
                      <p className={`text-[13px] ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        <span className="font-semibold">Name:</span> {preview.name}
                      </p>
                    )}
                    {preview.title && (
                      <p className={`text-[13px] ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        <span className="font-semibold">Title:</span> {preview.title}
                      </p>
                    )}
                    {preview.summary && (
                      <p className={`text-[13px] ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        <span className="font-semibold">Summary:</span> {preview.summary.slice(0, 120)}...
                      </p>
                    )}
                    {preview.skills.length > 0 && (
                      <div>
                        <span className={`text-[13px] font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Skills: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {preview.skills.map((s, i) => (
                            <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full ${darkMode ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleApply}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-[12px] shadow-md shadow-green-500/25"
                      >
                        Apply to Resume
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPreview(null)}
                        className={`px-4 py-2 rounded-xl font-semibold text-[12px] border ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'}`}
                      >
                        Re-parse
                      </motion.button>
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
