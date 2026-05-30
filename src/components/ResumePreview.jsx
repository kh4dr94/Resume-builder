import { forwardRef } from 'react'
import { useTranslation } from '../TranslationContext'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa'

// ─── Shared Helpers ───────────────────────────────────────────────────────────

function ContactItem({ icon: Icon, value }) {
  if (!value) return null
  return (
    <span className="flex items-center gap-1">
      <Icon size={10} />
      {value}
    </span>
  )
}

function useResumeData(data) {
  const { personalInfo, experience, education, skills, certifications, languages } = data
  return {
    personalInfo,
    filledSkills: skills.filter((s) => s.trim() !== ''),
    filledExperience: experience.filter((exp) => exp.company || exp.position),
    filledEducation: education.filter((edu) => edu.institution || edu.degree),
    filledCertifications: certifications.filter((cert) => cert.name),
    filledLanguages: languages.filter((lang) => lang.language),
  }
}

function EmptyState({ t }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-lg font-medium mb-2">{t('preview.emptyTitle')}</p>
      <p className="text-sm">{t('preview.emptySubtitle')}</p>
    </div>
  )
}

function isEmpty(d) {
  return !d.personalInfo.fullName && !d.personalInfo.summary &&
    d.filledExperience.length === 0 && d.filledEducation.length === 0 && d.filledSkills.length === 0
}


// ─── Section Renderers (shared across layouts) ────────────────────────────────

function SectionHeading({ label, theme, variant }) {
  if (variant === 'tech') {
    return (
      <h2
        className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-2 pl-3"
        style={{ color: theme.accent, borderLeft: `4px solid ${theme.accent}` }}
      >
        {label}
      </h2>
    )
  }
  if (variant === 'minimal') {
    return (
      <h2
        className="text-[13px] font-semibold uppercase tracking-wider pb-1 mb-2"
        style={{ color: theme.textPrimary, borderBottom: 'none' }}
      >
        {label}
      </h2>
    )
  }
  return (
    <h2
      className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-2"
      style={{ color: theme.accent, borderBottom: `1px solid ${theme.sectionBorder}` }}
    >
      {label}
    </h2>
  )
}

function SummarySection({ personalInfo, theme, sectionLabels, variant }) {
  if (!personalInfo.summary) return null
  return (
    <div className="mb-5">
      <SectionHeading label={sectionLabels?.summary || 'Professional Summary'} theme={theme} variant={variant} />
      <p style={{ color: theme.textSecondary }} className="leading-[1.6]">{personalInfo.summary}</p>
    </div>
  )
}


function ExperienceSection({ filledExperience, theme, sectionLabels, variant }) {
  if (filledExperience.length === 0) return null
  return (
    <div className="mb-5">
      <SectionHeading label={sectionLabels?.experience || 'Professional Experience'} theme={theme} variant={variant} />
      <div className="space-y-4">
        {filledExperience.map((exp) => (
          <div key={exp.id}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-[12px]" style={{ color: theme.textPrimary }}>{exp.position}</h3>
                <p className="italic" style={{ color: theme.textSecondary }}>{exp.company}</p>
              </div>
              <span className="text-[10px] whitespace-nowrap ml-4" style={{ color: theme.textMuted }}>
                {exp.startDate}{(exp.endDate || exp.current) && ` — ${exp.current ? 'Present' : exp.endDate}`}
              </span>
            </div>
            {exp.description && (
              <div className="mt-1.5 whitespace-pre-line leading-[1.6]" style={{ color: theme.textSecondary }}>{exp.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function EducationSection({ filledEducation, theme, sectionLabels, variant }) {
  if (filledEducation.length === 0) return null
  return (
    <div className="mb-5">
      <SectionHeading label={sectionLabels?.education || 'Education'} theme={theme} variant={variant} />
      <div className="space-y-3">
        {filledEducation.map((edu) => (
          <div key={edu.id} className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-[12px]" style={{ color: theme.textPrimary }}>
                {edu.degree}{edu.field && ` in ${edu.field}`}
              </h3>
              <p className="italic" style={{ color: theme.textSecondary }}>{edu.institution}</p>
              {edu.gpa && <p className="text-[10px]" style={{ color: theme.textMuted }}>GPA: {edu.gpa}</p>}
            </div>
            <span className="text-[10px] whitespace-nowrap ml-4" style={{ color: theme.textMuted }}>
              {edu.startDate}{edu.endDate && ` — ${edu.endDate}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}


function SkillsSection({ filledSkills, theme, sectionLabels, variant }) {
  if (filledSkills.length === 0) return null
  const tagStyle = variant === 'tech'
    ? { backgroundColor: theme.skillBg, border: `1px solid ${theme.skillBorder}`, color: theme.accent, fontFamily: "'JetBrains Mono', monospace" }
    : variant === 'dark'
    ? { backgroundColor: theme.skillBg, border: `1px solid ${theme.skillBorder}`, color: theme.textSecondary }
    : { backgroundColor: theme.skillBg, border: `1px solid ${theme.skillBorder}`, color: theme.textSecondary }
  return (
    <div className="mb-5">
      <SectionHeading label={sectionLabels?.skills || 'Skills'} theme={theme} variant={variant} />
      <div className="flex flex-wrap gap-2 mt-1">
        {filledSkills.map((skill, i) => (
          <span key={i} className="px-2.5 py-1 rounded text-[10px]" style={tagStyle}>{skill}</span>
        ))}
      </div>
    </div>
  )
}

function CertificationsSection({ filledCertifications, theme, sectionLabels, variant }) {
  if (filledCertifications.length === 0) return null
  return (
    <div className="mb-5">
      <SectionHeading label={sectionLabels?.certifications || 'Certifications'} theme={theme} variant={variant} />
      <div className="space-y-2">
        {filledCertifications.map((cert) => (
          <div key={cert.id} className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-[11px]" style={{ color: theme.textPrimary }}>{cert.name}</h3>
              {cert.issuer && <p className="text-[10px]" style={{ color: theme.textSecondary }}>{cert.issuer}</p>}
            </div>
            {cert.date && <span className="text-[10px] ml-4" style={{ color: theme.textMuted }}>{cert.date}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function LanguagesSection({ filledLanguages, theme, sectionLabels, variant }) {
  if (filledLanguages.length === 0) return null
  return (
    <div className="mb-5">
      <SectionHeading label={sectionLabels?.languages || 'Languages'} theme={theme} variant={variant} />
      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
        {filledLanguages.map((lang) => (
          <span key={lang.id} style={{ color: theme.textSecondary }}>
            <span className="font-medium">{lang.language}</span>
            {lang.proficiency && <span style={{ color: theme.textMuted }}> — {lang.proficiency}</span>}
          </span>
        ))}
      </div>
    </div>
  )
}


// ─── Section Dispatcher ───────────────────────────────────────────────────────

function RenderSection({ sectionId, d, theme, sectionLabels, variant }) {
  const props = { theme, sectionLabels, variant }
  switch (sectionId) {
    case 'summary': return <SummarySection personalInfo={d.personalInfo} {...props} />
    case 'experience': return <ExperienceSection filledExperience={d.filledExperience} {...props} />
    case 'education': return <EducationSection filledEducation={d.filledEducation} {...props} />
    case 'skills': return <SkillsSection filledSkills={d.filledSkills} {...props} />
    case 'certifications': return <CertificationsSection filledCertifications={d.filledCertifications} {...props} />
    case 'languages': return <LanguagesSection filledLanguages={d.filledLanguages} {...props} />
    default: return null
  }
}

// ─── Layout: Single Column (modern, classic, elegant, academic) ───────────────

const SingleColumnLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div
    ref={ref}
    className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto"
    style={{ padding: '40px 48px', minHeight: '297mm', color: theme.textPrimary, fontFamily: theme.fontFamily, backgroundColor: '#ffffff' }}
  >
    {/* Header */}
    <div className="text-center mb-6 pb-4" style={{ borderBottom: `2px solid ${theme.sectionBorder}` }}>
      <h1 className="text-[28px] font-bold tracking-wide uppercase mb-1" style={{ color: theme.primary }}>{d.personalInfo.fullName || 'Your Name'}</h1>
      {d.personalInfo.title && <p className="text-[14px] font-medium tracking-wider uppercase mb-3" style={{ color: theme.textSecondary }}>{d.personalInfo.title}</p>}
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[10px]" style={{ color: theme.textMuted }}>
        <ContactItem icon={FaEnvelope} value={d.personalInfo.email} />
        <ContactItem icon={FaPhone} value={d.personalInfo.phone} />
        <ContactItem icon={FaMapMarkerAlt} value={d.personalInfo.location} />
        <ContactItem icon={FaLinkedin} value={d.personalInfo.linkedin} />
        <ContactItem icon={FaGlobe} value={d.personalInfo.website} />
      </div>
    </div>
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
  </div>
))
SingleColumnLayout.displayName = 'SingleColumnLayout'


// ─── Layout: Two Column Sidebar (creative, bold, infographic) ─────────────────

const TwoColumnLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => {
  const sidebarSections = ['skills', 'languages', 'certifications']
  const mainSections = sectionOrder.filter((id) => !sidebarSections.includes(id))
  const sideOrderedSections = sectionOrder.filter((id) => sidebarSections.includes(id))

  return (
    <div
      ref={ref}
      className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto"
      style={{ minHeight: '297mm', fontFamily: theme.fontFamily, display: 'flex' }}
    >
      {/* Sidebar */}
      <div className="flex-shrink-0" style={{ width: '35%', backgroundColor: theme.headerBg, color: theme.headerText, padding: '36px 24px' }}>
        <h1 className="text-[22px] font-bold tracking-wide mb-1" style={{ color: theme.headerText }}>{d.personalInfo.fullName || 'Your Name'}</h1>
        {d.personalInfo.title && <p className="text-[12px] font-medium tracking-wider uppercase mb-4 opacity-90">{d.personalInfo.title}</p>}
        {/* Contact */}
        <div className="space-y-2 text-[10px] mb-6 opacity-90">
          {d.personalInfo.email && <div className="flex items-center gap-2"><FaEnvelope size={10} />{d.personalInfo.email}</div>}
          {d.personalInfo.phone && <div className="flex items-center gap-2"><FaPhone size={10} />{d.personalInfo.phone}</div>}
          {d.personalInfo.location && <div className="flex items-center gap-2"><FaMapMarkerAlt size={10} />{d.personalInfo.location}</div>}
          {d.personalInfo.linkedin && <div className="flex items-center gap-2"><FaLinkedin size={10} />{d.personalInfo.linkedin}</div>}
          {d.personalInfo.website && <div className="flex items-center gap-2"><FaGlobe size={10} />{d.personalInfo.website}</div>}
        </div>
        {/* Sidebar sections */}
        {sideOrderedSections.map((id) => (
          <div key={id} className="mb-5">
            <h2 className="text-[12px] font-bold uppercase tracking-wider pb-1 mb-2" style={{ borderBottom: `1px solid rgba(255,255,255,0.25)`, color: theme.headerText }}>
              {sectionLabels?.[id] || id}
            </h2>
            {id === 'skills' && d.filledSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">{d.filledSkills.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[9px]" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: theme.headerText }}>{s}</span>
              ))}</div>
            )}
            {id === 'languages' && d.filledLanguages.length > 0 && (
              <div className="space-y-1">{d.filledLanguages.map((l) => (
                <div key={l.id} className="text-[10px]"><span className="font-medium">{l.language}</span>{l.proficiency && <span className="opacity-75"> — {l.proficiency}</span>}</div>
              ))}</div>
            )}
            {id === 'certifications' && d.filledCertifications.length > 0 && (
              <div className="space-y-1.5">{d.filledCertifications.map((c) => (
                <div key={c.id} className="text-[10px]"><span className="font-medium">{c.name}</span>{c.issuer && <span className="opacity-75 block">{c.issuer}</span>}</div>
              ))}</div>
            )}
          </div>
        ))}
      </div>
      {/* Main content */}
      <div style={{ width: '65%', padding: '36px 32px', color: theme.textPrimary, backgroundColor: '#ffffff' }}>
        {isEmpty(d) ? <EmptyState t={t} /> : mainSections.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
      </div>
    </div>
  )
})
TwoColumnLayout.displayName = 'TwoColumnLayout'


// ─── Layout: Banner Header (executive, professional) ──────────────────────────

const BannerLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div
    ref={ref}
    className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto"
    style={{ minHeight: '297mm', fontFamily: theme.fontFamily, backgroundColor: '#ffffff', color: theme.textPrimary }}
  >
    {/* Banner */}
    <div style={{ backgroundColor: theme.headerBg, padding: '36px 48px', color: theme.headerText }}>
      <h1 className="text-[28px] font-bold tracking-wide uppercase mb-1" style={{ color: theme.headerText }}>{d.personalInfo.fullName || 'Your Name'}</h1>
      {d.personalInfo.title && <p className="text-[14px] font-medium tracking-wider uppercase opacity-90">{d.personalInfo.title}</p>}
    </div>
    {/* Contact bar */}
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px] px-12 py-3" style={{ color: theme.textMuted, borderBottom: `1px solid ${theme.sectionBorder}` }}>
      <ContactItem icon={FaEnvelope} value={d.personalInfo.email} />
      <ContactItem icon={FaPhone} value={d.personalInfo.phone} />
      <ContactItem icon={FaMapMarkerAlt} value={d.personalInfo.location} />
      <ContactItem icon={FaLinkedin} value={d.personalInfo.linkedin} />
      <ContactItem icon={FaGlobe} value={d.personalInfo.website} />
    </div>
    {/* Sections */}
    <div style={{ padding: '28px 48px' }}>
      {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
    </div>
  </div>
))
BannerLayout.displayName = 'BannerLayout'


// ─── Layout: Minimal Clean (minimal) ─────────────────────────────────────────

const MinimalLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div
    ref={ref}
    className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto"
    style={{ padding: '56px 56px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#ffffff' }}
  >
    {/* Header — left-aligned, large */}
    <div className="mb-6">
      <h1 className="text-[36px] font-light tracking-tight mb-0.5" style={{ color: theme.textPrimary }}>{d.personalInfo.fullName || 'Your Name'}</h1>
      {d.personalInfo.title && <p className="text-[14px] font-normal tracking-wide mb-3" style={{ color: theme.textMuted }}>{d.personalInfo.title}</p>}
      <div style={{ borderBottom: `1px solid ${theme.sectionBorder}`, marginBottom: '16px' }} />
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px]" style={{ color: theme.textMuted }}>
        <ContactItem icon={FaEnvelope} value={d.personalInfo.email} />
        <ContactItem icon={FaPhone} value={d.personalInfo.phone} />
        <ContactItem icon={FaMapMarkerAlt} value={d.personalInfo.location} />
        <ContactItem icon={FaLinkedin} value={d.personalInfo.linkedin} />
        <ContactItem icon={FaGlobe} value={d.personalInfo.website} />
      </div>
    </div>
    {/* Sections */}
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} variant="minimal" />)}
  </div>
))
MinimalLayout.displayName = 'MinimalLayout'


// ─── Layout: Tech Style (tech) ────────────────────────────────────────────────

const TechLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div
    ref={ref}
    className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto"
    style={{ padding: '40px 48px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#ffffff' }}
  >
    {/* Header — monospace-inspired */}
    <div className="mb-6 pb-4" style={{ borderBottom: `2px solid ${theme.accent}` }}>
      <h1 className="text-[26px] font-bold tracking-tight mb-1" style={{ color: theme.primary, fontFamily: "'JetBrains Mono', monospace" }}>
        {'> '}{d.personalInfo.fullName || 'Your Name'}
      </h1>
      {d.personalInfo.title && <p className="text-[13px] font-medium tracking-wide mb-3" style={{ color: theme.textSecondary, fontFamily: "'JetBrains Mono', monospace" }}>{d.personalInfo.title}</p>}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px]" style={{ color: theme.textMuted }}>
        <ContactItem icon={FaEnvelope} value={d.personalInfo.email} />
        <ContactItem icon={FaPhone} value={d.personalInfo.phone} />
        <ContactItem icon={FaMapMarkerAlt} value={d.personalInfo.location} />
        <ContactItem icon={FaLinkedin} value={d.personalInfo.linkedin} />
        <ContactItem icon={FaGlobe} value={d.personalInfo.website} />
      </div>
    </div>
    {/* Sections with left-border accent */}
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} variant="tech" />)}
  </div>
))
TechLayout.displayName = 'TechLayout'


// ─── Layout: Dark Mode (darkmode) ─────────────────────────────────────────────

const DarkLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div
    ref={ref}
    className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto"
    style={{ padding: '40px 48px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: theme.bgColor || '#111827' }}
  >
    {/* Header */}
    <div className="text-center mb-6 pb-4" style={{ borderBottom: `1px solid ${theme.sectionBorder}` }}>
      <h1 className="text-[28px] font-bold tracking-wide uppercase mb-1" style={{ color: theme.accent }}>{d.personalInfo.fullName || 'Your Name'}</h1>
      {d.personalInfo.title && <p className="text-[14px] font-medium tracking-wider uppercase mb-3" style={{ color: theme.textSecondary }}>{d.personalInfo.title}</p>}
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[10px]" style={{ color: theme.textMuted }}>
        <ContactItem icon={FaEnvelope} value={d.personalInfo.email} />
        <ContactItem icon={FaPhone} value={d.personalInfo.phone} />
        <ContactItem icon={FaMapMarkerAlt} value={d.personalInfo.location} />
        <ContactItem icon={FaLinkedin} value={d.personalInfo.linkedin} />
        <ContactItem icon={FaGlobe} value={d.personalInfo.website} />
      </div>
    </div>
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} variant="dark" />)}
  </div>
))
DarkLayout.displayName = 'DarkLayout'


// ─── Main Component ───────────────────────────────────────────────────────────

const ResumePreview = forwardRef(({ data, theme, sectionOrder, sectionLabels }, ref) => {
  const { t } = useTranslation()
  const d = useResumeData(data)
  const templateId = theme.id || 'classic'
  const commonProps = { d, theme, sectionOrder, sectionLabels, t }

  if (['creative', 'bold', 'infographic'].includes(templateId)) {
    return <TwoColumnLayout ref={ref} {...commonProps} />
  }
  if (['executive', 'professional'].includes(templateId)) {
    return <BannerLayout ref={ref} {...commonProps} />
  }
  if (templateId === 'tech') {
    return <TechLayout ref={ref} {...commonProps} />
  }
  if (templateId === 'darkmode') {
    return <DarkLayout ref={ref} {...commonProps} />
  }
  if (templateId === 'minimal') {
    return <MinimalLayout ref={ref} {...commonProps} />
  }
  // Default: single column (modern, classic, elegant, academic)
  return <SingleColumnLayout ref={ref} {...commonProps} />
})

ResumePreview.displayName = 'ResumePreview'

export default ResumePreview
