import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

export default function MinimalTemplate({ data }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  return (
    <div
      className="bg-white w-full text-[11px] leading-relaxed"
      style={{ padding: '56px 64px', minHeight: '297mm', color: '#374151', fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Header - Minimal */}
      <div className="mb-10">
        <h1 className="text-[32px] font-light tracking-tight text-gray-900 mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p className="text-[13px] text-gray-400 font-normal tracking-wide mb-5">
            {personalInfo.title}
          </p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] text-gray-500">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <FaEnvelope size={9} className="text-gray-300" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <FaPhone size={9} className="text-gray-300" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <FaMapMarkerAlt size={9} className="text-gray-300" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5">
              <FaLinkedin size={9} className="text-gray-300" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1.5">
              <FaGlobe size={9} className="text-gray-300" />
              {personalInfo.website}
            </span>
          )}
        </div>
      </div>

      {/* Thin separator */}
      <div className="w-full h-px bg-gray-200 mb-8"></div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-8">
          <p className="text-gray-600 leading-[1.8] text-[11px] max-w-[90%]">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {filledExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[10px] font-semibold uppercase tracking-[3px] text-gray-400 mb-5">
            Experience
          </h2>
          <div className="space-y-5">
            {filledExperience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[140px_1fr] gap-4">
                <div className="text-[10px] text-gray-400 pt-0.5 font-mono">
                  {exp.startDate && (
                    <span>{exp.startDate}{(exp.endDate || exp.current) && <><br />{exp.current ? 'Present' : exp.endDate}</>}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-[12px] text-gray-800 leading-tight">{exp.position}</h3>
                  <p className="text-gray-500 text-[11px] mt-0.5">{exp.company}</p>
                  {exp.description && (
                    <p className="mt-2 text-gray-600 whitespace-pre-line leading-[1.7] text-[10.5px]">{exp.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {filledEducation.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[10px] font-semibold uppercase tracking-[3px] text-gray-400 mb-5">
            Education
          </h2>
          <div className="space-y-4">
            {filledEducation.map((edu) => (
              <div key={edu.id} className="grid grid-cols-[140px_1fr] gap-4">
                <div className="text-[10px] text-gray-400 pt-0.5 font-mono">
                  {edu.startDate && (
                    <span>{edu.startDate}{edu.endDate && <><br />{edu.endDate}</>}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-[12px] text-gray-800 leading-tight">
                    {edu.degree}{edu.field && `, ${edu.field}`}
                  </h3>
                  <p className="text-gray-500 text-[11px] mt-0.5">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-400 text-[10px] mt-0.5">GPA: {edu.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {filledSkills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[10px] font-semibold uppercase tracking-[3px] text-gray-400 mb-4">
            Skills
          </h2>
          <div className="flex flex-wrap gap-x-1.5 gap-y-1.5">
            {filledSkills.map((skill, index) => (
              <span key={index} className="text-[10px] text-gray-600 font-mono bg-gray-50 px-2.5 py-1 rounded border border-gray-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {filledCertifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[10px] font-semibold uppercase tracking-[3px] text-gray-400 mb-4">
            Certifications
          </h2>
          <div className="space-y-2">
            {filledCertifications.map((cert) => (
              <div key={cert.id} className="flex items-baseline justify-between">
                <div>
                  <span className="font-medium text-[11px] text-gray-700">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-400 text-[10px] ml-2">— {cert.issuer}</span>}
                </div>
                {cert.date && <span className="text-[10px] text-gray-400 font-mono">{cert.date}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {filledLanguages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[10px] font-semibold uppercase tracking-[3px] text-gray-400 mb-4">
            Languages
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5">
            {filledLanguages.map((lang) => (
              <span key={lang.id} className="text-[11px] text-gray-600">
                {lang.language}
                {lang.proficiency && <span className="text-gray-400 ml-1.5 font-mono text-[9px]">({lang.proficiency})</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && filledEducation.length === 0 && filledSkills.length === 0 && (
        <div className="text-center py-20 text-gray-300">
          <p className="text-lg font-light mb-2">Your resume preview will appear here</p>
          <p className="text-sm">Start filling in the form to see your resume come to life</p>
        </div>
      )}
    </div>
  )
}
