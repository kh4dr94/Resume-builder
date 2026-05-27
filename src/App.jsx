import { useState, useRef, useEffect, useCallback } from 'react'
import { useReactToPrint } from 'react-to-print'
import { motion, AnimatePresence } from 'framer-motion'
import ResumeForm from './components/ResumeForm'
import TemplateSelector from './components/TemplateSelector'
import Recommendations from './components/Recommendations'
import { templates } from './components/templates'
import { FaFilePdf, FaEye, FaEdit, FaRocket, FaMagic, FaShieldAlt, FaEraser } from 'react-icons/fa'

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

function App() {
  const [resumeData, setResumeData] = useState(sampleData)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [activeView, setActiveView] = useState('form')
  const [usingSample, setUsingSample] = useState(true)
  const [previewScale, setPreviewScale] = useState(0.55)
  const resumeRef = useRef(null)
  const previewContainerRef = useRef(null)

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
  }, [])

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${resumeData.personalInfo.fullName || 'Resume'}_Resume`,
  })

  const toggleSampleData = () => {
    if (usingSample) {
      setResumeData(emptyData)
      setUsingSample(false)
    } else {
      setResumeData(sampleData)
      setUsingSample(true)
    }
  }

  const SelectedTemplateComponent = templates.find((t) => t.id === selectedTemplate)?.component

  const filledSections = [
    resumeData.personalInfo.fullName,
    resumeData.personalInfo.summary,
    resumeData.experience.some((e) => e.company || e.position),
    resumeData.education.some((e) => e.institution || e.degree),
    resumeData.skills.some((s) => s.trim() !== ''),
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/80">
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
              <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">
                Resume Builder
              </h1>
              <p className="text-[11px] text-gray-400 font-medium -mt-0.5">
                Create • Customize • Download
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress indicator */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < filledSections ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-500 font-medium ml-1">
                {filledSections}/5 sections
              </span>
            </div>

            {/* Mobile view toggle */}
            <div className="flex lg:hidden bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveView('form')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'form'
                    ? 'bg-white shadow-sm text-blue-600 ring-1 ring-gray-200/50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaEdit size={11} />
                Edit
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'preview'
                    ? 'bg-white shadow-sm text-blue-600 ring-1 ring-gray-200/50'
                    : 'text-gray-500 hover:text-gray-700'
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
              className="hidden sm:flex items-center gap-2 bg-white text-gray-600 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all border border-gray-200 font-medium text-[13px] hover:text-gray-800"
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
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
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
              {/* Template Selector */}
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
              />

              {/* Recommendations */}
              <Recommendations data={resumeData} />

              {/* Form */}
              <ResumeForm data={resumeData} setData={setResumeData} />
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
                className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-200/60"
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
                        <SelectedTemplateComponent data={resumeData} />
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
      <footer className="border-t border-gray-200/60 bg-white/60 backdrop-blur-sm mt-16">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-gray-400">
                <FaMagic size={11} />
                <span className="text-[11px] font-medium">Built with React + Tailwind CSS</span>
              </div>
              <div className="hidden sm:block h-3 w-px bg-gray-200"></div>
              <div className="hidden sm:flex items-center gap-1.5 text-gray-400">
                <FaShieldAlt size={10} />
                <span className="text-[11px] font-medium">100% client-side — your data never leaves your browser</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-300 font-medium">
              v2.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
