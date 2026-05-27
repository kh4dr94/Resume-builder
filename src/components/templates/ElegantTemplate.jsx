import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

export default function ElegantTemplate({ data, sectionOrder, colorTheme }) {
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
        <div key="summary" className="mb-6 text-center max-w-[85%] mx-auto">
          <p className="text-gray-600 leading-[1.8] italic break-words">{personalInfo.summary}</p>
        </div>
      ) : null,

    experience: () =>
      filledExperience.length > 0 ? (
        <div key="experience" className="mb-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-center mb-4" style={{ color: accent || '#e11d48' }}>
            <span className="px-4 bg-white relative">Experience</span>
          </h2>
          <div className="space-y-4">
            {filledExperience.map((exp) => (
              <div key={exp.id} className="text-center">
                <h3 className="font-bold text-[12px] text-gray-800 truncate">{exp.position}</h3>
                <p className="text-[11px] truncate" style={{ color: accent || '#f43f5e' }}>{exp.company}</p>
                <p className="text-[9px] text-gray-400 italic mt-0.5">{exp.startDate}{(exp.endDate || exp.current) && ` — ${exp.current ? 'Present' : exp.endDate}`}</p>
                {exp.description && <p className="mt-2 text-gray-600 whitespace-pre-line leading-[1.7] text-[10.5px] text-left break-words">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      filledEducation.length > 0 ? (
        <div key="education" className="mb-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-center mb-4" style={{ color: accent || '#e11d48' }}>
            Education
          </h2>
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
      ) : null,

    skills: () =>
      filledSkills.length > 0 ? (
        <div key="skills" className="mb-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[3px] mb-3" style={{ color: accent || '#e11d48' }}>Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {filledSkills.map((skill, i) => (
              <span key={i} className="px-2 py-0.5 text-gray-600 rounded text-[9px] truncate max-w-[120px]" style={{ border: `1px solid ${accent || '#fecdd3'}` }}>{skill}</span>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      filledCertifications.length > 0 ? (
        <div key="certifications" className="mb-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[3px] mb-3" style={{ color: accent || '#e11d48' }}>Certifications</h2>
          <div className="space-y-1.5">
            {filledCertifications.map((cert) => (
              <div key={cert.id} className="text-[10px]">
                <p className="font-semibold text-gray-700 break-words">{cert.name}</p>
                {cert.issuer && <p className="text-gray-400 text-[9px] truncate">{cert.issuer} {cert.date && `• ${cert.date}`}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    languages: () =>
      filledLanguages.length > 0 ? (
        <div key="languages" className="mb-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[3px] mb-2" style={{ color: accent || '#e11d48' }}>Languages</h2>
          <div className="space-y-1">
            {filledLanguages.map((lang) => (
              <p key={lang.id} className="text-[10px] text-gray-600">{lang.language}{lang.proficiency && ` — ${lang.proficiency}`}</p>
            ))}
          </div>
        </div>
      ) : null,
  }

  return (
    <div className="bg-white w-full text-[11px] leading-relaxed break-words overflow-hidden" style={{ minHeight: '297mm', color: '#2d2d2d', fontFamily: "'Playfair Display', 'Georgia', serif" }}>
      {/* Header */}
      <div className="px-12 pt-10 pb-6 text-center border-b border-gray-200 relative">
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: accent || '#fda4af' }}></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: accent || '#fda4af' }}></div>
        
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="" className="w-24 h-24 rounded-full object-cover mx-auto mb-3 shadow-sm" style={{ border: `4px solid ${accent ? accent + '30' : '#ffe4e6'}` }} />
        )}
        
        <h1 className="text-[28px] font-light tracking-[3px] uppercase text-gray-800 break-words">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p className="text-[12px] tracking-[2px] uppercase mt-1 font-normal truncate" style={{ color: accent || '#f43f5e' }}>{personalInfo.title}</p>
        )}
        
        <div className="w-20 h-px mx-auto mt-4 mb-3" style={{ backgroundColor: accent || '#fda4af' }}></div>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-gray-500">
          {personalInfo.email && <span className="flex items-center gap-1"><FaEnvelope size={9} style={{ color: accent || '#fb7185' }} /><span className="truncate max-w-[160px]">{personalInfo.email}</span></span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><FaPhone size={9} style={{ color: accent || '#fb7185' }} />{personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><FaMapMarkerAlt size={9} style={{ color: accent || '#fb7185' }} />{personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1"><FaLinkedin size={9} style={{ color: accent || '#fb7185' }} /><span className="truncate max-w-[150px]">{personalInfo.linkedin}</span></span>}
          {personalInfo.website && <span className="flex items-center gap-1"><FaGlobe size={9} style={{ color: accent || '#fb7185' }} /><span className="truncate max-w-[130px]">{personalInfo.website}</span></span>}
        </div>
      </div>

      <div className="px-12 py-7">
        {/* Render sections in specified order */}
        {order.map((id) => sectionRenderers[id]?.())}
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: accent || '#fda4af' }}></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: accent || '#fda4af' }}></div>

      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && filledEducation.length === 0 && filledSkills.length === 0 && (
        <div className="text-center py-20 text-gray-400"><p className="text-lg mb-2">Your resume preview will appear here</p></div>
      )}
    </div>
  )
}
