import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

export default function ModernTemplate({ data }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  return (
    <div
      className="bg-white w-full font-sans text-[11px] leading-relaxed break-words overflow-hidden"
      style={{ padding: '0', minHeight: '297mm', color: '#1a1a1a' }}
    >
      {/* Header - Modern gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-8">
        <div className="flex items-start gap-5">
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="" className="w-20 h-20 rounded-full object-cover border-3 border-white/30 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-[28px] font-bold tracking-wide mb-1 truncate">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.title && (
              <p className="text-[14px] text-blue-100 font-medium tracking-wider uppercase mb-4 truncate">
                {personalInfo.title}
              </p>
            )}
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-blue-100">
              {personalInfo.email && (
                <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <FaEnvelope size={10} className="shrink-0" />
                  <span className="truncate">{personalInfo.email}</span>
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1.5">
                  <FaPhone size={10} className="shrink-0" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1.5">
                  <FaMapMarkerAlt size={10} className="shrink-0" />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <FaLinkedin size={10} className="shrink-0" />
                  <span className="truncate">{personalInfo.linkedin}</span>
                </span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1.5 truncate max-w-[150px]">
                  <FaGlobe size={10} className="shrink-0" />
                  <span className="truncate">{personalInfo.website}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-6">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-blue-600 rounded"></div>
              Profile
            </h2>
            <p className="text-gray-700 leading-[1.7] pl-8">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {filledExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-blue-600 rounded"></div>
              Experience
            </h2>
            <div className="space-y-4 pl-8">
              {filledExperience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-5 top-1.5 w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[12px] text-gray-900">{exp.position}</h3>
                      <p className="text-blue-600 font-medium text-[11px]">{exp.company}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded whitespace-nowrap ml-4">
                      {exp.startDate}{(exp.endDate || exp.current) && ` — ${exp.current ? 'Present' : exp.endDate}`}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-1.5 text-gray-600 whitespace-pre-line leading-[1.6]">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {filledEducation.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-blue-600 rounded"></div>
              Education
            </h2>
            <div className="space-y-3 pl-8">
              {filledEducation.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[12px] text-gray-900">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-blue-600 text-[11px]">{edu.institution}</p>
                    {edu.gpa && <p className="text-gray-500 text-[10px]">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded whitespace-nowrap ml-4">
                    {edu.startDate}{edu.endDate && ` — ${edu.endDate}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {filledSkills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-blue-600 rounded"></div>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2 pl-8">
              {filledSkills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-medium border border-blue-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {filledCertifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-blue-600 rounded"></div>
              Certifications
            </h2>
            <div className="space-y-2 pl-8">
              {filledCertifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[11px] text-gray-900">{cert.name}</h3>
                    {cert.issuer && <p className="text-gray-500 text-[10px]">{cert.issuer}</p>}
                  </div>
                  {cert.date && <span className="text-[10px] text-gray-400 ml-4">{cert.date}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {filledLanguages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-blue-600 rounded"></div>
              Languages
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-1 pl-8">
              {filledLanguages.map((lang) => (
                <span key={lang.id} className="text-gray-700">
                  <span className="font-medium">{lang.language}</span>
                  {lang.proficiency && <span className="text-gray-400"> — {lang.proficiency}</span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && filledEducation.length === 0 && filledSkills.length === 0 && (
        <div className="text-center py-16 text-gray-400 px-10">
          <p className="text-lg font-medium mb-2">Your resume preview will appear here</p>
          <p className="text-sm">Start filling in the form to see your resume come to life!</p>
        </div>
      )}
    </div>
  )
}
