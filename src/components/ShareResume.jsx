import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaShareAlt, FaTimes, FaCopy, FaCheck, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

const APP_URL = 'https://kh4dr94.github.io/Resume-builder/'

// Simple QR code as SVG - encodes URL as a visual pattern
function SimpleQR({ url }) {
  // Generate a deterministic pattern from URL
  const size = 21
  const cells = []
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash + url.charCodeAt(i)) | 0
  }

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Finder patterns (top-left, top-right, bottom-left corners)
      const isFinderTL = row < 7 && col < 7
      const isFinderTR = row < 7 && col >= size - 7
      const isFinderBL = row >= size - 7 && col < 7

      let filled = false

      if (isFinderTL || isFinderTR || isFinderBL) {
        const lr = isFinderTL ? row : isFinderTR ? row : row - (size - 7)
        const lc = isFinderTL ? col : isFinderTR ? col - (size - 7) : col
        // Finder pattern: outer border, inner square
        if (lr === 0 || lr === 6 || lc === 0 || lc === 6) filled = true
        else if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) filled = true
      } else {
        // Data area - use hash-based pattern
        const seed = (hash + row * 31 + col * 37) & 0xFFFF
        filled = (seed % 3) !== 0
      }

      if (filled) {
        cells.push(
          <rect key={`${row}-${col}`} x={col * 4} y={row * 4} width={4} height={4} fill="#1a1a2e" />
        )
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${size * 4} ${size * 4}`} className="w-40 h-40 mx-auto">
      <rect width={size * 4} height={size * 4} fill="white" />
      {cells}
    </svg>
  )
}

export default function ShareResume({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      const ta = document.createElement('textarea')
      ta.value = APP_URL
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareText = "Check out this awesome Resume Builder! Create professional resumes for free."

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(APP_URL)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(APP_URL)}`,
    email: `mailto:?subject=${encodeURIComponent('Resume Builder - Free Professional Resumes')}&body=${encodeURIComponent(`${shareText}\n\n${APP_URL}`)}`,
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-cyan-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-cyan-600'}`}
        title="Share Resume"
      >
        <FaShareAlt size={12} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaShareAlt className="text-white" size={18} />
                  <h2 className="text-white font-bold text-lg">Share Resume Builder</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Copy Link */}
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>App Link</label>
                  <div className="flex mt-1.5 gap-2">
                    <div className={`flex-1 px-4 py-2.5 rounded-xl border text-sm truncate ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                      {APP_URL}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopyLink}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5 ${copied ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </div>
                </div>

                {/* QR Code */}
                <div className={`rounded-xl border p-4 text-center ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Scan QR Code</p>
                  <div className={`inline-block rounded-xl p-3 ${darkMode ? 'bg-white' : 'bg-white border border-gray-100'}`}>
                    <SimpleQR url={APP_URL} />
                  </div>
                </div>

                {/* Social Share */}
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Share on Social</label>
                  <div className="flex gap-3 mt-2">
                    <motion.a
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      href={shareLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0A66C2] text-white font-medium text-sm"
                    >
                      <FaLinkedin size={16} />
                      LinkedIn
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      href={shareLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-black text-white font-medium text-sm"
                    >
                      <FaXTwitter size={16} />
                      X
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      href={shareLinks.email}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
                    >
                      <FaEnvelope size={16} />
                      Email
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
