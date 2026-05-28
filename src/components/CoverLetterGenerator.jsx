import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEnvelope, FaTimes, FaCopy, FaCheck, FaSpinner } from 'react-icons/fa'

const INTRO_PHRASES = [
  "I am writing to express my strong interest in the",
  "I am excited to apply for the",
  "With great enthusiasm, I am applying for the",
]

const BODY_PHRASES = [
  "In my current role, I have successfully",
  "Throughout my career, I have demonstrated",
  "My experience includes",
]

const CLOSING_PHRASES = [
  "I am confident that my skills and experience make me an excellent fit for this role. I would welcome the opportunity to discuss how I can contribute to your team.",
  "I look forward to the possibility of bringing my expertise to your organization and would be happy to discuss my qualifications further.",
  "Thank you for considering my application. I am eager to bring my experience and passion to this exciting opportunity.",
]

function generateLetters(data, jobTitle, companyName) {
  const name = data.personalInfo?.fullName || 'the applicant'
  const title = data.personalInfo?.title || 'professional'
  const skills = (data.skills || []).filter(s => s.trim()).slice(0, 5)
  const experience = data.experience || []
  const topExp = experience[0]

  const letters = []

  for (let i = 0; i < 3; i++) {
    const intro = `${INTRO_PHRASES[i]} ${jobTitle} position at ${companyName}. As a ${title} with a proven track record, I believe my background aligns perfectly with what you're looking for.`

    let body = ''
    if (topExp && topExp.company) {
      body = `${BODY_PHRASES[i]} delivered impactful results. At ${topExp.company} as ${topExp.position || 'a key contributor'}, I developed expertise that directly relates to this opportunity.`
    } else {
      body = `${BODY_PHRASES[i]} a commitment to excellence and continuous growth in my field.`
    }

    if (skills.length > 0) {
      body += ` My key competencies include ${skills.join(', ')}, which I am eager to apply in the ${jobTitle} role at ${companyName}.`
    }

    const closing = `${CLOSING_PHRASES[i]}\n\nSincerely,\n${name}`

    letters.push(`Dear Hiring Manager,\n\n${intro}\n\n${body}\n\n${closing}`)
  }

  return letters
}

export default function CoverLetterGenerator({ data, darkMode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [letters, setLetters] = useState([])
  const [generating, setGenerating] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const handleGenerate = () => {
    if (!jobTitle.trim() || !companyName.trim()) return
    setGenerating(true)
    setTimeout(() => {
      const generated = generateLetters(data, jobTitle.trim(), companyName.trim())
      setLetters(generated)
      setGenerating(false)
    }, 800)
  }

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    }
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-pink-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-pink-600'}`}
        title="Cover Letter Generator"
      >
        <FaEnvelope size={12} />
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
              <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-white" size={18} />
                  <h2 className="text-white font-bold text-lg">Cover Letter Generator</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] scrollbar-thin">
                {/* Inputs */}
                <div className="space-y-3 mb-5">
                  <div>
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Job Title</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Frontend Developer"
                      className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-pink-500/30`}
                    />
                  </div>
                  <div>
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Google"
                      className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-pink-500/30`}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    disabled={generating || !jobTitle.trim() || !companyName.trim()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {generating ? <FaSpinner className="animate-spin" size={14} /> : null}
                    {generating ? 'Generating...' : 'Generate 3 Cover Letters'}
                  </motion.button>
                </div>

                {/* Generated Letters */}
                {letters.length > 0 && (
                  <div className="space-y-4">
                    {letters.map((letter, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl border p-4 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Draft {idx + 1}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopy(letter, idx)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${copiedIndex === idx ? 'bg-green-100 text-green-700' : darkMode ? 'bg-gray-600 text-gray-300 hover:text-white' : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-800'}`}
                          >
                            {copiedIndex === idx ? <FaCheck size={10} /> : <FaCopy size={10} />}
                            {copiedIndex === idx ? 'Copied!' : 'Copy'}
                          </motion.button>
                        </div>
                        <pre className={`whitespace-pre-wrap text-sm leading-relaxed font-sans ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {letter}
                        </pre>
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
