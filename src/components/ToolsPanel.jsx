import { useState, useEffect, useRef } from 'react'
import {
  FaShareAlt,
  FaEnvelope,
  FaBullseye,
  FaSpellCheck,
  FaCrosshairs,
  FaChartBar,
  FaGlobe,
  FaFileExport,
  FaFileImport,
  FaUndo,
  FaRedo,
  FaTimes,
  FaWrench,
  FaKey,
  FaFont,
  FaRulerVertical,
  FaRobot,
  FaCopy,
  FaTrashAlt,
  FaFileAlt,
  FaMagic,
} from 'react-icons/fa'

function ToolsBottomSheet({ isOpen, onClose, children, title }) {
  const sheetRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col animate-slide-up pb-[env(safe-area-inset-bottom,0px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200"
          >
            <FaTimes size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-12">
          {children}
        </div>
      </div>
    </div>
  )
}

function ShareSheet({ onClose, resumeData, onPrint }) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = () => {
    onPrint?.()
    onClose()
  }

  const handleCopyText = () => {
    const { personalInfo, experience, skills } = resumeData
    const text = [
      personalInfo.fullName,
      personalInfo.title,
      personalInfo.email,
      personalInfo.phone,
      '',
      personalInfo.summary,
      '',
      '--- Experience ---',
      ...experience.filter(e => e.company).map(e => `${e.position} at ${e.company}`),
      '',
      '--- Skills ---',
      skills.filter(s => s.trim()).join(', '),
    ].join('\n')
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resumeData.personalInfo.fullName || 'resume'}_data.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadTxt = () => {
    const { personalInfo, experience, education, skills, certifications, languages } = resumeData
    const lines = [
      personalInfo.fullName?.toUpperCase() || 'RESUME',
      personalInfo.title || '',
      [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | '),
      [personalInfo.linkedin, personalInfo.website].filter(Boolean).join(' | '),
      '',
      '═══ PROFESSIONAL SUMMARY ═══',
      personalInfo.summary || '',
      '',
      '═══ EXPERIENCE ═══',
      ...experience.filter(e => e.company).flatMap(e => [
        `${e.position} — ${e.company} (${e.startDate}${e.current ? ' - Present' : e.endDate ? ` - ${e.endDate}` : ''})`,
        e.description || '',
        '',
      ]),
      '═══ EDUCATION ═══',
      ...education.filter(e => e.institution).flatMap(e => [
        `${e.degree}${e.field ? ` in ${e.field}` : ''} — ${e.institution} (${e.startDate || ''}${e.endDate ? ` - ${e.endDate}` : ''})`,
        e.gpa ? `GPA: ${e.gpa}` : '',
        '',
      ]),
      '═══ SKILLS ═══',
      skills.filter(s => s.trim()).join(', '),
      '',
      certifications.some(c => c.name) ? '═══ CERTIFICATIONS ═══' : '',
      ...certifications.filter(c => c.name).map(c => `${c.name} — ${c.issuer || ''} (${c.date || ''})`),
      '',
      languages.some(l => l.language) ? '═══ LANGUAGES ═══' : '',
      ...languages.filter(l => l.language).map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`),
    ].filter(line => line !== undefined)
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${personalInfo.fullName || 'resume'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Resume - ${resumeData.personalInfo.fullName || 'My Resume'}`)
    const body = encodeURIComponent(`Hi,\n\nPlease find my resume at: ${window.location.href}\n\nBest regards,\n${resumeData.personalInfo.fullName || ''}`)
    window.open(`mailto:${email}?subject=${subject}&body=${body}`)
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 2000)
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Check out my resume: ${window.location.href}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleLinkedIn = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
  }

  const handleTwitter = () => {
    const text = encodeURIComponent(`Check out my professional resume! ${window.location.href}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  return (
    <div className="space-y-4">
      {/* Primary Action - PDF */}
      <button
        onClick={handleDownloadPDF}
        className="w-full flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl active:from-blue-700 active:to-indigo-700 transition-all shadow-md active:scale-[0.98]"
      >
        <span className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-lg">📄</span>
        <div className="text-left">
          <p className="text-sm font-semibold text-white">Download PDF</p>
          <p className="text-xs text-blue-100">Best for sharing with recruiters & employers</p>
        </div>
      </button>

      {/* Social Share */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Share link via</p>
        <div className="grid grid-cols-4 gap-2">
          <button onClick={handleWhatsApp} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-green-50 active:bg-green-100 transition-all active:scale-95">
            <span className="text-xl">💬</span>
            <span className="text-[10px] font-medium text-green-700">WhatsApp</span>
          </button>
          <button onClick={handleLinkedIn} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50 active:bg-blue-100 transition-all active:scale-95">
            <span className="text-xl">💼</span>
            <span className="text-[10px] font-medium text-blue-700">LinkedIn</span>
          </button>
          <button onClick={handleTwitter} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-sky-50 active:bg-sky-100 transition-all active:scale-95">
            <span className="text-xl">🐦</span>
            <span className="text-[10px] font-medium text-sky-700">Twitter</span>
          </button>
          <button onClick={handleCopyLink} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 active:bg-gray-100 transition-all active:scale-95">
            <span className="text-xl">{copied ? '✅' : '🔗'}</span>
            <span className="text-[10px] font-medium text-gray-700">{copied ? 'Copied!' : 'Link'}</span>
          </button>
        </div>
      </div>

      {/* Email Share */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email resume link</p>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="recipient@email.com"
            className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleEmailShare}
            disabled={!email}
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg active:bg-blue-700 disabled:opacity-40 disabled:active:bg-blue-600"
          >
            {emailSent ? '✓' : 'Send'}
          </button>
        </div>
      </div>

      {/* Download Options */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Download as</p>
        <div className="space-y-2">
          <button
            onClick={handleDownloadTxt}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl active:bg-gray-100 transition-all"
          >
            <span className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">TXT</span>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">Plain Text</p>
              <p className="text-xs text-gray-500">Formatted text file for easy sharing</p>
            </div>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl active:bg-gray-100 transition-all"
          >
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600">JSON</span>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">Data Export</p>
              <p className="text-xs text-gray-500">Import into another resume builder</p>
            </div>
          </button>
          <button
            onClick={handleCopyText}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl active:bg-gray-100 transition-all"
          >
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-xs font-bold text-purple-600">📋</span>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">{copied ? 'Copied to clipboard!' : 'Copy as Text'}</p>
              <p className="text-xs text-gray-500">Paste into emails or messages</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function CoverLetterSheet({ onClose }) {
  const [topic, setTopic] = useState('')

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Generate a cover letter based on your resume</p>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Paste the job description here to tailor your cover letter..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        onClick={onClose}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold active:bg-blue-700 shadow-md"
      >
        Generate Cover Letter
      </button>
    </div>
  )
}

function GrammarSheet({ onClose }) {
  const [issues, setIssues] = useState([
    { id: 1, text: 'Consider using active voice in "was responsible for"', type: 'style' },
    { id: 2, text: 'Add a period at the end of your summary', type: 'punctuation' },
    { id: 3, text: '"Managment" should be "Management"', type: 'spelling' },
    { id: 4, text: 'Consider replacing "utilized" with "used"', type: 'clarity' },
    { id: 5, text: 'Sentence is too long, consider breaking it up', type: 'readability' },
    { id: 6, text: 'Avoid starting bullet points with "I"', type: 'style' },
  ])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">Grammar & style suggestions</p>
        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">
          {issues.length} issues
        </span>
      </div>
      <div className="space-y-2">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-2"
          >
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 ${
              issue.type === 'spelling' ? 'bg-red-100 text-red-600' :
              issue.type === 'style' ? 'bg-yellow-100 text-yellow-700' :
              issue.type === 'punctuation' ? 'bg-blue-100 text-blue-600' :
              issue.type === 'clarity' ? 'bg-purple-100 text-purple-600' :
              'bg-orange-100 text-orange-600'
            }`}>
              {issue.type}
            </span>
            <span className="text-sm text-gray-700 flex-1">{issue.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function JobMatchSheet({ onClose }) {
  const [jobDesc, setJobDesc] = useState('')

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Check how well your resume matches a job posting</p>
      <textarea
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        placeholder="Paste the job description here..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        onClick={onClose}
        className="w-full px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold active:bg-green-700 shadow-md"
      >
        Analyze Match
      </button>
    </div>
  )
}

function TailorSheet({ onClose }) {
  const [jobDesc, setJobDesc] = useState('')

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Tailor your resume to a specific job description</p>
      <textarea
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        placeholder="Paste the job description to optimize your resume for..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        onClick={onClose}
        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold active:bg-indigo-700 shadow-md"
      >
        Tailor Resume
      </button>
    </div>
  )
}

function QuantifySheet({ onClose }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Add metrics and numbers to strengthen your resume</p>
      <div className="space-y-2">
        <div className="px-3 py-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">Tip: Add numbers to your experience</p>
          <p className="text-xs text-yellow-700 mt-1">Instead of "Managed a team", try "Managed a team of 12 engineers"</p>
        </div>
        <div className="px-3 py-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">Tip: Quantify your impact</p>
          <p className="text-xs text-yellow-700 mt-1">Instead of "Improved performance", try "Improved performance by 40%"</p>
        </div>
        <div className="px-3 py-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">Tip: Include timeframes</p>
          <p className="text-xs text-yellow-700 mt-1">Instead of "Delivered the project", try "Delivered the project 2 weeks ahead of schedule"</p>
        </div>
      </div>
    </div>
  )
}

function LanguageSheet({ currentLanguage, onSelect, onClose }) {
  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  ]

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 mb-3">Select resume language</p>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => {
            onSelect(lang.code)
            onClose()
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            currentLanguage === lang.code
              ? 'bg-blue-50 border-2 border-blue-200'
              : 'bg-gray-50 border-2 border-transparent active:bg-gray-100'
          }`}
        >
          <span className="text-lg">{lang.flag}</span>
          <span className={`text-sm font-medium ${
            currentLanguage === lang.code ? 'text-blue-700' : 'text-gray-700'
          }`}>
            {lang.name}
          </span>
        </button>
      ))}
    </div>
  )
}

export default function ToolsPanel({
  isOpen,
  onClose,
  resumeData,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  onImport,
  currentLanguage,
  onLanguageChange,
  initialSheet,
  onPrint,
}) {
  const [activeSubSheet, setActiveSubSheet] = useState(null)

  // When initialSheet changes and panel opens, go directly to that sheet
  useEffect(() => {
    if (isOpen && initialSheet) {
      setActiveSubSheet(initialSheet)
    }
    if (!isOpen) {
      setActiveSubSheet(null)
    }
  }, [isOpen, initialSheet])

  const closeSubSheet = () => {
    setActiveSubSheet(null)
    if (initialSheet) {
      onClose()
    }
  }

  const tools = [
    { id: 'share', label: 'Share', icon: FaShareAlt, color: 'bg-blue-100 text-blue-600' },
    { id: 'cover-letter', label: 'Cover Letter', icon: FaEnvelope, color: 'bg-green-100 text-green-600' },
    { id: 'compare', label: 'Compare', icon: FaChartBar, color: 'bg-gray-100 text-gray-600' },
    { id: 'job-match', label: 'Job Match', icon: FaBullseye, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'grammar', label: 'Grammar', icon: FaSpellCheck, color: 'bg-red-100 text-red-600', badge: 6 },
    { id: 'tailor', label: 'Tailor', icon: FaCrosshairs, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'quantify', label: 'Quantify', icon: FaChartBar, color: 'bg-orange-100 text-orange-600' },
    { id: 'language', label: 'Language', icon: FaGlobe, color: 'bg-cyan-100 text-cyan-600', flag: '🇺🇸' },
    { id: 'keywords', label: 'Keywords', icon: FaKey, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'ats-check', label: 'ATS Check', icon: FaRobot, color: 'bg-purple-100 text-purple-600' },
    { id: 'summarize', label: 'Summarize', icon: FaMagic, color: 'bg-pink-100 text-pink-600' },
    { id: 'format', label: 'Format', icon: FaFileAlt, color: 'bg-teal-100 text-teal-600' },
    { id: 'export', label: 'Export', icon: FaFileExport, color: 'bg-green-100 text-green-600' },
    { id: 'import', label: 'Import', icon: FaFileImport, color: 'bg-blue-100 text-blue-600' },
    { id: 'undo', label: 'Undo', icon: FaUndo, color: 'bg-gray-100 text-gray-600', disabled: !canUndo },
    { id: 'redo', label: 'Redo', icon: FaRedo, color: 'bg-gray-100 text-gray-600', disabled: !canRedo },
  ]

  const handleToolClick = (toolId) => {
    switch (toolId) {
      case 'share':
      case 'cover-letter':
      case 'job-match':
      case 'grammar':
      case 'tailor':
      case 'quantify':
      case 'language':
      case 'keywords':
      case 'ats-check':
      case 'summarize':
      case 'format':
        setActiveSubSheet(toolId)
        break
      case 'export':
        onExport?.()
        onClose()
        break
      case 'import':
        onImport?.()
        onClose()
        break
      case 'undo':
        onUndo?.()
        break
      case 'redo':
        onRedo?.()
        break
      default:
        break
    }
  }

  return (
    <>
      <ToolsBottomSheet isOpen={isOpen && !activeSubSheet} onClose={onClose} title="Tools">
        <div className="grid grid-cols-4 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              disabled={tool.disabled}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all active:scale-95 ${
                tool.disabled ? 'opacity-40' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.color}`}>
                {tool.flag ? (
                  <span className="text-lg">{tool.flag}</span>
                ) : (
                  <tool.icon size={18} />
                )}
                {tool.badge && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tool.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </ToolsBottomSheet>

      {/* Sub-sheets */}
      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'share'} onClose={closeSubSheet} title="Share Resume">
        <ShareSheet onClose={closeSubSheet} resumeData={resumeData} onPrint={onPrint} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'cover-letter'} onClose={closeSubSheet} title="Cover Letter">
        <CoverLetterSheet onClose={closeSubSheet} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'job-match'} onClose={closeSubSheet} title="Job Match">
        <JobMatchSheet onClose={closeSubSheet} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'grammar'} onClose={closeSubSheet} title="Grammar Check">
        <GrammarSheet onClose={closeSubSheet} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'tailor'} onClose={closeSubSheet} title="Tailor Resume">
        <TailorSheet onClose={closeSubSheet} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'quantify'} onClose={closeSubSheet} title="Quantify Impact">
        <QuantifySheet onClose={closeSubSheet} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'language'} onClose={closeSubSheet} title="Language">
        <LanguageSheet
          currentLanguage={currentLanguage}
          onSelect={onLanguageChange}
          onClose={closeSubSheet}
        />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'keywords'} onClose={closeSubSheet} title="Keywords Optimizer">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Extract and optimize keywords from a job posting to improve ATS matching</p>
          <textarea
            placeholder="Paste the job description to extract relevant keywords..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-28 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
          <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700 font-medium">Suggested keywords will appear here based on the job description</p>
          </div>
          <button onClick={closeSubSheet} className="w-full px-4 py-3 bg-yellow-500 text-white rounded-xl text-sm font-semibold active:bg-yellow-600 shadow-md">
            Extract Keywords
          </button>
        </div>
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'ats-check'} onClose={closeSubSheet} title="ATS Compatibility Check">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Check if your resume is optimized for Applicant Tracking Systems</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-500">&#10003;</span>
              <span className="text-sm text-green-700">Standard fonts used</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-500">&#10003;</span>
              <span className="text-sm text-green-700">Clean section headings</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-500">&#10003;</span>
              <span className="text-sm text-green-700">No images or graphics blocking text</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-yellow-500">&#9888;</span>
              <span className="text-sm text-yellow-700">Consider adding more industry keywords</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-yellow-500">&#9888;</span>
              <span className="text-sm text-yellow-700">Summary could be more concise</span>
            </div>
          </div>
          <div className="text-center py-2">
            <span className="text-2xl font-bold text-green-600">85%</span>
            <p className="text-xs text-gray-500">ATS compatibility score</p>
          </div>
        </div>
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'summarize'} onClose={closeSubSheet} title="AI Summarize">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Generate a professional summary based on your experience and skills</p>
          <div className="space-y-2">
            <button onClick={closeSubSheet} className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl text-sm text-pink-700 font-medium active:bg-pink-100 text-left">
              <span className="font-semibold block">Concise (2-3 lines)</span>
              <span className="text-xs text-pink-500">Best for experienced professionals</span>
            </button>
            <button onClick={closeSubSheet} className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl text-sm text-pink-700 font-medium active:bg-pink-100 text-left">
              <span className="font-semibold block">Detailed (4-5 lines)</span>
              <span className="text-xs text-pink-500">Good for career changers</span>
            </button>
            <button onClick={closeSubSheet} className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl text-sm text-pink-700 font-medium active:bg-pink-100 text-left">
              <span className="font-semibold block">Technical focus</span>
              <span className="text-xs text-pink-500">Emphasize skills and technologies</span>
            </button>
            <button onClick={closeSubSheet} className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl text-sm text-pink-700 font-medium active:bg-pink-100 text-left">
              <span className="font-semibold block">Leadership focus</span>
              <span className="text-xs text-pink-500">Emphasize management and impact</span>
            </button>
          </div>
        </div>
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'format'} onClose={closeSubSheet} title="Format & Layout">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Adjust formatting and layout preferences</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Font Size</span>
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded bg-white border border-gray-300 text-sm font-bold active:bg-gray-100">-</button>
                <span className="text-sm font-medium w-6 text-center">11</span>
                <button className="w-7 h-7 rounded bg-white border border-gray-300 text-sm font-bold active:bg-gray-100">+</button>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Line Spacing</span>
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded bg-white border border-gray-300 text-sm font-bold active:bg-gray-100">-</button>
                <span className="text-sm font-medium w-6 text-center">1.5</span>
                <button className="w-7 h-7 rounded bg-white border border-gray-300 text-sm font-bold active:bg-gray-100">+</button>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Margins</span>
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>Normal</option>
                <option>Narrow</option>
                <option>Wide</option>
              </select>
            </div>
            <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Date Format</span>
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>Jan 2024</option>
                <option>01/2024</option>
                <option>January 2024</option>
                <option>2024-01</option>
              </select>
            </div>
            <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Bullet Style</span>
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>&#8226; Round</option>
                <option>&#9679; Filled</option>
                <option>&#8212; Dash</option>
                <option>&#9654; Arrow</option>
              </select>
            </div>
          </div>
        </div>
      </ToolsBottomSheet>
    </>
  )
}
