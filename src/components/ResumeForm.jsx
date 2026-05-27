import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaTools,
  FaCertificate,
  FaLanguage,
  FaPlus,
  FaTrash,
  FaChevronDown,
  FaCamera,
} from 'react-icons/fa'

function Section({ title, icon: Icon, children, defaultOpen = false, count = 0, subtitle = '' }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden transition-all duration-200 hover:border-gray-300/80 hover:shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-50 to-indigo-100/80 rounded-xl flex items-center justify-center ring-1 ring-blue-100/50">
            <Icon className="text-blue-600" size={15} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[13px] text-gray-800">{title}</span>
              {count > 0 && (
                <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-bold ring-1 ring-blue-100/50">
                  {count}
                </span>
              )}
            </div>
            {subtitle && (
              <span className="text-[11px] text-gray-400 font-normal">{subtitle}</span>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center"
        >
          <FaChevronDown className="text-gray-400" size={11} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-3 border-t border-gray-100">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text', placeholder = '', icon = null }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all text-sm text-gray-800 placeholder:text-gray-300"
      />
    </div>
  )
}

function TextArea({ label, value, onChange, placeholder = '', rows = 3 }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all text-sm text-gray-800 placeholder:text-gray-300 resize-none leading-relaxed"
      />
    </div>
  )
}

function AddButton({ onClick, label }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-[12px] mt-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
    >
      <FaPlus size={10} />
      {label}
    </motion.button>
  )
}

function RemoveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-100 transition-all"
    >
      <FaTrash size={11} />
    </button>
  )
}

export default function ResumeForm({ data, setData }) {
  const updatePersonalInfo = (field, value) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now(), company: '', position: '', startDate: '', endDate: '', current: false, description: '' },
      ],
    }))
  }

  const updateExperience = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const removeExperience = (id) => {
    setData((prev) => ({ ...prev, experience: prev.experience.filter((exp) => exp.id !== id) }))
  }

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
      ],
    }))
  }

  const updateEducation = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const removeEducation = (id) => {
    setData((prev) => ({ ...prev, education: prev.education.filter((edu) => edu.id !== id) }))
  }

  const addSkill = () => {
    setData((prev) => ({ ...prev, skills: [...prev.skills, ''] }))
  }

  const updateSkill = (index, value) => {
    setData((prev) => ({ ...prev, skills: prev.skills.map((s, i) => (i === index ? value : s)) }))
  }

  const removeSkill = (index) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))
  }

  const addCertification = () => {
    setData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { id: Date.now(), name: '', issuer: '', date: '' }],
    }))
  }

  const updateCertification = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)),
    }))
  }

  const removeCertification = (id) => {
    setData((prev) => ({ ...prev, certifications: prev.certifications.filter((cert) => cert.id !== id) }))
  }

  const addLanguage = () => {
    setData((prev) => ({
      ...prev,
      languages: [...prev.languages, { id: Date.now(), language: '', proficiency: '' }],
    }))
  }

  const updateLanguage = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)),
    }))
  }

  const removeLanguage = (id) => {
    setData((prev) => ({ ...prev, languages: prev.languages.filter((lang) => lang.id !== id) }))
  }

  return (
    <div className="space-y-3">
      {/* Personal Information */}
      <Section title="Personal Information" subtitle="Basic details & contact" icon={FaUser} defaultOpen={true}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Photo upload */}
          <div className="sm:col-span-2 flex items-center gap-4 mb-2">
            <div className="relative">
              {data.personalInfo.photo ? (
                <img
                  src={data.personalInfo.photo}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <FaCamera className="text-gray-400" size={16} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Profile Photo <span className="text-gray-400 font-normal normal-case">(optional)</span>
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-semibold hover:bg-blue-100 transition-colors border border-blue-100">
                  <FaCamera size={10} />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          updatePersonalInfo('photo', reader.result)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </label>
                {data.personalInfo.photo && (
                  <button
                    onClick={() => updatePersonalInfo('photo', '')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-red-500 text-[11px] font-medium hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash size={9} />
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Shown in supported templates</p>
            </div>
          </div>

          <div className="sm:col-span-2">
            <InputField
              label="Full Name"
              value={data.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="sm:col-span-2">
            <InputField
              label="Professional Title"
              value={data.personalInfo.title}
              onChange={(e) => updatePersonalInfo('title', e.target.value)}
              placeholder="Senior Software Engineer"
            />
          </div>
          <InputField
            label="Email"
            type="email"
            value={data.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="john@example.com"
          />
          <InputField
            label="Phone"
            type="tel"
            value={data.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
          <InputField
            label="Location"
            value={data.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder="San Francisco, CA"
          />
          <InputField
            label="LinkedIn"
            value={data.personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
          <div className="sm:col-span-2">
            <InputField
              label="Website / Portfolio"
              value={data.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              placeholder="johndoe.dev"
            />
          </div>
          <div className="sm:col-span-2">
            <TextArea
              label="Professional Summary"
              value={data.personalInfo.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
              placeholder="A brief summary of your professional background, key achievements, and career goals..."
              rows={4}
            />
            {/* Word & character count */}
            <div className="flex items-center gap-3 mt-1.5 px-1">
              <span className={`text-[10px] font-mono ${
                (data.personalInfo.summary?.split(/\s+/).filter(Boolean).length || 0) > 50 ? 'text-amber-500' : 'text-gray-400'
              }`}>
                {data.personalInfo.summary?.split(/\s+/).filter(Boolean).length || 0} words
              </span>
              <span className="text-gray-300">•</span>
              <span className={`text-[10px] font-mono ${
                (data.personalInfo.summary?.length || 0) > 300 ? 'text-amber-500' : 'text-gray-400'
              }`}>
                {data.personalInfo.summary?.length || 0} chars
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-[10px] text-gray-400">
                {(data.personalInfo.summary?.split(/\s+/).filter(Boolean).length || 0) <= 50 ? 'Aim for 30-50 words' : 'Consider trimming'}
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* Work Experience */}
      <Section
        title="Work Experience"
        subtitle="Your professional history"
        icon={FaBriefcase}
        count={data.experience.filter((e) => e.company || e.position).length}
      >
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div
              key={exp.id}
              className="relative p-4 bg-gradient-to-b from-gray-50/80 to-gray-50/40 rounded-xl border border-gray-200/60"
            >
              {data.experience.length > 1 && <RemoveButton onClick={() => removeExperience(exp.id)} />}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <InputField
                  label="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Google"
                />
                <InputField
                  label="Position"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Senior Engineer"
                />
                <InputField
                  label="Start Date"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  placeholder="Jan 2020"
                />
                <div>
                  <InputField
                    label="End Date"
                    value={exp.current ? 'Present' : exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    placeholder="Dec 2023"
                  />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30"
                    />
                    <span className="text-[11px] text-gray-500 font-medium">Currently working here</span>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <TextArea
                    label="Description & Achievements"
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="• Led a team of 5 engineers&#10;• Improved performance by 40%&#10;• Mentored junior developers"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          ))}
          <AddButton onClick={addExperience} label="Add Experience" />
        </div>
      </Section>

      {/* Education */}
      <Section
        title="Education"
        subtitle="Academic background"
        icon={FaGraduationCap}
        count={data.education.filter((e) => e.institution || e.degree).length}
      >
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div
              key={edu.id}
              className="relative p-4 bg-gradient-to-b from-gray-50/80 to-gray-50/40 rounded-xl border border-gray-200/60"
            >
              {data.education.length > 1 && <RemoveButton onClick={() => removeEducation(edu.id)} />}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <InputField
                    label="Institution"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder="Stanford University"
                  />
                </div>
                <InputField
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                />
                <InputField
                  label="Field of Study"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Computer Science"
                />
                <InputField
                  label="Start Date"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  placeholder="2016"
                />
                <InputField
                  label="End Date"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  placeholder="2020"
                />
                <InputField
                  label="GPA (optional)"
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.9/4.0"
                />
              </div>
            </div>
          ))}
          <AddButton onClick={addEducation} label="Add Education" />
        </div>
      </Section>

      {/* Skills */}
      <Section
        title="Skills"
        subtitle="Technical & soft skills"
        icon={FaTools}
        count={data.skills.filter((s) => s.trim() !== '').length}
      >
        <div className="space-y-2.5">
          {data.skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                placeholder={`Skill ${index + 1} (e.g. JavaScript, React, Leadership)`}
                className="flex-1 px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all text-sm text-gray-800 placeholder:text-gray-300"
              />
              {data.skills.length > 1 && (
                <button
                  onClick={() => removeSkill(index)}
                  className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-100 transition-all shrink-0"
                >
                  <FaTrash size={10} />
                </button>
              )}
            </div>
          ))}
          <AddButton onClick={addSkill} label="Add Skill" />
        </div>
      </Section>

      {/* Certifications */}
      <Section
        title="Certifications"
        subtitle="Professional credentials"
        icon={FaCertificate}
        count={data.certifications.filter((c) => c.name).length}
      >
        <div className="space-y-4">
          {data.certifications.map((cert) => (
            <div
              key={cert.id}
              className="relative p-4 bg-gradient-to-b from-gray-50/80 to-gray-50/40 rounded-xl border border-gray-200/60"
            >
              {data.certifications.length > 1 && <RemoveButton onClick={() => removeCertification(cert.id)} />}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <InputField
                    label="Certification Name"
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    placeholder="AWS Solutions Architect"
                  />
                </div>
                <InputField
                  label="Issuing Organization"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
                <InputField
                  label="Date"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  placeholder="March 2023"
                />
              </div>
            </div>
          ))}
          <AddButton onClick={addCertification} label="Add Certification" />
        </div>
      </Section>

      {/* Languages */}
      <Section
        title="Languages"
        subtitle="Language proficiencies"
        icon={FaLanguage}
        count={data.languages.filter((l) => l.language).length}
      >
        <div className="space-y-3">
          {data.languages.map((lang) => (
            <div
              key={lang.id}
              className="relative p-4 bg-gradient-to-b from-gray-50/80 to-gray-50/40 rounded-xl border border-gray-200/60"
            >
              {data.languages.length > 1 && <RemoveButton onClick={() => removeLanguage(lang.id)} />}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <InputField
                  label="Language"
                  value={lang.language}
                  onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                  placeholder="English"
                />
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Proficiency
                  </label>
                  <select
                    value={lang.proficiency}
                    onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all text-sm text-gray-800"
                  >
                    <option value="">Select level</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <AddButton onClick={addLanguage} label="Add Language" />
        </div>
      </Section>
    </div>
  )
}
