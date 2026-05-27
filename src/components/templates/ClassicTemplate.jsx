import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

export default function ClassicTemplate({ data }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  return (
    <div
      className="bg-white w-full text-[11px] leading-relaxed"
      style={{ padding: '48px 56px', minHeight: '297mm', color: '#2d2d2d', fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Header - Classic centered */}
      <div className="text-center mb-6 pb-5 border-b-2 border-gray-900">
        <h1 className="text-[30px] font-normal tracking-[4px] uppercase mb-1" style={{ fontFamily: "'Georgia', serif" }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p className="text-[13px] text-gray-600 tracking-[2px] uppercase mb-4 font-normal">
            {personalInfo.title}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 text-[10px] text-gray-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <FaEnvelope size={9} />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.email && personalInfo.phone && <span className="text-gray-300">|</span>}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <FaPhone size={9} />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.phone && personalInfo.location && <span className="text-gray-300">|</span>}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt size={9} />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.location && personalInfo.linkedin && <span className="text-gray-300">|</span>}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <FaLinkedin size={9} />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.linkedin && personalInfo.website && <span className="text-gray-300">|</span>}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <FaGlobe size={9} />
              {personalInfo.website}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] border-b border-gray-400 pb-1 mb-2 text-gray-800">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-[1.7] italic">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {filledExperience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] border-b border-gray-400 pb-1 mb-3 text-gray-800">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {filledExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[12px] text-gray-900">{exp.position}</h3>
                  <span className="text-[10px] text-gray-500 italic whitespace-nowrap ml-4">
                    {exp.startDate}{(exp.endDate || exp.current) && ` — ${exp.current ? 'Present' : exp.endDate}`}
                  </span>
                </div>
                <p className="text-gray-600 italic text-[11px]">{exp.company}</p>
                {exp.description && (
                  <p className="mt-1.5 text-gray-700 whitespace-pre-line leading-[1.6]">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {filledEducation.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] border-b border-gray-400 pb-1 mb-3 text-gray-800">
            Education
          </h2>
          <div className="space-y-3">
            {filledEducation.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-[12px] text-gray-900">
                    {edu.degree}{edu.field && `, ${edu.field}`}
                  </h3>
                  <p className="text-gray-600 italic">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-500 text-[10px]">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-[10px] text-gray-500 italic whitespace-nowrap ml-4">
                  {edu.startDate}{edu.endDate && ` — ${edu.endDate}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {filledSkills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] border-b border-gray-400 pb-1 mb-2 text-gray-800">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-2">
            {filledSkills.map((skill, index) => (
              <span key={index} className="text-gray-700 text-[10px] flex items-center gap-1.5">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {filledCertifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] border-b border-gray-400 pb-1 mb-3 text-gray-800">
            Certifications & Licenses
          </h2>
          <div className="space-y-2">
            {filledCertifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-[11px] text-gray-900">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-500 text-[10px]"> — {cert.issuer}</span>}
                </div>
                {cert.date && <span className="text-[10px] text-gray-500 italic ml-4">{cert.date}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {filledLanguages.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] border-b border-gray-400 pb-1 mb-2 text-gray-800">
            Languages
          </h2>
          <div className="flex flex-wrap gap-x-8 gap-y-1 mt-1">
            {filledLanguages.map((lang) => (
              <span key={lang.id} className="text-gray-700">
                <span className="font-medium">{lang.language}</span>
                {lang.proficiency && <span className="text-gray-500 italic"> ({lang.proficiency})</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && filledEducation.length === 0 && filledSkills.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium mb-2">Your resume preview will appear here</p>
          <p className="text-sm">Start filling in the form to see your resume come to life!</p>
        </div>
      )}
    </div>
  )
}
