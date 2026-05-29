import { useState } from 'react'
import {
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaExclamationTriangle,
  FaTimes,
  FaLightbulb,
  FaFileAlt,
  FaBolt,
  FaStar,
  FaBalanceScale,
} from 'react-icons/fa'
import { useTranslation } from '../TranslationContext'

function analyzeResume(data) {
  const { personalInfo, experience, education, skills, certifications, languages } = data

  // --- Completion Checks ---
  const checks = []
  if (personalInfo.fullName) checks.push({ label: 'Full name', done: true, section: 'contact' })
  else checks.push({ label: 'Full name', done: false, section: 'contact' })

  if (personalInfo.title) checks.push({ label: 'Professional title', done: true, section: 'contact' })
  else checks.push({ label: 'Professional title', done: false, section: 'contact' })

  if (personalInfo.email) checks.push({ label: 'Email address', done: true, section: 'contact' })
  else checks.push({ label: 'Email address', done: false, section: 'contact' })

  if (personalInfo.phone) checks.push({ label: 'Phone number', done: true, section: 'contact' })
  else checks.push({ label: 'Phone number', done: false, section: 'contact' })

  if (personalInfo.location) checks.push({ label: 'Location', done: true, section: 'contact' })
  else checks.push({ label: 'Location', done: false, section: 'contact' })

  if (personalInfo.linkedin) checks.push({ label: 'LinkedIn profile', done: true, section: 'contact' })
  else checks.push({ label: 'LinkedIn profile', done: false, section: 'contact' })

  if (personalInfo.website) checks.push({ label: 'Portfolio/Website', done: true, section: 'contact' })
  else checks.push({ label: 'Portfolio/Website', done: false, section: 'contact' })

  const hasSummary = personalInfo.summary && personalInfo.summary.length > 30
  checks.push({ label: hasSummary ? 'Professional summary' : 'Professional summary (min 30 chars)', done: hasSummary, section: 'summary' })

  const filledExp = experience.filter((e) => e.company && e.position)
  checks.push({ label: `Work experience (${filledExp.length} entries)`, done: filledExp.length > 0, section: 'experience' })

  const expWithDesc = filledExp.filter((e) => e.description && e.description.length > 20)
  checks.push({ label: 'Experience descriptions', done: expWithDesc.length === filledExp.length && filledExp.length > 0, section: 'experience' })

  const filledEdu = education.filter((e) => e.institution && e.degree)
  checks.push({ label: `Education (${filledEdu.length} entries)`, done: filledEdu.length > 0, section: 'education' })

  const filledSkills = skills.filter((s) => s.trim() !== '')
  checks.push({ label: `Skills (${filledSkills.length} listed)`, done: filledSkills.length >= 3, section: 'skills' })

  const filledCerts = certifications.filter((c) => c.name)
  checks.push({ label: 'Certifications', done: filledCerts.length > 0, section: 'certifications' })

  const filledLangs = languages.filter((l) => l.language)
  checks.push({ label: 'Languages', done: filledLangs.length > 0, section: 'languages' })

  const completed = checks.filter((c) => c.done).length
  const total = checks.length
  const percentage = Math.round((completed / total) * 100)

  // --- Word Count ---
  const allText = [
    personalInfo.fullName, personalInfo.title, personalInfo.summary,
    ...experience.map((e) => `${e.company} ${e.position} ${e.description}`),
    ...education.map((e) => `${e.institution} ${e.degree} ${e.field}`),
    ...skills,
    ...certifications.map((c) => c.name),
    ...languages.map((l) => l.language),
  ].join(' ')
  const wordCount = allText.split(/\s+/).filter((w) => w.length > 0).length

  // --- Impact Score (action verbs, numbers) ---
  const actionVerbs = ['led', 'managed', 'built', 'developed', 'improved', 'increased', 'reduced', 'created', 'designed', 'implemented', 'achieved', 'delivered', 'launched', 'optimized', 'streamlined', 'collaborated', 'mentored', 'architected', 'drove', 'generated']
  const descText = experience.map((e) => e.description || '').join(' ').toLowerCase()
  const actionVerbCount = actionVerbs.filter((v) => descText.includes(v)).length
  const numberCount = (descText.match(/\d+/g) || []).length
  const impactScore = Math.min(100, Math.round((actionVerbCount * 8 + numberCount * 12)))

  // --- Readability ---
  const sentences = descText.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const avgWordsPerSentence = sentences.length > 0
    ? Math.round(descText.split(/\s+/).length / sentences.length)
    : 0
  const readabilityScore = avgWordsPerSentence <= 20 ? 'Good' : avgWordsPerSentence <= 30 ? 'Fair' : 'Complex'

  // --- Section Scores ---
  const sectionScores = {
    contact: Math.round((checks.filter((c) => c.section === 'contact' && c.done).length / checks.filter((c) => c.section === 'contact').length) * 100),
    summary: hasSummary ? (personalInfo.summary.length >= 100 ? 100 : 60) : 0,
    experience: filledExp.length > 0 ? Math.round((expWithDesc.length / Math.max(filledExp.length, 1)) * 100) : 0,
    education: filledEdu.length > 0 ? 100 : 0,
    skills: Math.min(100, Math.round((filledSkills.length / 5) * 100)),
  }

  // --- Tips ---
  const tips = []
  if (!hasSummary) tips.push({ text: 'Add a professional summary (3-5 sentences)', priority: 'high' })
  if (filledSkills.length < 5) tips.push({ text: 'Add at least 5 skills for better ATS matching', priority: 'medium' })
  if (numberCount < 3) tips.push({ text: 'Add more metrics and numbers to quantify your impact', priority: 'high' })
  if (actionVerbCount < 3) tips.push({ text: 'Use more action verbs (led, built, improved, etc.)', priority: 'medium' })
  if (!personalInfo.linkedin) tips.push({ text: 'Add your LinkedIn URL — recruiters check it', priority: 'low' })
  if (wordCount < 200) tips.push({ text: 'Your resume is quite short — aim for 300-600 words', priority: 'medium' })
  if (wordCount > 800) tips.push({ text: 'Consider trimming — keep it under 700 words for one page', priority: 'low' })
  if (filledExp.length > 0 && expWithDesc.length < filledExp.length) tips.push({ text: 'Add descriptions to all work experience entries', priority: 'high' })

  return {
    checks, completed, total, percentage,
    wordCount, impactScore, readabilityScore, avgWordsPerSentence,
    sectionScores, tips, actionVerbCount, numberCount,
    filledExp, filledSkills, filledCerts, filledLangs,
  }
}

function ScoreRing({ score, size = 56, strokeWidth = 5, color }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>{score}%</span>
      </div>
    </div>
  )
}

function SectionBar({ label, score }) {
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444'
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-600 w-20 capitalize">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium w-8 text-right" style={{ color }}>{score}%</span>
    </div>
  )
}

export default function ResumeAnalytics({ data }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const analytics = analyzeResume(data)
  const { percentage, checks, completed, total, wordCount, impactScore, sectionScores, tips, actionVerbCount, numberCount, readabilityScore, avgWordsPerSentence, filledExp, filledSkills } = analytics

  const mainColor = percentage >= 80 ? '#22c55e' : percentage >= 50 ? '#eab308' : '#ef4444'
  const badgeClass = percentage >= 80 ? 'bg-green-100 text-green-700' : percentage >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <FaChartBar size={14} className="text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-gray-800">{t('analytics.title')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${badgeClass}`}>
            {percentage}% {t('analytics.complete')}
          </span>
          {expanded ? <FaChevronUp className="text-gray-400" size={12} /> : <FaChevronDown className="text-gray-400" size={12} />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-4 pt-2">
            {[
              { key: 'overview', label: t('analytics.overview') },
              { key: 'sections', label: t('analytics.sections') },
              { key: 'tips', label: t('analytics.tips') },
              { key: 'checklist', label: t('analytics.checklist') },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 text-xs font-medium capitalize border-b-2 transition-all -mb-px ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="px-4 py-4">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Score circles */}
                <div className="flex items-center justify-around">
                  <div className="flex flex-col items-center gap-1">
                    <ScoreRing score={percentage} color={mainColor} />
                    <span className="text-[10px] text-gray-500 font-medium">{t('analytics.completion')}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ScoreRing score={impactScore} color={impactScore >= 60 ? '#22c55e' : impactScore >= 30 ? '#eab308' : '#ef4444'} />
                    <span className="text-[10px] text-gray-500 font-medium">{t('analytics.impact')}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ScoreRing score={Math.min(100, Math.round((wordCount / 500) * 100))} color="#6366f1" />
                    <span className="text-[10px] text-gray-500 font-medium">{t('analytics.length')}</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center px-2 py-2.5 bg-gray-50 rounded-lg">
                    <p className="text-base font-bold text-gray-800">{wordCount}</p>
                    <p className="text-[10px] text-gray-500">{t('analytics.words')}</p>
                  </div>
                  <div className="text-center px-2 py-2.5 bg-gray-50 rounded-lg">
                    <p className="text-base font-bold text-gray-800">{actionVerbCount}</p>
                    <p className="text-[10px] text-gray-500">{t('analytics.actionVerbs')}</p>
                  </div>
                  <div className="text-center px-2 py-2.5 bg-gray-50 rounded-lg">
                    <p className="text-base font-bold text-gray-800">{numberCount}</p>
                    <p className="text-[10px] text-gray-500">{t('analytics.metrics')}</p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg">
                    <FaFileAlt size={12} className="text-indigo-500" />
                    <div>
                      <p className="text-xs font-semibold text-indigo-700">{readabilityScore}</p>
                      <p className="text-[10px] text-indigo-500">{t('analytics.readability')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg">
                    <FaStar size={12} className="text-amber-500" />
                    <div>
                      <p className="text-xs font-semibold text-amber-700">{filledSkills.length} {t('analytics.skills')}</p>
                      <p className="text-[10px] text-amber-500">{filledSkills.length >= 8 ? 'Excellent' : filledSkills.length >= 5 ? 'Good' : 'Add more'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                    <FaBolt size={12} className="text-blue-500" />
                    <div>
                      <p className="text-xs font-semibold text-blue-700">{filledExp.length} {t('analytics.roles')}</p>
                      <p className="text-[10px] text-blue-500">{filledExp.length >= 3 ? 'Strong' : 'Add more'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                    <FaBalanceScale size={12} className="text-green-500" />
                    <div>
                      <p className="text-xs font-semibold text-green-700">{avgWordsPerSentence} avg</p>
                      <p className="text-[10px] text-green-500">{t('analytics.wordsPerSentence')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTIONS TAB */}
            {activeTab === 'sections' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 mb-2">How well each section is filled out</p>
                <SectionBar label="Contact" score={sectionScores.contact} />
                <SectionBar label="Summary" score={sectionScores.summary} />
                <SectionBar label="Experience" score={sectionScores.experience} />
                <SectionBar label="Education" score={sectionScores.education} />
                <SectionBar label="Skills" score={sectionScores.skills} />
              </div>
            )}

            {/* TIPS TAB */}
            {activeTab === 'tips' && (
              <div className="space-y-2">
                {tips.length === 0 ? (
                  <div className="text-center py-6">
                    <FaCheck size={24} className="text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Looking great! No suggestions.</p>
                  </div>
                ) : (
                  tips.map((tip, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border ${
                        tip.priority === 'high'
                          ? 'bg-red-50 border-red-200'
                          : tip.priority === 'medium'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <FaLightbulb
                        size={12}
                        className={`mt-0.5 ${
                          tip.priority === 'high' ? 'text-red-400' : tip.priority === 'medium' ? 'text-yellow-500' : 'text-blue-400'
                        }`}
                      />
                      <div className="flex-1">
                        <span className="text-sm text-gray-700">{tip.text}</span>
                        <span className={`ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          tip.priority === 'high' ? 'bg-red-100 text-red-600' : tip.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {tip.priority}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* CHECKLIST TAB */}
            {activeTab === 'checklist' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">{completed} of {total} items</p>
                  <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: mainColor }} />
                  </div>
                </div>
                {checks.map((check, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      check.done ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    {check.done ? (
                      <FaCheck size={10} className="text-green-500 shrink-0" />
                    ) : (
                      <FaTimes size={10} className="text-red-400 shrink-0" />
                    )}
                    <span className={check.done ? 'text-green-700' : 'text-gray-600'}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
