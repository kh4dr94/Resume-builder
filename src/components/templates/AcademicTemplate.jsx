import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

export default function AcademicTemplate({ data, sectionOrder, colorTheme }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data
  const order = sectionOrder || ['summary', 'education', 'experience', 'skills', 'certifications', 'languages']
  const accent = colorTheme?.primary || null

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  const sectionRenderers = {
    summary: () =>
      personalInfo.summary ? (
        <div key="summary" className="mb-6">
          <h2 className="text-[12px] font-bold uppercase mb-2 border-b pb-0.5" style={{ color: accent || '#111827', borderColor: accent || '#d1d5db' }}>Research Interests & Summary</h2>
          <p className="text-gray-700 leading-[1.8] text-justify">{personalInfo.summary}</p>
        </div>
      ) : null,

    education: () =>
      filledEducation.length > 0 ? (
        <div key="education" className="mb-6">
          <h2 className="text-[12px] font-bold uppercase mb-3 border-b pb-0.5" style={{ color: accent || '#111827', borderColor: accent || '#d1d5db' }}>Education</h2>
          <div className="space-y-3">
            {filledEducation.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="font-bold text-[11px] text-gray-900">{edu.institution}</h3>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0 italic">{edu.startDate}{edu.endDate && ` – ${edu.endDate}`}</span>
                </div>
                <p className="text-gray-700 italic text-[11px]">{edu.degree}{edu.field && `, ${edu.field}`}</p>
                {edu.gpa && <p className="text-gray-500 text-[10px]">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    experience: () =>
      filledExperience.length > 0 ? (
        <div key="experience" className="mb-6">
          <h2 className="text-[12px] font-bold uppercase mb-3 border-b pb-0.5" style={{ color: accent || '#111827', borderColor: accent || '#d1d5db' }}>Professional Experience</h2>
          <div className="space-y-4">
            {filledExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="font-bold text-[11px] text-gray-900">{exp.position}</h3>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0 italic">{exp.startDate}{(exp.endDate || exp.current) && ` – ${exp.current ? 'Present' : exp.endDate}`}</span>
                </div>
                <p className="text-gray-700 italic text-[11px]">{exp.company}</p>
                {exp.description && <p className="mt-1 text-gray-600 whitespace-pre-line leading-[1.7] text-[10.5px] text-justify">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    skills: () =>
      filledSkills.length > 0 ? (
        <div key="skills" className="mb-6">
          <h2 className="text-[12px] font-bold uppercase mb-2 border-b pb-0.5" style={{ color: accent || '#111827', borderColor: accent || '#d1d5db' }}>Technical Proficiencies</h2>
          <p className="text-gray-700 text-[10.5px] leading-[1.7]">{filledSkills.join(', ')}</p>
        </div>
      ) : null,

    certifications: () =>
      filledCertifications.length > 0 ? (
        <div key="certifications" className="mb-6">
          <h2 className="text-[12px] font-bold uppercase mb-3 border-b pb-0.5" style={{ color: accent || '#111827', borderColor: accent || '#d1d5db' }}>Awards & Certifications</h2>
          <div className="space-y-1.5">
            {filledCertifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-gray-900 font-semibold">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-500 text-[10px]"> — {cert.issuer}</span>}
                </div>
                {cert.date && <span className="text-[10px] text-gray-500 italic shrink-0">{cert.date}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    languages: () =>
      filledLanguages.length > 0 ? (
        <div key="languages" className="mb-6">
          <h2 className="text-[12px] font-bold uppercase mb-2 border-b pb-0.5" style={{ color: accent || '#111827', borderColor: accent || '#d1d5db' }}>Languages</h2>
          <p className="text-gray-700 text-[10.5px]">
            {filledLanguages.map((lang, i) => (
              <span key={lang.id}>{lang.language}{lang.proficiency && ` (${lang.proficiency})`}{i < filledLanguages.length - 1 && ', '}</span>
            ))}
          </p>
        </div>
      ) : null,
  }

  return (
    <div className="bg-white w-full text-[11px] leading-relaxed break-words overflow-hidden" style={{ minHeight: '297mm', color: '#1f2937', fontFamily: "'Times New Roman', 'Georgia', serif" }}>
      <div className="px-14 py-10">
        {/* Header - centered academic style */}
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-normal text-gray-900 mb-1 tracking-wide">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p className="text-[13px] text-gray-600 italic mb-3">{personalInfo.title}</p>
          )}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[10px] text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && personalInfo.phone && <span className="text-gray-300">|</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.location && <span className="text-gray-300">|</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[10px] text-gray-600 mt-0.5">
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.linkedin && personalInfo.website && <span className="text-gray-300">|</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
          <div className="w-full h-px mt-4" style={{ backgroundColor: accent || '#111827' }}></div>
        </div>

        {/* Render sections in specified order */}
        {order.map((id) => sectionRenderers[id]?.())}
      </div>

      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && (
        <div className="text-center py-20 text-gray-400"><p className="text-lg">Your resume preview will appear here</p></div>
      )}
    </div>
  )
}
