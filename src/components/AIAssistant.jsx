import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaMagic, FaTimes, FaCheck, FaLightbulb, FaRedo } from 'react-icons/fa'

// ============================================================
// CURATED LIBRARIES FOR TEMPLATE-BASED GENERATION
// ============================================================

const ACTION_VERBS = {
  leadership: ['Spearheaded', 'Orchestrated', 'Championed', 'Directed', 'Pioneered', 'Mobilized', 'Cultivated', 'Steered'],
  achievement: ['Accelerated', 'Boosted', 'Elevated', 'Maximized', 'Surpassed', 'Transformed', 'Revolutionized', 'Amplified'],
  technical: ['Architected', 'Engineered', 'Optimized', 'Implemented', 'Automated', 'Streamlined', 'Integrated', 'Deployed'],
  collaboration: ['Partnered', 'Facilitated', 'Coordinated', 'Mentored', 'Collaborated', 'Aligned', 'Unified', 'Bridged'],
  analysis: ['Analyzed', 'Assessed', 'Evaluated', 'Identified', 'Investigated', 'Researched', 'Diagnosed', 'Mapped'],
  creation: ['Developed', 'Designed', 'Built', 'Created', 'Launched', 'Established', 'Initiated', 'Formulated'],
}

const METRICS_TEMPLATES = [
  'resulting in {percent}% improvement in {area}',
  'reducing {area} by {percent}%',
  'increasing {area} by {percent}%',
  'serving {number}+ {users}',
  'across {number} {teams}',
  'within {timeframe}',
  'saving {number} hours per {period}',
  'generating ${amount} in {outcome}',
]

const SUMMARY_TEMPLATES = [
  '{adjective} {title} with {years}+ years of experience in {skills_area}. Proven track record of {achievement}. Passionate about {passion} and committed to {commitment}.',
  'Results-driven {title} specializing in {skills_area} with a demonstrated history of {achievement}. {adjective} professional dedicated to {passion} while {commitment}.',
  '{adjective} and detail-oriented {title} bringing {years}+ years of expertise in {skills_area}. Known for {achievement} and {passion}. Adept at {commitment}.',
]

const SUMMARY_ADJECTIVES = [
  'Dynamic', 'Innovative', 'Strategic', 'Accomplished', 'Versatile',
  'Forward-thinking', 'Results-oriented', 'High-performing', 'Dedicated', 'Proactive',
]

const ACHIEVEMENTS = [
  'delivering high-impact solutions that drive business growth',
  'leading cross-functional teams to exceed objectives',
  'building scalable systems that serve millions of users',
  'optimizing processes and reducing operational costs',
  'driving innovation and technical excellence',
  'transforming complex challenges into elegant solutions',
  'mentoring teams and fostering collaborative environments',
  'shipping products that delight users and stakeholders',
]

const PASSIONS = [
  'clean code and engineering best practices',
  'continuous learning and professional development',
  'building products that make a real difference',
  'pushing the boundaries of technology',
  'creating exceptional user experiences',
  'data-driven decision making',
  'fostering inclusive team cultures',
  'solving complex problems at scale',
]

const COMMITMENTS = [
  'delivering measurable results in fast-paced environments',
  'bridging the gap between technical solutions and business objectives',
  'leveraging cutting-edge technologies to solve real-world problems',
  'driving team productivity and operational excellence',
  'building maintainable, scalable, and secure systems',
  'translating stakeholder needs into actionable technical strategies',
]

const SKILLS_DATABASE = {
  'software engineer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Git', 'Agile', 'REST APIs', 'Microservices', 'System Design', 'TDD'],
  'frontend': ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js', 'Webpack', 'Figma', 'Responsive Design', 'Accessibility (WCAG)', 'Performance Optimization', 'Storybook', 'Jest'],
  'backend': ['Node.js', 'Python', 'Java', 'Go', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'REST APIs', 'GraphQL', 'Microservices', 'Message Queues', 'System Design', 'CI/CD'],
  'data scientist': ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'Tableau', 'Spark', 'Jupyter', 'Statistical Modeling', 'Machine Learning', 'Deep Learning', 'NLP', 'A/B Testing'],
  'product manager': ['Product Strategy', 'Agile/Scrum', 'User Research', 'Data Analysis', 'Roadmapping', 'Jira', 'A/B Testing', 'Stakeholder Management', 'OKRs', 'Go-to-Market', 'Figma', 'SQL', 'Analytics', 'User Stories', 'Competitive Analysis'],
  'designer': ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'Wireframing', 'User Research', 'Design Systems', 'Typography', 'Color Theory', 'Accessibility', 'Responsive Design', 'Interaction Design', 'Usability Testing', 'Information Architecture'],
  'devops': ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Ansible', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Linux', 'Prometheus', 'Grafana', 'Shell Scripting', 'Networking', 'Security', 'Infrastructure as Code'],
  'marketing': ['SEO', 'Google Analytics', 'Content Strategy', 'Social Media Marketing', 'Email Marketing', 'PPC', 'A/B Testing', 'Copywriting', 'HubSpot', 'Salesforce', 'Brand Strategy', 'Market Research', 'CRM', 'Lead Generation'],
  'project manager': ['Agile', 'Scrum', 'PMP', 'Jira', 'Risk Management', 'Budgeting', 'Stakeholder Management', 'Resource Planning', 'Microsoft Project', 'Confluence', 'Communication', 'Leadership', 'Time Management', 'Change Management'],
  'default': ['Project Management', 'Communication', 'Problem Solving', 'Leadership', 'Teamwork', 'Analytical Thinking', 'Time Management', 'Adaptability', 'Critical Thinking', 'Attention to Detail'],
}

const STAR_PATTERNS = [
  { situation: 'In a {context} environment', task: 'tasked with {task}', action: '{action_verb} {action}', result: 'resulting in {result}' },
  { situation: 'When faced with {challenge}', task: 'responsible for {task}', action: '{action_verb} {action}', result: 'which led to {result}' },
  { situation: 'As part of {initiative}', task: 'to {task}', action: '{action_verb} {action}', result: 'achieving {result}' },
]

// ============================================================
// GENERATION ENGINE
// ============================================================

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickMultipleRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function getYearsFromExperience(experience) {
  if (!experience || experience.length === 0) return '3'
  const years = experience.length * 2 + Math.floor(Math.random() * 3)
  return String(Math.max(2, Math.min(years, 15)))
}

function getSkillsArea(skills) {
  if (!skills || skills.length === 0) return 'technology and innovation'
  const validSkills = skills.filter(s => s && s.trim())
  if (validSkills.length === 0) return 'technology and innovation'
  const topSkills = validSkills.slice(0, 3).join(', ')
  return topSkills
}

function findMatchingSkillsCategory(title) {
  if (!title) return 'default'
  const lowerTitle = title.toLowerCase()
  for (const [key] of Object.entries(SKILLS_DATABASE)) {
    if (lowerTitle.includes(key)) return key
  }
  if (lowerTitle.includes('engineer') || lowerTitle.includes('developer')) return 'software engineer'
  if (lowerTitle.includes('front')) return 'frontend'
  if (lowerTitle.includes('back')) return 'backend'
  if (lowerTitle.includes('data')) return 'data scientist'
  if (lowerTitle.includes('design')) return 'designer'
  if (lowerTitle.includes('product')) return 'product manager'
  if (lowerTitle.includes('devops') || lowerTitle.includes('sre') || lowerTitle.includes('infrastructure')) return 'devops'
  if (lowerTitle.includes('market')) return 'marketing'
  if (lowerTitle.includes('project') || lowerTitle.includes('program')) return 'project manager'
  return 'default'
}

// Generate professional summaries
function generateSummaries(resumeData) {
  const title = resumeData.personalInfo?.title || 'Professional'
  const skills = resumeData.skills || []
  const experience = resumeData.experience || []
  const years = getYearsFromExperience(experience)
  const skillsArea = getSkillsArea(skills)

  const results = []
  const usedTemplates = pickMultipleRandom(SUMMARY_TEMPLATES, 3)

  for (let i = 0; i < 3; i++) {
    const template = usedTemplates[i]
    const summary = template
      .replace('{adjective}', pickRandom(SUMMARY_ADJECTIVES))
      .replace('{title}', title)
      .replace('{years}', years)
      .replace('{skills_area}', skillsArea)
      .replace('{achievement}', pickRandom(ACHIEVEMENTS))
      .replace('{passion}', pickRandom(PASSIONS))
      .replace('{commitment}', pickRandom(COMMITMENTS))

    results.push(summary)
  }

  return results
}

// Generate enhanced bullet points
function generateBulletPoints(description, position) {
  if (!description || !description.trim()) {
    // Generate from scratch based on position
    const verbs = pickMultipleRandom(Object.values(ACTION_VERBS).flat(), 3)
    return [
      `• ${verbs[0]} cross-functional initiatives to improve team productivity and project delivery timelines\n• ${pickRandom(ACTION_VERBS.technical)} scalable solutions that enhanced system performance by 40%\n• ${pickRandom(ACTION_VERBS.collaboration)} with stakeholders to align technical solutions with business objectives`,
      `• ${verbs[1]} development of key features serving 10K+ users across multiple platforms\n• ${pickRandom(ACTION_VERBS.achievement)} operational efficiency through process automation and optimization\n• ${pickRandom(ACTION_VERBS.analysis)} performance bottlenecks and implemented solutions reducing latency by 60%`,
      `• ${verbs[2]} end-to-end project lifecycle from requirements gathering to production deployment\n• ${pickRandom(ACTION_VERBS.creation)} comprehensive documentation and onboarding materials for team of 8\n• ${pickRandom(ACTION_VERBS.leadership)} strategic planning sessions resulting in 25% faster time-to-market`,
    ]
  }

  // Enhance existing description
  const lines = description.split('\n').filter(l => l.trim())
  const results = []

  for (let variation = 0; variation < 3; variation++) {
    const enhanced = lines.map(line => {
      const cleaned = line.replace(/^[•\-\*]\s*/, '').trim()
      if (!cleaned) return ''

      const verbCategory = pickRandom(Object.keys(ACTION_VERBS))
      const verb = pickRandom(ACTION_VERBS[verbCategory])
      const metric = pickRandom(METRICS_TEMPLATES)
        .replace('{percent}', String(Math.floor(Math.random() * 50) + 15))
        .replace('{number}', String(Math.floor(Math.random() * 50) + 5))
        .replace('{area}', pickRandom(['efficiency', 'performance', 'productivity', 'throughput', 'reliability']))
        .replace('{users}', pickRandom(['users', 'customers', 'stakeholders', 'team members']))
        .replace('{teams}', pickRandom(['teams', 'departments', 'regions']))
        .replace('{timeframe}', pickRandom(['3 months', '6 weeks', 'Q1 deadline']))
        .replace('{period}', pickRandom(['week', 'month', 'sprint']))
        .replace('{amount}', pickRandom(['100K', '250K', '500K', '1M']))
        .replace('{outcome}', pickRandom(['revenue', 'cost savings', 'annual value']))

      // Reconstruct with strong verb and metrics
      return `• ${verb} ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}, ${metric}`
    }).filter(l => l).join('\n')

    results.push(enhanced)
  }

  return results
}

// Suggest skills based on job title
function suggestSkills(title, existingSkills) {
  const category = findMatchingSkillsCategory(title)
  const allSkills = SKILLS_DATABASE[category] || SKILLS_DATABASE['default']
  const existingLower = (existingSkills || []).map(s => s.toLowerCase().trim())

  const suggestions = allSkills.filter(
    skill => !existingLower.includes(skill.toLowerCase())
  )

  return suggestions.slice(0, 12)
}

// ============================================================
// AI ASSISTANT COMPONENT
// ============================================================

export default function AIAssistant({ mode, resumeData, onApply, onClose, fieldValue, position }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generate = useCallback(() => {
    setLoading(true)
    // Simulate a brief delay for UX feel
    setTimeout(() => {
      let results = []
      if (mode === 'summary') {
        results = generateSummaries(resumeData)
      } else if (mode === 'bullets') {
        results = generateBulletPoints(fieldValue, position)
      } else if (mode === 'skills') {
        results = suggestSkills(
          resumeData.personalInfo?.title,
          resumeData.skills
        )
      }
      setSuggestions(results)
      setLoading(false)
      setGenerated(true)
    }, 600)
  }, [mode, resumeData, fieldValue, position])

  // Auto-generate on mount
  useState(() => {
    generate()
  })

  const modeConfig = {
    summary: {
      title: 'Summary Generator',
      subtitle: 'Professional summaries based on your profile',
      icon: '✨',
    },
    bullets: {
      title: 'Bullet Enhancer',
      subtitle: 'Stronger action verbs & quantifiable metrics',
      icon: '🚀',
    },
    skills: {
      title: 'Skills Suggester',
      subtitle: 'Relevant skills for your role',
      icon: '💡',
    },
  }

  const config = modeConfig[mode] || modeConfig.summary

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200/80 w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-md shadow-blue-500/20">
                  {config.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{config.title}</h3>
                  <p className="text-[11px] text-gray-500">{config.subtitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all"
              >
                <FaTimes size={12} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-3"
                >
                  <FaMagic className="text-white" size={16} />
                </motion.div>
                <p className="text-sm text-gray-500 font-medium">Generating suggestions...</p>
              </div>
            ) : mode === 'skills' ? (
              <div>
                <p className="text-xs text-gray-500 mb-3 font-medium">
                  Click skills to add them to your resume:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((skill, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onApply(skill)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl text-xs font-semibold text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all"
                    >
                      <FaLightbulb size={9} className="text-blue-400" />
                      {skill}
                    </motion.button>
                  ))}
                </div>
                {suggestions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400">
                      {resumeData.personalInfo?.title
                        ? "You've already added all suggested skills! Great job."
                        : 'Add a job title in Personal Info to get skill suggestions.'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative p-4 bg-gray-50/80 border border-gray-200/60 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-sm text-gray-700 leading-relaxed flex-1 whitespace-pre-line">
                        {suggestion}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onApply(suggestion)
                        onClose()
                      }}
                      className="mt-3 ml-9 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-[11px] font-semibold shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all"
                    >
                      <FaCheck size={9} />
                      Use this
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <p className="text-[10px] text-gray-400">
              Generated from your profile data • No external APIs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all"
            >
              <FaRedo size={9} />
              Regenerate
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================
// AI TRIGGER BUTTON - Floating sparkle button
// ============================================================

export function AITriggerButton({ onClick, tooltip = 'AI Assist' }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={tooltip}
      className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 transition-shadow"
    >
      <FaMagic size={11} />
    </motion.button>
  )
}
