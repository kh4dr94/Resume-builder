import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

export default function DarkModeTemplate({ data, sectionOrder, colorTheme }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data
  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  return (
    <div className="bg-[#0a0a0f] w-full text-[11px] leading-relaxed break-words overflow-hidden" style={{ minHeight: '297mm', color: '#e2e8f0', fontFamily: "system-ui, sans-serif" }}>
      {/* Neon accent line */}
      <div className="h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"></div>

      <div className="px-10 py-10">
        {/* Header */}
        <div className="flex items-start gap-6 mb-8 pb-6 border-b border-gray-800">
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="" className="w-20 h-20 rounded-xl object-cover ring-2 ring-cyan-500/50 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-[28px] font-bold text-white leading-tight mb-1 truncate">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.title && (
              <p className="text-[13px] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-semibold mb-3 truncate">{personalInfo.title}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-gray-400">
              {personalInfo.email && <span className="flex items-center gap-1.5"><FaEnvelope size={9} className="text-cyan-400 shrink-0" /><span className="truncate max-w-[170px]">{personalInfo.email}</span></span>}
              {personalInfo.phone && <span className="flex items-center gap-1.5"><FaPhone size={9} className="text-cyan-400 shrink-0" />{personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1.5"><FaMapMarkerAlt size={9} className="text-cyan-400 shrink-0" />{personalInfo.location}</span>}
              {personalInfo.linkedin && <span className="flex items-center gap-1.5"><FaLinkedin size={9} className="text-cyan-400 shrink-0" /><span className="truncate max-w-[150px]">{personalInfo.linkedin}</span></span>}
              {personalInfo.website && <span className="flex items-center gap-1.5"><FaGlobe size={9} className="text-cyan-400 shrink-0" /><span className="truncate max-w-[130px]">{personalInfo.website}</span></span>}
            </div>
          </div>
        </div>

        {personalInfo.summary && (
          <div className="mb-7">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-cyan-400 mb-2">About</h2>
            <p className="text-gray-300 leading-[1.8]">{personalInfo.summary}</p>
          </div>
        )}

        {filledExperience.length > 0 && (
          <div className="mb-7">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-cyan-400 mb-4">Experience</h2>
            <div className="space-y-4">
              {filledExperience.map((exp) => (
                <div key={exp.id} className="bg-[#111118] rounded-xl p-4 border border-gray-800/50 hover:border-cyan-900/50 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[12px] text-white truncate">{exp.position}</h3>
                      <p className="text-purple-400 text-[11px] truncate">{exp.company}</p>
                    </div>
                    <span className="text-[9px] text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">{exp.startDate}{(exp.endDate || exp.current) && ` — ${exp.current ? 'Present' : exp.endDate}`}</span>
                  </div>
                  {exp.description && <p className="mt-2 text-gray-400 whitespace-pre-line leading-[1.7] text-[10.5px]">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {filledEducation.length > 0 && (
          <div className="mb-7">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-cyan-400 mb-4">Education</h2>
            <div className="space-y-3">
              {filledEducation.map((edu) => (
                <div key={edu.id} className="bg-[#111118] rounded-xl p-3 border border-gray-800/50 flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[12px] text-white truncate">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                    <p className="text-gray-400 text-[11px]">{edu.institution}</p>
                    {edu.gpa && <p className="text-gray-500 text-[10px]">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-[9px] text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">{edu.startDate}{edu.endDate && ` — ${edu.endDate}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {filledSkills.length > 0 && (
          <div className="mb-7">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-cyan-400 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {filledSkills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-cyan-300 border border-cyan-500/20 rounded-lg text-[9px] font-medium truncate max-w-[140px]">{skill}</span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {filledCertifications.length > 0 && (
            <div>
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-cyan-400 mb-3">Certifications</h2>
              <div className="space-y-2">
                {filledCertifications.map((cert) => (
                  <div key={cert.id} className="text-[10px]">
                    <p className="text-white font-semibold">{cert.name}</p>
                    {cert.issuer && <p className="text-gray-500">{cert.issuer} {cert.date && `• ${cert.date}`}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {filledLanguages.length > 0 && (
            <div>
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-cyan-400 mb-3">Languages</h2>
              <div className="space-y-1.5">
                {filledLanguages.map((lang) => (
                  <div key={lang.id} className="flex justify-between text-[10px]">
                    <span className="text-gray-300">{lang.language}</span>
                    <span className="text-purple-400">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && (
        <div className="text-center py-20 text-gray-600"><p className="text-lg">Your resume preview will appear here</p></div>
      )}
    </div>
  )
}
