import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

export default function InfographicTemplate({ data, sectionOrder, colorTheme }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data
  const order = sectionOrder || ['summary', 'experience', 'education', 'skills', 'certifications', 'languages']
  const accent = colorTheme?.primary || null

  const accentColor = accent || '#7c3aed' // violet-600

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  const proficiencyWidth = (p) => p === 'Native' ? '100%' : p === 'Fluent' ? '90%' : p === 'Advanced' ? '75%' : p === 'Intermediate' ? '55%' : '35%'

  return (
    <div className="bg-white w-full text-[11px] leading-relaxed break-words overflow-hidden" style={{ minHeight: '297mm', color: '#1f2937' }}>
      {/* Left sidebar + main content */}
      <div className="flex" style={{ minHeight: '297mm' }}>
        {/* Sidebar */}
        <div className="w-[38%] text-white px-6 py-8" style={{ background: accent ? `linear-gradient(to bottom, ${accent}, ${accent}cc)` : 'linear-gradient(to bottom, #7c3aed, #4338ca)' }}>
          {personalInfo.photo && (
            <div className="mb-5 flex justify-center">
              <img src={personalInfo.photo} alt="" className="w-28 h-28 rounded-full object-cover border-4 border-white/20" />
            </div>
          )}
          <div className="text-center mb-6 pb-5 border-b border-white/20">
            <h1 className="text-[20px] font-bold leading-tight break-words">{personalInfo.fullName || 'Your Name'}</h1>
            {personalInfo.title && <p className="text-white/70 text-[11px] mt-1">{personalInfo.title}</p>}
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-3">Contact</h2>
            <div className="space-y-2 text-[10px] text-white/80">
              {personalInfo.email && <div className="flex items-center gap-2"><FaEnvelope size={9} className="text-white/60 shrink-0" /><span className="break-all">{personalInfo.email}</span></div>}
              {personalInfo.phone && <div className="flex items-center gap-2"><FaPhone size={9} className="text-white/60 shrink-0" />{personalInfo.phone}</div>}
              {personalInfo.location && <div className="flex items-center gap-2"><FaMapMarkerAlt size={9} className="text-white/60 shrink-0" />{personalInfo.location}</div>}
              {personalInfo.linkedin && <div className="flex items-center gap-2"><FaLinkedin size={9} className="text-white/60 shrink-0" /><span className="break-all">{personalInfo.linkedin}</span></div>}
              {personalInfo.website && <div className="flex items-center gap-2"><FaGlobe size={9} className="text-white/60 shrink-0" /><span className="break-all">{personalInfo.website}</span></div>}
            </div>
          </div>

          {/* Skills with visual bars */}
          {filledSkills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-3">Skills</h2>
              <div className="space-y-2">
                {filledSkills.slice(0, 10).map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[9px] mb-0.5">
                      <span className="text-white/90 truncate mr-2">{skill}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${85 - i * 5}%`, background: 'linear-gradient(to right, rgba(255,255,255,0.7), rgba(255,255,255,0.4))' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages with bars */}
          {filledLanguages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-3">Languages</h2>
              <div className="space-y-2">
                {filledLanguages.map((lang) => (
                  <div key={lang.id}>
                    <div className="flex justify-between text-[9px] mb-0.5">
                      <span className="text-white/90">{lang.language}</span>
                      <span className="text-white/60">{lang.proficiency}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: proficiencyWidth(lang.proficiency), background: 'linear-gradient(to right, rgba(255,255,255,0.7), rgba(255,255,255,0.4))' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filledCertifications.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-3">Certifications</h2>
              <div className="space-y-2">
                {filledCertifications.map((cert) => (
                  <div key={cert.id} className="text-[10px] bg-white/5 rounded p-2">
                    <p className="text-white font-semibold text-[10px]">{cert.name}</p>
                    {cert.issuer && <p className="text-white/60 text-[9px]">{cert.issuer}</p>}
                    {cert.date && <p className="text-white/50 text-[8px] mt-0.5">{cert.date}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="w-[62%] px-8 py-8">
          {personalInfo.summary && (
            <div className="mb-7">
              <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: accentColor }}>
                <div className="w-3 h-3 rounded-full" style={{ background: accent ? `linear-gradient(to right, ${accent}, ${accent}cc)` : 'linear-gradient(to right, #7c3aed, #ec4899)' }}></div>
                About Me
              </h2>
              <p className="text-gray-600 leading-[1.8]">{personalInfo.summary}</p>
            </div>
          )}

          {filledExperience.length > 0 && (
            <div className="mb-7">
              <h2 className="text-[12px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                <div className="w-3 h-3 rounded-full" style={{ background: accent ? `linear-gradient(to right, ${accent}, ${accent}cc)` : 'linear-gradient(to right, #7c3aed, #ec4899)' }}></div>
                Experience
              </h2>
              <div className="space-y-4">
                {filledExperience.map((exp) => (
                  <div key={exp.id} className="relative pl-5 border-l-2" style={{ borderColor: accentColor + '40' }}>
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[12px] text-gray-900 truncate">{exp.position}</h3>
                        <p className="text-[11px] truncate" style={{ color: accentColor }}>{exp.company}</p>
                      </div>
                      <span className="text-[9px] text-gray-400 px-2 py-0.5 rounded whitespace-nowrap shrink-0" style={{ backgroundColor: accentColor + '10' }}>{exp.startDate}{(exp.endDate || exp.current) && ` — ${exp.current ? 'Present' : exp.endDate}`}</span>
                    </div>
                    {exp.description && <p className="mt-1.5 text-gray-600 whitespace-pre-line leading-[1.6] text-[10.5px]">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {filledEducation.length > 0 && (
            <div className="mb-7">
              <h2 className="text-[12px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                <div className="w-3 h-3 rounded-full" style={{ background: accent ? `linear-gradient(to right, ${accent}, ${accent}cc)` : 'linear-gradient(to right, #7c3aed, #ec4899)' }}></div>
                Education
              </h2>
              <div className="space-y-3">
                {filledEducation.map((edu) => (
                  <div key={edu.id} className="pl-5 border-l-2 relative" style={{ borderColor: accentColor + '40' }}>
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[12px] text-gray-900 truncate">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                        <p className="text-gray-600 text-[11px]">{edu.institution}</p>
                        {edu.gpa && <p className="text-gray-400 text-[10px]">GPA: {edu.gpa}</p>}
                      </div>
                      <span className="text-[9px] text-gray-400 px-2 py-0.5 rounded whitespace-nowrap shrink-0" style={{ backgroundColor: accentColor + '10' }}>{edu.startDate}{edu.endDate && ` — ${edu.endDate}`}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && (
        <div className="text-center py-20 text-gray-400"><p className="text-lg">Your resume preview will appear here</p></div>
      )}
    </div>
  )
}
