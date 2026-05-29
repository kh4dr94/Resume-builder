import { useState } from 'react'
import { useTranslation } from '../TranslationContext'
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
  FaChevronUp,
  FaMagic,
  FaCheck,
  FaRedo,
} from 'react-icons/fa'

// AI Rewrite logic
const ACTION_VERBS = [
  'Spearheaded', 'Orchestrated', 'Pioneered', 'Accelerated', 'Transformed',
  'Championed', 'Architected', 'Streamlined', 'Cultivated', 'Delivered',
  'Engineered', 'Optimized', 'Launched', 'Directed', 'Implemented',
  'Established', 'Revitalized', 'Negotiated', 'Maximized', 'Formulated',
  'Elevated', 'Consolidated', 'Redesigned', 'Mentored', 'Facilitated',
  'Automated', 'Devised', 'Executed', 'Generated', 'Strengthened',
  'Initiated', 'Overhauled', 'Modernized', 'Leveraged', 'Coordinated',
  'Drove', 'Influenced', 'Secured', 'Resolved', 'Integrated',
  'Deployed', 'Scaled', 'Reduced', 'Increased', 'Enhanced',
]

function rewriteBullet(bullet) {
  if (!bullet || !bullet.trim()) return bullet
  let text = bullet.trim().replace(/^[-•*]\s*/, '')
  const weakOpeners = /^(I\s+)?(did|made|got|helped|worked on|was responsible for|handled|managed|used|ran)\s+/i
  text = text.replace(weakOpeners, '')
  text = text.charAt(0).toUpperCase() + text.slice(1)
  const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)]
  const hasNumbers = /\d/.test(text)
  const quantifier = hasNumbers ? '' : ', resulting in [X]% improvement'
  return `${verb} ${text.charAt(0).toLowerCase() + text.slice(1)}${quantifier}`
}

function Section({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon className="text-blue-600" size={16} />
          </div>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        {open ? (
          <FaChevronUp className="text-gray-400" size={14} />
        ) : (
          <FaChevronDown className="text-gray-400" size={14} />
        )}
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100 pt-4">{children}</div>}
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
      />
    </div>
  )
}

function TextArea({ label, value, onChange, placeholder = '', rows = 3 }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none"
      />
    </div>
  )
}

// AI Summary generation templates
const SUMMARY_TEMPLATES = [
  (title, skills, years) => `Results-driven ${title} with ${years}+ years of experience in ${skills.slice(0, 3).join(', ')}. Proven track record of delivering high-impact solutions and driving measurable business outcomes.`,
  (title, skills, years) => `Dynamic ${title} combining ${years}+ years of expertise in ${skills.slice(0, 3).join(', ')} with strong analytical and leadership abilities. Passionate about building innovative solutions that scale.`,
  (title, skills, years) => `Accomplished ${title} with ${years}+ years specializing in ${skills.slice(0, 3).join(', ')}. Known for translating complex requirements into elegant, efficient solutions that exceed stakeholder expectations.`,
  (title, skills, years) => `Strategic ${title} leveraging ${years}+ years of hands-on experience in ${skills.slice(0, 4).join(', ')}. Committed to continuous improvement and delivering excellence in fast-paced environments.`,
]

// Skills database for suggestions
const SKILLS_DB = {
  'software engineer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Git', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'REST APIs', 'GraphQL', 'SQL', 'MongoDB', 'Agile/Scrum', 'System Design', 'Microservices', 'Unit Testing'],
  'frontend developer': ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js', 'Vue.js', 'Webpack', 'Responsive Design', 'Accessibility', 'Performance Optimization', 'Git', 'REST APIs', 'Figma', 'Jest'],
  'backend developer': ['Node.js', 'Python', 'Java', 'Go', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'REST APIs', 'GraphQL', 'Microservices', 'CI/CD', 'Security'],
  'product manager': ['Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing', 'Data Analytics', 'Agile/Scrum', 'Stakeholder Management', 'Jira', 'Market Analysis', 'KPI Tracking', 'Cross-functional Leadership', 'SQL'],
  'data scientist': ['Python', 'R', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'SQL', 'Statistics', 'Data Visualization', 'Pandas', 'NumPy', 'Scikit-learn', 'NLP', 'A/B Testing', 'Spark', 'Tableau'],
  'designer': ['Figma', 'Sketch', 'Adobe Creative Suite', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Typography', 'Wireframing', 'User Testing', 'Interaction Design', 'Responsive Design', 'Accessibility'],
  'marketing manager': ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Social Media', 'Google Analytics', 'Email Marketing', 'PPC', 'Brand Management', 'CRM', 'A/B Testing', 'Copywriting', 'Campaign Management', 'HubSpot'],
  'project manager': ['Project Planning', 'Agile/Scrum', 'Risk Management', 'Stakeholder Management', 'Budget Management', 'Jira', 'Resource Allocation', 'Cross-functional Leadership', 'Communication', 'Kanban', 'Process Improvement'],
  'devops engineer': ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Jenkins', 'Linux', 'Python', 'Bash', 'Ansible', 'Monitoring', 'Git', 'Prometheus', 'Grafana', 'Infrastructure as Code'],
  'full stack developer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'REST APIs', 'GraphQL', 'Docker', 'AWS', 'Git', 'Next.js', 'PostgreSQL', 'CI/CD', 'Testing'],
}

function AISummaryInline({ personalInfo, skills, experience, onApply }) {
  const { t } = useTranslation()
  const [showOptions, setShowOptions] = useState(false)
  const [applied, setApplied] = useState(null)

  const title = personalInfo.title || 'Professional'
  const validSkills = skills.filter(s => s.trim())
  const fallbackSkills = validSkills.length > 0 ? validSkills : ['problem-solving', 'communication', 'leadership']
  const years = Math.max(1, experience.filter(e => e.company).length)

  const summaries = SUMMARY_TEMPLATES.map((fn, idx) => ({
    id: idx,
    text: fn(title, fallbackSkills, years),
  }))

  const handleApply = (summary) => {
    onApply(summary.text)
    setApplied(summary.id)
    setTimeout(() => setApplied(null), 2000)
  }

  return (
    <div className="mt-2">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-100 active:scale-95 transition-all"
      >
        <FaMagic size={10} />
        {showOptions ? t('ai.hideSuggestions') : t('ai.generateSummary')}
      </button>

      {showOptions && (
        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1">
          {summaries.map((summary) => (
            <div key={summary.id} className="p-2.5 bg-white border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 leading-relaxed mb-1.5">{summary.text}</p>
              <button
                onClick={() => handleApply(summary)}
                className={`px-2 py-1 text-[10px] font-semibold rounded ${
                  applied === summary.id
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-600 text-white active:bg-purple-700'
                }`}
              >
                {applied === summary.id ? `✓ ${t('ai.applied')}` : t('ai.useThis')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AISkillsInline({ title, existingSkills, onAddSkill }) {
  const { t } = useTranslation()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [added, setAdded] = useState(new Set())

  const normalizedTitle = (title || '').toLowerCase().trim()
  let suggestedSkills = null

  // Try to match job title to database
  for (const [key, skills] of Object.entries(SKILLS_DB)) {
    if (normalizedTitle.includes(key) || key.includes(normalizedTitle)) {
      suggestedSkills = skills
      break
    }
  }

  if (!suggestedSkills) {
    suggestedSkills = ['Communication', 'Problem Solving', 'Project Management', 'Data Analysis', 'Leadership', 'Strategic Planning', 'Team Collaboration', 'Critical Thinking', 'Time Management', 'Adaptability']
  }

  const existingLower = existingSkills.map(s => s.toLowerCase().trim())
  const filtered = suggestedSkills.filter(s => !existingLower.includes(s.toLowerCase()) && !added.has(s))

  const handleAdd = (skill) => {
    onAddSkill(skill)
    setAdded(prev => new Set([...prev, skill]))
  }

  return (
    <div className="mt-2">
      <button
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-100 active:scale-95 transition-all"
      >
        <FaMagic size={10} />
        {showSuggestions ? t('ai.hideSuggestions') : t('ai.suggestSkills')}
      </button>

      {showSuggestions && (
        <div className="mt-2 max-h-40 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-green-600 py-2">✓ {t('ai.allAdded')}</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {filtered.map((skill, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAdd(skill)}
                  className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700 active:bg-blue-100 active:scale-95 transition-all"
                >
                  + {skill}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AIRewriteInline({ description, onApply }) {
  const { t } = useTranslation()
  const [rewrites, setRewrites] = useState({})
  const [showAll, setShowAll] = useState(false)

  const bullets = description.split('\n').filter(l => l.trim()).map((line, idx) => ({
    idx,
    text: line.replace(/^[-•*]\s*/, '').trim(),
    raw: line,
  }))

  const handleRewrite = (bulletIdx) => {
    const bullet = bullets[bulletIdx]
    const improved = rewriteBullet(bullet.text)
    setRewrites(prev => ({ ...prev, [bulletIdx]: improved }))
  }

  const handleApply = (bulletIdx) => {
    const rewritten = rewrites[bulletIdx]
    if (!rewritten) return
    const lines = description.split('\n')
    let count = -1
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim()) {
        count++
        if (count === bulletIdx) {
          lines[i] = `• ${rewritten}`
          break
        }
      }
    }
    onApply(lines.join('\n'))
    setRewrites(prev => {
      const copy = { ...prev }
      delete copy[bulletIdx]
      return copy
    })
  }

  if (bullets.length === 0) return null

  return (
    <div className="mt-2">
      <button
        onClick={() => setShowAll(!showAll)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-100 active:scale-95 transition-all"
      >
        <FaMagic size={10} />
        {showAll ? t('ai.hideRewrite') : `${t('ai.rewrite')} (${bullets.length} ${t('ai.bullets')})`}
      </button>

      {showAll && (
        <div className="mt-2 space-y-2">
          {bullets.map((bullet, idx) => (
            <div key={idx} className="p-2.5 bg-white border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-1.5">"{bullet.text}"</p>
              {rewrites[idx] ? (
                <div className="space-y-1.5">
                  <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-xs text-green-800">✨ {rewrites[idx]}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleApply(idx)}
                      className="px-2 py-1 bg-green-600 text-white text-[10px] font-semibold rounded active:bg-green-700"
                    >
                      <FaCheck className="inline mr-0.5" size={8} /> {t('ai.apply')}
                    </button>
                    <button
                      onClick={() => handleRewrite(idx)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 text-[10px] font-medium rounded active:bg-gray-300"
                    >
                      <FaRedo className="inline mr-0.5" size={8} /> {t('ai.retry')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleRewrite(idx)}
                  className="px-2.5 py-1.5 bg-purple-600 text-white text-[10px] font-semibold rounded-md active:bg-purple-700"
                >
                  <FaMagic className="inline mr-1" size={9} /> {t('ai.rewrite')}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ResumeForm({ data, setData }) {
  const { t } = useTranslation()

  const updatePersonalInfo = (field, value) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  // Experience handlers
  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    }))
  }

  const updateExperience = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }))
  }

  const removeExperience = (id) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  // Education handlers
  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          gpa: '',
        },
      ],
    }))
  }

  const updateEducation = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }))
  }

  const removeEducation = (id) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  // Skills handlers
  const addSkill = () => {
    setData((prev) => ({
      ...prev,
      skills: [...prev.skills, ''],
    }))
  }

  const updateSkill = (index, value) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s, i) => (i === index ? value : s)),
    }))
  }

  const removeSkill = (index) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  // Certification handlers
  const addCertification = () => {
    setData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: Date.now(), name: '', issuer: '', date: '' },
      ],
    }))
  }

  const updateCertification = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }))
  }

  const removeCertification = (id) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }))
  }

  // Language handlers
  const addLanguage = () => {
    setData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        { id: Date.now(), language: '', proficiency: '' },
      ],
    }))
  }

  const updateLanguage = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    }))
  }

  const removeLanguage = (id) => {
    setData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang.id !== id),
    }))
  }

  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <Section title={t('form.personalInfo')} icon={FaUser} defaultOpen={true}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <InputField
              label={t('form.fullName')}
              value={data.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="sm:col-span-2">
            <InputField
              label={t('form.professionalTitle')}
              value={data.personalInfo.title}
              onChange={(e) => updatePersonalInfo('title', e.target.value)}
              placeholder="Senior Software Engineer"
            />
          </div>
          <InputField
            label={t('form.email')}
            type="email"
            value={data.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="john@example.com"
          />
          <InputField
            label={t('form.phone')}
            type="tel"
            value={data.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
          <InputField
            label={t('form.location')}
            value={data.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder="San Francisco, CA"
          />
          <InputField
            label={t('form.linkedin')}
            value={data.personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
          <div className="sm:col-span-2">
            <InputField
              label={t('form.website')}
              value={data.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              placeholder="johndoe.dev"
            />
          </div>
          <div className="sm:col-span-2">
            <TextArea
              label={t('form.summary')}
              value={data.personalInfo.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
              placeholder="A brief summary of your professional background, key achievements, and career goals..."
              rows={4}
            />
            <AISummaryInline
              personalInfo={data.personalInfo}
              skills={data.skills}
              experience={data.experience}
              onApply={(summary) => updatePersonalInfo('summary', summary)}
            />
          </div>
        </div>
      </Section>

      {/* Work Experience */}
      <Section title={t('form.workExperience')} icon={FaBriefcase}>
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div
              key={exp.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
            >
              {data.experience.length > 1 && (
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label={t('form.company')}
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Google"
                />
                <InputField
                  label={t('form.position')}
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Senior Engineer"
                />
                <InputField
                  label={t('form.startDate')}
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  placeholder="Jan 2020"
                />
                <div>
                  <InputField
                    label={t('form.endDate')}
                    value={exp.current ? 'Present' : exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    placeholder="Dec 2023"
                  />
                  <label className="flex items-center gap-2 mt-1.5">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) =>
                        updateExperience(exp.id, 'current', e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">{t('form.currentlyWorking')}</span>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <TextArea
                    label={t('form.description')}
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(exp.id, 'description', e.target.value)
                    }
                    placeholder="• Led a team of 5 engineers to deliver a microservices architecture&#10;• Improved system performance by 40% through optimization&#10;• Mentored junior developers and conducted code reviews"
                    rows={4}
                  />
                  {/* AI Rewrite for each bullet */}
                  {exp.description && exp.description.trim() && (
                    <AIRewriteInline
                      description={exp.description}
                      onApply={(newDesc) => updateExperience(exp.id, 'description', newDesc)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addExperience}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <FaPlus size={12} />
            {t('form.addExperience')}
          </button>
        </div>
      </Section>

      {/* Education */}
      <Section title={t('form.education')} icon={FaGraduationCap}>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div
              key={edu.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
            >
              {data.education.length > 1 && (
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <InputField
                    label={t('form.institution')}
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(edu.id, 'institution', e.target.value)
                    }
                    placeholder="Stanford University"
                  />
                </div>
                <InputField
                  label={t('form.degree')}
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                />
                <InputField
                  label={t('form.fieldOfStudy')}
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Computer Science"
                />
                <InputField
                  label={t('form.startDate')}
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  placeholder="2016"
                />
                <InputField
                  label={t('form.endDate')}
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  placeholder="2020"
                />
                <InputField
                  label={t('form.gpa')}
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.9/4.0"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addEducation}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <FaPlus size={12} />
            {t('form.addEducation')}
          </button>
        </div>
      </Section>

      {/* Skills */}
      <Section title={t('form.skills')} icon={FaTools}>
        <div className="space-y-2">
          {data.skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                placeholder="e.g. JavaScript, React, Node.js"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              />
              {data.skills.length > 1 && (
                <button
                  onClick={() => removeSkill(index)}
                  className="text-red-400 hover:text-red-600 transition-colors p-2"
                >
                  <FaTrash size={12} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addSkill}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm mt-2"
          >
            <FaPlus size={12} />
            {t('form.addSkill')}
          </button>
          <AISkillsInline
            title={data.personalInfo.title}
            existingSkills={data.skills}
            onAddSkill={(skill) => {
              setData((prev) => ({
                ...prev,
                skills: [...prev.skills, skill],
              }))
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t('form.skillTip')}
          </p>
        </div>
      </Section>

      {/* Certifications */}
      <Section title={t('form.certifications')} icon={FaCertificate}>
        <div className="space-y-4">
          {data.certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
            >
              {data.certifications.length > 1 && (
                <button
                  onClick={() => removeCertification(cert.id)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <InputField
                    label={t('form.certName')}
                    value={cert.name}
                    onChange={(e) =>
                      updateCertification(cert.id, 'name', e.target.value)
                    }
                    placeholder="AWS Solutions Architect"
                  />
                </div>
                <InputField
                  label={t('form.issuer')}
                  value={cert.issuer}
                  onChange={(e) =>
                    updateCertification(cert.id, 'issuer', e.target.value)
                  }
                  placeholder="Amazon Web Services"
                />
                <InputField
                  label={t('form.date')}
                  value={cert.date}
                  onChange={(e) =>
                    updateCertification(cert.id, 'date', e.target.value)
                  }
                  placeholder="March 2023"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addCertification}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <FaPlus size={12} />
            {t('form.addCertification')}
          </button>
        </div>
      </Section>

      {/* Languages */}
      <Section title={t('form.languages')} icon={FaLanguage}>
        <div className="space-y-4">
          {data.languages.map((lang) => (
            <div
              key={lang.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 relative"
            >
              {data.languages.length > 1 && (
                <button
                  onClick={() => removeLanguage(lang.id)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label={t('form.language')}
                  value={lang.language}
                  onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                  placeholder="English"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('form.proficiency')}
                  </label>
                  <select
                    value={lang.proficiency}
                    onChange={(e) =>
                      updateLanguage(lang.id, 'proficiency', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  >
                    <option value="">{t('form.selectLevel')}</option>
                    <option value="Native">{t('form.native')}</option>
                    <option value="Fluent">{t('form.fluent')}</option>
                    <option value="Advanced">{t('form.advanced')}</option>
                    <option value="Intermediate">{t('form.intermediate')}</option>
                    <option value="Basic">{t('form.basic')}</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addLanguage}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <FaPlus size={12} />
            {t('form.addLanguage')}
          </button>
        </div>
      </Section>
    </div>
  )
}
