import { useState, useEffect, useRef } from 'react'
import {
  FaShareAlt,
  FaEnvelope,
  FaEye,
  FaSpellCheck,
  FaCrosshairs,
  FaChartBar,
  FaGlobe,
  FaWrench,
  FaEllipsisH,
  FaFilePdf,
  FaEdit,
} from 'react-icons/fa'

export default function MobileToolbar({
  onToolsOpen,
  onShareOpen,
  onGrammarOpen,
  activeView,
  onViewChange,
}) {
  const tools = [
    { id: 'share', icon: FaShareAlt, label: 'Share', action: onShareOpen },
    { id: 'envelope', icon: FaEnvelope, label: 'Letter', action: () => onToolsOpen?.() },
    { id: 'eye', icon: FaEye, label: 'Preview', action: () => onViewChange?.('preview') },
    { id: 'grammar', icon: FaSpellCheck, label: 'Grammar', badge: 6, action: onGrammarOpen },
    { id: 'tailor', icon: FaCrosshairs, label: 'Tailor', action: () => onToolsOpen?.() },
    { id: 'quantify', icon: FaChartBar, label: 'Quantify', action: () => onToolsOpen?.() },
    { id: 'language', icon: FaGlobe, label: 'Lang', flag: '🇺🇸', action: () => onToolsOpen?.() },
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
