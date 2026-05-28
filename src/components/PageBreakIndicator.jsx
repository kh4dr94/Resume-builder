import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExclamationTriangle } from 'react-icons/fa'

// A4 height in pixels at 96dpi: 297mm * 96/25.4 = 1122.52px
const A4_HEIGHT_PX = 1123

export default function PageBreakIndicator({ resumeRef, scale, darkMode }) {
  const [contentHeight, setContentHeight] = useState(0)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    if (!resumeRef?.current) return

    const updateMeasurements = () => {
      const el = resumeRef.current
      if (el) {
        const height = el.scrollHeight
        setContentHeight(height)
        setPages(Math.ceil(height / A4_HEIGHT_PX))
      }
    }

    updateMeasurements()

    const observer = new MutationObserver(updateMeasurements)
    observer.observe(resumeRef.current, { childList: true, subtree: true, characterData: true })

    // Also poll occasionally for layout changes
    const interval = setInterval(updateMeasurements, 2000)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [resumeRef])

  const isOverflowing = contentHeight > A4_HEIGHT_PX

  return (
    <>
      {/* Page break line - positioned inside the preview area */}
      {isOverflowing && (
        <div
          className="absolute left-0 right-0 pointer-events-none z-10"
          style={{ top: `${A4_HEIGHT_PX * scale}px` }}
        >
          <div className="relative">
            <div className="border-t-2 border-dashed border-red-400/60" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${darkMode ? 'bg-gray-800 text-red-400' : 'bg-white text-red-500'} border border-red-300/50`}>
                Page 1 | Page 2
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Overflow warning */}
      <AnimatePresence>
        {isOverflowing && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium mt-2 ${darkMode ? 'bg-amber-900/20 text-amber-400 border border-amber-800/30' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}
          >
            <FaExclamationTriangle size={10} />
            <span>
              Resume is {pages} page{pages > 1 ? 's' : ''} — content extends beyond single page ({Math.round(contentHeight)}px / {A4_HEIGHT_PX}px)
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
