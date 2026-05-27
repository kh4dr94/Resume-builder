import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

export default function ProfessionalTemplate({ data, sectionOrder, colorTheme }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  return (
    <div className="bg-white w-full text-[11px] leading-relaxed break-words overflow-hidden" style={{ minHeight: '297mm', color: '#1f2937', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Top accent bar */}
      <div className="h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"></div>
      
      <div className="px-10 py-8">
        {/* Header with photo */}
        <div className="flex items-start gap-6 mb-6 pb-6 border-b-2 border-teal-500">
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="" className="w-20 h-20 rounded-full object-cover border-3 border-teal-500 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-[26px] font-bold text-gray-900 truncate">{personalInfo.fullName || 'Your Name'}</h1>
            {personalInfo.title && (
              <p className="text-[13px] text-teal-600 font-semibold tracking-wide mt-0.5 truncate">{personalInfo.title}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[10px] text-gray-500">
              {personalInfo.email && <span className="flex items-center gap-1 truncate max-w-[180px]"><FaEnvelope size={9} className="text-teal-500 shrink-0" /><span className="truncate">{personalInfo.email}</span></span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><FaPhone size={9} className="text-teal-500 shrink-0" />{personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1"><FaMapMarkerAlt size={9} className="text-teal-500 shrink-0" />{personalInfo.location}</span>}
              {personalInfo.linkedin && <span className="flex items-center gap-1 truncate max-w-[180px]"><FaLinkedin size={9} className="text-teal-500 shrink-0" /><span className="truncate">{personalInfo.linkedin}</span></span>}
              {personalInfo.website && <span className="flex items-center gap-1 truncate max-w-[150px]"><FaGlobe size={9} className="text-teal-500 shrink-0" /><span className="truncate">{personalInfo.website}</span></span>}
            </div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {personalInfo.summary && (
              <div className="mb-6">
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-700 mb-2 pb-1 border-b border-teal-200">Summary</h2>
                <p className="text-gray-600 leading-[1.7] break-words">{personalInfo.summary}</p>
              </div>
            )}

            {filledExperience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-700 mb-3 pb-1 border-b border-teal-200">Experience</h2>
                <div className="space-y-4">
                  {filledExperience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-[12px] text-gray-900 truncate">{exp.position}</h3>
                          <p className="text-teal-600 text-[11px] truncate">{exp.company}</p>
                        </div>
                        <span className="text-[9px] text-gray-400 bg-teal-50 px-2 py-0.5 rounded whitespace-nowrap shrink-0">{exp.startDate}{(exp.endDate || exp.current) && ` — ${exp.current ? 'Present' : exp.endDate}`}</span>
                      </div>
                      {exp.description && <p className="mt-1.5 text-gray-600 whitespace-pre-line leading-[1.6] text-[10.5px] break-words">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filledEducation.length > 0 && (
              <div className="mb-6">
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-700 mb-3 pb-1 border-b border-teal-200">Education</h2>
                <div className="space-y-3">
                  {filledEducation.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[12px] text-gray-900 truncate">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                        <p className="text-gray-600 text-[11px] truncate">{edu.institution}</p>
                        {edu.gpa && <p className="text-gray-400 text-[10px]">GPA: {edu.gpa}</p>}
                      </div>
                      <span className="text-[9px] text-gray-400 bg-teal-50 px-2 py-0.5 rounded whitespace-nowrap shrink-0">{edu.startDate}{edu.endDate && ` — ${edu.endDate}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-[160px] shrink-0">
            {filledSkills.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-700 mb-2 pb-1 border-b border-teal-200">Skills</h2>
                <div className="space-y-1">
                  {filledSkills.map((skill, i) => (
                    <div key={i} className="text-[10px] text-gray-600 flex items-center gap-1.5 truncate">
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full shrink-0"></div>
                      <span className="truncate">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filledCertifications.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-700 mb-2 pb-1 border-b border-teal-200">Certs</h2>
                <div className="space-y-2">
                  {filledCertifications.map((cert) => (
                    <div key={cert.id} className="text-[10px]">
                      <p className="font-semibold text-gray-800 break-words">{cert.name}</p>
                      {cert.issuer && <p className="text-gray-400 truncate">{cert.issuer}</p>}
                      {cert.date && <p className="text-teal-500 text-[9px]">{cert.date}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filledLanguages.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-700 mb-2 pb-1 border-b border-teal-200">Languages</h2>
                <div className="space-y-1">
                  {filledLanguages.map((lang) => (
                    <div key={lang.id} className="text-[10px] flex justify-between">
                      <span className="text-gray-700">{lang.language}</span>
                      <span className="text-teal-500 text-[9px]">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && filledEducation.length === 0 && filledSkills.length === 0 && (
        <div className="text-center py-20 text-gray-400"><p className="text-lg font-medium mb-2">Your resume preview will appear here</p></div>
      )}
    </div>
  )
}
