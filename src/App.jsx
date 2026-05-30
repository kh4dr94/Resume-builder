import { useState, useRef, useEffect, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useReactToPrint } from 'react-to-print'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import DraggableSection from './components/DraggableSection'
import ProfileManager from './components/ProfileManager'
import TemplateSelector, { templates } from './components/TemplateSelector'
import MobileToolbar from './components/MobileToolbar'
import ToolsPanel from './components/ToolsPanel'
import AIFeatures from './components/AIFeatures'
import ResumeAnalytics from './components/ResumeAnalytics'
import VersionHistory from './components/VersionHistory'
import QuickFill from './components/QuickFill'
import { TranslationProvider } from './TranslationContext'
import { t } from './i18n'
import {
  FaFilePdf,
  FaEye,
  FaEdit,
  FaGripVertical,
  FaMoon,
  FaSun,
  FaEllipsisH,
  FaCog,
  FaColumns,
  FaMagic,
} from 'react-icons/fa'

const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'education',
  'skills',
  'certifications',
  'languages',
]

const sectionLabelKey = {
  summary: 'sections.summary',
  experience: 'sections.experience',
  education: 'sections.education',
  skills: 'sections.skills',
  certifications: 'sections.certifications',
  languages: 'sections.languages',
}

const createEmptyResumeData = () => ({
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
    profileImage: '',
  },
  experience: [
    {
      id: 1,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
  ],
  education: [
    {
      id: 1,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    },
  ],
  skills: [''],
  certifications: [{ id: 1, name: '', issuer: '', date: '' }],
  languages: [{ id: 1, language: '', proficiency: '' }],
})

const STORAGE_KEY = 'resumeBuilder_state'
const VERSIONS_KEY = 'resumeBuilder_versions'

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load state:', e)
  }
  return null
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save state:', e)
  }
}

function loadVersions() {
  try {
    const saved = localStorage.getItem(VERSIONS_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {}
  return []
}

function saveVersions(versions) {
  try {
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions))
  } catch (e) {}
}

function App() {
  const savedState = loadState()

  const [profiles, setProfiles] = useState(
    savedState?.profiles || [
      { id: 'default', name: 'My Resume', data: createEmptyResumeData() },
    ]
  )
  const [activeProfileId, setActiveProfileId] = useState(
    savedState?.activeProfileId || 'default'
  )
  const [activeTemplateId, setActiveTemplateId] = useState(
    savedState?.activeTemplateId || 'creative'
  )
  const [sectionOrder, setSectionOrder] = useState(
    savedState?.sectionOrder || [...DEFAULT_SECTION_ORDER]
  )
  const [activeView, setActiveView] = useState('form')
  const [darkMode, setDarkMode] = useState(savedState?.darkMode || false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [toolsInitialSheet, setToolsInitialSheet] = useState(null)
  const [aiOpen, setAiOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(savedState?.currentLanguage || 'en-US')
  const [versions, setVersions] = useState(loadVersions)
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const resumeRef = useRef(null)
  const lastSaveRef = useRef(Date.now())

  // Get active profile data
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0]
  const resumeData = activeProfile.data
  const activeTemplate = templates.find((t_) => t_.id === activeTemplateId) || templates[0]

  // Persist state
  useEffect(() => {
    saveState({ profiles, activeProfileId, activeTemplateId, sectionOrder, darkMode, currentLanguage })
  }, [profiles, activeProfileId, activeTemplateId, sectionOrder, darkMode, currentLanguage])

  // Auto-save version every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      if (now - lastSaveRef.current > 300000) {
        const newVersion = {
          id: `v_${now}`,
          timestamp: now,
          data: JSON.parse(JSON.stringify(resumeData)),
          label: null,
        }
        const updated = [newVersion, ...versions].slice(0, 10)
        setVersions(updated)
        saveVersions(updated)
        lastSaveRef.current = now
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [versions, resumeData])

  // Update resume data for active profile
  const setResumeData = (updater) => {
    // Push to undo stack
    setUndoStack((prev) => [...prev.slice(-20), JSON.parse(JSON.stringify(resumeData))])
    setRedoStack([])

    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, data: typeof updater === 'function' ? updater(p.data) : updater }
          : p
      )
    )
  }

  // Undo/Redo
  const handleUndo = () => {
    if (undoStack.length === 0) return
    const previous = undoStack[undoStack.length - 1]
    setRedoStack((prev) => [...prev, JSON.parse(JSON.stringify(resumeData))])
    setUndoStack((prev) => prev.slice(0, -1))
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, data: previous } : p))
    )
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(resumeData))])
    setRedoStack((prev) => prev.slice(0, -1))
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, data: next } : p))
    )
  }

  // Version History handlers
  const handleRestoreVersion = (version) => {
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(resumeData))])
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, data: version.data } : p))
    )
  }

  const handleDeleteVersion = (versionId) => {
    const updated = versions.filter((v) => v.id !== versionId)
    setVersions(updated)
    saveVersions(updated)
  }

  // Quick Fill
  const handleQuickFill = (sampleData) => {
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(resumeData))])
    setRedoStack([])
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, data: sampleData } : p))
    )
    // Save a version before quick fill
    const newVersion = {
      id: `v_${Date.now()}`,
      timestamp: Date.now(),
      data: JSON.parse(JSON.stringify(resumeData)),
      label: 'Before Quick Fill',
    }
    const updated = [newVersion, ...versions].slice(0, 10)
    setVersions(updated)
    saveVersions(updated)
  }

  // Export/Import
  const handleExport = () => {
    const exportData = {
      resumeData,
      templateId: activeTemplateId,
      sectionOrder,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resumeData.personalInfo.fullName || 'resume'}_export.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target.result)
          if (imported.resumeData) {
            setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(resumeData))])
            setProfiles((prev) =>
              prev.map((p) =>
                p.id === activeProfileId ? { ...p, data: imported.resumeData } : p
              )
            )
            if (imported.templateId) setActiveTemplateId(imported.templateId)
            if (imported.sectionOrder) setSectionOrder(imported.sectionOrder)
          }
        } catch (err) {
          alert('Invalid file format')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  // Profile handlers
  const handleCreateProfile = (name) => {
    const newProfile = {
      id: `profile_${Date.now()}`,
      name,
      data: createEmptyResumeData(),
    }
    setProfiles((prev) => [...prev, newProfile])
    setActiveProfileId(newProfile.id)
  }

  const handleSwitchProfile = (id) => {
    setActiveProfileId(id)
  }

  const handleDeleteProfile = (id) => {
    if (profiles.length <= 1) return
    setProfiles((prev) => prev.filter((p) => p.id !== id))
    if (activeProfileId === id) {
      const remaining = profiles.filter((p) => p.id !== id)
      setActiveProfileId(remaining[0].id)
    }
  }

  const handleRenameProfile = (id, newName) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    )
  }

  // Drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${resumeData.personalInfo.fullName || 'Resume'}_Resume`,
  })

  return (
    <TranslationProvider language={currentLanguage}>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-100 to-blue-50'}`}>
        {/* Header */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">R</span>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t(currentLanguage, 'app.title')}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  darkMode
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
              </button>

              {/* Tools button */}
              <button
                onClick={() => { setToolsInitialSheet(null); setToolsOpen(true) }}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaEllipsisH size={16} />
              </button>

              {/* View toggle */}
              <div className={`flex lg:hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-0.5`}>
                <button
                  onClick={() => setActiveView('form')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeView === 'form'
                      ? `${darkMode ? 'bg-gray-600 text-white' : 'bg-white shadow text-blue-600'}`
                      : `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                  }`}
                >
                  <FaEdit size={12} />
                  {t(currentLanguage, 'app.edit')}
                </button>
                <button
                  onClick={() => setActiveView('preview')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeView === 'preview'
                      ? `${darkMode ? 'bg-gray-600 text-white' : 'bg-white shadow text-blue-600'}`
                      : `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                  }`}
                >
                  <FaEye size={12} />
                  {t(currentLanguage, 'app.preview')}
                </button>
              </div>

              {/* Settings */}
              <button
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaCog size={16} />
              </button>

              {/* PDF Download */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md font-medium text-sm"
              >
                <FaFilePdf size={14} />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Quick Tools Bar */}
        <MobileToolbar
          onShareOpen={() => { setToolsInitialSheet('share'); setToolsOpen(true) }}
          onCoverLetterOpen={() => { setToolsInitialSheet('cover-letter'); setToolsOpen(true) }}
          onJobMatchOpen={() => { setToolsInitialSheet('job-match'); setToolsOpen(true) }}
          onGrammarOpen={() => { setToolsInitialSheet('grammar'); setToolsOpen(true) }}
          onTailorOpen={() => { setToolsInitialSheet('tailor'); setToolsOpen(true) }}
          onQuantifyOpen={() => { setToolsInitialSheet('quantify'); setToolsOpen(true) }}
          onLanguageOpen={() => { setToolsInitialSheet('language'); setToolsOpen(true) }}
          currentLanguage={currentLanguage}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-4 pb-20 lg:py-6 lg:pb-6">
          <div className="flex gap-6">
            {/* Form Panel */}
            <div
              className={`w-full lg:w-1/2 xl:w-5/12 ${
                activeView === 'preview' ? 'hidden lg:block' : ''
              }`}
            >
              <div className="space-y-3">
                {/* Active Profile Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg flex items-center justify-center`}>
                      <FaColumns size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t(currentLanguage, 'profile.activeProfile')}</p>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {activeProfile.name}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {profiles.length}
                    </span>
                  </div>
                </div>

                {/* Quick Fill */}
                <QuickFill onFill={handleQuickFill} />

                {/* Resume Analytics */}
                <ResumeAnalytics data={resumeData} />

                {/* Version History */}
                <VersionHistory
                  versions={versions}
                  onRestore={handleRestoreVersion}
                  onDelete={handleDeleteVersion}
                />

                {/* Template Selector */}
                <TemplateSelector
                  activeTemplateId={activeTemplateId}
                  onSelect={setActiveTemplateId}
                />

                {/* Profile Manager */}
                <ProfileManager
                  profiles={profiles}
                  activeProfileId={activeProfileId}
                  onSwitch={handleSwitchProfile}
                  onCreate={handleCreateProfile}
                  onDelete={handleDeleteProfile}
                  onRename={handleRenameProfile}
                />

                {/* Section Order (Drag & Drop) */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4`}>
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} flex items-center gap-2 mb-3`}>
                    <FaGripVertical size={12} className="text-green-600" />
                    {t(currentLanguage, 'sections.sectionOrder')}
                    <span className={`text-xs font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>({t(currentLanguage, 'sections.dragToReorder')})</span>
                  </h3>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={sectionOrder}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-1">
                        {sectionOrder.map((sectionId) => (
                          <DraggableSection key={sectionId} id={sectionId}>
                            <div className={`px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'} rounded-lg border text-sm font-medium`}>
                              {t(currentLanguage, sectionLabelKey[sectionId])}
                            </div>
                          </DraggableSection>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>

                {/* Resume Form */}
                <ResumeForm data={resumeData} setData={setResumeData} />
              </div>
            </div>

            {/* Preview Panel */}
            <div
              className={`w-full lg:w-1/2 xl:w-7/12 ${
                activeView === 'form' ? 'hidden lg:block' : ''
              }`}
            >
              <div className="sticky top-6">
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                  <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} px-4 py-2 border-b flex items-center gap-2`}>
                    <FaEye className={darkMode ? 'text-gray-400' : 'text-gray-400'} size={14} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t(currentLanguage, 'preview.livePreview')}</span>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} ml-auto capitalize`}>
                      {t(currentLanguage, 'preview.template')}: {activeTemplate.name}
                    </span>
                  </div>
                  <div className="p-4 overflow-auto max-h-[calc(100vh-160px)]">
                    <ResumePreview
                      ref={resumeRef}
                      data={resumeData}
                      theme={activeTemplate}
                      sectionOrder={sectionOrder}
                      sectionLabels={{
                        summary: t(currentLanguage, 'sections.summary'),
                        experience: t(currentLanguage, 'sections.experience'),
                        education: t(currentLanguage, 'sections.education'),
                        skills: t(currentLanguage, 'sections.skills'),
                        certifications: t(currentLanguage, 'sections.certifications'),
                        languages: t(currentLanguage, 'sections.languages'),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Tools Panel */}
        <ToolsPanel
          isOpen={toolsOpen}
          onClose={() => { setToolsOpen(false); setToolsInitialSheet(null) }}
          resumeData={resumeData}
          onUpdateData={(data) => setResumeData(data)}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
          onExport={handleExport}
          onImport={handleImport}
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          initialSheet={toolsInitialSheet}
          onPrint={handlePrint}
        />
      </div>
    </TranslationProvider>
  )
}

export default App
