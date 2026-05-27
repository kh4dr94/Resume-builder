import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

export default function ElegantTemplate({ data, sectionOrder, colorTheme }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  return (
    <div className="bg-white w-full text-[11px] leading-relaxed break-words overflow-hidden" style={{ minHeight: '297mm', color: '#2d2d2d', fontFamily: "'Playfair Display', 'Georgia', serif" }}>
      {/* Header */}
      <div className="px-12 pt-10 pb-6 text-center border-b border-gray-200 relative">
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-rose-300"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-rose-300"></div>
        
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="" className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-rose-100 shadow-sm" />
        )}
        
        <h1 className="text-[28px] font-light tracking-[3px] uppercase text-gray-800 break-words">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p className="text-[12px] text-rose-500 tracking-[2px] uppercase mt-1 font-normal truncate">{personalInfo.title}</p>
        )}
        
        <div className="w-20 h-px bg-rose-300 mx-auto mt-4 mb-3"></div>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-gray-500">
          {personalInfo.email && <span className="flex items-center gap-1"><FaEnvelope size={9} className="text-rose-400" /><span className="truncate max-w-[160px]">{personalInfo.email}</span></span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><FaPhone size={9} className="text-rose-400" />{personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><FaMapMarkerAlt size={9} className="text-rose-400" />{personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1"><FaLinkedin size={9} className="text-rose-400" /><span className="truncate max-w-[150px]">{personalInfo.linkedin}</span></span>}
          {personalInfo.website && <span className="flex items-center gap-1"><FaGlobe size={9} className="text-rose-400" /><span className="truncate max-w-[130px]">{personalInfo.website}</span></span>}
        </div>
      </div>

      <div className="px-12 py-7">
        {personalInfo.summary && (
          <div className="mb-6 text-center max-w-[85%] mx-auto">
            <p className="text-gray-600 leading-[1.8] italic break-words">{personalInfo.summary}</p>
          </div>
        )}

        {filledExperience.length > 0 && (
          <div className="mb-7">
            <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-center text-rose-600 mb-4"><span className="px-4 bg-white relative">Experience</span></h2>
            <div className="space-y-4">
              {filledExperience.map((exp) => (
                <div key={exp.id} className="text-center">
                  <h3 className="font-bold text-[12px] text-gray-800 truncate">{exp.position}</h3>
                  <p className="text-rose-500 text-[11px] truncate">{exp.company}</p>
                  <p className="text-[9px] text-gray-400 italic mt-0.5">{exp.startDate}{(exp.endDate || exp.current) && ` — ${exp.current ? 'Present' : exp.endDate}`}</p>
                  {exp.description && <p className="mt-2 text-gray-600 whitespace-pre-line leading-[1.7] text-[10.5px] text-left break-words">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {filledEducation.length > 0 && (
          <div className="mb-7">
            <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-center text-rose-600 mb-4">Education</h2>
            <div className="space-y-3 text-center">
              {filledEducation.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-[12px] text-gray-800 break-words">{edu.degree}{edu.field && `, ${edu.field}`}</h3>
                  <p className="text-gray-600 text-[11px]">{edu.institution}</p>
                  <p className="text-[9px] text-gray-400 italic">{edu.startDate}{edu.endDate && ` — ${edu.endDate}`}{edu.gpa && ` • GPA: ${edu.gpa}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          {filledSkills.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-rose-600 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {filledSkills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 border border-rose-200 text-gray-600 rounded text-[9px] truncate max-w-[120px]">{skill}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            {filledCertifications.length > 0 && (
              <div className="mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-rose-600 mb-3">Certifications</h2>
                <div className="space-y-1.5">
                  {filledCertifications.map((cert) => (
                    <div key={cert.id} className="text-[10px]">
                      <p className="font-semibold text-gray-700 break-words">{cert.name}</p>
                      {cert.issuer && <p className="text-gray-400 text-[9px] truncate">{cert.issuer} {cert.date && `• ${cert.date}`}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filledLanguages.length > 0 && (
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-rose-600 mb-2">Languages</h2>
                <div className="space-y-1">
                  {filledLanguages.map((lang) => (
                    <p key={lang.id} className="text-[10px] text-gray-600">{lang.language}{lang.proficiency && ` — ${lang.proficiency}`}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-rose-300"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-rose-300"></div>

      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && filledEducation.length === 0 && filledSkills.length === 0 && (
        <div className="text-center py-20 text-gray-400"><p className="text-lg mb-2">Your resume preview will appear here</p></div>
      )}
    </div>
  )
}
