import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

export default function ExecutiveTemplate({ data }) {
  const { personalInfo, experience, education, skills, certifications, languages } = data

  const filledSkills = skills.filter((s) => s.trim() !== '')
  const filledExperience = experience.filter((exp) => exp.company || exp.position)
  const filledEducation = education.filter((edu) => edu.institution || edu.degree)
  const filledCertifications = certifications.filter((cert) => cert.name)
  const filledLanguages = languages.filter((lang) => lang.language)

  return (
    <div
      className="bg-white w-full text-[11px] leading-relaxed"
      style={{ minHeight: '297mm', color: '#1f2937', fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Dark Header with Gold Accent */}
      <div className="bg-[#1a1a2e] text-white px-12 py-10 relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}></div>

        <div className="relative">
          <h1 className="text-[30px] font-normal tracking-wide mb-1" style={{ fontFamily: "'Georgia', serif" }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p className="text-[13px] text-[#d4a853] font-normal tracking-[2px] uppercase mb-5">
              {personalInfo.title}
            </p>
          )}

          {/* Gold line */}
          <div className="w-16 h-0.5 bg-[#d4a853] mb-5"></div>

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] text-gray-300">
            {personalInfo.email && (
              <span className="flex items-center gap-1.5">
                <FaEnvelope size={9} className="text-[#d4a853]" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5">
                <FaPhone size={9} className="text-[#d4a853]" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt size={9} className="text-[#d4a853]" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1.5">
                <FaLinkedin size={9} className="text-[#d4a853]" />
                {personalInfo.linkedin}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1.5">
                <FaGlobe size={9} className="text-[#d4a853]" />
                {personalInfo.website}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="px-12 py-8">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-7 pb-6 border-b border-gray-200">
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-[#1a1a2e] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#d4a853] rounded-full"></span>
              Executive Summary
            </h2>
            <p className="text-gray-600 leading-[1.8] text-[11px] italic">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {filledExperience.length > 0 && (
          <div className="mb-7 pb-6 border-b border-gray-200">
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-[#1a1a2e] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#d4a853] rounded-full"></span>
              Professional Experience
            </h2>
            <div className="space-y-5">
              {filledExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-[12px] text-[#1a1a2e]">{exp.position}</h3>
                      <p className="text-[#d4a853] font-medium text-[11px]">{exp.company}</p>
                    </div>
                    <span className="text-[10px] text-gray-500 bg-gray-50 px-3 py-0.5 rounded-full border border-gray-100 whitespace-nowrap ml-4">
                      {exp.startDate}{(exp.endDate || exp.current) && ` — ${exp.current ? 'Present' : exp.endDate}`}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-gray-600 whitespace-pre-line leading-[1.7] text-[10.5px] pl-0">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {filledEducation.length > 0 && (
          <div className="mb-7 pb-6 border-b border-gray-200">
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-[#1a1a2e] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#d4a853] rounded-full"></span>
              Education
            </h2>
            <div className="space-y-3">
              {filledEducation.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[12px] text-[#1a1a2e]">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-gray-600 text-[11px]">{edu.institution}</p>
                    {edu.gpa && <p className="text-gray-400 text-[10px]">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-[10px] text-gray-500 bg-gray-50 px-3 py-0.5 rounded-full border border-gray-100 whitespace-nowrap ml-4">
                    {edu.startDate}{edu.endDate && ` — ${edu.endDate}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two column bottom section */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left: Skills + Languages */}
          <div>
            {filledSkills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-[#1a1a2e] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#d4a853] rounded-full"></span>
                  Core Competencies
                </h2>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {filledSkills.map((skill, index) => (
                    <span key={index} className="text-[10px] text-gray-600 flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-[#d4a853] rounded-full shrink-0"></span>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {filledLanguages.length > 0 && (
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-[#1a1a2e] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#d4a853] rounded-full"></span>
                  Languages
                </h2>
                <div className="space-y-1.5">
                  {filledLanguages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-700 font-medium">{lang.language}</span>
                      {lang.proficiency && (
                        <span className="text-[#d4a853] text-[9px] font-medium uppercase tracking-wide">{lang.proficiency}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Certifications */}
          <div>
            {filledCertifications.length > 0 && (
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-[#1a1a2e] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#d4a853] rounded-full"></span>
                  Certifications
                </h2>
                <div className="space-y-2.5">
                  {filledCertifications.map((cert) => (
                    <div key={cert.id} className="text-[10px] border-l-2 border-[#d4a853] pl-3">
                      <p className="font-bold text-[#1a1a2e] text-[11px]">{cert.name}</p>
                      {cert.issuer && <p className="text-gray-500">{cert.issuer}</p>}
                      {cert.date && <p className="text-[#d4a853] text-[9px] mt-0.5">{cert.date}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!personalInfo.fullName && !personalInfo.summary && filledExperience.length === 0 && filledEducation.length === 0 && filledSkills.length === 0 && (
        <div className="text-center py-20 text-gray-400 px-12">
          <p className="text-lg font-normal mb-2">Your resume preview will appear here</p>
          <p className="text-sm">Start filling in the form to see your resume come to life</p>
        </div>
      )}
    </div>
  )
}
