import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGlobe, FaChevronDown } from 'react-icons/fa'

// Translation definitions for section headings
export const TRANSLATIONS = {
  en: {
    label: 'English',
    flag: '🇺🇸',
    profile: 'Profile',
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    certifications: 'Certifications',
    languages: 'Languages',
    projects: 'Projects',
    references: 'References',
    contact: 'Contact',
    interests: 'Interests',
  },
  es: {
    label: 'Español',
    flag: '🇪🇸',
    profile: 'Perfil',
    summary: 'Resumen',
    experience: 'Experiencia',
    education: 'Educación',
    skills: 'Habilidades',
    certifications: 'Certificaciones',
    languages: 'Idiomas',
    projects: 'Proyectos',
    references: 'Referencias',
    contact: 'Contacto',
    interests: 'Intereses',
  },
  fr: {
    label: 'Français',
    flag: '🇫🇷',
    profile: 'Profil',
    summary: 'Résumé',
    experience: 'Expérience',
    education: 'Formation',
    skills: 'Compétences',
    certifications: 'Certifications',
    languages: 'Langues',
    projects: 'Projets',
    references: 'Références',
    contact: 'Contact',
    interests: 'Centres d\'intérêt',
  },
  de: {
    label: 'Deutsch',
    flag: '🇩🇪',
    profile: 'Profil',
    summary: 'Zusammenfassung',
    experience: 'Berufserfahrung',
    education: 'Ausbildung',
    skills: 'Fähigkeiten',
    certifications: 'Zertifizierungen',
    languages: 'Sprachen',
    projects: 'Projekte',
    references: 'Referenzen',
    contact: 'Kontakt',
    interests: 'Interessen',
  },
  pt: {
    label: 'Português',
    flag: '🇧🇷',
    profile: 'Perfil',
    summary: 'Resumo',
    experience: 'Experiência',
    education: 'Educação',
    skills: 'Habilidades',
    certifications: 'Certificações',
    languages: 'Idiomas',
    projects: 'Projetos',
    references: 'Referências',
    contact: 'Contato',
    interests: 'Interesses',
  },
}

const LANGUAGES = Object.entries(TRANSLATIONS).map(([code, t]) => ({
  code,
  label: t.label,
  flag: t.flag,
}))

function loadLanguage() {
  try {
    return localStorage.getItem('resumeBuilder_language') || 'en'
  } catch {
    return 'en'
  }
}

function saveLanguage(lang) {
  try {
    localStorage.setItem('resumeBuilder_language', lang)
  } catch {}
}

export default function LanguageSelector({ darkMode, onLanguageChange }) {
  const [selected, setSelected] = useState(loadLanguage)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (code) => {
    setSelected(code)
    saveLanguage(code)
    setIsOpen(false)
    if (onLanguageChange) onLanguageChange(code)
  }

  const current = LANGUAGES.find(l => l.code === selected) || LANGUAGES[0]

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:text-blue-400' : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-blue-600'}`}
        title="Resume Language"
      >
        <FaGlobe size={11} />
        <span>{current.flag}</span>
        <FaChevronDown size={8} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full right-0 mt-2 w-44 rounded-xl shadow-lg border overflow-hidden z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          >
            <div className={`px-3 py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Section Language
              </p>
            </div>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full px-3 py-2 flex items-center gap-2.5 text-left transition-colors ${
                  selected === lang.code
                    ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700'
                    : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="text-xs font-medium">{lang.label}</span>
                {selected === lang.code && (
                  <span className="ml-auto text-blue-500 text-xs">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
