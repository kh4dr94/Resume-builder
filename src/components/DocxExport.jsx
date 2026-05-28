import { motion } from 'framer-motion'
import { FaFileWord } from 'react-icons/fa'

function generateDocxHtml(data) {
  const { personalInfo, experience, education, skills, certifications, languages } = data

  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>Resume</title>
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #333; margin: 40px; }
      h1 { font-size: 22pt; margin: 0 0 4px 0; color: #1a1a1a; }
      h2 { font-size: 13pt; color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin: 16px 0 8px 0; }
      h3 { font-size: 11pt; margin: 6px 0 2px 0; }
      p { margin: 2px 0; }
      .subtitle { font-size: 12pt; color: #555; margin-bottom: 8px; }
      .contact { font-size: 10pt; color: #666; margin-bottom: 4px; }
      .skill-tag { display: inline-block; background: #eff6ff; padding: 2px 8px; border-radius: 4px; margin: 2px 4px 2px 0; font-size: 10pt; }
      .exp-header { margin-bottom: 2px; }
      .date { color: #888; font-size: 10pt; }
      ul { margin: 4px 0; padding-left: 20px; }
      li { margin: 2px 0; }
    </style>
    </head><body>`

  // Personal Info
  if (personalInfo?.fullName) {
    html += `<h1>${personalInfo.fullName}</h1>`
  }
  if (personalInfo?.title) {
    html += `<p class="subtitle">${personalInfo.title}</p>`
  }

  const contactParts = []
  if (personalInfo?.email) contactParts.push(personalInfo.email)
  if (personalInfo?.phone) contactParts.push(personalInfo.phone)
  if (personalInfo?.location) contactParts.push(personalInfo.location)
  if (contactParts.length > 0) {
    html += `<p class="contact">${contactParts.join(' | ')}</p>`
  }

  const linkParts = []
  if (personalInfo?.linkedin) linkParts.push(personalInfo.linkedin)
  if (personalInfo?.website) linkParts.push(personalInfo.website)
  if (linkParts.length > 0) {
    html += `<p class="contact">${linkParts.join(' | ')}</p>`
  }

  if (personalInfo?.summary) {
    html += `<h2>Professional Summary</h2><p>${personalInfo.summary}</p>`
  }

  // Experience
  const filledExp = (experience || []).filter(e => e.company || e.position)
  if (filledExp.length > 0) {
    html += `<h2>Experience</h2>`
    filledExp.forEach(exp => {
      html += `<div class="exp-header"><h3>${exp.position || ''}${exp.company ? ` — ${exp.company}` : ''}</h3>`
      html += `<p class="date">${exp.startDate || ''}${exp.endDate ? ` - ${exp.endDate}` : exp.current ? ' - Present' : ''}</p></div>`
      if (exp.description) {
        const lines = exp.description.split('\n').filter(l => l.trim())
        html += '<ul>'
        lines.forEach(line => {
          html += `<li>${line.replace(/^[•\-*]\s*/, '')}</li>`
        })
        html += '</ul>'
      }
    })
  }

  // Education
  const filledEdu = (education || []).filter(e => e.institution || e.degree)
  if (filledEdu.length > 0) {
    html += `<h2>Education</h2>`
    filledEdu.forEach(edu => {
      html += `<h3>${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}${edu.institution ? ` — ${edu.institution}` : ''}</h3>`
      const parts = []
      if (edu.startDate || edu.endDate) parts.push(`${edu.startDate || ''} - ${edu.endDate || ''}`)
      if (edu.gpa) parts.push(`GPA: ${edu.gpa}`)
      if (parts.length > 0) html += `<p class="date">${parts.join(' | ')}</p>`
    })
  }

  // Skills
  const filledSkills = (skills || []).filter(s => s.trim())
  if (filledSkills.length > 0) {
    html += `<h2>Skills</h2><p>`
    filledSkills.forEach(skill => {
      html += `<span class="skill-tag">${skill}</span>`
    })
    html += `</p>`
  }

  // Certifications
  const filledCerts = (certifications || []).filter(c => c.name)
  if (filledCerts.length > 0) {
    html += `<h2>Certifications</h2><ul>`
    filledCerts.forEach(cert => {
      html += `<li>${cert.name}${cert.issuer ? ` — ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}</li>`
    })
    html += `</ul>`
  }

  // Languages
  const filledLangs = (languages || []).filter(l => l.language)
  if (filledLangs.length > 0) {
    html += `<h2>Languages</h2><ul>`
    filledLangs.forEach(lang => {
      html += `<li>${lang.language}${lang.proficiency ? ` — ${lang.proficiency}` : ''}</li>`
    })
    html += `</ul>`
  }

  html += `</body></html>`
  return html
}

export default function DocxExport({ data, darkMode }) {
  const handleDownload = () => {
    const html = generateDocxHtml(data)
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data?.personalInfo?.fullName || 'Resume'}_Resume.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleDownload}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shadow-md font-semibold text-[13px] ${
        darkMode
          ? 'bg-gradient-to-r from-blue-700 to-cyan-700 text-white shadow-blue-900/30'
          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/25'
      }`}
      title="Download as Word document"
    >
      <FaFileWord size={14} />
      <span className="hidden sm:inline">DOCX</span>
    </motion.button>
  )
}
