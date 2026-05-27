import { forwardRef } from 'react'
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGlobe,
} from 'react-icons/fa'

const ResumePreview = forwardRef(({ data }, ref) => {
  const { personalInfo, experience, education, skills, certifications, languages } = data

  const hasContent = (section) => {
    if (Array.isArray(section)) {
      return section.some((item) => {
        if (typeof item === 'string') return item.trim() !== ''
        return Object.entries(item).some(
          ([key, val]) => key !== 'id' && val && val.toString().trim() !== ''
        )
      })
    }
    return false
  }

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter(
    (exp) => exp.company || exp.position
  )
  const filledEducation = education.filter(
    (edu) => edu.institution || edu.degree
  )
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  return (
    <div
      ref={ref}
      className="bg-white w-full max-w-[210mm] mx-auto font-['Georgia',serif] text-[11px] leading-relaxed"
      style={{ 
        padding: '40px 48px',
        minHeight: '297mm',
        color: '#1a1a1a',
      }}
    >
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
        <h1
          className="text-[28px] font-bold tracking-wide uppercase mb-1"
          style={{ color: '#1a1a1a', fontFamily: "'Georgia', serif" }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p className="text-[14px] text-gray-600 font-medium tracking-wider uppercase mb-3">
            {personalInfo.title}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[10px] text-gray-600">
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

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-5">
          <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2 text-gray-800">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-[1.6]">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {filledExperience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-800">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {filledExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[12px] text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="text-gray-600 italic">{exp.company}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap ml-4">
                    {exp.startDate}
                    {(exp.endDate || exp.current) &&
                      ` — ${exp.current ? 'Present' : exp.endDate}`}
                  </span>
                </div>
                {exp.description && (
                  <div className="mt-1.5 text-gray-700 whitespace-pre-line leading-[1.6]">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {filledEducation.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-800">
            Education
          </h2>
          <div className="space-y-3">
            {filledEducation.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[12px] text-gray-900">
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </h3>
                  <p className="text-gray-600 italic">{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-gray-500 text-[10px]">GPA: {edu.gpa}</p>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 whitespace-nowrap ml-4">
                  {edu.startDate}
                  {edu.endDate && ` — ${edu.endDate}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {filledSkills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2 text-gray-800">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2 mt-1">
            {filledSkills.map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-[10px] border border-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {filledCertifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-800">
            Certifications
          </h2>
          <div className="space-y-2">
            {filledCertifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[11px] text-gray-900">
                    {cert.name}
                  </h3>
                  {cert.issuer && (
                    <p className="text-gray-600 text-[10px]">{cert.issuer}</p>
                  )}
                </div>
                {cert.date && (
                  <span className="text-[10px] text-gray-500 ml-4">
                    {cert.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {filledLanguages.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2 text-gray-800">
            Languages
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
            {filledLanguages.map((lang) => (
              <span key={lang.id} className="text-gray-700">
                <span className="font-medium">{lang.language}</span>
                {lang.proficiency && (
                  <span className="text-gray-500"> — {lang.proficiency}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

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
