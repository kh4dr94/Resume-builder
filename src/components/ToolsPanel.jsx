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
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col animate-slide-up"
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
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-[env(safe-area-inset-bottom,16px)]">
          {children}
        </div>
      </div>
    </div>
  )
}

function ShareSheet({ onClose, resumeData }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Share your resume with others</p>
      <button
        onClick={handleCopyLink}
        className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 font-medium active:bg-blue-100"
      >
        {copied ? 'Link Copied!' : 'Copy Share Link'}
      </button>
      <button
        onClick={onClose}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium active:bg-gray-100"
      >
        Download as JSON
      </button>
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
        <ShareSheet onClose={closeSubSheet} resumeData={resumeData} />
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
    </>
  )
}
