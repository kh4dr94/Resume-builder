import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

export default function BoldTemplate({ data, sectionOrder, colorTheme }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data
  const order = sectionOrder || ['summary', 'experience', 'education', 'skills', 'certifications', 'languages']
  const accent = colorTheme?.primary || null

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  const sectionRenderers = {
    summary: () =>
      personalInfo.summary ? (
        <div key="summary" className="mb-8 pl-4 border-l-4" style={{ borderColor: accent || '#f97316' }}>
          <p className="text-gray-300 leading-[1.8] text-[11px]">{personalInfo.summary}</p>
        </div>
      ) : null,

    experience: () =>
      filledExperience.length > 0 ? (
        <div key="experience" className="mb-8">
          <h2 className="text-[14px] font-black uppercase tracking-[4px] text-white mb-4">Experience</h2>
          <div className="space-y-5">
            {filledExperience.map((exp) => (
              <div key={exp.id} className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[13px] text-white truncate">{exp.position}</h3>
                    <p className="text-[11px] font-semibold truncate" style={{ color: accent || '#fb923c' }}>{exp.company}</p>
                  </div>
                  <span className="text-[9px] text-gray-500 bg-[#252525] px-2.5 py-1 rounded whitespace-nowrap shrink-0">{exp.startDate}{(exp.endDate || exp.current) && ` — ${exp.current ? 'Present' : exp.endDate}`}</span>
                </div>
                {exp.description && <p className="mt-2 text-gray-400 whitespace-pre-line leading-[1.7] text-[10.5px]">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      filledEducation.length > 0 ? (
        <div key="education" className="mb-8">
          <h2 className="text-[14px] font-black uppercase tracking-[4px] text-white mb-4">Education</h2>
          <div className="space-y-3">
            {filledEducation.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start gap-2 bg-[#1a1a1a] rounded-lg p-3 border border-gray-800">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[12px] text-white truncate">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                  <p className="text-gray-400 text-[11px]">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-500 text-[10px]">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-[9px] text-gray-500 bg-[#252525] px-2.5 py-1 rounded whitespace-nowrap shrink-0">{edu.startDate}{edu.endDate && ` — ${edu.endDate}`}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    skills: () =>
      filledSkills.length > 0 ? (
        <div key="skills" className="mb-8">
          <h2 className="text-[14px] font-black uppercase tracking-[4px] text-white mb-3">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {filledSkills.map((skill, i) => (
              <span key={i} className="px-2.5 py-1 rounded text-[9px] font-semibold truncate max-w-[130px]" style={{ backgroundColor: (accent || '#f97316') + '1a', color: accent || '#fdba74', border: `1px solid ${(accent || '#f97316') + '4d'}` }}>{skill}</span>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      filledCertifications.length > 0 ? (
        <div key="certifications" className="mb-8">
          <h2 className="text-[14px] font-black uppercase tracking-[4px] text-white mb-3">Certs</h2>
          <div className="space-y-2">
            {filledCertifications.map((cert) => (
              <div key={cert.id} className="text-[10px]">
                <p className="text-white font-semibold">{cert.name}</p>
                {cert.issuer && <p className="text-gray-500">{cert.issuer} {cert.date && `• ${cert.date}`}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    languages: () =>
      filledLanguages.length > 0 ? (
        <div key="languages" className="mb-8">
          <h2 className="text-[14px] font-black uppercase tracking-[4px] text-white mb-3">Languages</h2>
          <div className="space-y-1">
            {filledLanguages.map((lang) => (
              <div key={lang.id} className="text-[10px] flex justify-between text-gray-300">
                <span>{lang.language}</span>
                <span style={{ color: accent || '#fb923c' }}>{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null,
  }

  return (
    <div className="bg-[#0f0f0f] w-full text-[11px] leading-relaxed break-words overflow-hidden" style={{ minHeight: '297mm', color: '#e5e5e5' }}>
      {/* Hero header */}
      <div className="px-12 pt-12 pb-8 relative">
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: accent ? `linear-gradient(to right, ${accent}, ${accent}cc)` : 'linear-gradient(to right, #f97316, #ef4444, #ec4899)' }}></div>
        <div className="flex items-start gap-6">
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="" className="w-24 h-24 rounded-2xl object-cover shrink-0" style={{ border: `2px solid ${(accent || '#f97316') + '80'}` }} />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-[36px] font-black tracking-tight text-white leading-none mb-2 truncate" style={{ fontFamily: "system-ui, sans-serif" }}>
              {personalInfo.fullName || 'YOUR NAME'}
            </h1>
            {personalInfo.title && (
              <p className="text-[15px] font-bold uppercase tracking-[3px] mb-4 truncate" style={{ color: accent || '#fb923c' }}>{personalInfo.title}</p>
            )}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] text-gray-400">
              {personalInfo.email && <span className="flex items-center gap-1.5"><FaEnvelope size={9} style={{ color: accent || '#f97316' }} className="shrink-0" /><span className="truncate max-w-[180px]">{personalInfo.email}</span></span>}
              {personalInfo.phone && <span className="flex items-center gap-1.5"><FaPhone size={9} style={{ color: accent || '#f97316' }} className="shrink-0" />{personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1.5"><FaMapMarkerAlt size={9} style={{ color: accent || '#f97316' }} className="shrink-0" />{personalInfo.location}</span>}
              {personalInfo.linkedin && <span className="flex items-center gap-1.5"><FaLinkedin size={9} style={{ color: accent || '#f97316' }} className="shrink-0" /><span className="truncate max-w-[160px]">{personalInfo.linkedin}</span></span>}
              {personalInfo.website && <span className="flex items-center gap-1.5"><FaGlobe size={9} style={{ color: accent || '#f97316' }} className="shrink-0" /><span className="truncate max-w-[140px]">{personalInfo.website}</span></span>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 pb-10">
        {/* Render sections in specified order */}
        {order.map((id) => sectionRenderers[id]?.())}
      </div>

      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && (
        <div className="text-center py-20 text-gray-600"><p className="text-lg font-bold">Your resume preview will appear here</p></div>
      )}
    </div>
  )
}
