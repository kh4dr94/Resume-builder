import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

export default function CreativeTemplate({ data, sectionOrder, colorTheme }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data
  const order = sectionOrder || ['summary', 'experience', 'education', 'skills', 'certifications', 'languages']
  const accent = colorTheme?.primary || null

  const accentColor = accent || '#34d399' // emerald-400

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  return (
    <div className="bg-white w-full text-[11px] leading-relaxed break-words overflow-hidden" style={{ minHeight: '297mm', color: '#1a1a1a' }}>

      {/* Two-column layout */}
      <div className="flex" style={{ minHeight: '297mm' }}>
        {/* Left sidebar */}
        <div className="w-[35%] bg-slate-800 text-white px-6 py-8">
          {/* Photo */}
          {personalInfo.photo && (
            <div className="mb-5 flex justify-center">
              <img src={personalInfo.photo} alt="" className="w-24 h-24 rounded-full object-cover" style={{ border: `3px solid ${accentColor}` }} />
            </div>
          )}
          {/* Name */}
          <div className="mb-6 pb-4 border-b border-slate-600">
            <h1 className="text-[22px] font-bold leading-tight mb-1 break-words">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.title && (
              <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: accentColor }}>
                {personalInfo.title}
              </p>
            )}
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Contact</h2>
            <div className="space-y-2 text-[10px] text-gray-300">
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <FaEnvelope size={10} style={{ color: accentColor }} />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <FaPhone size={10} style={{ color: accentColor }} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt size={10} style={{ color: accentColor }} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <FaLinkedin size={10} style={{ color: accentColor }} />
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <FaGlobe size={10} style={{ color: accentColor }} />
                  <span>{personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>


          {/* Skills */}
          {filledSkills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {filledSkills.map((skill, index) => (
                  <span key={index} className="px-2 py-0.5 bg-slate-700 text-gray-200 rounded text-[9px] border border-slate-600">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {filledLanguages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Languages</h2>
              <div className="space-y-2">
                {filledLanguages.map((lang) => (
                  <div key={lang.id} className="text-[10px]">
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span>{lang.language}</span>
                      <span style={{ color: accentColor }}>{lang.proficiency}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{
                        backgroundColor: accentColor,
                        width: lang.proficiency === 'Native' ? '100%' :
                               lang.proficiency === 'Fluent' ? '90%' :
                               lang.proficiency === 'Advanced' ? '75%' :
                               lang.proficiency === 'Intermediate' ? '55%' : '35%'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {filledCertifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Certifications</h2>
              <div className="space-y-2">
                {filledCertifications.map((cert) => (
                  <div key={cert.id} className="text-[10px]">
                    <p className="text-white font-medium">{cert.name}</p>
                    {cert.issuer && <p className="text-gray-400">{cert.issuer}</p>}
                    {cert.date && <p className="text-[9px]" style={{ color: accentColor }}>{cert.date}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


        {/* Right main content */}
        <div className="w-[65%] px-8 py-8">
          {/* Summary */}
          {personalInfo.summary && (
            <div className="mb-6">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-800 mb-2 pb-1" style={{ borderBottom: `2px solid ${accentColor}` }}>
                About Me
              </h2>
              <p className="text-gray-600 leading-[1.7]">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {filledExperience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-800 mb-3 pb-1" style={{ borderBottom: `2px solid ${accentColor}` }}>
                Work Experience
              </h2>
              <div className="space-y-4">
                {filledExperience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[12px] text-gray-900">{exp.position}</h3>
                        <p className="font-medium text-[11px]" style={{ color: accentColor }}>{exp.company}</p>
                      </div>
                      <span className="text-[9px] text-white bg-slate-700 px-2 py-0.5 rounded whitespace-nowrap ml-3">
                        {exp.startDate}{(exp.endDate || exp.current) && ` — ${exp.current ? 'Present' : exp.endDate}`}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="mt-1.5 text-gray-600 whitespace-pre-line leading-[1.6] text-[10px]">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {filledEducation.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-800 mb-3 pb-1" style={{ borderBottom: `2px solid ${accentColor}` }}>
                Education
              </h2>
              <div className="space-y-3">
                {filledEducation.map((edu) => (
                  <div key={edu.id} className="pl-4 border-l-2 border-gray-200 relative">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[12px] text-gray-900">
                          {edu.degree}{edu.field && ` in ${edu.field}`}
                        </h3>
                        <p className="text-[11px]" style={{ color: accentColor }}>{edu.institution}</p>
                        {edu.gpa && <p className="text-gray-500 text-[10px]">GPA: {edu.gpa}</p>}
                      </div>
                      <span className="text-[9px] text-white bg-slate-700 px-2 py-0.5 rounded whitespace-nowrap ml-3">
                        {edu.startDate}{edu.endDate && ` — ${edu.endDate}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && filledEducation.length === 0 && filledSkills.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium mb-2">Your resume preview will appear here</p>
          <p className="text-sm">Start filling in the form to see your resume come to life!</p>
        </div>
      )}
    </div>
  )
}
