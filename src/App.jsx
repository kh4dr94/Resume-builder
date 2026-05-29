import { useState, useRef, useEffect } from 'react'
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
import ThemePicker, { themes } from './components/ThemePicker'
import MobileToolbar from './components/MobileToolbar'
import { FaFilePdf, FaEye, FaEdit, FaGripVertical } from 'react-icons/fa'

const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'education',
  'skills',
  'certifications',
  'languages',
]

const SECTION_LABELS = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  languages: 'Languages',
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
  const [activeThemeId, setActiveThemeId] = useState(
    savedState?.activeThemeId || 'classic'
  )
  const [sectionOrder, setSectionOrder] = useState(
    savedState?.sectionOrder || [...DEFAULT_SECTION_ORDER]
  )
  const [activeView, setActiveView] = useState('form')
  const resumeRef = useRef(null)

  // Get active profile data
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0]
  const resumeData = activeProfile.data
  const activeTheme = themes.find((t) => t.id === activeThemeId) || themes[0]

  // Persist state
  useEffect(() => {
    saveState({ profiles, activeProfileId, activeThemeId, sectionOrder })
  }, [profiles, activeProfileId, activeThemeId, sectionOrder])

  // Update resume data for active profile
  const setResumeData = (updater) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, data: typeof updater === 'function' ? updater(p.data) : updater }
          : p
      )
    )
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-xs text-gray-500">Create professional resumes in minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile view toggle */}
            <div className="flex lg:hidden bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveView('form')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeView === 'form'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaEdit size={14} />
                Edit
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeView === 'preview'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaEye size={14} />
                Preview
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
            >
              <FaFilePdf size={16} />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-6">
        <div className="flex gap-6">
          {/* Form Panel */}
          <div
            className={`w-full lg:w-1/2 xl:w-5/12 ${
              activeView === 'preview' ? 'hidden lg:block' : ''
            }`}
          >
            <div className="space-y-4">
              {/* Profile Manager */}
              <ProfileManager
                profiles={profiles}
                activeProfileId={activeProfileId}
                onSwitch={handleSwitchProfile}
                onCreate={handleCreateProfile}
                onDelete={handleDeleteProfile}
                onRename={handleRenameProfile}
              />

              {/* Theme Picker */}
              <ThemePicker
                activeThemeId={activeThemeId}
                onSelect={setActiveThemeId}
              />

              {/* Section Order (Drag & Drop) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <FaGripVertical size={12} className="text-green-600" />
                  Section Order
                  <span className="text-xs font-normal text-gray-400">(drag to reorder)</span>
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
                          <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 font-medium">
                            {SECTION_LABELS[sectionId]}
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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                  <FaEye className="text-gray-400" size={14} />
                  <span className="text-sm font-medium text-gray-600">Live Preview</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    Theme: {activeTheme.name}
                  </span>
                </div>
                <div className="p-4 overflow-auto max-h-[calc(100vh-160px)]">
                  <ResumePreview
                    ref={resumeRef}
                    data={resumeData}
                    theme={activeTheme}
                    sectionOrder={sectionOrder}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Toolbar */}
      <MobileToolbar
        onPrint={handlePrint}
        activeThemeId={activeThemeId}
        onSelectTheme={setActiveThemeId}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSwitchProfile={handleSwitchProfile}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
        onRenameProfile={handleRenameProfile}
        sectionOrder={sectionOrder}
        sectionLabels={SECTION_LABELS}
        onReorder={setSectionOrder}
      />
    </div>
  )
}

export default App
