import { useState, useRef, useEffect, useCallback } from 'react'
import { useReactToPrint } from 'react-to-print'
import { motion, AnimatePresence } from 'framer-motion'
import ResumeForm from './components/ResumeForm'
import TemplateSelector from './components/TemplateSelector'
import Recommendations from './components/Recommendations'
import ProfileManager, { loadProfiles, saveProfiles, loadActiveProfileId, saveActiveProfileId } from './components/ProfileManager'
import SectionOrderPanel, { DEFAULT_SECTION_ORDER } from './components/SectionOrderPanel'
import ThemePicker, { COLOR_THEMES } from './components/ThemePicker'
import ATSScore from './components/ATSScore'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import WordCount from './components/WordCount'
import { templates } from './components/templates'
import ZoomControls from './components/ZoomControls'
import QuickFill from './components/QuickFill'
import ComparisonView from './components/ComparisonView'
import DocxExport from './components/DocxExport'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import JobMatcher from './components/JobMatcher'
import VersionHistory from './components/VersionHistory'
import CustomSections from './components/CustomSections'
import PageBreakIndicator from './components/PageBreakIndicator'
import CoverLetterGenerator from './components/CoverLetterGenerator'
import ShareResume from './components/ShareResume'
import PrintSettings from './components/PrintSettings'
import WelcomeTour from './components/WelcomeTour'
import GrammarChecker from './components/GrammarChecker'
import TailoringWizard from './components/TailoringWizard'
import LanguageSelector from './components/LanguageSelector'
import AchievementQuantifier from './components/AchievementQuantifier'
import { FaFilePdf, FaEye, FaEdit, FaRocket, FaMagic, FaShieldAlt, FaEraser, FaMoon, FaSun, FaUndo, FaRedo, FaSave, FaFileExport, FaFileImport, FaKeyboard, FaEllipsisH, FaTimes } from 'react-icons/fa'

const sampleData = {
  personalInfo: {
    fullName: 'Alex Johnson',
    title: 'Senior Software Engineer',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    website: 'alexjohnson.dev',
    summary: 'Results-driven software engineer with 8+ years of experience building scalable web applications. Led cross-functional teams to deliver products serving 2M+ users. Passionate about clean code, mentoring, and driving engineering excellence.',
    photo: '',
  },
  experience: [
    {
      id: 1,
      company: 'Google',
      position: 'Senior Software Engineer',
      startDate: 'Jan 2021',
      endDate: '',
      current: true,
      description: '• Led migration of monolithic app to microservices, reducing deploy time by 70%\n• Mentored 4 junior engineers and established code review standards\n• Architected real-time data pipeline processing 10M+ events/day',
    },
    {
      id: 2,
      company: 'Stripe',
      position: 'Software Engineer',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      current: false,
      description: '• Built payment processing features handling $2B+ in annual transactions\n• Improved API response times by 40% through caching optimization\n• Contributed to open-source SDK used by 50K+ developers',
    },
  ],
  education: [
    {
      id: 1,
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Computer Science',
      startDate: '2016',
      endDate: '2018',
      gpa: '3.9/4.0',
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Kubernetes', 'GraphQL', 'PostgreSQL', 'System Design'],
  certifications: [
    { id: 1, name: 'AWS Solutions Architect Professional', issuer: 'Amazon Web Services', date: 'Mar 2023' },
    { id: 2, name: 'Google Cloud Professional Engineer', issuer: 'Google Cloud', date: 'Nov 2022' },
  ],
  languages: [
    { id: 1, language: 'English', proficiency: 'Native' },
    { id: 2, language: 'Spanish', proficiency: 'Advanced' },
  ],
  customSections: [],
}

const emptyData = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
    photo: '',
  },
  experience: [
    { id: 1, company: '', position: '', startDate: '', endDate: '', current: false, description: '' },
  ],
  education: [
    { id: 1, institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
  ],
  skills: [''],
  certifications: [{ id: 1, name: '', issuer: '', date: '' }],
  languages: [{ id: 1, language: '', proficiency: '' }],
  customSections: [],
}

// Load from localStorage or use sample data (backward compat)
function loadSavedData() {
  try {
    const saved = localStorage.getItem('resumeBuilder_data')
    if (saved) return JSON.parse(saved)
  } catch (e) {}
  return null
}

function loadSavedTemplate() {
  try {
    return localStorage.getItem('resumeBuilder_template') || 'modern'
  } catch (e) {}
  return 'modern'
}

function loadDarkMode() {
  try {
    return localStorage.getItem('resumeBuilder_darkMode') === 'true'
  } catch (e) {}
  return false
}

function loadSectionOrder() {
  try {
    const saved = localStorage.getItem('resumeBuilder_sectionOrder')
    if (saved) return JSON.parse(saved)
  } catch (e) {}
  return DEFAULT_SECTION_ORDER
}

function loadColorTheme() {
  try {
    const saved = localStorage.getItem('resumeBuilder_colorTheme')
    if (saved) return JSON.parse(saved)
  } catch (e) {}
  return COLOR_THEMES[0]
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

function initProfiles() {
  const existingProfiles = loadProfiles()
  if (existingProfiles && existingProfiles.length > 0) {
    return existingProfiles
  }
  // Migrate existing data into a default profile
  const savedData = loadSavedData()
  const defaultProfile = {
    id: generateId(),
    name: 'My Resume',
    data: savedData || sampleData,
    template: loadSavedTemplate(),
    sectionOrder: loadSectionOrder(),
    colorTheme: loadColorTheme(),
  }
  saveProfiles([defaultProfile])
  saveActiveProfileId(defaultProfile.id)
  return [defaultProfile]
}

function App() {
  const [profiles, setProfiles] = useState(initProfiles)
  const [activeProfileId, setActiveProfileId] = useState(() => {
    const savedId = loadActiveProfileId()
    if (savedId && profiles.find(p => p.id === savedId)) return savedId
    return profiles[0]?.id
  })

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0]

  const [resumeData, setResumeData] = useState(activeProfile?.data || sampleData)
  const [selectedTemplate, setSelectedTemplate] = useState(activeProfile?.template || loadSavedTemplate())
  const [sectionOrder, setSectionOrder] = useState(activeProfile?.sectionOrder || DEFAULT_SECTION_ORDER)
  const [colorTheme, setColorTheme] = useState(activeProfile?.colorTheme || COLOR_THEMES[0])
  const [activeView, setActiveView] = useState('form')
  const [usingSample, setUsingSample] = useState(!activeProfile?.data)
  const [previewScale, setPreviewScale] = useState(0.55)
  const [manualZoom, setManualZoom] = useState(null)
  const [darkMode, setDarkMode] = useState(loadDarkMode())
  const [saveStatus, setSaveStatus] = useState('')
  const [history, setHistory] = useState([activeProfile?.data || sampleData])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const resumeRef = useRef(null)
  const previewContainerRef = useRef(null)
  const importInputRef = useRef(null)

  // Auto-save to localStorage (profiles + legacy keys for backward compat)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Update the active profile in the profiles array
        const updatedProfiles = profiles.map(p =>
          p.id === activeProfileId
            ? { ...p, data: resumeData, template: selectedTemplate, sectionOrder, colorTheme }
            : p
        )
        saveProfiles(updatedProfiles)
        saveActiveProfileId(activeProfileId)
        // Also save to legacy keys for backward compat
        localStorage.setItem('resumeBuilder_data', JSON.stringify(resumeData))
        localStorage.setItem('resumeBuilder_template', selectedTemplate)
        localStorage.setItem('resumeBuilder_darkMode', darkMode.toString())
        localStorage.setItem('resumeBuilder_sectionOrder', JSON.stringify(sectionOrder))
        localStorage.setItem('resumeBuilder_colorTheme', JSON.stringify(colorTheme))
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus(''), 2000)
      } catch (e) {}
    }, 1000) // debounce 1s
    return () => clearTimeout(timer)
  }, [resumeData, selectedTemplate, darkMode, sectionOrder, colorTheme, profiles, activeProfileId])

  // Dark mode body class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Sync profiles state when profiles change externally
  useEffect(() => {
    setProfiles(prev => prev.map(p =>
      p.id === activeProfileId
        ? { ...p, data: resumeData, template: selectedTemplate, sectionOrder, colorTheme }
        : p
    ))
  }, [resumeData, selectedTemplate, sectionOrder, colorTheme])

  // Profile management
  const handleSwitchProfile = useCallback((profileId) => {
    // Save current state to current profile first
    setProfiles(prev => {
      const updated = prev.map(p =>
        p.id === activeProfileId
          ? { ...p, data: resumeData, template: selectedTemplate, sectionOrder, colorTheme }
          : p
      )
      saveProfiles(updated)
      return updated
    })

    const target = profiles.find(p => p.id === profileId)
    if (target) {
      setActiveProfileId(profileId)
      saveActiveProfileId(profileId)
      setResumeData(target.data || sampleData)
      setSelectedTemplate(target.template || 'modern')
      setSectionOrder(target.sectionOrder || DEFAULT_SECTION_ORDER)
      setColorTheme(target.colorTheme || COLOR_THEMES[0])
      setHistory([target.data || sampleData])
      setHistoryIndex(0)
      setUsingSample(!target.data)
    }
  }, [activeProfileId, resumeData, selectedTemplate, sectionOrder, colorTheme, profiles])

  const handleCreateProfile = useCallback((name) => {
    const newProfile = {
      id: generateId(),
      name,
      data: emptyData,
      template: 'modern',
      sectionOrder: DEFAULT_SECTION_ORDER,
      colorTheme: COLOR_THEMES[0],
    }
    setProfiles(prev => {
      const updated = [...prev, newProfile]
      saveProfiles(updated)
      return updated
    })
    // Switch to new profile
    setActiveProfileId(newProfile.id)
    saveActiveProfileId(newProfile.id)
    setResumeData(emptyData)
    setSelectedTemplate('modern')
    setSectionOrder(DEFAULT_SECTION_ORDER)
    setColorTheme(COLOR_THEMES[0])
    setHistory([emptyData])
    setHistoryIndex(0)
    setUsingSample(false)
  }, [])

  const handleDeleteProfile = useCallback((profileId) => {
    setProfiles(prev => {
      const updated = prev.filter(p => p.id !== profileId)
      saveProfiles(updated)
      // If deleting active profile, switch to first remaining
      if (profileId === activeProfileId && updated.length > 0) {
        const fallback = updated[0]
        setActiveProfileId(fallback.id)
        saveActiveProfileId(fallback.id)
        setResumeData(fallback.data || sampleData)
        setSelectedTemplate(fallback.template || 'modern')
        setSectionOrder(fallback.sectionOrder || DEFAULT_SECTION_ORDER)
        setColorTheme(fallback.colorTheme || COLOR_THEMES[0])
        setHistory([fallback.data || sampleData])
        setHistoryIndex(0)
      }
      return updated
    })
  }, [activeProfileId])

  const handleRenameProfile = useCallback((profileId, newName) => {
    setProfiles(prev => {
      const updated = prev.map(p => p.id === profileId ? { ...p, name: newName } : p)
      saveProfiles(updated)
      return updated
    })
  }, [])

  // Undo/Redo - track history
  const updateResumeData = useCallback((newData) => {
    if (typeof newData === 'function') {
      setResumeData((prev) => {
        const result = newData(prev)
        setHistory((h) => [...h.slice(0, historyIndex + 1), result].slice(-30))
        setHistoryIndex((i) => Math.min(i + 1, 29))
        return result
      })
    } else {
      setResumeData(newData)
      setHistory((h) => [...h.slice(0, historyIndex + 1), newData].slice(-30))
      setHistoryIndex((i) => Math.min(i + 1, 29))
    }
    setUsingSample(false)
  }, [historyIndex])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setResumeData(history[newIndex])
    }
  }, [historyIndex, history])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setResumeData(history[newIndex])
    }
  }, [historyIndex, history])

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${resumeData?.personalInfo?.fullName || 'Resume'}_Resume`,
  })

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') { e.preventDefault(); handlePrint() }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); setDarkMode(dm => !dm) }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = document.activeElement?.tagName?.toLowerCase()
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault()
          setShortcutsOpen(s => !s)
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [undo, redo, handlePrint, darkMode])

  // Auto-scale preview to fit container width
  useEffect(() => {
    const container = previewContainerRef.current
    if (!container) return

    const updateScale = () => {
      const containerWidth = container.clientWidth - 32 // padding
      const a4Width = 794 // 210mm in px at 96dpi
      const scale = Math.min(containerWidth / a4Width, 1)
      setPreviewScale(scale)
    }

    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(container)
    return () => observer.disconnect()
  }, [manualZoom])

  // Export all profiles as JSON
  const handleExport = useCallback(() => {
    const exportData = {
      version: '4.0',
      exportedAt: new Date().toISOString(),
      profiles: profiles,
      activeProfileId: activeProfileId,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume-profiles-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [profiles, activeProfileId])

  // Import profiles from JSON
  const handleImport = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result)
        if (importedData.profiles && Array.isArray(importedData.profiles)) {
          setProfiles(importedData.profiles)
          saveProfiles(importedData.profiles)
          const newActiveId = importedData.activeProfileId || importedData.profiles[0]?.id
          if (newActiveId) {
            const target = importedData.profiles.find(p => p.id === newActiveId) || importedData.profiles[0]
            setActiveProfileId(target.id)
            saveActiveProfileId(target.id)
            setResumeData(target.data || sampleData)
            setSelectedTemplate(target.template || 'modern')
            setSectionOrder(target.sectionOrder || DEFAULT_SECTION_ORDER)
            setColorTheme(target.colorTheme || COLOR_THEMES[0])
            setHistory([target.data || sampleData])
            setHistoryIndex(0)
          }
        }
      } catch (err) {
        alert('Invalid JSON file. Please select a valid resume export file.')
      }
    }
    reader.readAsText(file)
    // Reset input value so same file can be re-imported
    e.target.value = ''
  }, [])

  const toggleSampleData = () => {
    if (usingSample) {
      setResumeData(emptyData)
      setUsingSample(false)
      setHistory([emptyData])
      setHistoryIndex(0)
    } else {
      setResumeData(sampleData)
      setUsingSample(true)
      setHistory([sampleData])
      setHistoryIndex(0)
    }
  }

  // Zoom controls
  const effectiveScale = manualZoom !== null ? manualZoom : previewScale
  const handleZoomIn = useCallback(() => {
    setManualZoom(prev => Math.min((prev !== null ? prev : previewScale) + 0.1, 1))
  }, [previewScale])
  const handleZoomOut = useCallback(() => {
    setManualZoom(prev => Math.max((prev !== null ? prev : previewScale) - 0.1, 0.3))
  }, [previewScale])
  const handleZoomReset = useCallback(() => {
    setManualZoom(null)
  }, [])

  // Quick Fill handler
  const handleQuickFill = useCallback((extracted) => {
    updateResumeData((prev) => {
      const updated = { ...prev, personalInfo: { ...prev.personalInfo } }
      if (extracted.name) updated.personalInfo.fullName = extracted.name
      if (extracted.title) updated.personalInfo.title = extracted.title
      if (extracted.summary) updated.personalInfo.summary = extracted.summary
      if (extracted.skills.length > 0) {
        const existing = (prev.skills || []).filter(s => s.trim())
        const newSkills = [...new Set([...existing, ...extracted.skills])]
        updated.skills = newSkills
      }
      return updated
    })
  }, [updateResumeData])

  // Grammar fix handler
  const handleGrammarFix = useCallback((issue) => {
    if (!issue.fix) return
    updateResumeData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev))
      // Try to fix in summary
      if (updated.personalInfo?.summary?.includes(issue.fix.find)) {
        updated.personalInfo.summary = updated.personalInfo.summary.replace(issue.fix.find, issue.fix.replace)
        return updated
      }
      // Try to fix in experience
      if (updated.experience) {
        for (let i = 0; i < updated.experience.length; i++) {
          if (updated.experience[i].description?.includes(issue.fix.find)) {
            updated.experience[i].description = updated.experience[i].description.replace(issue.fix.find, issue.fix.replace)
            return updated
          }
        }
      }
      // Try custom sections
      if (updated.customSections) {
        for (let i = 0; i < updated.customSections.length; i++) {
          if (updated.customSections[i].content?.includes(issue.fix.find)) {
            updated.customSections[i].content = updated.customSections[i].content.replace(issue.fix.find, issue.fix.replace)
            return updated
          }
        }
      }
      return updated
    })
  }, [updateResumeData])

  // Tailoring wizard apply handler
  const handleTailoringSuggestions = useCallback(({ skillsToAdd, bulletsToAdd }) => {
    updateResumeData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev))
      // Add skills
      if (skillsToAdd.length > 0) {
        const existing = (updated.skills || []).filter(s => s.trim())
        updated.skills = [...new Set([...existing, ...skillsToAdd])]
      }
      // Add bullets to first experience
      if (bulletsToAdd.length > 0 && updated.experience?.length > 0) {
        const exp = updated.experience[0]
        const newBullets = bulletsToAdd.map(b => `• ${b}`).join('\n')
        exp.description = exp.description ? `${exp.description}\n${newBullets}` : newBullets
      }
      return updated
    })
  }, [updateResumeData])

  // Achievement quantifier update handler
  const handleUpdateExperience = useCallback((expId, newDescription) => {
    updateResumeData((prev) => {
      const updated = { ...prev, experience: prev.experience.map(exp =>
        exp.id === expId ? { ...exp, description: newDescription } : exp
      )}
      return updated
    })
  }, [updateResumeData])

  const SelectedTemplateComponent = templates.find((t) => t.id === selectedTemplate)?.component

  const filledSections = [
    resumeData.personalInfo?.fullName,
    resumeData.personalInfo?.summary,
    (resumeData.experience || []).some((e) => e.company || e.position),
    (resumeData.education || []).some((e) => e.institution || e.degree),
    (resumeData.skills || []).some((s) => s.trim() !== ''),
  ].filter(Boolean).length

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-[#f8fafc]'}`}>
      {/* Header */}
      <header className={`backdrop-blur-xl sticky top-0 z-50 border-b transition-colors duration-300 ${darkMode ? 'bg-gray-900/80 border-gray-700/80' : 'bg-white/80 border-gray-200/80'}`}>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <motion.div
              whileHover={{ rotate: -5, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20"
            >
              <FaRocket className="text-white" size={14} />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className={`text-[15px] sm:text-[17px] font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Resume Builder
              </h1>
              <p className="hidden sm:block text-[11px] text-gray-400 font-medium -mt-0.5">
                Create • Customize • Download
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Save status */}
            <AnimatePresence>
              {saveStatus && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="hidden sm:flex items-center gap-1.5 text-[10px] text-green-500 font-medium"
                >
                  <FaSave size={9} />
                  Auto-saved
                </motion.div>
              )}
            </AnimatePresence>

            {/* Undo/Redo */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${historyIndex <= 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                title="Undo (Ctrl+Z)"
              >
                <FaUndo size={11} />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${historyIndex >= history.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                title="Redo (Ctrl+Y)"
              >
                <FaRedo size={11} />
              </button>
            </div>

            {/* Progress indicator */}
            <div className={`hidden md:flex items-center gap-2 rounded-lg px-3 py-1.5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < filledSections ? 'bg-blue-500' : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-[10px] font-medium ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {filledSections}/5
              </span>
            </div>

            {/* Export/Import buttons */}
            <div className="hidden lg:flex items-center gap-1">
              <CoverLetterGenerator data={resumeData} darkMode={darkMode} />
              <ShareResume darkMode={darkMode} />
              <ComparisonView profiles={profiles} darkMode={darkMode} />
              <JobMatcher data={resumeData} darkMode={darkMode} />
              <GrammarChecker data={resumeData} darkMode={darkMode} onFix={handleGrammarFix} />
              <TailoringWizard data={resumeData} darkMode={darkMode} onApplySuggestions={handleTailoringSuggestions} />
              <AchievementQuantifier data={resumeData} darkMode={darkMode} onUpdateExperience={handleUpdateExperience} />
              <LanguageSelector darkMode={darkMode} />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-green-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-green-600'}`}
                title="Export profiles"
              >
                <FaFileExport size={12} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => importInputRef.current?.click()}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-blue-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-blue-600'}`}
                title="Import profiles"
              >
                <FaFileImport size={12} />
              </motion.button>
            </div>

            {/* Keyboard shortcuts button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShortcutsOpen(true)}
              className={`hidden lg:flex w-8 h-8 rounded-xl items-center justify-center transition-all border text-sm font-bold ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-purple-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-purple-600'}`}
              title="Keyboard shortcuts (?)"
            >
              ?
            </motion.button>

            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`hidden sm:flex w-9 h-9 rounded-xl items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-yellow-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
              title="Toggle dark mode"
            >
              {darkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
            </motion.button>

            {/* Mobile tools menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(true)}
              className={`flex lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-blue-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-blue-600'}`}
              title="Tools menu"
            >
              <FaEllipsisH size={13} />
            </motion.button>

            {/* Mobile view toggle - compact on small screens */}
            <div className={`flex lg:hidden rounded-lg sm:rounded-xl p-0.5 sm:p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <button
                onClick={() => setActiveView('form')}
                className={`flex items-center gap-1 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                  activeView === 'form'
                    ? `${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-white shadow-sm text-blue-600'} ring-1 ring-gray-200/50`
                    : `${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`
                }`}
              >
                <FaEdit size={10} />
                <span className="hidden xs:inline">Edit</span>
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className={`flex items-center gap-1 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                  activeView === 'preview'
                    ? `${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-white shadow-sm text-blue-600'} ring-1 ring-gray-200/50`
                    : `${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`
                }`}
              >
                <FaEye size={10} />
                <span className="hidden xs:inline">Preview</span>
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleSampleData}
              className={`hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border font-medium text-[13px] ${darkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              {usingSample ? <FaEraser size={13} /> : <FaMagic size={13} />}
              {usingSample ? 'Clear' : 'Sample'}
            </motion.button>

            <div className="hidden md:block">
              <DocxExport data={resumeData} darkMode={darkMode} />
            </div>

            <div className="hidden md:block">
              <PrintSettings darkMode={darkMode} />
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePrint}
              className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 font-semibold text-[12px] sm:text-[13px]"
            >
              <FaFilePdf size={14} />
              <span className="hidden sm:inline">PDF</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hidden file input for import (always in DOM) */}
      <input
        ref={importInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      {/* Mobile Tools Bottom Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
            />
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed bottom-0 left-0 right-0 z-[70] lg:hidden rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto ${darkMode ? 'bg-gray-900 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className={`w-10 h-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
              </div>
              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3">
                <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tools</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <FaTimes size={14} />
                </button>
              </div>
              {/* Tools Grid */}
              <div className="grid grid-cols-4 gap-3 px-5 pb-6">
                <div className="flex flex-col items-center gap-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <ShareResume darkMode={darkMode} />
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Share</span>
                </div>
                <div className="flex flex-col items-center gap-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <CoverLetterGenerator data={resumeData} darkMode={darkMode} />
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cover Letter</span>
                </div>
                <div className="flex flex-col items-center gap-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <ComparisonView profiles={profiles} darkMode={darkMode} />
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Compare</span>
                </div>
                <div className="flex flex-col items-center gap-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <JobMatcher data={resumeData} darkMode={darkMode} />
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Job Match</span>
                </div>
                <div className="flex flex-col items-center gap-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <GrammarChecker data={resumeData} darkMode={darkMode} onFix={handleGrammarFix} />
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Grammar</span>
                </div>
                <div className="flex flex-col items-center gap-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <TailoringWizard data={resumeData} darkMode={darkMode} onApplySuggestions={handleTailoringSuggestions} />
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tailor</span>
                </div>
                <div className="flex flex-col items-center gap-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <AchievementQuantifier data={resumeData} darkMode={darkMode} onUpdateExperience={handleUpdateExperience} />
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quantify</span>
                </div>
                <div className="flex flex-col items-center gap-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <LanguageSelector darkMode={darkMode} />
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Language</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { handleExport(); setMobileMenuOpen(false); }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-green-400' : 'bg-gray-50 border-gray-200 text-green-600'}`}
                  >
                    <FaFileExport size={14} />
                  </motion.button>
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Export</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { importInputRef.current?.click(); setMobileMenuOpen(false); }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-gray-50 border-gray-200 text-blue-600'}`}
                  >
                    <FaFileImport size={14} />
                  </motion.button>
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Import</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { undo(); setMobileMenuOpen(false); }}
                    disabled={historyIndex <= 0}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${historyIndex <= 0 ? 'opacity-30' : ''} ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                  >
                    <FaUndo size={14} />
                  </motion.button>
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Undo</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { redo(); setMobileMenuOpen(false); }}
                    disabled={historyIndex >= history.length - 1}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${historyIndex >= history.length - 1 ? 'opacity-30' : ''} ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                  >
                    <FaRedo size={14} />
                  </motion.button>
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Redo</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left Panel - Form */}
          <div
            className={`w-full lg:w-[440px] xl:w-[480px] shrink-0 min-w-0 ${
              activeView === 'preview' ? 'hidden lg:block' : ''
            }`}
          >
            <div className="space-y-5">
              {/* Mobile Quick Tools Bar */}
              <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 -mx-1 px-1 scrollbar-hide">
                <div className="flex-shrink-0">
                  <ShareResume darkMode={darkMode} />
                </div>
                <div className="flex-shrink-0">
                  <CoverLetterGenerator data={resumeData} darkMode={darkMode} />
                </div>
                <div className="flex-shrink-0">
                  <JobMatcher data={resumeData} darkMode={darkMode} />
                </div>
                <div className="flex-shrink-0">
                  <GrammarChecker data={resumeData} darkMode={darkMode} onFix={handleGrammarFix} />
                </div>
                <div className="flex-shrink-0">
                  <TailoringWizard data={resumeData} darkMode={darkMode} onApplySuggestions={handleTailoringSuggestions} />
                </div>
                <div className="flex-shrink-0">
                  <AchievementQuantifier data={resumeData} darkMode={darkMode} onUpdateExperience={handleUpdateExperience} />
                </div>
                <div className="flex-shrink-0">
                  <LanguageSelector darkMode={darkMode} />
                </div>
              </div>

              {/* Profile Manager */}
              <ProfileManager
                profiles={profiles}
                activeProfileId={activeProfileId}
                onSwitch={handleSwitchProfile}
                onCreate={handleCreateProfile}
                onDelete={handleDeleteProfile}
                onRename={handleRenameProfile}
                darkMode={darkMode}
              />

              {/* Quick Fill */}
              <div className="flex items-center gap-2">
                <QuickFill onApply={handleQuickFill} darkMode={darkMode} />
              </div>

              {/* Analytics Dashboard */}
              <AnalyticsDashboard data={resumeData} darkMode={darkMode} />

              {/* Version History */}
              <VersionHistory data={resumeData} onRestore={updateResumeData} darkMode={darkMode} />

              {/* Template Selector */}
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
              />

              {/* Section Order Panel */}
              <SectionOrderPanel
                sectionOrder={sectionOrder}
                onReorder={setSectionOrder}
                darkMode={darkMode}
              />

              {/* ATS Score */}
              <ATSScore data={resumeData} darkMode={darkMode} />

              {/* Color Theme Picker */}
              <ThemePicker
                colorTheme={colorTheme}
                onSelect={setColorTheme}
                darkMode={darkMode}
              />

              {/* Recommendations */}
              <Recommendations data={resumeData} />

              {/* Form */}
              <ResumeForm data={resumeData} setData={updateResumeData} darkMode={darkMode} />

              {/* Custom Sections */}
              <CustomSections
                customSections={resumeData.customSections || []}
                onChange={(sections) => updateResumeData((prev) => ({ ...prev, customSections: sections }))}
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div
            className={`w-full lg:flex-1 min-w-0 max-w-full ${
              activeView === 'form' ? 'hidden lg:block' : ''
            }`}
          >
            <div className="sticky top-[76px]">
              {/* Word Count Bar */}
              <WordCount data={resumeData} darkMode={darkMode} />

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={`rounded-2xl shadow-xl overflow-hidden border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 shadow-gray-900/50' : 'bg-white border-gray-200/60 shadow-gray-200/50'}`}
              >
                {/* Preview toolbar */}
                <div className="bg-gray-50/80 px-3 sm:px-5 py-3 border-b border-gray-200/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="hidden sm:flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28CA42]"></div>
                    </div>
                    <div className="hidden sm:block h-4 w-px bg-gray-200"></div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate">
                      {templates.find((t) => t.id === selectedTemplate)?.name} Template
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ZoomControls
                      scale={effectiveScale}
                      onZoomIn={handleZoomIn}
                      onZoomOut={handleZoomOut}
                      onReset={handleZoomReset}
                    />
                    <span className="hidden sm:inline text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-100 font-mono">
                      A4 • 210×297mm
                    </span>
                  </div>
                </div>

                {/* Preview content - scale to fit */}
                <div ref={previewContainerRef} className="overflow-hidden max-h-[calc(100vh-160px)] scrollbar-thin bg-[#e8eaed]/40 p-2 sm:p-4">
                  <div className="relative mx-auto overflow-hidden" style={{ width: '210mm', maxWidth: '100%', transform: `scale(${effectiveScale})`, transformOrigin: 'top left', height: `calc(297mm * ${effectiveScale})` }}>
                    <div
                      className="shadow-2xl shadow-gray-300/40 rounded overflow-hidden bg-white break-words"
                      style={{ width: '210mm', minHeight: '297mm' }}
                      ref={resumeRef}
                    >
                      {SelectedTemplateComponent && (
                        <SelectedTemplateComponent data={resumeData} sectionOrder={sectionOrder} colorTheme={colorTheme} />
                      )}
                    </div>
                    <PageBreakIndicator resumeRef={resumeRef} scale={1} darkMode={darkMode} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t backdrop-blur-sm mt-8 sm:mt-16 transition-colors duration-300 ${darkMode ? 'border-gray-700/60 bg-gray-900/60' : 'border-gray-200/60 bg-white/60'}`}>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <FaMagic size={11} />
                <span className="text-[11px] font-medium">Built with React + Tailwind CSS</span>
              </div>
              <div className={`hidden sm:block h-3 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`hidden sm:flex items-center gap-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <FaShieldAlt size={10} />
                <span className="text-[11px] font-medium">100% client-side — auto-saves locally</span>
              </div>
            </div>
            <p className={`text-[11px] font-medium ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
              v4.0
            </p>
          </div>
        </div>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} darkMode={darkMode} />

      {/* Welcome Tour - shows only on first visit */}
      <WelcomeTour />
    </div>
  )
}

export default App
