import { useState, useRef, useEffect, useCallback } from 'react'
import { useReactToPrint } from 'react-to-print'
import { motion, AnimatePresence } from 'framer-motion'
import ResumeForm from './components/ResumeForm'
import TemplateSelector from './components/TemplateSelector'
import Recommendations from './components/Recommendations'
import ProfileManager from './components/ProfileManager'
import ThemePicker, { colorThemes } from './components/ThemePicker'
import SectionOrderPanel, { DEFAULT_SECTION_ORDER } from './components/SectionOrderPanel'
import { templates } from './components/templates'
import { FaFilePdf, FaEye, FaEdit, FaRocket, FaMagic, FaShieldAlt, FaEraser, FaMoon, FaSun, FaUndo, FaRedo, FaSave } from 'react-icons/fa'

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
}

// localStorage helpers
function loadState(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
  } catch (e) {}
  return fallback
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {}
}

function App() {
  // --- Profiles state ---
  const [profiles, setProfiles] = useState(() =>
    loadState('resumeBuilder_profiles', [
      { id: 'default', name: 'My Resume', data: loadState('resumeBuilder_data', null) || sampleData },
    ])
  )
  const [activeProfileId, setActiveProfileId] = useState(() =>
    loadState('resumeBuilder_activeProfile', 'default')
  )

  // --- Theme & section order ---
  const [selectedTemplate, setSelectedTemplate] = useState(() =>
    loadState('resumeBuilder_template', 'modern')
  )
  const [activeColorTheme, setActiveColorTheme] = useState(() =>
    loadState('resumeBuilder_colorTheme', 'default')
  )
  const [sectionOrder, setSectionOrder] = useState(() =>
    loadState('resumeBuilder_sectionOrder', [...DEFAULT_SECTION_ORDER])
  )

  // --- UI state ---
  const [activeView, setActiveView] = useState('form')
  const [previewScale, setPreviewScale] = useState(0.55)
  const [darkMode, setDarkMode] = useState(() =>
    loadState('resumeBuilder_darkMode', false)
  )
  const [saveStatus, setSaveStatus] = useState('')

  // --- History for undo/redo ---
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0]
  const resumeData = activeProfile?.data || sampleData
  const [history, setHistory] = useState([resumeData])
  const [historyIndex, setHistoryIndex] = useState(0)

  const resumeRef = useRef(null)
  const previewContainerRef = useRef(null)

  // Reset history when switching profiles
  useEffect(() => {
    setHistory([resumeData])
    setHistoryIndex(0)
  }, [activeProfileId])

  // Auto-save all state to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage('resumeBuilder_profiles', profiles)
      saveToStorage('resumeBuilder_activeProfile', activeProfileId)
      saveToStorage('resumeBuilder_template', selectedTemplate)
      saveToStorage('resumeBuilder_colorTheme', activeColorTheme)
      saveToStorage('resumeBuilder_sectionOrder', sectionOrder)
      saveToStorage('resumeBuilder_darkMode', darkMode)
      // Keep legacy key for backward compatibility
      saveToStorage('resumeBuilder_data', resumeData)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(''), 2000)
    }, 1000)
    return () => clearTimeout(timer)
  }, [profiles, activeProfileId, selectedTemplate, activeColorTheme, sectionOrder, darkMode])

  // Dark mode body class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Update resume data for active profile (with history tracking)
  const updateResumeData = useCallback((newData) => {
    if (typeof newData === 'function') {
      setProfiles((prev) =>
        prev.map((p) => {
          if (p.id !== activeProfileId) return p
          const result = newData(p.data)
          setHistory((h) => [...h.slice(0, historyIndex + 1), result].slice(-30))
          setHistoryIndex((i) => Math.min(i + 1, 29))
          return { ...p, data: result }
        })
      )
    } else {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === activeProfileId ? { ...p, data: newData } : p
        )
      )
      setHistory((h) => [...h.slice(0, historyIndex + 1), newData].slice(-30))
      setHistoryIndex((i) => Math.min(i + 1, 29))
    }
  }, [activeProfileId, historyIndex])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const data = history[newIndex]
      setProfiles((prev) =>
        prev.map((p) => (p.id === activeProfileId ? { ...p, data } : p))
      )
    }
  }, [historyIndex, history, activeProfileId])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const data = history[newIndex]
      setProfiles((prev) =>
        prev.map((p) => (p.id === activeProfileId ? { ...p, data } : p))
      )
    }
  }, [historyIndex, history, activeProfileId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [undo, redo])

  // Auto-scale preview to fit container
  useEffect(() => {
    const container = previewContainerRef.current
    if (!container) return
    const updateScale = () => {
      const containerWidth = container.clientWidth - 32
      const a4Width = 794
      const scale = Math.min(containerWidth / a4Width, 1)
      setPreviewScale(scale)
    }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // --- Profile handlers ---
  const handleCreateProfile = (name) => {
    const newProfile = {
      id: `profile_${Date.now()}`,
      name,
      data: JSON.parse(JSON.stringify(emptyData)),
    }
    setProfiles((prev) => [...prev, newProfile])
    setActiveProfileId(newProfile.id)
  }

  const handleDuplicateProfile = (id) => {
    const source = profiles.find((p) => p.id === id)
    if (!source) return
    const newProfile = {
      id: `profile_${Date.now()}`,
      name: `${source.name} (Copy)`,
      data: JSON.parse(JSON.stringify(source.data)),
    }
    setProfiles((prev) => [...prev, newProfile])
    setActiveProfileId(newProfile.id)
  }

  const handleDeleteProfile = (id) => {
    if (profiles.length <= 1) return
    const remaining = profiles.filter((p) => p.id !== id)
    setProfiles(remaining)
    if (activeProfileId === id) {
      setActiveProfileId(remaining[0].id)
    }
  }

  const handleRenameProfile = (id, newName) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    )
  }

  const handleSwitchProfile = (id) => {
    setActiveProfileId(id)
  }

  // --- Print ---
  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${resumeData.personalInfo.fullName || 'Resume'}_Resume`,
  })

  // --- Sample toggle ---
  const usingSample = JSON.stringify(resumeData) === JSON.stringify(sampleData)
  const toggleSampleData = () => {
    if (usingSample) {
      updateResumeData(emptyData)
    } else {
      updateResumeData(sampleData)
    }
  }

  // --- Get selected template component ---
  const SelectedTemplateComponent = templates.find((t) => t.id === selectedTemplate)?.component

  // Get active color theme
  const currentColorTheme = colorThemes.find((t) => t.id === activeColorTheme) || colorThemes[0]

  const filledSections = [
    resumeData.personalInfo.fullName,
    resumeData.personalInfo.summary,
    resumeData.experience.some((e) => e.company || e.position),
    resumeData.education.some((e) => e.institution || e.degree),
    resumeData.skills.some((s) => s.trim() !== ''),
  ].filter(Boolean).length

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-[#f8fafc]'}`}>
      {/* Header */}
      <header className={`backdrop-blur-xl sticky top-0 z-50 border-b transition-colors duration-300 ${darkMode ? 'bg-gray-900/80 border-gray-700/80' : 'bg-white/80 border-gray-200/80'}`}>
        <div className="max-w-[1400px] mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <motion.div
              whileHover={{ rotate: -5, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20"
            >
              <FaRocket className="text-white" size={16} />
            </motion.div>
            <div>
              <h1 className={`text-[17px] font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Resume Builder
              </h1>
              <p className="text-[11px] text-gray-400 font-medium -mt-0.5">
                Create • Customize • Download
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-yellow-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
              title="Toggle dark mode"
            >
              {darkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
            </motion.button>

            {/* Mobile view toggle */}
            <div className={`flex lg:hidden rounded-xl p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <button
                onClick={() => setActiveView('form')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'form'
                    ? `${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-white shadow-sm text-blue-600'} ring-1 ring-gray-200/50`
                    : `${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`
                }`}
              >
                <FaEdit size={11} />
                Edit
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'preview'
                    ? `${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-white shadow-sm text-blue-600'} ring-1 ring-gray-200/50`
                    : `${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`
                }`}
              >
                <FaEye size={11} />
                Preview
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleSampleData}
              className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border font-medium text-[13px] ${darkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              {usingSample ? <FaEraser size={13} /> : <FaMagic size={13} />}
              {usingSample ? 'Clear' : 'Sample'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 font-semibold text-[13px]"
            >
              <FaFilePdf size={14} />
              <span className="hidden sm:inline">PDF</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Panel - Form */}
          <div
            className={`w-full lg:w-[440px] xl:w-[480px] shrink-0 ${
              activeView === 'preview' ? 'hidden lg:block' : ''
            }`}
          >
            <div className="space-y-5">
              {/* Profile Manager */}
              <ProfileManager
                profiles={profiles}
                activeProfileId={activeProfileId}
                onSwitch={handleSwitchProfile}
                onCreate={handleCreateProfile}
                onDuplicate={handleDuplicateProfile}
                onDelete={handleDeleteProfile}
                onRename={handleRenameProfile}
              />

              {/* Template Selector */}
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
              />

              {/* Color Theme Picker */}
              <ThemePicker
                activeThemeId={activeColorTheme}
                onSelect={setActiveColorTheme}
              />

              {/* Section Order (Drag & Drop) */}
              <SectionOrderPanel
                sectionOrder={sectionOrder}
                onReorder={setSectionOrder}
              />

              {/* Recommendations */}
              <Recommendations data={resumeData} />

              {/* Form */}
              <ResumeForm data={resumeData} setData={updateResumeData} darkMode={darkMode} />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div
            className={`w-full lg:flex-1 min-w-0 ${
              activeView === 'form' ? 'hidden lg:block' : ''
            }`}
          >
            <div className="sticky top-[76px]">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={`rounded-2xl shadow-xl overflow-hidden border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 shadow-gray-900/50' : 'bg-white border-gray-200/60 shadow-gray-200/50'}`}
              >
                {/* Preview toolbar */}
                <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28CA42]"></div>
                    </div>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      {templates.find((t) => t.id === selectedTemplate)?.name} Template
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeColorTheme !== 'default' && (
                      <span className="text-[10px] text-purple-500 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 font-medium">
                        {currentColorTheme.name}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-100 font-mono">
                      A4 • 210×297mm
                    </span>
                  </div>
                </div>

                {/* Preview content - scale to fit */}
                <div ref={previewContainerRef} className="overflow-auto max-h-[calc(100vh-160px)] scrollbar-thin bg-[#e8eaed]/40 p-4">
                  <div style={{ width: '210mm', transform: `scale(${previewScale})`, transformOrigin: 'top center', margin: '0 auto', height: `calc(297mm * ${previewScale})` }}>
                    <div
                      className="shadow-2xl shadow-gray-300/40 rounded overflow-hidden bg-white break-words"
                      style={{ width: '210mm', minHeight: '297mm' }}
                      ref={resumeRef}
                    >
                      {SelectedTemplateComponent && (
                        <SelectedTemplateComponent
                          data={resumeData}
                          sectionOrder={sectionOrder}
                          colorTheme={currentColorTheme}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t backdrop-blur-sm mt-16 transition-colors duration-300 ${darkMode ? 'border-gray-700/60 bg-gray-900/60' : 'border-gray-200/60 bg-white/60'}`}>
        <div className="max-w-[1400px] mx-auto px-6 py-5">
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
    </div>
  )
}

export default App
