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


function ContactRow({ personalInfo, theme }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px]" style={{ color: theme.textMuted }}>
      <ContactItem icon={FaEnvelope} value={personalInfo.email} />
      <ContactItem icon={FaPhone} value={personalInfo.phone} />
      <ContactItem icon={FaMapMarkerAlt} value={personalInfo.location} />
      <ContactItem icon={FaLinkedin} value={personalInfo.linkedin} />
      <ContactItem icon={FaGlobe} value={personalInfo.website} />
    </div>
  )
}

function ContactColumn({ personalInfo, theme }) {
  return (
    <div className="space-y-2 text-[10px]" style={{ color: theme.headerText || theme.textMuted }}>
      {personalInfo.email && <div className="flex items-center gap-2"><FaEnvelope size={10} />{personalInfo.email}</div>}
      {personalInfo.phone && <div className="flex items-center gap-2"><FaPhone size={10} />{personalInfo.phone}</div>}
      {personalInfo.location && <div className="flex items-center gap-2"><FaMapMarkerAlt size={10} />{personalInfo.location}</div>}
      {personalInfo.linkedin && <div className="flex items-center gap-2"><FaLinkedin size={10} />{personalInfo.linkedin}</div>}
      {personalInfo.website && <div className="flex items-center gap-2"><FaGlobe size={10} />{personalInfo.website}</div>}
    </div>
  )
}


// ─── Section Renderers ────────────────────────────────────────────────────────

function SectionHeading({ label, theme, variant }) {
  if (variant === 'tech') {
    return <h2 className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-2 pl-3" style={{ color: theme.accent, borderLeft: `4px solid ${theme.accent}` }}>{label}</h2>
  }
  if (variant === 'minimal') {
    return <h2 className="text-[13px] font-semibold uppercase tracking-wider pb-1 mb-2" style={{ color: theme.textPrimary }}>{label}</h2>
  }
  if (variant === 'ribbon') {
    return (
      <div className="mb-2 -ml-4 flex items-center">
        <div className="px-4 py-1 text-[12px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: theme.accent, borderRadius: '0 4px 4px 0' }}>{label}</div>
      </div>
    )
  }
  if (variant === 'metro') {
    return <h2 className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-2 px-3 py-1 rounded" style={{ color: theme.accent, backgroundColor: theme.skillBg, border: `1px solid ${theme.sectionBorder}` }}>{label}</h2>
  }
  if (variant === 'academic') {
    return <h2 className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-2" style={{ color: theme.accent, borderBottom: `2px solid ${theme.accent}` }}>{label}</h2>
  }
  return <h2 className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-2" style={{ color: theme.accent, borderBottom: `1px solid ${theme.sectionBorder}` }}>{label}</h2>
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
            {exp.description && <div className="mt-1.5 whitespace-pre-line leading-[1.6]" style={{ color: theme.textSecondary }}>{exp.description}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}


function TimelineExperienceSection({ filledExperience, theme, sectionLabels, variant }) {
  if (filledExperience.length === 0) return null
  return (
    <div className="mb-5">
      <SectionHeading label={sectionLabels?.experience || 'Professional Experience'} theme={theme} variant={variant} />
      <div className="relative pl-6">
        <div className="absolute left-2 top-1 bottom-1 w-0.5" style={{ backgroundColor: theme.accent }} />
        <div className="space-y-4">
          {filledExperience.map((exp) => (
            <div key={exp.id} className="relative">
              <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: '#fff', borderColor: theme.accent }} />
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[12px]" style={{ color: theme.textPrimary }}>{exp.position}</h3>
                  <p className="italic" style={{ color: theme.textSecondary }}>{exp.company}</p>
                </div>
                <span className="text-[10px] whitespace-nowrap ml-4" style={{ color: theme.textMuted }}>
                  {exp.startDate}{(exp.endDate || exp.current) && ` — ${exp.current ? 'Present' : exp.endDate}`}
                </span>
              </div>
              {exp.description && <div className="mt-1.5 whitespace-pre-line leading-[1.6]" style={{ color: theme.textSecondary }}>{exp.description}</div>}
            </div>
          ))}
        </div>
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
              <h3 className="font-bold text-[12px]" style={{ color: theme.textPrimary }}>{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
              <p className="italic" style={{ color: theme.textSecondary }}>{edu.institution}</p>
              {edu.gpa && <p className="text-[10px]" style={{ color: theme.textMuted }}>GPA: {edu.gpa}</p>}
            </div>
            <span className="text-[10px] whitespace-nowrap ml-4" style={{ color: theme.textMuted }}>{edu.startDate}{edu.endDate && ` — ${edu.endDate}`}</span>
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
    : { backgroundColor: theme.skillBg, border: `1px solid ${theme.skillBorder}`, color: theme.textSecondary }
  return (
    <div className="mb-5">
      <SectionHeading label={sectionLabels?.skills || 'Skills'} theme={theme} variant={variant} />
      <div className="flex flex-wrap gap-2 mt-1">
        {filledSkills.map((skill, i) => <span key={i} className="px-2.5 py-1 rounded text-[10px]" style={tagStyle}>{skill}</span>)}
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
    case 'experience':
      if (variant === 'timeline') return <TimelineExperienceSection filledExperience={d.filledExperience} {...props} />
      return <ExperienceSection filledExperience={d.filledExperience} {...props} />
    case 'education': return <EducationSection filledEducation={d.filledEducation} {...props} />
    case 'skills': return <SkillsSection filledSkills={d.filledSkills} {...props} />
    case 'certifications': return <CertificationsSection filledCertifications={d.filledCertifications} {...props} />
    case 'languages': return <LanguagesSection filledLanguages={d.filledLanguages} {...props} />
    default: return null
  }
}

// Helper: Sidebar content for two-column layouts
function SidebarSections({ d, sectionOrder, sectionLabels, theme }) {
  const sidebarSections = ['skills', 'languages', 'certifications']
  const ordered = sectionOrder.filter((id) => sidebarSections.includes(id))
  return ordered.map((id) => (
    <div key={id} className="mb-5">
      <h2 className="text-[12px] font-bold uppercase tracking-wider pb-1 mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.25)', color: theme.headerText }}>{sectionLabels?.[id] || id}</h2>
      {id === 'skills' && d.filledSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">{d.filledSkills.map((s, i) => <span key={i} className="px-2 py-0.5 rounded text-[9px]" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: theme.headerText }}>{s}</span>)}</div>
      )}
      {id === 'languages' && d.filledLanguages.length > 0 && (
        <div className="space-y-1">{d.filledLanguages.map((l) => <div key={l.id} className="text-[10px]"><span className="font-medium">{l.language}</span>{l.proficiency && <span className="opacity-75"> — {l.proficiency}</span>}</div>)}</div>
      )}
      {id === 'certifications' && d.filledCertifications.length > 0 && (
        <div className="space-y-1.5">{d.filledCertifications.map((c) => <div key={c.id} className="text-[10px]"><span className="font-medium">{c.name}</span>{c.issuer && <span className="opacity-75 block">{c.issuer}</span>}</div>)}</div>
      )}
    </div>
  ))
}


// ─── Layout 1: Modern (single column, centered header) ───────────────────────

const ModernLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ padding: '40px 48px', minHeight: '297mm', color: theme.textPrimary, fontFamily: theme.fontFamily, backgroundColor: '#ffffff' }}>
    <div className="text-center mb-6 pb-4" style={{ borderBottom: `2px solid ${theme.sectionBorder}` }}>
      <div className="flex items-center justify-center gap-4">
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
        <div>
          <h1 className="text-[28px] font-bold tracking-wide uppercase mb-1" style={{ color: theme.primary }}>{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[14px] font-medium tracking-wider uppercase mb-3" style={{ color: theme.textSecondary }}>{d.personalInfo.title}</p>}
        </div>
      </div>
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
ModernLayout.displayName = 'ModernLayout'


// ─── Layout 2: Classic (single column, serif, traditional) ────────────────────

const ClassicLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ padding: '40px 48px', minHeight: '297mm', color: theme.textPrimary, fontFamily: theme.fontFamily, backgroundColor: '#ffffff' }}>
    <div className="text-center mb-6 pb-4" style={{ borderBottom: `3px double ${theme.sectionBorder}` }}>
      <div className="flex items-center justify-center gap-4">
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
        <div>
          <h1 className="text-[26px] font-bold tracking-wide mb-1" style={{ color: theme.primary, fontFamily: theme.fontFamily }}>{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[13px] italic mb-3" style={{ color: theme.textSecondary }}>{d.personalInfo.title}</p>}
        </div>
      </div>
      <ContactRow personalInfo={d.personalInfo} theme={theme} />
    </div>
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
  </div>
))
ClassicLayout.displayName = 'ClassicLayout'


// ─── Layout 3: Creative (left sidebar 35/65) ─────────────────────────────────

const CreativeLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => {
  const sidebarIds = ['skills', 'languages', 'certifications']
  const mainSections = sectionOrder.filter((id) => !sidebarIds.includes(id))
  return (
    <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ minHeight: '297mm', fontFamily: theme.fontFamily, display: 'flex' }}>
      <div className="flex-shrink-0" style={{ width: '35%', backgroundColor: theme.headerBg, color: theme.headerText, padding: '36px 24px' }}>
        {d.personalInfo.profileImage && <div className="flex justify-center mb-4"><img src={d.personalInfo.profileImage} alt="" className="w-[60px] h-[60px] rounded-full object-cover border-2 border-white/30" /></div>}
        <h1 className="text-[22px] font-bold tracking-wide mb-1" style={{ color: theme.headerText }}>{d.personalInfo.fullName || 'Your Name'}</h1>
        {d.personalInfo.title && <p className="text-[12px] font-medium tracking-wider uppercase mb-4 opacity-90">{d.personalInfo.title}</p>}
        <div className="mb-6 opacity-90"><ContactColumn personalInfo={d.personalInfo} theme={theme} /></div>
        <SidebarSections d={d} sectionOrder={sectionOrder} sectionLabels={sectionLabels} theme={theme} />
      </div>
      <div style={{ width: '65%', padding: '36px 32px', color: theme.textPrimary, backgroundColor: '#ffffff' }}>
        {isEmpty(d) ? <EmptyState t={t} /> : mainSections.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
      </div>
    </div>
  )
})
CreativeLayout.displayName = 'CreativeLayout'


// ─── Layout 4: Minimal (ultra-clean, left-aligned, whitespace) ────────────────

const MinimalLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ padding: '56px 56px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#ffffff' }}>
    <div className="mb-8">
      <div className="flex items-center gap-4">
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
        <div>
          <h1 className="text-[36px] font-light tracking-tight mb-0.5" style={{ color: theme.textPrimary }}>{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[14px] font-normal tracking-wide mb-4" style={{ color: theme.textMuted }}>{d.personalInfo.title}</p>}
        </div>
      </div>
      <ContactRow personalInfo={d.personalInfo} theme={theme} />
    </div>
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} variant="minimal" />)}
  </div>
))
MinimalLayout.displayName = 'MinimalLayout'


// ─── Layout 5: Executive (dark banner, gold accents) ──────────────────────────

const ExecutiveLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ minHeight: '297mm', fontFamily: theme.fontFamily, backgroundColor: '#ffffff', color: theme.textPrimary }}>
    <div style={{ backgroundColor: theme.headerBg, padding: '36px 48px', color: theme.headerText }}>
      <div className="flex items-center gap-4">
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white/30" />}
        <div>
          <h1 className="text-[28px] font-bold tracking-wide uppercase mb-1" style={{ color: theme.headerText }}>{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[14px] font-medium tracking-wider uppercase opacity-90">{d.personalInfo.title}</p>}
        </div>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px] px-12 py-3" style={{ color: theme.textMuted, borderBottom: `2px solid ${theme.accent}` }}>
      <ContactItem icon={FaEnvelope} value={d.personalInfo.email} />
      <ContactItem icon={FaPhone} value={d.personalInfo.phone} />
      <ContactItem icon={FaMapMarkerAlt} value={d.personalInfo.location} />
      <ContactItem icon={FaLinkedin} value={d.personalInfo.linkedin} />
      <ContactItem icon={FaGlobe} value={d.personalInfo.website} />
    </div>
    <div style={{ padding: '28px 48px' }}>
      {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
    </div>
  </div>
))
ExecutiveLayout.displayName = 'ExecutiveLayout'


// ─── Layout 6: Professional (banner header, two-tone) ─────────────────────────

const ProfessionalLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ minHeight: '297mm', fontFamily: theme.fontFamily, backgroundColor: '#ffffff', color: theme.textPrimary }}>
    <div style={{ backgroundColor: theme.headerBg, padding: '28px 48px', color: theme.headerText }}>
      <div className="flex items-center gap-4">
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white/30" />}
        <div>
          <h1 className="text-[26px] font-bold tracking-wide mb-1" style={{ color: theme.headerText }}>{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[13px] font-medium tracking-wide opacity-90 mb-2">{d.personalInfo.title}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] opacity-80 mt-2">
        <ContactItem icon={FaEnvelope} value={d.personalInfo.email} />
        <ContactItem icon={FaPhone} value={d.personalInfo.phone} />
        <ContactItem icon={FaMapMarkerAlt} value={d.personalInfo.location} />
        <ContactItem icon={FaLinkedin} value={d.personalInfo.linkedin} />
        <ContactItem icon={FaGlobe} value={d.personalInfo.website} />
      </div>
    </div>
    <div style={{ padding: '28px 48px' }}>
      {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
    </div>
  </div>
))
ProfessionalLayout.displayName = 'ProfessionalLayout'


// ─── Layout 7: Elegant (centered script-style, decorative dividers) ───────────

const ElegantLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ padding: '48px 48px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#ffffff' }}>
    <div className="text-center mb-8">
      {d.personalInfo.profileImage && <div className="flex justify-center mb-3"><img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" /></div>}
      <h1 className="text-[32px] font-bold italic mb-1" style={{ color: theme.accent, fontFamily: "'Playfair Display', serif" }}>{d.personalInfo.fullName || 'Your Name'}</h1>
      {d.personalInfo.title && <p className="text-[13px] tracking-widest uppercase mb-3" style={{ color: theme.textSecondary }}>{d.personalInfo.title}</p>}
      <div className="flex justify-center items-center gap-2 mb-3">
        <div style={{ width: '60px', height: '1px', backgroundColor: theme.accent }} />
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.accent }} />
        <div style={{ width: '60px', height: '1px', backgroundColor: theme.accent }} />
      </div>
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
ElegantLayout.displayName = 'ElegantLayout'


// ─── Layout 8: Bold (dark left sidebar, bright accent) ────────────────────────

const BoldLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => {
  const sidebarIds = ['skills', 'languages', 'certifications']
  const mainSections = sectionOrder.filter((id) => !sidebarIds.includes(id))
  return (
    <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ minHeight: '297mm', fontFamily: theme.fontFamily, display: 'flex' }}>
      <div className="flex-shrink-0" style={{ width: '35%', backgroundColor: theme.headerBg, color: theme.headerText, padding: '36px 24px' }}>
        {d.personalInfo.profileImage && <div className="flex justify-center mb-4"><img src={d.personalInfo.profileImage} alt="" className="w-[60px] h-[60px] rounded-full object-cover border-2 border-white/30" /></div>}
        <h1 className="text-[22px] font-bold tracking-wide mb-1" style={{ color: theme.accent }}>{d.personalInfo.fullName || 'Your Name'}</h1>
        {d.personalInfo.title && <p className="text-[12px] font-medium tracking-wider uppercase mb-4 opacity-90">{d.personalInfo.title}</p>}
        <div className="mb-6 opacity-90"><ContactColumn personalInfo={d.personalInfo} theme={theme} /></div>
        <SidebarSections d={d} sectionOrder={sectionOrder} sectionLabels={sectionLabels} theme={theme} />
      </div>
      <div style={{ width: '65%', padding: '36px 32px', color: theme.textPrimary, backgroundColor: '#ffffff' }}>
        {isEmpty(d) ? <EmptyState t={t} /> : mainSections.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
      </div>
    </div>
  )
})
BoldLayout.displayName = 'BoldLayout'


// ─── Layout 9: Tech (monospace, left-border accents, terminal) ────────────────

const TechLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ padding: '40px 48px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#ffffff' }}>
    <div className="mb-6 pb-4" style={{ borderBottom: `2px solid ${theme.accent}` }}>
      <div className="flex items-center gap-4">
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
        <div>
          <h1 className="text-[26px] font-bold tracking-tight mb-1" style={{ color: theme.primary, fontFamily: "'JetBrains Mono', monospace" }}>{'> '}{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[13px] font-medium tracking-wide mb-3" style={{ color: theme.textSecondary, fontFamily: "'JetBrains Mono', monospace" }}>{d.personalInfo.title}</p>}
        </div>
      </div>
      <ContactRow personalInfo={d.personalInfo} theme={theme} />
    </div>
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} variant="tech" />)}
  </div>
))
TechLayout.displayName = 'TechLayout'


// ─── Layout 10: Academic (numbered sections, serif, traditional CV) ───────────

const AcademicLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ padding: '40px 48px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#ffffff' }}>
    <div className="text-center mb-6 pb-3" style={{ borderBottom: `2px solid ${theme.accent}` }}>
      <div className="flex items-center justify-center gap-4">
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
        <div>
          <h1 className="text-[24px] font-bold tracking-wide uppercase mb-1" style={{ color: theme.primary }}>{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[12px] italic mb-2" style={{ color: theme.textSecondary }}>{d.personalInfo.title}</p>}
        </div>
      </div>
      <ContactRow personalInfo={d.personalInfo} theme={theme} />
    </div>
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} variant="academic" />)}
  </div>
))
AcademicLayout.displayName = 'AcademicLayout'


// ─── Layout 11: Infographic (right sidebar 65/35) ─────────────────────────────

const InfographicLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => {
  const sidebarIds = ['skills', 'languages', 'certifications']
  const mainSections = sectionOrder.filter((id) => !sidebarIds.includes(id))
  return (
    <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ minHeight: '297mm', fontFamily: theme.fontFamily, display: 'flex' }}>
      <div style={{ width: '65%', padding: '36px 32px', color: theme.textPrimary, backgroundColor: '#ffffff' }}>
        <div className="mb-6">
          <div className="flex items-center gap-4">
            {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
            <div>
              <h1 className="text-[26px] font-bold tracking-wide mb-1" style={{ color: theme.primary }}>{d.personalInfo.fullName || 'Your Name'}</h1>
              {d.personalInfo.title && <p className="text-[13px] font-medium mb-3" style={{ color: theme.textSecondary }}>{d.personalInfo.title}</p>}
            </div>
          </div>
        </div>
        {isEmpty(d) ? <EmptyState t={t} /> : mainSections.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
      </div>
      <div className="flex-shrink-0" style={{ width: '35%', backgroundColor: theme.headerBg, color: theme.headerText, padding: '36px 24px' }}>
        <div className="mb-6 opacity-90"><ContactColumn personalInfo={d.personalInfo} theme={theme} /></div>
        <SidebarSections d={d} sectionOrder={sectionOrder} sectionLabels={sectionLabels} theme={theme} />
      </div>
    </div>
  )
})
InfographicLayout.displayName = 'InfographicLayout'


// ─── Layout 12: Dark Mode (full dark bg, neon accents) ────────────────────────

const DarkLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ padding: '40px 48px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: theme.bgColor || '#111827' }}>
    <div className="text-center mb-6 pb-4" style={{ borderBottom: `1px solid ${theme.sectionBorder}` }}>
      {d.personalInfo.profileImage && <div className="flex justify-center mb-3"><img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-blue-400/30" /></div>}
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
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
  </div>
))
DarkLayout.displayName = 'DarkLayout'


// ─── Layout 13: Timeline (left line connecting entries) ───────────────────────

const TimelineLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ padding: '40px 48px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#ffffff' }}>
    <div className="mb-6 pb-4" style={{ borderBottom: `2px solid ${theme.accent}` }}>
      <div className="flex items-center gap-4">
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
        <div>
          <h1 className="text-[26px] font-bold tracking-wide mb-1" style={{ color: theme.primary }}>{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[13px] font-medium tracking-wide mb-3" style={{ color: theme.textSecondary }}>{d.personalInfo.title}</p>}
        </div>
      </div>
      <ContactRow personalInfo={d.personalInfo} theme={theme} />
    </div>
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} variant="timeline" />)}
  </div>
))
TimelineLayout.displayName = 'TimelineLayout'


// ─── Layout 14: Compact (dense, small font, max content) ─────────────────────

const CompactLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[9px] leading-tight overflow-y-auto" style={{ padding: '24px 32px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#ffffff' }}>
    <div className="flex justify-between items-start mb-3 pb-2" style={{ borderBottom: `1px solid ${theme.sectionBorder}` }}>
      <div className="flex items-center gap-3">
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />}
        <div>
          <h1 className="text-[20px] font-bold tracking-tight mb-0.5" style={{ color: theme.primary }}>{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[11px] font-medium" style={{ color: theme.textSecondary }}>{d.personalInfo.title}</p>}
        </div>
      </div>
      <div className="text-right space-y-0.5 text-[9px]" style={{ color: theme.textMuted }}>
        {d.personalInfo.email && <div>{d.personalInfo.email}</div>}
        {d.personalInfo.phone && <div>{d.personalInfo.phone}</div>}
        {d.personalInfo.location && <div>{d.personalInfo.location}</div>}
        {d.personalInfo.linkedin && <div>{d.personalInfo.linkedin}</div>}
      </div>
    </div>
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
  </div>
))
CompactLayout.displayName = 'CompactLayout'


// ─── Layout 15: Magazine (large header area, editorial, large name) ───────────

const MagazineLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#ffffff' }}>
    <div className="text-center py-12 px-12" style={{ backgroundColor: theme.headerBg }}>
      {d.personalInfo.profileImage && <div className="flex justify-center mb-3"><img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" /></div>}
      <h1 className="text-[42px] font-bold tracking-tight mb-2" style={{ color: theme.headerText, fontFamily: "'Playfair Display', serif" }}>{d.personalInfo.fullName || 'Your Name'}</h1>
      {d.personalInfo.title && <p className="text-[16px] font-light tracking-widest uppercase mb-4" style={{ color: theme.accent }}>{d.personalInfo.title}</p>}
      <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-1 text-[10px]" style={{ color: theme.textMuted }}>
        <ContactItem icon={FaEnvelope} value={d.personalInfo.email} />
        <ContactItem icon={FaPhone} value={d.personalInfo.phone} />
        <ContactItem icon={FaMapMarkerAlt} value={d.personalInfo.location} />
        <ContactItem icon={FaLinkedin} value={d.personalInfo.linkedin} />
        <ContactItem icon={FaGlobe} value={d.personalInfo.website} />
      </div>
    </div>
    <div style={{ padding: '32px 48px' }}>
      {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
    </div>
  </div>
))
MagazineLayout.displayName = 'MagazineLayout'


// ─── Layout 16: Gradient (gradient header fading to white, curves) ────────────

const GradientLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#ffffff' }}>
    <div style={{ background: theme.accentGradient || `linear-gradient(135deg, ${theme.headerBg} 0%, ${theme.accent} 100%)`, padding: '36px 48px', borderRadius: '0 0 24px 24px', color: '#ffffff' }}>
      <div className="flex items-center gap-4">
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white/30" />}
        <div>
          <h1 className="text-[28px] font-bold tracking-wide mb-1">{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[14px] font-medium tracking-wider uppercase opacity-90 mb-3">{d.personalInfo.title}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] opacity-90 mt-2">
        <ContactItem icon={FaEnvelope} value={d.personalInfo.email} />
        <ContactItem icon={FaPhone} value={d.personalInfo.phone} />
        <ContactItem icon={FaMapMarkerAlt} value={d.personalInfo.location} />
        <ContactItem icon={FaLinkedin} value={d.personalInfo.linkedin} />
        <ContactItem icon={FaGlobe} value={d.personalInfo.website} />
      </div>
    </div>
    <div style={{ padding: '28px 48px' }}>
      {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
    </div>
  </div>
))
GradientLayout.displayName = 'GradientLayout'


// ─── Layout 17: Split (50/50, left info, right content) ───────────────────────

const SplitLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => {
  const sidebarIds = ['summary', 'skills', 'languages', 'certifications']
  const mainSections = sectionOrder.filter((id) => !sidebarIds.includes(id))
  const leftSections = sectionOrder.filter((id) => sidebarIds.includes(id))
  return (
    <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ minHeight: '297mm', fontFamily: theme.fontFamily, display: 'flex' }}>
      <div style={{ width: '50%', backgroundColor: theme.headerBg, color: theme.headerText, padding: '36px 28px' }}>
        {d.personalInfo.profileImage && <div className="flex justify-center mb-4"><img src={d.personalInfo.profileImage} alt="" className="w-[60px] h-[60px] rounded-full object-cover border-2 border-white/30" /></div>}
        <h1 className="text-[24px] font-bold tracking-wide mb-1" style={{ color: theme.headerText }}>{d.personalInfo.fullName || 'Your Name'}</h1>
        {d.personalInfo.title && <p className="text-[12px] font-medium tracking-wider uppercase mb-4 opacity-90">{d.personalInfo.title}</p>}
        <div className="mb-6 opacity-90"><ContactColumn personalInfo={d.personalInfo} theme={theme} /></div>
        {leftSections.map((id) => {
          if (id === 'summary' && d.personalInfo.summary) return <div key={id} className="mb-5"><h2 className="text-[12px] font-bold uppercase tracking-wider pb-1 mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.25)' }}>{sectionLabels?.summary || 'Summary'}</h2><p className="text-[10px] leading-relaxed opacity-90">{d.personalInfo.summary}</p></div>
          if (id === 'skills' && d.filledSkills.length > 0) return <div key={id} className="mb-5"><h2 className="text-[12px] font-bold uppercase tracking-wider pb-1 mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.25)' }}>{sectionLabels?.skills || 'Skills'}</h2><div className="flex flex-wrap gap-1.5">{d.filledSkills.map((s, i) => <span key={i} className="px-2 py-0.5 rounded text-[9px]" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>{s}</span>)}</div></div>
          if (id === 'languages' && d.filledLanguages.length > 0) return <div key={id} className="mb-5"><h2 className="text-[12px] font-bold uppercase tracking-wider pb-1 mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.25)' }}>{sectionLabels?.languages || 'Languages'}</h2><div className="space-y-1">{d.filledLanguages.map((l) => <div key={l.id} className="text-[10px]">{l.language}{l.proficiency && <span className="opacity-75"> — {l.proficiency}</span>}</div>)}</div></div>
          if (id === 'certifications' && d.filledCertifications.length > 0) return <div key={id} className="mb-5"><h2 className="text-[12px] font-bold uppercase tracking-wider pb-1 mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.25)' }}>{sectionLabels?.certifications || 'Certifications'}</h2><div className="space-y-1">{d.filledCertifications.map((c) => <div key={c.id} className="text-[10px]">{c.name}</div>)}</div></div>
          return null
        })}
      </div>
      <div style={{ width: '50%', padding: '36px 28px', color: theme.textPrimary, backgroundColor: '#ffffff' }}>
        {isEmpty(d) ? <EmptyState t={t} /> : mainSections.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />)}
      </div>
    </div>
  )
})
SplitLayout.displayName = 'SplitLayout'


// ─── Layout 18: Metro (card-based, each section in its own card) ──────────────

const MetroLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ padding: '32px 36px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#f8fafb' }}>
    <div className="mb-6 p-5 rounded-xl" style={{ backgroundColor: '#ffffff', border: `2px solid ${theme.sectionBorder}` }}>
      <div className="flex items-center gap-4">
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
        <div>
          <h1 className="text-[26px] font-bold tracking-wide mb-1" style={{ color: theme.primary }}>{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[13px] font-medium mb-3" style={{ color: theme.textSecondary }}>{d.personalInfo.title}</p>}
        </div>
      </div>
      <ContactRow personalInfo={d.personalInfo} theme={theme} />
    </div>
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => (
      <div key={id} className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#ffffff', border: `1px solid ${theme.sectionBorder}` }}>
        <RenderSection sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} variant="metro" />
      </div>
    ))}
  </div>
))
MetroLayout.displayName = 'MetroLayout'


// ─── Layout 19: Ribbon (colored ribbon/tab for each section heading) ──────────

const RibbonLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ padding: '40px 48px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#ffffff' }}>
    <div className="mb-6 pb-4" style={{ borderBottom: `3px solid ${theme.accent}` }}>
      <div className="flex items-center gap-4">
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
        <div>
          <h1 className="text-[28px] font-bold tracking-wide mb-1" style={{ color: theme.primary }}>{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[13px] font-medium tracking-wide mb-3" style={{ color: theme.textSecondary }}>{d.personalInfo.title}</p>}
        </div>
      </div>
      <ContactRow personalInfo={d.personalInfo} theme={theme} />
    </div>
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id) => <RenderSection key={id} sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} variant="ribbon" />)}
  </div>
))
RibbonLayout.displayName = 'RibbonLayout'


// ─── Layout 20: Asymmetric (staggered, alternating left/right) ────────────────

const AsymmetricLayout = forwardRef(({ d, theme, sectionOrder, sectionLabels, t }, ref) => (
  <div ref={ref} className="w-full max-w-[210mm] mx-auto text-[11px] leading-relaxed overflow-y-auto" style={{ padding: '40px 36px', minHeight: '297mm', fontFamily: theme.fontFamily, color: theme.textPrimary, backgroundColor: '#ffffff' }}>
    <div className="mb-6 pb-4 text-right" style={{ borderBottom: `2px solid ${theme.accent}` }}>
      <div className="flex items-center justify-end gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-wide mb-1" style={{ color: theme.primary }}>{d.personalInfo.fullName || 'Your Name'}</h1>
          {d.personalInfo.title && <p className="text-[13px] font-medium tracking-wide mb-3" style={{ color: theme.textSecondary }}>{d.personalInfo.title}</p>}
        </div>
        {d.personalInfo.profileImage && <img src={d.personalInfo.profileImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
      </div>
      <div className="flex flex-wrap justify-end items-center gap-x-4 gap-y-1 text-[10px]" style={{ color: theme.textMuted }}>
        <ContactItem icon={FaEnvelope} value={d.personalInfo.email} />
        <ContactItem icon={FaPhone} value={d.personalInfo.phone} />
        <ContactItem icon={FaMapMarkerAlt} value={d.personalInfo.location} />
        <ContactItem icon={FaLinkedin} value={d.personalInfo.linkedin} />
        <ContactItem icon={FaGlobe} value={d.personalInfo.website} />
      </div>
    </div>
    {isEmpty(d) ? <EmptyState t={t} /> : sectionOrder.map((id, idx) => (
      <div key={id} style={{ paddingLeft: idx % 2 === 0 ? '0' : '48px', paddingRight: idx % 2 === 0 ? '48px' : '0' }}>
        <RenderSection sectionId={id} d={d} theme={theme} sectionLabels={sectionLabels} />
      </div>
    ))}
  </div>
))
AsymmetricLayout.displayName = 'AsymmetricLayout'


// ─── Main Component ───────────────────────────────────────────────────────────

const LAYOUT_MAP = {
  modern: ModernLayout,
  classic: ClassicLayout,
  creative: CreativeLayout,
  minimal: MinimalLayout,
  executive: ExecutiveLayout,
  professional: ProfessionalLayout,
  elegant: ElegantLayout,
  bold: BoldLayout,
  tech: TechLayout,
  academic: AcademicLayout,
  infographic: InfographicLayout,
  darkmode: DarkLayout,
  timeline: TimelineLayout,
  compact: CompactLayout,
  magazine: MagazineLayout,
  gradient: GradientLayout,
  split: SplitLayout,
  metro: MetroLayout,
  ribbon: RibbonLayout,
  asymmetric: AsymmetricLayout,
}

const ResumePreview = forwardRef(({ data, theme, sectionOrder, sectionLabels }, ref) => {
  const { t } = useTranslation()
  const d = useResumeData(data)
  const templateId = theme.id || 'modern'
  const Layout = LAYOUT_MAP[templateId] || ModernLayout
  return <Layout ref={ref} d={d} theme={theme} sectionOrder={sectionOrder} sectionLabels={sectionLabels} t={t} />
})

ResumePreview.displayName = 'ResumePreview'

export default ResumePreview
