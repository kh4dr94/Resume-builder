import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe, FaTerminal } from 'react-icons/fa'

export default function TechTemplate({ data, sectionOrder, colorTheme }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data
  const order = sectionOrder || ['summary', 'experience', 'education', 'skills', 'certifications', 'languages']
  const accent = colorTheme?.primary || null

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  // Catppuccin-inspired colors, overridable with accent
  const purple = accent || '#cba6f7'
  const blue = accent || '#89b4fa'
  const green = accent || '#a6e3a1'
  const yellow = '#f9e2af'
  const pink = '#f5c2e7'

  return (
    <div className="bg-[#1e1e2e] w-full text-[11px] leading-relaxed break-words overflow-hidden" style={{ minHeight: '297mm', color: '#cdd6f4', fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" }}>
      {/* Terminal-style header */}
      <div className="bg-[#181825] px-10 py-6 border-b border-[#313244]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#f38ba8]"></div>
          <div className="w-3 h-3 rounded-full bg-[#f9e2af]"></div>
          <div className="w-3 h-3 rounded-full bg-[#a6e3a1]"></div>
          <span className="text-[10px] text-[#6c7086] ml-2">~/resume/{(personalInfo.fullName || 'dev').toLowerCase().replace(/\s+/g, '-')}</span>
        </div>
        <div className="flex items-start gap-5">
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="" className="w-16 h-16 rounded-lg object-cover border border-[#45475a] shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] mb-1" style={{ color: green }}>$ whoami</p>
            <h1 className="text-[24px] font-bold leading-tight mb-1 truncate" style={{ color: purple }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.title && (
              <p className="text-[12px] mb-3 truncate" style={{ color: blue }}>// {personalInfo.title}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-[#6c7086]">
              {personalInfo.email && <span className="flex items-center gap-1"><FaEnvelope size={8} style={{ color: accent || '#f5c2e7' }} className="shrink-0" /><span className="truncate max-w-[160px]">{personalInfo.email}</span></span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><FaPhone size={8} style={{ color: accent || '#f5c2e7' }} className="shrink-0" />{personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1"><FaMapMarkerAlt size={8} style={{ color: accent || '#f5c2e7' }} className="shrink-0" />{personalInfo.location}</span>}
              {personalInfo.linkedin && <span className="flex items-center gap-1"><FaLinkedin size={8} style={{ color: accent || '#f5c2e7' }} className="shrink-0" /><span className="truncate max-w-[140px]">{personalInfo.linkedin}</span></span>}
              {personalInfo.website && <span className="flex items-center gap-1"><FaGlobe size={8} style={{ color: accent || '#f5c2e7' }} className="shrink-0" /><span className="truncate max-w-[120px]">{personalInfo.website}</span></span>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-7">
        {personalInfo.summary && (
          <div className="mb-7">
            <p className="text-[10px] mb-1.5" style={{ color: green }}>$ cat about.md</p>
            <p className="text-[#bac2de] leading-[1.8] pl-3 border-l-2 border-[#313244]">{personalInfo.summary}</p>
          </div>
        )}

        {filledExperience.length > 0 && (
          <div className="mb-7">
            <p className="text-[10px] mb-3" style={{ color: green }}>$ git log --oneline --experience</p>
            <div className="space-y-4">
              {filledExperience.map((exp, i) => (
                <div key={exp.id} className="pl-4 border-l border-[#45475a] relative">
                  <div className="absolute -left-[3px] top-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent || '#f9e2af' }}></div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[12px] truncate" style={{ color: purple }}>{exp.position}</h3>
                      <p className="text-[10px] truncate" style={{ color: blue }}>@{exp.company}</p>
                    </div>
                    <span className="text-[9px] text-[#585b70] font-mono whitespace-nowrap shrink-0">{exp.startDate}{(exp.endDate || exp.current) && `..${exp.current ? 'HEAD' : exp.endDate}`}</span>
                  </div>
                  {exp.description && <p className="mt-1.5 text-[#a6adc8] whitespace-pre-line leading-[1.7] text-[10px]">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {filledEducation.length > 0 && (
          <div className="mb-7">
            <p className="text-[10px] mb-3" style={{ color: green }}>$ cat education.json</p>
            <div className="bg-[#181825] rounded-lg p-3 border border-[#313244] space-y-2">
              {filledEducation.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[#f9e2af] text-[11px] font-semibold">{edu.degree}</span>
                    {edu.field && <span className="text-[#6c7086]"> in </span>}
                    {edu.field && <span style={{ color: blue }}>{edu.field}</span>}
                    <p className="text-[#6c7086] text-[10px]">{edu.institution} {edu.gpa && `| GPA: ${edu.gpa}`}</p>
                  </div>
                  <span className="text-[9px] text-[#585b70] font-mono whitespace-nowrap shrink-0">{edu.startDate}{edu.endDate && `..${edu.endDate}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {filledSkills.length > 0 && (
          <div className="mb-7">
            <p className="text-[10px] mb-3" style={{ color: green }}>$ echo $SKILLS</p>
            <div className="flex flex-wrap gap-1.5">
              {filledSkills.map((skill, i) => (
                <span key={i} className="px-2 py-0.5 bg-[#181825] rounded text-[9px] font-mono truncate max-w-[140px]" style={{ color: blue, border: `1px solid ${accent ? accent + '40' : '#313244'}` }}>{skill}</span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {filledCertifications.length > 0 && (
            <div>
              <p className="text-[10px] mb-2" style={{ color: green }}>$ ls certs/</p>
              <div className="space-y-1.5">
                {filledCertifications.map((cert) => (
                  <div key={cert.id} className="text-[10px]">
                    <p className="font-semibold" style={{ color: accent || '#f9e2af' }}>{cert.name}</p>
                    {cert.issuer && <p className="text-[#585b70]">{cert.issuer} {cert.date && `(${cert.date})`}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {filledLanguages.length > 0 && (
            <div>
              <p className="text-[10px] mb-2" style={{ color: green }}>$ locale --list</p>
              <div className="space-y-1">
                {filledLanguages.map((lang) => (
                  <div key={lang.id} className="text-[10px] flex justify-between">
                    <span className="text-[#cdd6f4]">{lang.language}</span>
                    <span style={{ color: green }} className="text-[9px]">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && (
        <div className="text-center py-20 text-[#585b70]"><p className="text-lg font-mono">$ echo "Start typing to preview"</p></div>
      )}
    </div>
  )
}
