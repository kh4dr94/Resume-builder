import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import { FaFilePdf, FaEye, FaEdit } from 'react-icons/fa'

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
  const [activeView, setActiveView] = useState('form') // 'form' or 'preview'
  const resumeRef = useRef(null)

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
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Form Panel */}
          <div
            className={`w-full lg:w-1/2 xl:w-5/12 ${
              activeView === 'preview' ? 'hidden lg:block' : ''
            }`}
          >
            <ResumeForm data={resumeData} setData={setResumeData} />
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
                </div>
                <div className="p-4 overflow-auto max-h-[calc(100vh-160px)]">
                  <ResumePreview ref={resumeRef} data={resumeData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
