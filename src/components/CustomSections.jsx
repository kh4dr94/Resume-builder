import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPuzzlePiece, FaPlus, FaTrash, FaChevronDown } from 'react-icons/fa'

export default function CustomSections({ customSections = [], onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      title: '',
      content: '',
    }
    onChange([...customSections, newSection])
  }

  const updateSection = (id, field, value) => {
    onChange(customSections.map(sec => sec.id === id ? { ...sec, [field]: value } : sec))
  }

  const removeSection = (id) => {
    onChange(customSections.filter(sec => sec.id !== id))
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden transition-all duration-200 hover:border-gray-300/80 hover:shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-50 to-teal-100/80 rounded-xl flex items-center justify-center ring-1 ring-emerald-100/50">
            <FaPuzzlePiece className="text-emerald-600" size={15} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[13px] text-gray-800">Custom Sections</span>
              {customSections.length > 0 && (
                <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md font-bold ring-1 ring-emerald-100/50">
                  {customSections.length}
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-400 font-normal">Projects, Awards, Volunteer, etc.</span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center"
        >
          <FaChevronDown className="text-gray-400" size={11} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-3 border-t border-gray-100">
              <div className="space-y-4">
                {customSections.map((section) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative p-4 bg-gradient-to-b from-gray-50/80 to-gray-50/40 rounded-xl border border-gray-200/60"
                  >
                    <button
                      onClick={() => removeSection(section.id)}
                      className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-100 transition-all"
                    >
                      <FaTrash size={11} />
                    </button>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                          placeholder="e.g. Projects, Awards, Publications, Volunteer Work"
                          className="w-full px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all text-sm text-gray-800 placeholder:text-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                          Content
                        </label>
                        <textarea
                          value={section.content}
                          onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                          placeholder="• Describe your achievements, projects, or activities&#10;• Use bullet points for better readability"
                          rows={4}
                          className="w-full px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all text-sm text-gray-800 placeholder:text-gray-300 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={addSection}
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-[12px] mt-2 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <FaPlus size={10} />
                  Add Custom Section
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
