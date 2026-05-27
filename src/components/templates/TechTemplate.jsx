import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe, FaTerminal } from 'react-icons/fa'

export default function TechTemplate({ data, sectionOrder, colorTheme }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data
  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

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
            <p className="text-[10px] text-[#a6e3a1] mb-1">$ whoami</p>
            <h1 className="text-[24px] font-bold text-[#cba6f7] leading-tight mb-1 truncate">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.title && (
              <p className="text-[12px] text-[#89b4fa] mb-3 truncate">// {personalInfo.title}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-[#6c7086]">
              {personalInfo.email && <span className="flex items-center gap-1"><FaEnvelope size={8} className="text-[#f5c2e7] shrink-0" /><span className="truncate max-w-[160px]">{personalInfo.email}</span></span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><FaPhone size={8} className="text-[#f5c2e7] shrink-0" />{personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1"><FaMapMarkerAlt size={8} className="text-[#f5c2e7] shrink-0" />{personalInfo.location}</span>}
              {personalInfo.linkedin && <span className="flex items-center gap-1"><FaLinkedin size={8} className="text-[#f5c2e7] shrink-0" /><span className="truncate max-w-[140px]">{personalInfo.linkedin}</span></span>}
              {personalInfo.website && <span className="flex items-center gap-1"><FaGlobe size={8} className="text-[#f5c2e7] shrink-0" /><span className="truncate max-w-[120px]">{personalInfo.website}</span></span>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-7">
        {personalInfo.summary && (
          <div className="mb-7">
            <p className="text-[10px] text-[#a6e3a1] mb-1.5">$ cat about.md</p>
            <p className="text-[#bac2de] leading-[1.8] pl-3 border-l-2 border-[#313244]">{personalInfo.summary}</p>
          </div>
        )}

        {filledExperience.length > 0 && (
          <div className="mb-7">
            <p className="text-[10px] text-[#a6e3a1] mb-3">$ git log --oneline --experience</p>
            <div className="space-y-4">
              {filledExperience.map((exp, i) => (
                <div key={exp.id} className="pl-4 border-l border-[#45475a] relative">
                  <div className="absolute -left-[3px] top-1 w-1.5 h-1.5 bg-[#f9e2af] rounded-full"></div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[12px] text-[#cba6f7] truncate">{exp.position}</h3>
                      <p className="text-[#89b4fa] text-[10px] truncate">@{exp.company}</p>
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
            <p className="text-[10px] text-[#a6e3a1] mb-3">$ cat education.json</p>
            <div className="bg-[#181825] rounded-lg p-3 border border-[#313244] space-y-2">
              {filledEducation.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[#f9e2af] text-[11px] font-semibold">{edu.degree}</span>
                    {edu.field && <span className="text-[#6c7086]"> in </span>}
                    {edu.field && <span className="text-[#89b4fa]">{edu.field}</span>}
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
            <p className="text-[10px] text-[#a6e3a1] mb-3">$ echo $SKILLS</p>
            <div className="flex flex-wrap gap-1.5">
              {filledSkills.map((skill, i) => (
                <span key={i} className="px-2 py-0.5 bg-[#181825] text-[#89b4fa] border border-[#313244] rounded text-[9px] font-mono truncate max-w-[140px]">{skill}</span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {filledCertifications.length > 0 && (
            <div>
              <p className="text-[10px] text-[#a6e3a1] mb-2">$ ls certs/</p>
              <div className="space-y-1.5">
                {filledCertifications.map((cert) => (
                  <div key={cert.id} className="text-[10px]">
                    <p className="text-[#f9e2af] font-semibold">{cert.name}</p>
                    {cert.issuer && <p className="text-[#585b70]">{cert.issuer} {cert.date && `(${cert.date})`}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {filledLanguages.length > 0 && (
            <div>
              <p className="text-[10px] text-[#a6e3a1] mb-2">$ locale --list</p>
              <div className="space-y-1">
                {filledLanguages.map((lang) => (
                  <div key={lang.id} className="text-[10px] flex justify-between">
                    <span className="text-[#cdd6f4]">{lang.language}</span>
                    <span className="text-[#a6e3a1] text-[9px]">{lang.proficiency}</span>
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
