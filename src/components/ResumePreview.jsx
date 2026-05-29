import { forwardRef } from 'react'
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGlobe,
} from 'react-icons/fa'

const ResumePreview = forwardRef(({ data, theme, sectionOrder, sectionLabels }, ref) => {
  const { personalInfo, experience, education, skills, certifications, languages } = data

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter(
    (exp) => exp.company || exp.position
  )
  const filledEducation = education.filter(
    (edu) => edu.institution || edu.degree
  )
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  const sectionRenderers = {
    summary: () =>
      personalInfo.summary && (
        <div key="summary" className="mb-5">
          <h2
            className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-2"
            style={{ color: theme.accent, borderBottom: `1px solid ${theme.sectionBorder}` }}
          >
            {sectionLabels?.summary || 'Professional Summary'}
          </h2>
          <p style={{ color: theme.textSecondary }} className="leading-[1.6]">
            {personalInfo.summary}
          </p>
        </div>
      ),
    experience: () =>
      filledExperience.length > 0 && (
        <div key="experience" className="mb-5">
          <h2
            className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-3"
            style={{ color: theme.accent, borderBottom: `1px solid ${theme.sectionBorder}` }}
          >
            {sectionLabels?.experience || 'Professional Experience'}
          </h2>
          <div className="space-y-4">
            {filledExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[12px]" style={{ color: theme.textPrimary }}>
                      {exp.position}
                    </h3>
                    <p className="italic" style={{ color: theme.textSecondary }}>
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-[10px] whitespace-nowrap ml-4" style={{ color: theme.textMuted }}>
                    {exp.startDate}
                    {(exp.endDate || exp.current) &&
                      ` — ${exp.current ? 'Present' : exp.endDate}`}
                  </span>
                </div>
                {exp.description && (
                  <div className="mt-1.5 whitespace-pre-line leading-[1.6]" style={{ color: theme.textSecondary }}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ),
    education: () =>
      filledEducation.length > 0 && (
        <div key="education" className="mb-5">
          <h2
            className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-3"
            style={{ color: theme.accent, borderBottom: `1px solid ${theme.sectionBorder}` }}
          >
            {sectionLabels?.education || 'Education'}
          </h2>
          <div className="space-y-3">
            {filledEducation.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[12px]" style={{ color: theme.textPrimary }}>
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </h3>
                  <p className="italic" style={{ color: theme.textSecondary }}>
                    {edu.institution}
                  </p>
                  {edu.gpa && (
                    <p className="text-[10px]" style={{ color: theme.textMuted }}>
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
                <span className="text-[10px] whitespace-nowrap ml-4" style={{ color: theme.textMuted }}>
                  {edu.startDate}
                  {edu.endDate && ` — ${edu.endDate}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    skills: () =>
      filledSkills.length > 0 && (
        <div key="skills" className="mb-5">
          <h2
            className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-2"
            style={{ color: theme.accent, borderBottom: `1px solid ${theme.sectionBorder}` }}
          >
            {sectionLabels?.skills || 'Skills'}
          </h2>
          <div className="flex flex-wrap gap-2 mt-1">
            {filledSkills.map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded text-[10px]"
                style={{
                  backgroundColor: theme.skillBg,
                  border: `1px solid ${theme.skillBorder}`,
                  color: theme.textSecondary,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ),
    certifications: () =>
      filledCertifications.length > 0 && (
        <div key="certifications" className="mb-5">
          <h2
            className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-3"
            style={{ color: theme.accent, borderBottom: `1px solid ${theme.sectionBorder}` }}
          >
            {sectionLabels?.certifications || 'Certifications'}
          </h2>
          <div className="space-y-2">
            {filledCertifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[11px]" style={{ color: theme.textPrimary }}>
                    {cert.name}
                  </h3>
                  {cert.issuer && (
                    <p className="text-[10px]" style={{ color: theme.textSecondary }}>
                      {cert.issuer}
                    </p>
                  )}
                </div>
                {cert.date && (
                  <span className="text-[10px] ml-4" style={{ color: theme.textMuted }}>
                    {cert.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ),
    languages: () =>
      filledLanguages.length > 0 && (
        <div key="languages" className="mb-5">
          <h2
            className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-2"
            style={{ color: theme.accent, borderBottom: `1px solid ${theme.sectionBorder}` }}
          >
            {sectionLabels?.languages || 'Languages'}
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
            {filledLanguages.map((lang) => (
              <span key={lang.id} style={{ color: theme.textSecondary }}>
                <span className="font-medium">{lang.language}</span>
                {lang.proficiency && (
                  <span style={{ color: theme.textMuted }}> — {lang.proficiency}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ),
  }

  return (
    <div
      ref={ref}
      className="bg-white w-full max-w-[210mm] mx-auto font-['Georgia',serif] text-[11px] leading-relaxed"
      style={{
        padding: '40px 48px',
        minHeight: '297mm',
        color: theme.textPrimary,
      }}
    >
      {/* Header */}
      <div
        className="text-center mb-6 pb-4"
        style={{ borderBottom: `2px solid ${theme.headerBorder}` }}
      >
        <h1
          className="text-[28px] font-bold tracking-wide uppercase mb-1"
          style={{ color: theme.primary, fontFamily: "'Georgia', serif" }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p
            className="text-[14px] font-medium tracking-wider uppercase mb-3"
            style={{ color: theme.textSecondary }}
          >
            {personalInfo.title}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[10px]" style={{ color: theme.textMuted }}>
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <FaEnvelope size={10} />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <FaPhone size={10} />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt size={10} />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <FaLinkedin size={10} />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <FaGlobe size={10} />
              {personalInfo.website}
            </span>
          )}
        </div>
      </div>

      {/* Render sections in order */}
      {sectionOrder.map((sectionId) => sectionRenderers[sectionId]?.())}

      {/* Empty State */}
      {!personalInfo.fullName &&
        !personalInfo.summary &&
        filledExperience.length === 0 &&
        filledEducation.length === 0 &&
        filledSkills.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium mb-2">Your resume preview will appear here</p>
            <p className="text-sm">Start filling in the form on the left to see your resume come to life!</p>
          </div>
        )}
    </div>
  )
})

ResumePreview.displayName = 'ResumePreview'

export default ResumePreview
