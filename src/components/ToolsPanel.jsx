import { useState, useEffect, useRef } from 'react'
import {
  FaShareAlt,
  FaEnvelope,
  FaBullseye,
  FaSpellCheck,
  FaCrosshairs,
  FaChartBar,
  FaGlobe,
  FaFileExport,
  FaFileImport,
  FaUndo,
  FaRedo,
  FaTimes,
  FaWrench,
  FaKey,
  FaFont,
  FaRulerVertical,
  FaRobot,
  FaCopy,
  FaTrashAlt,
  FaFileAlt,
  FaMagic,
} from 'react-icons/fa'


function ToolsBottomSheet({ isOpen, onClose, children, title }) {
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

  return (
    <div className="fixed inset-0 z-[9999]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col animate-slide-up pb-[env(safe-area-inset-bottom,0px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200"
          >
            <FaTimes size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-12">
          {children}
        </div>
      </div>
    </div>
  )
}


function ShareSheet({ onClose, resumeData, onPrint }) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = () => {
    onPrint?.()
    onClose()
  }

  const handleCopyText = () => {
    const { personalInfo, experience, skills } = resumeData
    const text = [
      personalInfo.fullName,
      personalInfo.title,
      personalInfo.email,
      personalInfo.phone,
      '',
      personalInfo.summary,
      '',
      '--- Experience ---',
      ...experience.filter(e => e.company).map(e => `${e.position} at ${e.company}`),
      '',
      '--- Skills ---',
      skills.filter(s => s.trim()).join(', '),
    ].join('\n')
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }


  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resumeData.personalInfo.fullName || 'resume'}_data.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadTxt = () => {
    const { personalInfo, experience, education, skills, certifications, languages } = resumeData
    const lines = [
      personalInfo.fullName?.toUpperCase() || 'RESUME',
      personalInfo.title || '',
      [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | '),
      [personalInfo.linkedin, personalInfo.website].filter(Boolean).join(' | '),
      '',
      '=== PROFESSIONAL SUMMARY ===',
      personalInfo.summary || '',
      '',
      '=== EXPERIENCE ===',
      ...experience.filter(e => e.company).flatMap(e => [
        `${e.position} — ${e.company} (${e.startDate}${e.current ? ' - Present' : e.endDate ? ` - ${e.endDate}` : ''})`,
        e.description || '',
        '',
      ]),
      '=== EDUCATION ===',
      ...education.filter(e => e.institution).flatMap(e => [
        `${e.degree}${e.field ? ` in ${e.field}` : ''} — ${e.institution} (${e.startDate || ''}${e.endDate ? ` - ${e.endDate}` : ''})`,
        e.gpa ? `GPA: ${e.gpa}` : '',
        '',
      ]),
      '=== SKILLS ===',
      skills.filter(s => s.trim()).join(', '),
      '',
      certifications.some(c => c.name) ? '=== CERTIFICATIONS ===' : '',
      ...certifications.filter(c => c.name).map(c => `${c.name} — ${c.issuer || ''} (${c.date || ''})`),
      '',
      languages.some(l => l.language) ? '=== LANGUAGES ===' : '',
      ...languages.filter(l => l.language).map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`),
    ].filter(line => line !== undefined)
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${personalInfo.fullName || 'resume'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }


  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Resume - ${resumeData.personalInfo.fullName || 'My Resume'}`)
    const body = encodeURIComponent(`Hi,\n\nPlease find my resume at: ${window.location.href}\n\nBest regards,\n${resumeData.personalInfo.fullName || ''}`)
    window.open(`mailto:${email}?subject=${subject}&body=${body}`)
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 2000)
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Check out my resume: ${window.location.href}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleLinkedIn = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
  }

  const handleTwitter = () => {
    const text = encodeURIComponent(`Check out my professional resume! ${window.location.href}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }


  return (
    <div className="space-y-4">
      <button
        onClick={handleDownloadPDF}
        className="w-full flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl active:from-blue-700 active:to-indigo-700 transition-all shadow-md active:scale-[0.98]"
      >
        <span className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-lg">📄</span>
        <div className="text-left">
          <p className="text-sm font-semibold text-white">Download PDF</p>
          <p className="text-xs text-blue-100">Best for sharing with recruiters & employers</p>
        </div>
      </button>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Share link via</p>
        <div className="grid grid-cols-4 gap-2">
          <button onClick={handleWhatsApp} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-green-50 active:bg-green-100 transition-all active:scale-95">
            <span className="text-xl">💬</span>
            <span className="text-[10px] font-medium text-green-700">WhatsApp</span>
          </button>
          <button onClick={handleLinkedIn} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50 active:bg-blue-100 transition-all active:scale-95">
            <span className="text-xl">💼</span>
            <span className="text-[10px] font-medium text-blue-700">LinkedIn</span>
          </button>
          <button onClick={handleTwitter} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-sky-50 active:bg-sky-100 transition-all active:scale-95">
            <span className="text-xl">🐦</span>
            <span className="text-[10px] font-medium text-sky-700">Twitter</span>
          </button>
          <button onClick={handleCopyLink} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 active:bg-gray-100 transition-all active:scale-95">
            <span className="text-xl">{copied ? '✅' : '🔗'}</span>
            <span className="text-[10px] font-medium text-gray-700">{copied ? 'Copied!' : 'Link'}</span>
          </button>
        </div>
      </div>


      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email resume link</p>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="recipient@email.com"
            className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleEmailShare}
            disabled={!email}
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg active:bg-blue-700 disabled:opacity-40 disabled:active:bg-blue-600"
          >
            {emailSent ? '✓' : 'Send'}
          </button>
        </div>
      </div>


      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Download as</p>
        <div className="space-y-2">
          <button
            onClick={handleDownloadTxt}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl active:bg-gray-100 transition-all"
          >
            <span className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">TXT</span>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">Plain Text</p>
              <p className="text-xs text-gray-500">Formatted text file for easy sharing</p>
            </div>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl active:bg-gray-100 transition-all"
          >
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600">JSON</span>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">Data Export</p>
              <p className="text-xs text-gray-500">Import into another resume builder</p>
            </div>
          </button>
          <button
            onClick={handleCopyText}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl active:bg-gray-100 transition-all"
          >
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-xs font-bold text-purple-600">📋</span>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">{copied ? 'Copied to clipboard!' : 'Copy as Text'}</p>
              <p className="text-xs text-gray-500">Paste into emails or messages</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}


function CoverLetterSheet({ onClose, resumeData }) {
  const [jobDesc, setJobDesc] = useState('')
  const [generatedLetter, setGeneratedLetter] = useState('')
  const [copied, setCopied] = useState(false)

  const generateCoverLetter = () => {
    if (!jobDesc.trim()) return
    const { personalInfo, experience, skills } = resumeData
    const name = personalInfo.fullName || 'the applicant'
    const title = personalInfo.title || 'professional'
    const topSkills = skills.filter(s => s.trim()).slice(0, 5)
    const recentExp = experience.filter(e => e.company && e.position)[0]

    // Extract company name from job description
    const companyMatch = jobDesc.match(/(?:at|for|join|with)\s+([A-Z][A-Za-z\s&]+?)(?:\.|,|\s+as|\s+is|\s+we|\n)/i)
    const company = companyMatch ? companyMatch[1].trim() : 'your company'

    // Extract role from job description
    const roleMatch = jobDesc.match(/(?:position|role|title|hiring|looking for)[:\s]+([^\n,.]+)/i)
    const role = roleMatch ? roleMatch[1].trim() : title

    const skillsList = topSkills.length > 0
      ? topSkills.slice(0, 3).join(', ') + (topSkills.length > 3 ? `, and ${topSkills[3]}` : '')
      : 'diverse technical abilities'

    const expLine = recentExp
      ? `In my most recent role as ${recentExp.position} at ${recentExp.company}, I developed expertise that directly aligns with this opportunity.`
      : `Throughout my career as a ${title}, I have built expertise that aligns well with this role.`


    const yearsExp = experience.filter(e => e.company).length
    const expYears = yearsExp > 0 ? `With ${yearsExp}+ years of relevant experience, ` : ''

    const letter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. ${expYears}I am confident that my background in ${skillsList} makes me an excellent candidate for this role.

${expLine}

My key qualifications include:
${topSkills.slice(0, 4).map(s => `• Proficiency in ${s}`).join('\n')}
${recentExp && recentExp.description ? `• ${recentExp.description.split('\n')[0].replace(/^[-•]\s*/, '')}` : '• Proven track record of delivering results'}

I am excited about the opportunity to bring my skills and experience to ${company}. I would welcome the chance to discuss how my background aligns with your team's needs.

Thank you for considering my application. I look forward to hearing from you.

Sincerely,
${name}${personalInfo.email ? `\n${personalInfo.email}` : ''}${personalInfo.phone ? `\n${personalInfo.phone}` : ''}`

    setGeneratedLetter(letter)
  }


  const handleCopy = () => {
    navigator.clipboard?.writeText(generatedLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Generate a cover letter tailored to a specific job posting using your resume data</p>
      {!generatedLetter ? (
        <>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description here to tailor your cover letter..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={generateCoverLetter}
            disabled={!jobDesc.trim()}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold active:bg-blue-700 shadow-md disabled:opacity-40"
          >
            Generate Cover Letter
          </button>
        </>
      ) : (
        <>
          <textarea
            value={generatedLetter}
            onChange={(e) => setGeneratedLetter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-xs"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold active:bg-green-700 shadow-md"
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={() => { setGeneratedLetter(''); setJobDesc('') }}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold active:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  )
}


function GrammarSheet({ onClose, resumeData }) {
  const [issues, setIssues] = useState([])
  const [analyzed, setAnalyzed] = useState(false)

  useEffect(() => {
    analyzeGrammar()
  }, [resumeData])

  const analyzeGrammar = () => {
    const foundIssues = []
    let idCounter = 0

    // Gather all text from resume
    const allTexts = []
    if (resumeData.personalInfo.summary) allTexts.push({ source: 'Summary', text: resumeData.personalInfo.summary })
    resumeData.experience.forEach(exp => {
      if (exp.description) allTexts.push({ source: `${exp.position || 'Experience'} at ${exp.company || ''}`, text: exp.description })
    })

    // Passive voice patterns
    const passivePatterns = [
      /was responsible for/gi,
      /were tasked with/gi,
      /was assigned to/gi,
      /was involved in/gi,
      /were responsible for/gi,
      /was utilized/gi,
      /was used to/gi,
      /was created/gi,
      /was developed/gi,
      /was implemented/gi,
      /was managed/gi,
    ]


    // Weak verbs
    const weakVerbs = [/\bdid\b/gi, /\bmade\b/gi, /\bgot\b/gi, /\bhelped\b/gi, /\bwent\b/gi, /\btried\b/gi, /\bhandled\b/gi]

    allTexts.forEach(({ source, text }) => {
      const sentences = text.split(/[.!?\n]+/).filter(s => s.trim())

      sentences.forEach(sentence => {
        const trimmed = sentence.trim()
        if (!trimmed) return

        // Check passive voice
        passivePatterns.forEach(pattern => {
          const match = trimmed.match(pattern)
          if (match) {
            foundIssues.push({
              id: ++idCounter,
              text: `Passive voice: "${match[0]}" — use active voice instead`,
              type: 'style',
              source,
              original: trimmed.substring(0, 60) + (trimmed.length > 60 ? '...' : '')
            })
          }
        })

        // Check sentences starting with "I"
        if (/^\s*I\s/.test(trimmed)) {
          foundIssues.push({
            id: ++idCounter,
            text: `Starts with "I" — rephrase to lead with action verb`,
            type: 'style',
            source,
            original: trimmed.substring(0, 60) + (trimmed.length > 60 ? '...' : '')
          })
        }

        // Check long sentences (>30 words)
        const wordCount = trimmed.split(/\s+/).length
        if (wordCount > 30) {
          foundIssues.push({
            id: ++idCounter,
            text: `Sentence is ${wordCount} words long — consider splitting it (aim for under 30)`,
            type: 'readability',
            source,
            original: trimmed.substring(0, 60) + (trimmed.length > 60 ? '...' : '')
          })
        }


        // Check weak verbs
        weakVerbs.forEach(pattern => {
          const match = trimmed.match(pattern)
          if (match) {
            foundIssues.push({
              id: ++idCounter,
              text: `Weak verb "${match[0]}" — replace with a stronger action verb`,
              type: 'clarity',
              source,
              original: trimmed.substring(0, 60) + (trimmed.length > 60 ? '...' : '')
            })
          }
        })
      })

      // Check common spelling patterns in full text
      const spellingPatterns = [
        [/\bmanagment\b/gi, 'management'],
        [/\brecieved\b/gi, 'received'],
        [/\boccured\b/gi, 'occurred'],
        [/\bseperate\b/gi, 'separate'],
        [/\bacheive\b/gi, 'achieve'],
        [/\baccommodate\b/gi, 'accommodate'],
        [/\boccasion\b/gi, 'occasion'],
        [/\benvirnoment\b/gi, 'environment'],
        [/\bliason\b/gi, 'liaison'],
        [/\bneccessary\b/gi, 'necessary'],
        [/\bsucessful\b/gi, 'successful'],
        [/\bresponsibile\b/gi, 'responsible'],
        [/\bdevelopement\b/gi, 'development'],
        [/\bproffesional\b/gi, 'professional'],
      ]

      spellingPatterns.forEach(([pattern, correction]) => {
        const match = text.match(pattern)
        if (match) {
          foundIssues.push({
            id: ++idCounter,
            text: `"${match[0]}" should be "${correction}"`,
            type: 'spelling',
            source,
            original: match[0]
          })
        }
      })
    })

    setIssues(foundIssues)
    setAnalyzed(true)
  }


  const dismissIssue = (id) => {
    setIssues(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">Grammar & style analysis of your resume</p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          issues.length === 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {issues.length === 0 ? 'All clear!' : `${issues.length} issue${issues.length > 1 ? 's' : ''}`}
        </span>
      </div>
      {analyzed && issues.length === 0 && (
        <div className="px-4 py-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <span className="text-3xl">✅</span>
          <p className="text-sm font-medium text-green-700 mt-2">Your resume looks great!</p>
          <p className="text-xs text-green-600 mt-1">No grammar or style issues detected.</p>
        </div>
      )}
      <div className="space-y-2">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 shrink-0 ${
                issue.type === 'spelling' ? 'bg-red-100 text-red-600' :
                issue.type === 'style' ? 'bg-yellow-100 text-yellow-700' :
                issue.type === 'clarity' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {issue.type}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-700 block">{issue.text}</span>
                <span className="text-xs text-gray-400 block mt-0.5">in {issue.source}</span>
              </div>
              <button
                onClick={() => dismissIssue(issue.id)}
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 active:bg-gray-300 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


function JobMatchSheet({ onClose, resumeData }) {
  const [jobDesc, setJobDesc] = useState('')
  const [results, setResults] = useState(null)

  const extractKeywords = (text) => {
    // Common stop words to filter out
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'must', 'we', 'you', 'they', 'he', 'she', 'it', 'this', 'that', 'these', 'those', 'am', 'as', 'if', 'not', 'no', 'so', 'up', 'out', 'about', 'into', 'over', 'after', 'than', 'too', 'very', 'just', 'also', 'your', 'our', 'their', 'its', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'who', 'what', 'which', 'when', 'where', 'how', 'why', 'able', 'work', 'working', 'experience', 'including', 'well', 'etc', 'strong', 'using', 'new', 'role'])
    const words = text.toLowerCase()
      .replace(/[^a-z0-9+#.\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w))

    // Count frequency
    const freq = {}
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })

    // Also extract multi-word phrases (2-3 words)
    const phrases = []
    const cleanText = text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ')
    const allWords = cleanText.split(/\s+/)
    for (let i = 0; i < allWords.length - 1; i++) {
      const bi = `${allWords[i]} ${allWords[i+1]}`
      if (!stopWords.has(allWords[i]) && !stopWords.has(allWords[i+1]) && allWords[i].length > 2 && allWords[i+1].length > 2) {
        phrases.push(bi)
      }
    }
    const phraseFreq = {}
    phrases.forEach(p => { phraseFreq[p] = (phraseFreq[p] || 0) + 1 })

    // Combine top single words and phrases
    const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([w]) => w)
    const topPhrases = Object.entries(phraseFreq).filter(([,c]) => c >= 2).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([p]) => p)

    return [...topPhrases, ...topWords].slice(0, 25)
  }


  const analyzeMatch = () => {
    if (!jobDesc.trim()) return

    const keywords = extractKeywords(jobDesc)

    // Build full resume text for searching
    const resumeText = [
      resumeData.personalInfo.summary || '',
      resumeData.personalInfo.title || '',
      ...resumeData.experience.map(e => `${e.position || ''} ${e.company || ''} ${e.description || ''}`),
      ...resumeData.education.map(e => `${e.degree || ''} ${e.field || ''} ${e.institution || ''}`),
      ...resumeData.skills,
      ...resumeData.certifications.map(c => `${c.name || ''} ${c.issuer || ''}`),
    ].join(' ').toLowerCase()

    const found = []
    const missing = []

    keywords.forEach(kw => {
      if (resumeText.includes(kw.toLowerCase())) {
        found.push(kw)
      } else {
        missing.push(kw)
      }
    })

    const matchPercent = keywords.length > 0 ? Math.round((found.length / keywords.length) * 100) : 0

    const suggestions = []
    if (missing.length > 3) suggestions.push('Add more relevant keywords from the job description to your skills section')
    if (matchPercent < 50) suggestions.push('Your resume needs significant tailoring for this role')
    if (matchPercent >= 50 && matchPercent < 75) suggestions.push('Good foundation — add missing keywords to strengthen your match')
    if (matchPercent >= 75) suggestions.push('Strong match! Consider fine-tuning your summary to highlight relevant experience')
    if (missing.some(kw => kw.includes(' '))) suggestions.push('Add industry-specific phrases to your experience descriptions')

    setResults({ found, missing, matchPercent, suggestions })
  }


  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Check how well your resume matches a job posting</p>
      {!results ? (
        <>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={analyzeMatch}
            disabled={!jobDesc.trim()}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold active:bg-green-700 shadow-md disabled:opacity-40"
          >
            Analyze Match
          </button>
        </>
      ) : (
        <>
          <div className="text-center py-3">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${
              results.matchPercent >= 75 ? 'border-green-400 bg-green-50' :
              results.matchPercent >= 50 ? 'border-yellow-400 bg-yellow-50' :
              'border-red-400 bg-red-50'
            }`}>
              <span className={`text-2xl font-bold ${
                results.matchPercent >= 75 ? 'text-green-600' :
                results.matchPercent >= 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}>{results.matchPercent}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Job Match Score</p>
          </div>

          {results.found.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-600 mb-1.5">✓ Keywords Found ({results.found.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {results.found.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-700">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {results.missing.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 mb-1.5">✗ Keywords Missing ({results.missing.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {results.missing.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-red-50 border border-red-200 rounded-full text-xs text-red-700">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {results.suggestions.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-600">Suggestions</p>
              {results.suggestions.map((s, i) => (
                <div key={i} className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">💡 {s}</div>
              ))}
            </div>
          )}

          <button
            onClick={() => { setResults(null); setJobDesc('') }}
            className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium active:bg-gray-300"
          >
            Analyze Another
          </button>
        </>
      )}
    </div>
  )
}


function TailorSheet({ onClose, resumeData, onUpdateData }) {
  const [jobDesc, setJobDesc] = useState('')
  const [suggestions, setSuggestions] = useState(null)
  const [addedSkills, setAddedSkills] = useState(new Set())

  const analyzeTailor = () => {
    if (!jobDesc.trim()) return

    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'we', 'you', 'they', 'this', 'that', 'as', 'if', 'not', 'no', 'all', 'more', 'most', 'other', 'some', 'such', 'who', 'what', 'which', 'when', 'where', 'how', 'why', 'our', 'your', 'their', 'able', 'work', 'including', 'etc', 'well', 'strong'])

    // Extract technical/skill keywords from job description
    const techPatterns = /\b(?:[A-Z][a-z]+(?:\.[a-z]+)?|[A-Z]{2,}|[a-z]+(?:\.js|\.py|\.ts)?)\b/g
    const jobLower = jobDesc.toLowerCase()
    const words = jobLower.replace(/[^a-z0-9+#.\s-]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w))

    const freq = {}
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })

    const topKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([w]) => w)

    const resumeSkills = resumeData.skills.map(s => s.toLowerCase().trim())
    const resumeText = [
      resumeData.personalInfo.summary || '',
      ...resumeData.experience.map(e => `${e.position || ''} ${e.description || ''}`),
    ].join(' ').toLowerCase()

    const missingSkills = topKeywords.filter(kw =>
      !resumeSkills.some(s => s.includes(kw) || kw.includes(s)) &&
      !resumeText.includes(kw)
    ).slice(0, 10)

    // Generate description suggestions
    const descSuggestions = []
    resumeData.experience.forEach(exp => {
      if (exp.description && exp.company) {
        const relevantMissing = missingSkills.filter(kw =>
          !exp.description.toLowerCase().includes(kw)
        ).slice(0, 3)
        if (relevantMissing.length > 0) {
          descSuggestions.push({
            role: `${exp.position} at ${exp.company}`,
            suggestion: `Consider mentioning: ${relevantMissing.join(', ')}`,
            keywords: relevantMissing
          })
        }
      }
    })

    setSuggestions({ missingSkills, descSuggestions })
  }


  const handleAddSkill = (skill) => {
    if (addedSkills.has(skill)) return
    const newSkills = [...resumeData.skills]
    // Find first empty slot or append
    const emptyIdx = newSkills.findIndex(s => !s.trim())
    if (emptyIdx >= 0) {
      newSkills[emptyIdx] = skill
    } else {
      newSkills.push(skill)
    }
    onUpdateData?.({ ...resumeData, skills: newSkills })
    setAddedSkills(prev => new Set([...prev, skill]))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Tailor your resume by identifying missing keywords from a job description</p>
      {!suggestions ? (
        <>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description to optimize your resume for..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={analyzeTailor}
            disabled={!jobDesc.trim()}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold active:bg-indigo-700 shadow-md disabled:opacity-40"
          >
            Tailor Resume
          </button>
        </>
      ) : (
        <>
          {suggestions.missingSkills.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Missing Skills — tap to add to your resume</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.missingSkills.map((skill, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddSkill(skill)}
                    disabled={addedSkills.has(skill)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      addedSkills.has(skill)
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200 active:bg-indigo-100'
                    }`}
                  >
                    {addedSkills.has(skill) ? `✓ ${skill}` : `+ ${skill}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestions.descSuggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">Suggested Additions to Experience</p>
              {suggestions.descSuggestions.map((s, i) => (
                <div key={i} className="px-3 py-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <p className="text-xs font-medium text-indigo-800">{s.role}</p>
                  <p className="text-xs text-indigo-600 mt-0.5">{s.suggestion}</p>
                </div>
              ))}
            </div>
          )}

          {suggestions.missingSkills.length === 0 && (
            <div className="px-4 py-6 bg-green-50 border border-green-200 rounded-xl text-center">
              <span className="text-3xl">🎯</span>
              <p className="text-sm font-medium text-green-700 mt-2">Your resume is well-tailored!</p>
              <p className="text-xs text-green-600 mt-1">Most important keywords are already present.</p>
            </div>
          )}

          <button
            onClick={() => { setSuggestions(null); setJobDesc(''); setAddedSkills(new Set()) }}
            className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium active:bg-gray-300"
          >
            Analyze Another
          </button>
        </>
      )}
    </div>
  )
}


function QuantifySheet({ onClose, resumeData }) {
  const [findings, setFindings] = useState([])

  useEffect(() => {
    analyzeQuantification()
  }, [resumeData])

  const analyzeQuantification = () => {
    const results = []
    const hasNumbers = /\d+/
    const actionVerbs = ['led', 'managed', 'developed', 'created', 'built', 'improved', 'increased', 'decreased', 'reduced', 'grew', 'delivered', 'launched', 'designed', 'implemented', 'achieved', 'generated', 'saved', 'streamlined', 'optimized', 'automated']

    resumeData.experience.forEach(exp => {
      if (!exp.description || !exp.company) return
      const bullets = exp.description.split('\n').filter(b => b.trim())

      bullets.forEach(bullet => {
        const trimmed = bullet.replace(/^[-•*]\s*/, '').trim()
        if (!trimmed) return

        if (!hasNumbers.test(trimmed)) {
          // Suggest how to quantify
          let suggestion = ''
          const lower = trimmed.toLowerCase()

          if (lower.includes('managed') || lower.includes('led')) {
            suggestion = 'Add team size or number of direct reports (e.g., "Managed a team of X")'
          } else if (lower.includes('improved') || lower.includes('increased') || lower.includes('optimized')) {
            suggestion = 'Add percentage improvement (e.g., "Improved by X%")'
          } else if (lower.includes('developed') || lower.includes('built') || lower.includes('created')) {
            suggestion = 'Add scope or impact numbers (e.g., "serving X users" or "resulting in $X revenue")'
          } else if (lower.includes('reduced') || lower.includes('decreased') || lower.includes('saved')) {
            suggestion = 'Add savings amount or percentage (e.g., "Reduced costs by $X" or "Saved X hours/week")'
          } else if (lower.includes('delivered') || lower.includes('launched') || lower.includes('shipped')) {
            suggestion = 'Add timeline or scope (e.g., "Delivered X weeks ahead of schedule" or "to X users")'
          } else {
            suggestion = 'Add a specific metric: team size, %, $, time saved, users impacted, etc.'
          }

          results.push({
            id: `${exp.id}-${results.length}`,
            role: `${exp.position} at ${exp.company}`,
            original: trimmed.length > 80 ? trimmed.substring(0, 80) + '...' : trimmed,
            suggestion,
            hasActionVerb: actionVerbs.some(v => lower.includes(v))
          })
        }
      })
    })

    setFindings(results)
  }


  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Find bullet points that lack numbers and metrics</p>

      {findings.length === 0 ? (
        <div className="px-4 py-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <span className="text-3xl">📊</span>
          <p className="text-sm font-medium text-green-700 mt-2">Great job!</p>
          <p className="text-xs text-green-600 mt-1">
            {resumeData.experience.some(e => e.description) 
              ? 'All your bullet points already include quantified metrics.'
              : 'Add experience descriptions to get quantification suggestions.'}
          </p>
        </div>
      ) : (
        <>
          <div className="px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs text-orange-700 font-medium">
              {findings.length} bullet point{findings.length > 1 ? 's' : ''} could be strengthened with numbers
            </p>
          </div>
          <div className="space-y-3">
            {findings.map((f) => (
              <div key={f.id} className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-[10px] font-medium text-gray-400 uppercase">{f.role}</p>
                <p className="text-sm text-gray-800 mt-1">"{f.original}"</p>
                <div className="mt-2 px-2.5 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700">💡 {f.suggestion}</p>
                </div>
                {!f.hasActionVerb && (
                  <p className="text-[10px] text-orange-500 mt-1.5">⚠ Also consider starting with a strong action verb</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}


function LanguageSheet({ currentLanguage, onSelect, onClose }) {
  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  ]

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 mb-3">Select resume language</p>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => {
            onSelect(lang.code)
            onClose()
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            currentLanguage === lang.code
              ? 'bg-blue-50 border-2 border-blue-200'
              : 'bg-gray-50 border-2 border-transparent active:bg-gray-100'
          }`}
        >
          <span className="text-lg">{lang.flag}</span>
          <span className={`text-sm font-medium ${
            currentLanguage === lang.code ? 'text-blue-700' : 'text-gray-700'
          }`}>
            {lang.name}
          </span>
        </button>
      ))}
    </div>
  )
}


function KeywordsSheet({ onClose, resumeData }) {
  const [jobDesc, setJobDesc] = useState('')
  const [results, setResults] = useState(null)

  const analyzeKeywords = () => {
    if (!jobDesc.trim()) return

    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'we', 'you', 'they', 'he', 'she', 'it', 'this', 'that', 'as', 'if', 'not', 'no', 'all', 'more', 'most', 'other', 'some', 'who', 'what', 'which', 'when', 'where', 'how', 'why', 'our', 'your', 'their', 'able', 'work', 'working', 'including', 'well', 'etc', 'must', 'can', 'may', 'also', 'into', 'such', 'about', 'than', 'very', 'just', 'each', 'any', 'both', 'own', 'need', 'new', 'role', 'join', 'team', 'opportunity'])

    const jobLower = jobDesc.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ')
    const words = jobLower.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w))

    // Count frequency
    const freq = {}
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })

    // Extract 2-word phrases
    const jobWords = jobLower.split(/\s+/)
    for (let i = 0; i < jobWords.length - 1; i++) {
      if (!stopWords.has(jobWords[i]) && !stopWords.has(jobWords[i+1]) && jobWords[i].length > 2 && jobWords[i+1].length > 2) {
        const phrase = `${jobWords[i]} ${jobWords[i+1]}`
        freq[phrase] = (freq[phrase] || 0) + 1.5 // Boost phrases
      }
    }

    const topKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([kw, count]) => ({ keyword: kw, count: Math.round(count) }))


    // Build resume text
    const resumeText = [
      resumeData.personalInfo.summary || '',
      resumeData.personalInfo.title || '',
      ...resumeData.experience.map(e => `${e.position || ''} ${e.company || ''} ${e.description || ''}`),
      ...resumeData.education.map(e => `${e.degree || ''} ${e.field || ''} ${e.institution || ''}`),
      ...resumeData.skills,
      ...resumeData.certifications.map(c => c.name || ''),
    ].join(' ').toLowerCase()

    const totalJobWords = words.length
    const found = []
    const missing = []

    topKeywords.forEach(({ keyword, count }) => {
      const inResume = resumeText.includes(keyword)
      const density = totalJobWords > 0 ? Math.round((count / totalJobWords) * 100) : 0
      if (inResume) {
        found.push({ keyword, count, density })
      } else {
        missing.push({ keyword, count, density })
      }
    })

    setResults({ found, missing, totalWords: totalJobWords })
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Extract and analyze keywords from a job posting</p>
      {!results ? (
        <>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description to extract relevant keywords..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-28 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
          <button
            onClick={analyzeKeywords}
            disabled={!jobDesc.trim()}
            className="w-full px-4 py-3 bg-yellow-500 text-white rounded-xl text-sm font-semibold active:bg-yellow-600 shadow-md disabled:opacity-40"
          >
            Extract Keywords
          </button>
        </>
      ) : (
        <>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-xs text-gray-500">Analyzed {results.totalWords} words from job description</p>
          </div>

          {results.found.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-600 mb-1.5">✓ In Your Resume ({results.found.length})</p>
              <div className="space-y-1">
                {results.found.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg">
                    <span className="text-xs text-green-700 font-medium">{item.keyword}</span>
                    <span className="text-[10px] text-green-500">×{item.count} ({item.density}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.missing.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 mb-1.5">✗ Missing ({results.missing.length})</p>
              <div className="space-y-1">
                {results.missing.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg">
                    <span className="text-xs text-red-700 font-medium">{item.keyword}</span>
                    <span className="text-[10px] text-red-500">×{item.count} ({item.density}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => { setResults(null); setJobDesc('') }}
            className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium active:bg-gray-300"
          >
            Analyze Another
          </button>
        </>
      )}
    </div>
  )
}


function ATSCheckSheet({ onClose, resumeData }) {
  const [checks, setChecks] = useState([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    runATSCheck()
  }, [resumeData])

  const runATSCheck = () => {
    const results = []
    let totalPoints = 0
    let earnedPoints = 0
    const { personalInfo, experience, education, skills, certifications } = resumeData

    // 1. Contact info completeness (20 points)
    totalPoints += 20
    const contactFields = [personalInfo.fullName, personalInfo.email, personalInfo.phone, personalInfo.location]
    const contactFilled = contactFields.filter(Boolean).length
    const contactScore = Math.round((contactFilled / 4) * 20)
    earnedPoints += contactScore
    if (contactFilled === 4) {
      results.push({ pass: true, text: 'Contact information is complete', category: 'Contact' })
    } else {
      const missing = []
      if (!personalInfo.fullName) missing.push('full name')
      if (!personalInfo.email) missing.push('email')
      if (!personalInfo.phone) missing.push('phone')
      if (!personalInfo.location) missing.push('location')
      results.push({ pass: false, text: `Missing contact info: ${missing.join(', ')}`, category: 'Contact' })
    }

    // 2. Professional summary (15 points)
    totalPoints += 15
    if (personalInfo.summary) {
      const wordCount = personalInfo.summary.split(/\s+/).length
      if (wordCount >= 20 && wordCount <= 80) {
        earnedPoints += 15
        results.push({ pass: true, text: `Professional summary is good length (${wordCount} words)`, category: 'Summary' })
      } else if (wordCount < 20) {
        earnedPoints += 7
        results.push({ pass: false, text: `Summary is too short (${wordCount} words) — aim for 30-60 words`, category: 'Summary' })
      } else {
        earnedPoints += 10
        results.push({ pass: false, text: `Summary is too long (${wordCount} words) — aim for 30-60 words`, category: 'Summary' })
      }
    } else {
      results.push({ pass: false, text: 'No professional summary — ATS systems look for this', category: 'Summary' })
    }


    // 3. Skills section (15 points)
    totalPoints += 15
    const validSkills = skills.filter(s => s.trim())
    if (validSkills.length >= 8) {
      earnedPoints += 15
      results.push({ pass: true, text: `Good skills count (${validSkills.length} skills listed)`, category: 'Skills' })
    } else if (validSkills.length >= 4) {
      earnedPoints += 10
      results.push({ pass: false, text: `Consider adding more skills (${validSkills.length} listed, aim for 8+)`, category: 'Skills' })
    } else {
      earnedPoints += validSkills.length * 2
      results.push({ pass: false, text: `Too few skills (${validSkills.length}) — ATS filters often match on skills`, category: 'Skills' })
    }

    // 4. Experience section (20 points)
    totalPoints += 20
    const validExp = experience.filter(e => e.company && e.position)
    if (validExp.length >= 2) {
      earnedPoints += 10
      results.push({ pass: true, text: `${validExp.length} experience entries found`, category: 'Experience' })
    } else if (validExp.length === 1) {
      earnedPoints += 5
      results.push({ pass: false, text: 'Only 1 experience entry — consider adding more', category: 'Experience' })
    } else {
      results.push({ pass: false, text: 'No experience entries — this is critical for ATS', category: 'Experience' })
    }

    // Check for action verbs in descriptions
    const actionVerbs = ['led', 'managed', 'developed', 'created', 'built', 'implemented', 'designed', 'achieved', 'improved', 'increased', 'decreased', 'reduced', 'launched', 'delivered', 'optimized', 'streamlined', 'established', 'coordinated', 'executed', 'generated', 'analyzed', 'spearheaded']
    const expWithDescriptions = validExp.filter(e => e.description && e.description.trim())
    const expWithActionVerbs = expWithDescriptions.filter(e => {
      const lower = e.description.toLowerCase()
      return actionVerbs.some(v => lower.includes(v))
    })

    if (expWithDescriptions.length > 0 && expWithActionVerbs.length === expWithDescriptions.length) {
      earnedPoints += 10
      results.push({ pass: true, text: 'Experience descriptions use strong action verbs', category: 'Experience' })
    } else if (expWithActionVerbs.length > 0) {
      earnedPoints += 5
      results.push({ pass: false, text: 'Some descriptions lack action verbs (led, managed, developed, etc.)', category: 'Experience' })
    } else if (expWithDescriptions.length > 0) {
      results.push({ pass: false, text: 'Descriptions should start with action verbs for better ATS parsing', category: 'Experience' })
    }


    // 5. Education (10 points)
    totalPoints += 10
    const validEdu = education.filter(e => e.institution && e.degree)
    if (validEdu.length >= 1) {
      earnedPoints += 10
      results.push({ pass: true, text: 'Education section is present', category: 'Education' })
    } else {
      results.push({ pass: false, text: 'No education entries — most ATS systems expect this', category: 'Education' })
    }

    // 6. Dates format (10 points)
    totalPoints += 10
    const hasStartDates = validExp.filter(e => e.startDate).length
    if (hasStartDates === validExp.length && validExp.length > 0) {
      earnedPoints += 10
      results.push({ pass: true, text: 'Employment dates are consistently provided', category: 'Dates' })
    } else if (hasStartDates > 0) {
      earnedPoints += 5
      results.push({ pass: false, text: 'Some positions are missing dates — ATS systems flag this', category: 'Dates' })
    } else if (validExp.length > 0) {
      results.push({ pass: false, text: 'No dates on experience — ATS systems require employment dates', category: 'Dates' })
    } else {
      earnedPoints += 10 // Don't penalize if no experience yet
    }

    // 7. LinkedIn / online presence (10 points)
    totalPoints += 10
    if (personalInfo.linkedin || personalInfo.website) {
      earnedPoints += 10
      results.push({ pass: true, text: 'Online presence/LinkedIn URL included', category: 'Links' })
    } else {
      results.push({ pass: false, text: 'Consider adding LinkedIn URL or portfolio website', category: 'Links' })
    }

    const finalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
    setChecks(results)
    setScore(finalScore)
  }


  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Check if your resume is optimized for Applicant Tracking Systems</p>

      <div className="text-center py-3">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${
          score >= 80 ? 'border-green-400 bg-green-50' :
          score >= 60 ? 'border-yellow-400 bg-yellow-50' :
          'border-red-400 bg-red-50'
        }`}>
          <span className={`text-2xl font-bold ${
            score >= 80 ? 'text-green-600' :
            score >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>{score}%</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">ATS Compatibility Score</p>
      </div>

      <div className="space-y-2">
        {checks.map((check, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border ${
              check.pass
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <span className={`mt-0.5 text-sm ${check.pass ? 'text-green-500' : 'text-red-500'}`}>
              {check.pass ? '✓' : '✗'}
            </span>
            <div className="flex-1">
              <span className={`text-sm ${check.pass ? 'text-green-700' : 'text-red-700'}`}>{check.text}</span>
              <span className={`block text-[10px] mt-0.5 ${check.pass ? 'text-green-400' : 'text-red-400'}`}>{check.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


function SummarizeSheet({ onClose, resumeData, onUpdateData }) {
  const [summaries, setSummaries] = useState([])
  const [applied, setApplied] = useState(null)

  useEffect(() => {
    generateSummaries()
  }, [resumeData])

  const generateSummaries = () => {
    const { personalInfo, experience, skills } = resumeData
    const title = personalInfo.title || 'professional'
    const topSkills = skills.filter(s => s.trim()).slice(0, 5)
    const expCount = experience.filter(e => e.company).length
    const recentRoles = experience.filter(e => e.position).slice(0, 2).map(e => e.position)
    const companies = experience.filter(e => e.company).slice(0, 2).map(e => e.company)

    const skillStr = topSkills.length > 0 ? topSkills.slice(0, 3).join(', ') : 'diverse skills'
    const moreSkills = topSkills.length > 3 ? ` and ${topSkills[3]}` : ''

    const generated = []

    // Concise version
    generated.push({
      id: 'concise',
      label: 'Concise (2-3 lines)',
      desc: 'Best for experienced professionals',
      text: `Results-driven ${title} with ${expCount > 0 ? expCount + '+ years of' : ''} experience in ${skillStr}${moreSkills}. Proven ability to deliver high-quality solutions that drive business growth and operational efficiency.`
    })

    // Detailed version
    generated.push({
      id: 'detailed',
      label: 'Detailed (4-5 lines)',
      desc: 'Good for career changers',
      text: `Accomplished ${title} with a strong background in ${skillStr}${moreSkills}.${recentRoles.length > 0 ? ` Most recently served as ${recentRoles[0]}${companies[0] ? ` at ${companies[0]}` : ''}.` : ''} Passionate about leveraging technical expertise to solve complex problems and deliver measurable impact. Seeking to bring ${expCount > 0 ? expCount + ' years of' : ''} hands-on experience to a forward-thinking organization where I can contribute to team success and continued innovation.`
    })


    // Technical focus
    generated.push({
      id: 'technical',
      label: 'Technical Focus',
      desc: 'Emphasize skills and technologies',
      text: `${title} specializing in ${topSkills.length > 0 ? topSkills.join(', ') : 'software development and technical solutions'}.${expCount > 0 ? ` ${expCount}+ years of experience building scalable, high-performance systems.` : ''} Adept at translating business requirements into robust technical architectures and writing clean, maintainable code.`
    })

    // Leadership focus
    generated.push({
      id: 'leadership',
      label: 'Leadership Focus',
      desc: 'Emphasize management and impact',
      text: `Strategic ${title} with ${expCount > 0 ? expCount + '+ years of experience' : 'deep expertise'} in leading cross-functional teams and driving organizational success.${companies.length > 0 ? ` Demonstrated track record at ${companies.join(' and ')}.` : ''} Known for mentoring talent, establishing best practices, and aligning technical initiatives with business objectives to deliver measurable outcomes.`
    })

    setSummaries(generated)
  }

  const applySummary = (summary) => {
    const updated = {
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        summary: summary.text
      }
    }
    onUpdateData?.(updated)
    setApplied(summary.id)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Generate a professional summary from your experience and skills</p>
      <div className="space-y-2">
        {summaries.map((summary) => (
          <button
            key={summary.id}
            onClick={() => applySummary(summary)}
            className={`w-full px-4 py-3 rounded-xl text-sm text-left transition-all ${
              applied === summary.id
                ? 'bg-green-50 border-2 border-green-300'
                : 'bg-pink-50 border border-pink-200 active:bg-pink-100'
            }`}
          >
            <span className="font-semibold block text-pink-800">
              {applied === summary.id ? '✓ ' : ''}{summary.label}
            </span>
            <span className="text-xs text-pink-500 block">{summary.desc}</span>
            <span className="text-xs text-gray-600 block mt-1.5 line-clamp-3">{summary.text}</span>
          </button>
        ))}
      </div>
      {applied && (
        <p className="text-xs text-green-600 text-center font-medium">✓ Summary applied to your resume!</p>
      )}
    </div>
  )
}


function FormatSheet({ onClose, formatSettings, onFormatChange }) {
  const [settings, setSettings] = useState(formatSettings || {
    fontSize: 11,
    lineSpacing: 1.15,
    margins: 'normal',
    dateFormat: 'Jan 2024',
    bulletStyle: 'round',
  })

  const updateSetting = (key, value) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    onFormatChange?.(updated)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Adjust formatting and layout preferences</p>
      <div className="space-y-3">
        <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Font Size</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateSetting('fontSize', Math.max(8, settings.fontSize - 1))}
              className="w-7 h-7 rounded bg-white border border-gray-300 text-sm font-bold active:bg-gray-100"
            >-</button>
            <span className="text-sm font-medium w-6 text-center">{settings.fontSize}</span>
            <button
              onClick={() => updateSetting('fontSize', Math.min(16, settings.fontSize + 1))}
              className="w-7 h-7 rounded bg-white border border-gray-300 text-sm font-bold active:bg-gray-100"
            >+</button>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Line Spacing</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateSetting('lineSpacing', Math.max(1, +(settings.lineSpacing - 0.05).toFixed(2)))}
              className="w-7 h-7 rounded bg-white border border-gray-300 text-sm font-bold active:bg-gray-100"
            >-</button>
            <span className="text-sm font-medium w-10 text-center">{settings.lineSpacing.toFixed(2)}</span>
            <button
              onClick={() => updateSetting('lineSpacing', Math.min(2, +(settings.lineSpacing + 0.05).toFixed(2)))}
              className="w-7 h-7 rounded bg-white border border-gray-300 text-sm font-bold active:bg-gray-100"
            >+</button>
          </div>
        </div>


        <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Margins</span>
          <select
            value={settings.margins}
            onChange={(e) => updateSetting('margins', e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="narrow">Narrow</option>
            <option value="normal">Normal</option>
            <option value="wide">Wide</option>
          </select>
        </div>
        <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Date Format</span>
          <select
            value={settings.dateFormat}
            onChange={(e) => updateSetting('dateFormat', e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="Jan 2024">Jan 2024</option>
            <option value="01/2024">01/2024</option>
            <option value="January 2024">January 2024</option>
            <option value="2024-01">2024-01</option>
          </select>
        </div>
        <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Bullet Style</span>
          <select
            value={settings.bulletStyle}
            onChange={(e) => updateSetting('bulletStyle', e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="round">&#8226; Round</option>
            <option value="filled">&#9679; Filled</option>
            <option value="dash">&#8212; Dash</option>
            <option value="arrow">&#9654; Arrow</option>
          </select>
        </div>
      </div>
    </div>
  )
}


export default function ToolsPanel({
  isOpen,
  onClose,
  resumeData,
  onUpdateData,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  onImport,
  currentLanguage,
  onLanguageChange,
  initialSheet,
  onPrint,
  formatSettings,
  onFormatChange,
}) {
  const [activeSubSheet, setActiveSubSheet] = useState(null)

  useEffect(() => {
    if (isOpen && initialSheet) {
      setActiveSubSheet(initialSheet)
    }
    if (!isOpen) {
      setActiveSubSheet(null)
    }
  }, [isOpen, initialSheet])

  const closeSubSheet = () => {
    setActiveSubSheet(null)
    if (initialSheet) {
      onClose()
    }
  }

  const tools = [
    { id: 'share', label: 'Share', icon: FaShareAlt, color: 'bg-blue-100 text-blue-600' },
    { id: 'cover-letter', label: 'Cover Letter', icon: FaEnvelope, color: 'bg-green-100 text-green-600' },
    { id: 'job-match', label: 'Job Match', icon: FaBullseye, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'grammar', label: 'Grammar', icon: FaSpellCheck, color: 'bg-red-100 text-red-600' },
    { id: 'tailor', label: 'Tailor', icon: FaCrosshairs, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'quantify', label: 'Quantify', icon: FaChartBar, color: 'bg-orange-100 text-orange-600' },
    { id: 'language', label: 'Language', icon: FaGlobe, color: 'bg-cyan-100 text-cyan-600', flag: '🇺🇸' },
    { id: 'keywords', label: 'Keywords', icon: FaKey, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'ats-check', label: 'ATS Check', icon: FaRobot, color: 'bg-purple-100 text-purple-600' },
    { id: 'summarize', label: 'Summarize', icon: FaMagic, color: 'bg-pink-100 text-pink-600' },
    { id: 'format', label: 'Format', icon: FaFileAlt, color: 'bg-teal-100 text-teal-600' },
    { id: 'export', label: 'Export', icon: FaFileExport, color: 'bg-green-100 text-green-600' },
    { id: 'import', label: 'Import', icon: FaFileImport, color: 'bg-blue-100 text-blue-600' },
    { id: 'undo', label: 'Undo', icon: FaUndo, color: 'bg-gray-100 text-gray-600', disabled: !canUndo },
    { id: 'redo', label: 'Redo', icon: FaRedo, color: 'bg-gray-100 text-gray-600', disabled: !canRedo },
  ]


  const handleToolClick = (toolId) => {
    switch (toolId) {
      case 'share':
      case 'cover-letter':
      case 'job-match':
      case 'grammar':
      case 'tailor':
      case 'quantify':
      case 'language':
      case 'keywords':
      case 'ats-check':
      case 'summarize':
      case 'format':
        setActiveSubSheet(toolId)
        break
      case 'export':
        onExport?.()
        onClose()
        break
      case 'import':
        onImport?.()
        onClose()
        break
      case 'undo':
        onUndo?.()
        break
      case 'redo':
        onRedo?.()
        break
      default:
        break
    }
  }

  return (
    <>
      <ToolsBottomSheet isOpen={isOpen && !activeSubSheet} onClose={onClose} title="Tools">
        <div className="grid grid-cols-4 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              disabled={tool.disabled}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all active:scale-95 ${
                tool.disabled ? 'opacity-40' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.color}`}>
                {tool.flag ? (
                  <span className="text-lg">{tool.flag}</span>
                ) : (
                  <tool.icon size={18} />
                )}
              </div>
              <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </ToolsBottomSheet>


      {/* Sub-sheets */}
      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'share'} onClose={closeSubSheet} title="Share Resume">
        <ShareSheet onClose={closeSubSheet} resumeData={resumeData} onPrint={onPrint} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'cover-letter'} onClose={closeSubSheet} title="Cover Letter">
        <CoverLetterSheet onClose={closeSubSheet} resumeData={resumeData} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'job-match'} onClose={closeSubSheet} title="Job Match">
        <JobMatchSheet onClose={closeSubSheet} resumeData={resumeData} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'grammar'} onClose={closeSubSheet} title="Grammar Check">
        <GrammarSheet onClose={closeSubSheet} resumeData={resumeData} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'tailor'} onClose={closeSubSheet} title="Tailor Resume">
        <TailorSheet onClose={closeSubSheet} resumeData={resumeData} onUpdateData={onUpdateData} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'quantify'} onClose={closeSubSheet} title="Quantify Impact">
        <QuantifySheet onClose={closeSubSheet} resumeData={resumeData} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'language'} onClose={closeSubSheet} title="Language">
        <LanguageSheet
          currentLanguage={currentLanguage}
          onSelect={onLanguageChange}
          onClose={closeSubSheet}
        />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'keywords'} onClose={closeSubSheet} title="Keywords Optimizer">
        <KeywordsSheet onClose={closeSubSheet} resumeData={resumeData} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'ats-check'} onClose={closeSubSheet} title="ATS Compatibility Check">
        <ATSCheckSheet onClose={closeSubSheet} resumeData={resumeData} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'summarize'} onClose={closeSubSheet} title="AI Summarize">
        <SummarizeSheet onClose={closeSubSheet} resumeData={resumeData} onUpdateData={onUpdateData} />
      </ToolsBottomSheet>

      <ToolsBottomSheet isOpen={isOpen && activeSubSheet === 'format'} onClose={closeSubSheet} title="Format & Layout">
        <FormatSheet onClose={closeSubSheet} formatSettings={formatSettings} onFormatChange={onFormatChange} />
      </ToolsBottomSheet>
    </>
  )
}
