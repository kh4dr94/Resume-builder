import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { motion } from 'framer-motion'
import ResumeForm from './components/ResumeForm'
import TemplateSelector from './components/TemplateSelector'
import Recommendations from './components/Recommendations'
import { templates } from './components/templates'
import { FaFilePdf, FaEye, FaEdit, FaRocket } from 'react-icons/fa'

const initialData = {
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
}

function App() {
  const [resumeData, setResumeData] = useState(initialData)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [activeView, setActiveView] = useState('form')
  const resumeRef = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${resumeData.personalInfo.fullName || 'Resume'}_Resume`,
  })

  const SelectedTemplateComponent = templates.find(
    (t) => t.id === selectedTemplate
  )?.component

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200"
            >
              <FaRocket className="text-white" size={18} />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Resume Builder
              </h1>
              <p className="text-[10px] text-gray-500 font-medium">
                Professional resumes in minutes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile view toggle */}
            <div className="flex lg:hidden bg-gray-100/80 rounded-lg p-1 backdrop-blur">
              <button
                onClick={() => setActiveView('form')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeView === 'form'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaEdit size={12} />
                Edit
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeView === 'preview'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaEye size={12} />
                Preview
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-200/60 font-medium text-sm"
            >
              <FaFilePdf size={15} />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Panel - Form */}
          <div
            className={`w-full lg:w-[45%] xl:w-5/12 space-y-4 ${
              activeView === 'preview' ? 'hidden lg:block' : ''
            }`}
          >
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

          {/* Right Panel - Preview */}
          <div
            className={`w-full lg:w-[55%] xl:w-7/12 ${
              activeView === 'form' ? 'hidden lg:block' : ''
            }`}
          >
            <div className="sticky top-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100/80 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 ml-2">
                      Live Preview — {templates.find((t) => t.id === selectedTemplate)?.name} Template
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded">
                    A4
                  </span>
                </div>
                <div className="p-4 overflow-auto max-h-[calc(100vh-140px)] scrollbar-thin bg-gray-100/50">
                  <div className="shadow-lg rounded-sm overflow-hidden" ref={resumeRef}>
                    {SelectedTemplateComponent && (
                      <SelectedTemplateComponent data={resumeData} />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200/60 bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Built with React + Tailwind CSS
          </p>
          <p className="text-xs text-gray-400">
            Your data stays in your browser — nothing is sent to any server
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
