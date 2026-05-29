import {
  FaShareAlt,
  FaEnvelope,
  FaBullseye,
  FaSpellCheck,
  FaCrosshairs,
  FaChartBar,
  FaGlobe,
} from 'react-icons/fa'

const LANGUAGE_FLAGS = {
  'en-US': '🇺🇸',
  'en-GB': '🇬🇧',
  'en-AU': '🇦🇺',
  'en-CA': '🇨🇦',
  'en-NZ': '🇳🇿',
  'en-ZA': '🇿🇦',
  'en-IN': '🇮🇳',
  'es': '🇪🇸',
  'es-MX': '🇲🇽',
  'fr': '🇫🇷',
  'fr-CA': '🇨🇦',
  'de': '🇩🇪',
  'pt': '🇧🇷',
  'pt-PT': '🇵🇹',
  'it': '🇮🇹',
  'nl': '🇳🇱',
  'pl': '🇵🇱',
  'ru': '🇷🇺',
  'tr': '🇹🇷',
  'ko': '🇰🇷',
  'zh': '🇨🇳',
  'zh-TW': '🇹🇼',
  'ja': '🇯🇵',
  'ar': '🇸🇦',
  'hi': '🇮🇳',
  'th': '🇹🇭',
  'vi': '🇻🇳',
  'id': '🇮🇩',
  'ms': '🇲🇾',
  'sv': '🇸🇪',
  'da': '🇩🇰',
  'no': '🇳🇴',
  'fi': '🇫🇮',
  'he': '🇮🇱',
  'uk': '🇺🇦',
}

export default function MobileToolbar({
  onShareOpen,
  onCoverLetterOpen,
  onJobMatchOpen,
  onGrammarOpen,
  onTailorOpen,
  onQuantifyOpen,
  onLanguageOpen,
  currentLanguage,
}) {
  const currentFlag = LANGUAGE_FLAGS[currentLanguage] || '🇺🇸'

  const tools = [
    { id: 'share', icon: FaShareAlt, label: 'Share', action: onShareOpen },
    { id: 'envelope', icon: FaEnvelope, label: 'Letter', action: onCoverLetterOpen },
    { id: 'jobmatch', icon: FaBullseye, label: 'Match', action: onJobMatchOpen },
    { id: 'grammar', icon: FaSpellCheck, label: 'Grammar', action: onGrammarOpen },
    { id: 'tailor', icon: FaCrosshairs, label: 'Tailor', action: onTailorOpen },
    { id: 'quantify', icon: FaChartBar, label: 'Quantify', action: onQuantifyOpen },
    { id: 'language', icon: FaGlobe, label: 'Lang', flag: currentFlag, action: onLanguageOpen },
  ]

  return (
    <div className="bg-white border-y border-gray-200 px-2 py-2 overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={tool.action}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            {tool.flag ? (
              <span className="text-sm">{tool.flag}</span>
            ) : (
              <tool.icon size={16} className="text-gray-600" />
            )}
            {tool.badge && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {tool.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
