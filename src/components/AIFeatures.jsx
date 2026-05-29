import { useState, useEffect, useRef } from 'react'
import {
  FaTimes,
  FaMagic,
  FaLightbulb,
  FaTrophy,
  FaBolt,
  FaUserTie,
  FaPlus,
  FaCheck,
  FaRedo,
  FaArrowRight,
} from 'react-icons/fa'

// ─── Data: Action Verbs ───────────────────────────────────────────────────────
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
  'Produced', 'Built', 'Guided', 'Analyzed', 'Developed',
  'Introduced', 'Restructured', 'Unified', 'Validated', 'Propelled',
]

const WEAK_VERBS = [
  'did', 'made', 'got', 'helped', 'worked on',
  'was responsible for', 'handled', 'managed', 'used', 'ran',
]


const WEAK_VERB_ALTERNATIVES = {
  'did': ['Executed', 'Accomplished', 'Performed', 'Completed'],
  'made': ['Created', 'Developed', 'Produced', 'Constructed'],
  'got': ['Achieved', 'Obtained', 'Secured', 'Acquired'],
  'helped': ['Facilitated', 'Enabled', 'Supported', 'Empowered'],
  'worked on': ['Contributed to', 'Developed', 'Collaborated on', 'Engineered'],
  'was responsible for': ['Led', 'Managed', 'Oversaw', 'Directed'],
  'handled': ['Managed', 'Coordinated', 'Administered', 'Oversaw'],
  'managed': ['Directed', 'Orchestrated', 'Spearheaded', 'Supervised'],
  'used': ['Leveraged', 'Utilized', 'Employed', 'Applied'],
  'ran': ['Led', 'Directed', 'Operated', 'Administered'],
}


// ─── Data: Skills Database ────────────────────────────────────────────────────
const SKILLS_DATABASE = {
  'software engineer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Git', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'REST APIs', 'GraphQL', 'SQL', 'MongoDB', 'Agile/Scrum', 'System Design', 'Microservices', 'Unit Testing', 'Performance Optimization', 'Linux'],
  'frontend developer': ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js', 'Vue.js', 'Webpack', 'Responsive Design', 'Accessibility (WCAG)', 'Performance Optimization', 'Git', 'REST APIs', 'GraphQL', 'Figma', 'Jest', 'Storybook', 'PWA', 'SEO'],
  'backend developer': ['Node.js', 'Python', 'Java', 'Go', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'REST APIs', 'GraphQL', 'Microservices', 'Message Queues', 'CI/CD', 'Security Best Practices', 'Load Balancing', 'Caching', 'System Design'],
  'product manager': ['Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing', 'Data Analytics', 'Agile/Scrum', 'Stakeholder Management', 'PRDs', 'Jira', 'Market Analysis', 'Competitive Analysis', 'KPI Tracking', 'Cross-functional Leadership', 'Wireframing', 'Customer Interviews', 'SQL', 'Figma', 'OKRs', 'Go-to-Market Strategy', 'Prioritization Frameworks'],
  'data scientist': ['Python', 'R', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'SQL', 'Statistics', 'Data Visualization', 'Pandas', 'NumPy', 'Scikit-learn', 'NLP', 'A/B Testing', 'Big Data', 'Spark', 'Feature Engineering', 'Jupyter', 'Tableau', 'Hypothesis Testing'],
  'designer': ['Figma', 'Sketch', 'Adobe Creative Suite', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Typography', 'Color Theory', 'Wireframing', 'User Testing', 'Interaction Design', 'Responsive Design', 'Accessibility', 'Motion Design', 'Information Architecture', 'Visual Design', 'Design Thinking', 'Illustration', 'Brand Identity'],
  'ux designer': ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'Usability Testing', 'Information Architecture', 'Interaction Design', 'Design Thinking', 'Journey Mapping', 'Persona Development', 'A/B Testing', 'Accessibility (WCAG)', 'Sketch', 'InVision', 'Design Systems', 'Heuristic Evaluation', 'Card Sorting', 'Competitive Analysis', 'Responsive Design', 'Stakeholder Management'],
  'marketing manager': ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Social Media Marketing', 'Google Analytics', 'Email Marketing', 'PPC', 'Brand Management', 'Marketing Automation', 'CRM', 'A/B Testing', 'Copywriting', 'Campaign Management', 'Market Research', 'Budget Management', 'HubSpot', 'Facebook Ads', 'Google Ads', 'Lead Generation', 'ROI Analysis'],
  'data analyst': ['SQL', 'Excel', 'Python', 'Tableau', 'Power BI', 'Data Visualization', 'Statistical Analysis', 'ETL', 'Data Modeling', 'R', 'Google Analytics', 'A/B Testing', 'Dashboard Design', 'Data Cleaning', 'Regression Analysis', 'Business Intelligence', 'Looker', 'Data Warehousing', 'Hypothesis Testing', 'Reporting'],
  'devops engineer': ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Jenkins', 'Linux', 'Python', 'Bash', 'Ansible', 'Monitoring', 'Git', 'Networking', 'Security', 'Prometheus', 'Grafana', 'Helm', 'Infrastructure as Code', 'CloudFormation', 'Microservices'],
  'project manager': ['Project Planning', 'Agile/Scrum', 'Risk Management', 'Stakeholder Management', 'Budget Management', 'Jira', 'MS Project', 'Resource Allocation', 'Timeline Management', 'Cross-functional Leadership', 'PMP', 'Change Management', 'Communication', 'Conflict Resolution', 'Waterfall', 'Kanban', 'Status Reporting', 'Vendor Management', 'Quality Assurance', 'Process Improvement'],
  'mobile developer': ['React Native', 'Swift', 'Kotlin', 'Flutter', 'iOS', 'Android', 'REST APIs', 'Firebase', 'App Store Deployment', 'UI/UX Mobile', 'Push Notifications', 'Offline Storage', 'Performance Optimization', 'CI/CD', 'Unit Testing', 'Git', 'Agile', 'GraphQL', 'State Management', 'Accessibility'],
  'full stack developer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'REST APIs', 'GraphQL', 'Docker', 'AWS', 'Git', 'HTML/CSS', 'Tailwind', 'Next.js', 'PostgreSQL', 'Redis', 'CI/CD', 'Testing', 'Agile'],
  'machine learning engineer': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Deep Learning', 'NLP', 'Computer Vision', 'MLOps', 'Docker', 'Kubernetes', 'AWS SageMaker', 'Feature Engineering', 'Model Deployment', 'Data Pipelines', 'A/B Testing', 'SQL', 'Spark', 'Git', 'Statistical Modeling', 'Experiment Tracking'],
  'business analyst': ['Requirements Gathering', 'SQL', 'Excel', 'Data Analysis', 'Process Mapping', 'Stakeholder Management', 'Jira', 'Agile', 'Use Cases', 'Business Process Modeling', 'Tableau', 'Power BI', 'Documentation', 'UAT', 'Gap Analysis', 'SWOT Analysis', 'Wireframing', 'Communication', 'Problem Solving', 'Presentation'],
  'sales manager': ['Sales Strategy', 'CRM (Salesforce)', 'Pipeline Management', 'Negotiation', 'Team Leadership', 'Revenue Growth', 'Client Relationship Management', 'Cold Calling', 'Presentations', 'Forecasting', 'Territory Management', 'Quota Achievement', 'Cross-selling', 'Upselling', 'Contract Negotiation', 'Lead Qualification', 'Sales Analytics', 'Coaching', 'B2B Sales', 'Account Management'],
  'hr manager': ['Talent Acquisition', 'Employee Relations', 'Performance Management', 'HRIS', 'Compensation & Benefits', 'Training & Development', 'Labor Law', 'Onboarding', 'Diversity & Inclusion', 'Succession Planning', 'Conflict Resolution', 'Organizational Development', 'Engagement Surveys', 'Policy Development', 'Workforce Planning', 'Change Management', 'Compliance', 'Payroll', 'ATS', 'Interviewing'],
  'content writer': ['SEO Writing', 'Copywriting', 'Content Strategy', 'Blog Writing', 'Social Media Content', 'Editing', 'Research', 'WordPress', 'Google Analytics', 'Email Marketing', 'Brand Voice', 'Storytelling', 'AP Style', 'Content Management', 'Keyword Research', 'Long-form Content', 'Technical Writing', 'Proofreading', 'Content Calendar', 'Audience Analysis'],
  'qa engineer': ['Test Automation', 'Selenium', 'Cypress', 'Manual Testing', 'API Testing', 'Performance Testing', 'Test Planning', 'Bug Tracking', 'Jira', 'Agile', 'CI/CD', 'Python', 'JavaScript', 'SQL', 'Regression Testing', 'Test Cases', 'Load Testing', 'Security Testing', 'Mobile Testing', 'BDD/TDD'],
  'cloud architect': ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Docker', 'Microservices', 'Serverless', 'Networking', 'Security', 'Cost Optimization', 'High Availability', 'Disaster Recovery', 'CI/CD', 'Infrastructure as Code', 'Load Balancing', 'CDN', 'Database Architecture', 'Migration Planning', 'Compliance'],
  'cybersecurity analyst': ['Network Security', 'SIEM', 'Incident Response', 'Vulnerability Assessment', 'Penetration Testing', 'Firewalls', 'Encryption', 'Compliance (GDPR/HIPAA)', 'Risk Assessment', 'Threat Intelligence', 'SOC Operations', 'Malware Analysis', 'IDS/IPS', 'Security Auditing', 'Python', 'Linux', 'Cloud Security', 'Identity Management', 'Forensics', 'Security Frameworks'],
  'financial analyst': ['Financial Modeling', 'Excel', 'Valuation', 'Forecasting', 'Budgeting', 'P&L Analysis', 'SQL', 'Tableau', 'Bloomberg', 'Financial Reporting', 'Variance Analysis', 'DCF', 'PowerPoint', 'Risk Analysis', 'Data Analysis', 'Accounting Principles', 'Market Research', 'KPI Tracking', 'Strategic Planning', 'SAP'],
  'operations manager': ['Process Improvement', 'Supply Chain', 'Lean/Six Sigma', 'Budget Management', 'Team Leadership', 'Vendor Management', 'KPI Tracking', 'Resource Planning', 'Quality Control', 'Logistics', 'Inventory Management', 'ERP Systems', 'Compliance', 'Strategic Planning', 'Cross-functional Collaboration', 'Risk Management', 'Continuous Improvement', 'Scheduling', 'Cost Reduction', 'Performance Metrics'],
}


// ─── Data: Summary Templates ──────────────────────────────────────────────────
const SUMMARY_STYLES = {
  'Confident Leader': (title, skills, years) =>
    `Dynamic ${title} with ${years}+ years of proven leadership experience. Known for building high-performing teams and driving strategic initiatives that deliver measurable business impact. Expert in ${skills.slice(0, 3).join(', ')}, with a track record of exceeding organizational goals and inspiring cross-functional collaboration.`,
  'Technical Expert': (title, skills, years) =>
    `Highly skilled ${title} with ${years}+ years of deep technical expertise in ${skills.slice(0, 4).join(', ')}. Passionate about solving complex problems through innovative engineering solutions. Combines strong architectural thinking with hands-on implementation to deliver robust, scalable systems that drive business value.`,
  'Results-Driven': (title, skills, years) =>
    `Results-oriented ${title} with ${years}+ years of experience delivering quantifiable outcomes. Proven ability to optimize processes, reduce costs, and increase efficiency through strategic application of ${skills.slice(0, 3).join(', ')}. Consistently exceeds targets and transforms challenges into measurable achievements.`,
  'Creative Innovator': (title, skills, years) =>
    `Forward-thinking ${title} with ${years}+ years of experience pushing boundaries and reimagining possibilities. Combines creative problem-solving with expertise in ${skills.slice(0, 3).join(', ')} to develop innovative solutions. Thrives in fast-paced environments and passionate about turning visionary ideas into reality.`,
  'Customer-Focused': (title, skills, years) =>
    `Customer-centric ${title} with ${years}+ years dedicated to understanding and exceeding user expectations. Leverages expertise in ${skills.slice(0, 3).join(', ')} to create exceptional experiences that drive satisfaction and retention. Bridges the gap between technical capabilities and user needs with empathy and precision.`,
  'Growth-Oriented': (title, skills, years) =>
    `Ambitious ${title} with ${years}+ years of progressive experience driving growth and scaling operations. Combines strategic vision with hands-on expertise in ${skills.slice(0, 3).join(', ')} to identify opportunities and accelerate business expansion. Committed to continuous learning and delivering transformative results.`,
}


// ─── Utility Functions ────────────────────────────────────────────────────────
function getRandomVerb() {
  return ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)]
}

function getRandomVerbs(count) {
  const shuffled = [...ACTION_VERBS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function rewriteBullet(bullet) {
  if (!bullet || !bullet.trim()) return bullet
  let text = bullet.trim()
  // Remove leading dash/bullet
  text = text.replace(/^[-•*]\s*/, '')
  // Remove weak opening verbs
  const weakOpeners = /^(I\s+)?(did|made|got|helped|worked on|was responsible for|handled|managed|used|ran)\s+/i
  text = text.replace(weakOpeners, '')
  // Capitalize first letter
  text = text.charAt(0).toUpperCase() + text.slice(1)
  // Pick a strong verb
  const verb = getRandomVerb()
  // Add quantification hint
  const hasNumbers = /\d/.test(text)
  const quantifier = hasNumbers ? '' : ', resulting in [X]% improvement'
  return `${verb} ${text.charAt(0).toLowerCase() + text.slice(1)}${quantifier}`
}

function findMatchingSkills(jobTitle, existingSkills) {
  const normalizedTitle = (jobTitle || '').toLowerCase().trim()
  let matchedSkills = null
  // Try exact match first
  if (SKILLS_DATABASE[normalizedTitle]) {
    matchedSkills = SKILLS_DATABASE[normalizedTitle]
  } else {
    // Try partial match
    for (const [key, skills] of Object.entries(SKILLS_DATABASE)) {
      if (normalizedTitle.includes(key) || key.includes(normalizedTitle)) {
        matchedSkills = skills
        break
      }
    }
  }
  // Fallback: combine some general skills
  if (!matchedSkills) {
    matchedSkills = ['Communication', 'Problem Solving', 'Project Management', 'Data Analysis', 'Leadership', 'Strategic Planning', 'Team Collaboration', 'Critical Thinking', 'Time Management', 'Adaptability', 'Technical Writing', 'Presentation Skills', 'Stakeholder Management', 'Process Improvement', 'Decision Making']
  }
  const existingLower = existingSkills.map(s => s.toLowerCase().trim())
  return matchedSkills.map((skill, idx) => ({
    skill,
    alreadyAdded: existingLower.includes(skill.toLowerCase()),
    relevance: Math.max(60, 98 - idx * 2),
  }))
}


function generateAchievements(description) {
  const templates = [
    `Led a cross-functional team of [X] members, delivering [project/initiative] [X]% ahead of schedule and under budget`,
    `Increased [metric] by [X]% through strategic implementation of [approach], impacting [X]+ stakeholders`,
    `Reduced [process/cost] by [X]% by designing and executing [solution], saving $[X]K annually`,
  ]
  // Try to extract context from description
  const words = (description || '').toLowerCase()
  if (words.includes('team') || words.includes('manage') || words.includes('lead')) {
    return [
      `Led and mentored a team of [X] professionals, improving team productivity by [X]% and reducing turnover by [X]%`,
      `Spearheaded [project name] initiative with [X] team members, delivering results [X]% above target`,
      `Directed cross-functional collaboration across [X] departments, streamlining workflows and achieving [X]% efficiency gains`,
    ]
  }
  if (words.includes('develop') || words.includes('build') || words.includes('code') || words.includes('software')) {
    return [
      `Architected and deployed [system/feature] serving [X]+ users, reducing load time by [X]% and improving user satisfaction scores by [X]%`,
      `Engineered [X] key features that increased platform engagement by [X]%, contributing to $[X]K in additional revenue`,
      `Reduced technical debt by [X]% through systematic refactoring of [X] modules, decreasing bug reports by [X]%`,
    ]
  }
  if (words.includes('sale') || words.includes('revenue') || words.includes('client') || words.includes('customer')) {
    return [
      `Generated $[X]M in new revenue by acquiring [X]+ enterprise clients through strategic relationship building`,
      `Exceeded quarterly sales targets by [X]% for [X] consecutive quarters, ranking in the top [X]% of performers`,
      `Expanded client portfolio by [X]%, increasing customer lifetime value by $[X]K through upselling and retention strategies`,
    ]
  }
  if (words.includes('market') || words.includes('campaign') || words.includes('brand')) {
    return [
      `Launched [X] multi-channel campaigns generating [X]M+ impressions and [X]% conversion rate, exceeding ROI targets by [X]%`,
      `Grew organic traffic by [X]% and social media following by [X]K through data-driven content strategy`,
      `Increased brand awareness by [X]% and lead generation by [X]% through innovative marketing initiatives`,
    ]
  }
  return templates
}


function findWeakVerbs(text) {
  const found = []
  if (!text) return found
  WEAK_VERBS.forEach(verb => {
    const regex = new RegExp(`\\b${verb.replace(/\s+/g, '\\s+')}\\b`, 'gi')
    let match
    while ((match = regex.exec(text)) !== null) {
      found.push({
        verb: match[0],
        index: match.index,
        alternatives: WEAK_VERB_ALTERNATIVES[verb.toLowerCase()] || ['Executed', 'Delivered', 'Accomplished'],
      })
    }
  })
  return found
}

// ─── Tab: Rewrite Bullets ─────────────────────────────────────────────────────
function RewriteTab({ resumeData, onUpdateData }) {
  const [rewrites, setRewrites] = useState({})

  const bullets = []
  resumeData.experience.forEach((exp, expIdx) => {
    if (!exp.description) return
    const lines = exp.description.split('\n').filter(l => l.trim())
    lines.forEach((line, lineIdx) => {
      bullets.push({
        expIdx,
        lineIdx,
        text: line.replace(/^[-•*]\s*/, '').trim(),
        raw: line,
        company: exp.company,
        position: exp.position,
      })
    })
  })

  const handleRewrite = (key) => {
    const bullet = bullets.find((_, i) => i === key)
    if (!bullet) return
    const improved = rewriteBullet(bullet.text)
    setRewrites(prev => ({ ...prev, [key]: improved }))
  }

  const handleApply = (bulletIndex) => {
    const bullet = bullets[bulletIndex]
    const rewritten = rewrites[bulletIndex]
    if (!rewritten) return
    const newData = JSON.parse(JSON.stringify(resumeData))
    const exp = newData.experience[bullet.expIdx]
    const lines = exp.description.split('\n')
    let count = -1
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim()) {
        count++
        if (count === bullet.lineIdx) {
          lines[i] = `• ${rewritten}`
          break
        }
      }
    }
    exp.description = lines.join('\n')
    onUpdateData(newData)
    setRewrites(prev => {
      const copy = { ...prev }
      delete copy[bulletIndex]
      return copy
    })
  }

  if (bullets.length === 0) {
    return (
      <div className="text-center py-8">
        <FaMagic className="mx-auto text-3xl text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">Add experience descriptions to use AI Rewrite</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 mb-2">Click "Rewrite" to generate a stronger version of each bullet point.</p>
      {bullets.map((bullet, idx) => (
        <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {bullet.position} @ {bullet.company}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{bullet.text}</p>
          {rewrites[idx] ? (
            <div className="mt-2 space-y-2">
              <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-medium text-green-700 mb-1">✨ Improved:</p>
                <p className="text-sm text-green-800">{rewrites[idx]}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApply(idx)}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg active:bg-green-700"
                >
                  <FaCheck className="inline mr-1" /> Apply
                </button>
                <button
                  onClick={() => handleRewrite(idx)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 text-xs font-medium rounded-lg active:bg-gray-300"
                >
                  <FaRedo className="inline mr-1" /> Retry
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleRewrite(idx)}
              className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg active:bg-blue-700"
            >
              <FaMagic className="inline mr-1" /> Rewrite
            </button>
          )}
        </div>
      ))}
    </div>
  )
}


// ─── Tab: Skills Suggester ────────────────────────────────────────────────────
function SkillsTab({ resumeData, onUpdateData }) {
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const title = resumeData.personalInfo.title || ''
    const existing = resumeData.skills || []
    const matched = findMatchingSkills(title, existing)
    setSuggestions(matched)
  }, [resumeData.personalInfo.title, resumeData.skills])

  const handleAdd = (skill) => {
    const newData = JSON.parse(JSON.stringify(resumeData))
    newData.skills = [...newData.skills, skill]
    onUpdateData(newData)
  }

  const jobTitle = resumeData.personalInfo.title || 'your role'

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Skills suggested for <span className="font-semibold text-gray-700">{jobTitle}</span> based on industry standards.</p>
      {suggestions.length === 0 ? (
        <div className="text-center py-8">
          <FaLightbulb className="mx-auto text-3xl text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">Add a job title to get skill suggestions</p>
        </div>
      ) : (
        <div className="space-y-2">
          {suggestions.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.skill}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[80px]">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${item.relevance}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">{item.relevance}% match</span>
                </div>
              </div>
              {item.alreadyAdded ? (
                <span className="px-2.5 py-1 bg-gray-200 text-gray-500 text-[10px] font-medium rounded-full">Added</span>
              ) : (
                <button
                  onClick={() => handleAdd(item.skill)}
                  className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-semibold rounded-full active:bg-blue-700 flex items-center gap-1"
                >
                  <FaPlus size={8} /> Add
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


// ─── Tab: Achievement Generator ───────────────────────────────────────────────
function AchieveTab({ resumeData, onUpdateData }) {
  const [input, setInput] = useState('')
  const [achievements, setAchievements] = useState([])
  const [applied, setApplied] = useState(new Set())

  const handleGenerate = () => {
    if (!input.trim()) return
    const results = generateAchievements(input)
    setAchievements(results)
    setApplied(new Set())
  }

  const handleApply = (achievement, idx) => {
    // Add as a bullet to the most recent experience
    const newData = JSON.parse(JSON.stringify(resumeData))
    const lastExp = newData.experience.find(e => e.company)
    if (lastExp) {
      const sep = lastExp.description && lastExp.description.trim() ? '\n' : ''
      lastExp.description = (lastExp.description || '') + sep + `• ${achievement}`
      onUpdateData(newData)
      setApplied(prev => new Set([...prev, idx]))
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Describe what you did in plain language and get achievement-focused alternatives with metrics.</p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g., managed a team, built a website, increased sales..."
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm resize-none h-20 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      />
      <button
        onClick={handleGenerate}
        disabled={!input.trim()}
        className="w-full px-4 py-3 bg-purple-600 text-white text-sm font-semibold rounded-xl active:bg-purple-700 shadow-md disabled:opacity-40"
      >
        <FaTrophy className="inline mr-2" /> Generate Achievements
      </button>
      {achievements.length > 0 && (
        <div className="space-y-2 mt-3">
          <p className="text-xs font-semibold text-gray-600">Generated Achievements (fill in the [X] values):</p>
          {achievements.map((ach, idx) => (
            <div key={idx} className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <p className="text-sm text-purple-800 mb-2">{ach}</p>
              <button
                onClick={() => handleApply(ach, idx)}
                disabled={applied.has(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                  applied.has(idx)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-600 text-white active:bg-purple-700'
                }`}
              >
                {applied.has(idx) ? '✓ Applied' : 'Apply to Resume'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


// ─── Tab: Action Verb Booster ─────────────────────────────────────────────────
function VerbsTab({ resumeData, onUpdateData }) {
  const [weakVerbs, setWeakVerbs] = useState([])
  const [replaced, setReplaced] = useState(new Set())

  useEffect(() => {
    const allText = []
    resumeData.experience.forEach((exp, expIdx) => {
      if (exp.description) {
        allText.push({ text: exp.description, expIdx, source: `${exp.position || 'Experience'} @ ${exp.company || ''}` })
      }
    })
    if (resumeData.personalInfo.summary) {
      allText.push({ text: resumeData.personalInfo.summary, expIdx: -1, source: 'Summary' })
    }

    const found = []
    allText.forEach(({ text, expIdx, source }) => {
      const verbs = findWeakVerbs(text)
      verbs.forEach(v => {
        found.push({ ...v, expIdx, source, fullText: text })
      })
    })
    setWeakVerbs(found)
    setReplaced(new Set())
  }, [resumeData])

  const handleReplace = (verbIdx, alternative) => {
    const item = weakVerbs[verbIdx]
    if (!item) return
    const newData = JSON.parse(JSON.stringify(resumeData))

    if (item.expIdx === -1) {
      // Summary
      const regex = new RegExp(`\\b${item.verb.replace(/\s+/g, '\\s+')}\\b`, 'i')
      newData.personalInfo.summary = newData.personalInfo.summary.replace(regex, alternative)
    } else {
      // Experience
      const exp = newData.experience[item.expIdx]
      const regex = new RegExp(`\\b${item.verb.replace(/\s+/g, '\\s+')}\\b`, 'i')
      exp.description = exp.description.replace(regex, alternative)
    }

    onUpdateData(newData)
    setReplaced(prev => new Set([...prev, verbIdx]))
  }

  if (weakVerbs.length === 0) {
    return (
      <div className="text-center py-8">
        <FaBolt className="mx-auto text-3xl text-green-400 mb-3" />
        <p className="text-sm font-medium text-gray-700">No weak verbs found!</p>
        <p className="text-xs text-gray-500 mt-1">Your resume already uses strong action verbs.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Found <span className="font-semibold text-red-600">{weakVerbs.length}</span> weak verb{weakVerbs.length !== 1 ? 's' : ''} in your resume. Replace them with stronger alternatives:</p>
      {weakVerbs.map((item, idx) => (
        <div key={idx} className={`p-3 border rounded-xl ${replaced.has(idx) ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">
              "{item.verb}"
            </span>
            <span className="text-[10px] text-gray-400">in {item.source}</span>
            {replaced.has(idx) && <span className="text-[10px] text-green-600 font-medium ml-auto">✓ Replaced</span>}
          </div>
          {!replaced.has(idx) && (
            <div className="flex flex-wrap gap-1.5">
              {item.alternatives.map((alt, altIdx) => (
                <button
                  key={altIdx}
                  onClick={() => handleReplace(idx, alt)}
                  className="px-2.5 py-1.5 bg-white border border-gray-300 text-xs font-medium text-gray-700 rounded-lg active:bg-blue-50 active:border-blue-300 active:text-blue-700"
                >
                  {alt}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


// ─── Tab: Summary Styles ──────────────────────────────────────────────────────
function SummaryTab({ resumeData, onUpdateData }) {
  const [appliedStyle, setAppliedStyle] = useState(null)

  const title = resumeData.personalInfo.title || 'Professional'
  const skills = resumeData.skills.filter(s => s.trim())
  const years = Math.max(1, resumeData.experience.filter(e => e.company).length)

  const styles = Object.entries(SUMMARY_STYLES).map(([name, generator]) => ({
    name,
    text: generator(title, skills.length > 0 ? skills : ['problem-solving', 'communication', 'leadership'], years),
  }))

  const handleApply = (style) => {
    const newData = JSON.parse(JSON.stringify(resumeData))
    newData.personalInfo.summary = style.text
    onUpdateData(newData)
    setAppliedStyle(style.name)
    setTimeout(() => setAppliedStyle(null), 2000)
  }

  const styleIcons = {
    'Confident Leader': '👑',
    'Technical Expert': '🔧',
    'Results-Driven': '📈',
    'Creative Innovator': '💡',
    'Customer-Focused': '🤝',
    'Growth-Oriented': '🚀',
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Choose a summary style tailored to your profile as a <span className="font-semibold text-gray-700">{title}</span>.</p>
      {styles.map((style, idx) => (
        <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{styleIcons[style.name] || '✨'}</span>
            <span className="text-sm font-semibold text-gray-800">{style.name}</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-2">{style.text}</p>
          <button
            onClick={() => handleApply(style)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
              appliedStyle === style.name
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-600 text-white active:bg-blue-700'
            }`}
          >
            {appliedStyle === style.name ? '✓ Applied!' : 'Use This Style'}
          </button>
        </div>
      ))}
    </div>
  )
}


// ─── Main Component ───────────────────────────────────────────────────────────
const TABS = [
  { key: 'rewrite', label: 'Rewrite', icon: FaMagic },
  { key: 'skills', label: 'Skills', icon: FaLightbulb },
  { key: 'achieve', label: 'Achieve', icon: FaTrophy },
  { key: 'verbs', label: 'Verbs', icon: FaBolt },
  { key: 'summary', label: 'Summary', icon: FaUserTie },
]

export default function AIFeatures({ resumeData, onUpdateData, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('rewrite')
  const sheetRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const renderTab = () => {
    switch (activeTab) {
      case 'rewrite':
        return <RewriteTab resumeData={resumeData} onUpdateData={onUpdateData} />
      case 'skills':
        return <SkillsTab resumeData={resumeData} onUpdateData={onUpdateData} />
      case 'achieve':
        return <AchieveTab resumeData={resumeData} onUpdateData={onUpdateData} />
      case 'verbs':
        return <VerbsTab resumeData={resumeData} onUpdateData={onUpdateData} />
      case 'summary':
        return <SummaryTab resumeData={resumeData} onUpdateData={onUpdateData} />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-[9999]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-up pb-[env(safe-area-inset-bottom,0px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <FaMagic className="text-purple-600" />
            AI Tools
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-2 overflow-x-auto scrollbar-hide">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-0 flex flex-col items-center gap-1 py-3 px-2 text-[10px] font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-purple-600'
                    : 'text-gray-500 active:text-gray-700'
                }`}
              >
                <Icon size={16} />
                <span className="truncate">{tab.label}</span>
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-purple-600 rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-12">
          {renderTab()}
        </div>
      </div>
    </div>
  )
}
