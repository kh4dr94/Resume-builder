import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaPalette, FaEdit, FaMagic, FaFilePdf } from 'react-icons/fa'

const STEPS = [
  {
    title: 'Choose a Template',
    description: 'Pick from 12+ professionally designed templates to match your style and industry.',
    icon: FaPalette,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Fill in Your Details',
    description: 'Add your experience, skills, and education using our intuitive form with real-time preview.',
    icon: FaEdit,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Customize with AI',
    description: 'Use AI-powered suggestions to optimize your resume for ATS systems and recruiters.',
    icon: FaMagic,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Download & Share',
    description: 'Export as PDF or DOCX, share with a link, or print directly from your browser.',
    icon: FaFilePdf,
    gradient: 'from-green-500 to-emerald-500',
  },
]

const STORAGE_KEY = 'resumeBuilder_hasSeenTour'

export default function WelcomeTour() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem(STORAGE_KEY)
      if (!hasSeen) {
        setShow(true)
      }
    } catch (e) {}
  }, [])

  const dismiss = () => {
    setShow(false)
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch (e) {}
  }

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      dismiss()
    }
  }

  if (!show) return null

  const currentStep = STEPS[step]
  const Icon = currentStep.icon

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${currentStep.gradient} px-6 py-8 text-center relative`}>
              <button
                onClick={dismiss}
                className="absolute top-3 right-3 text-white/70 hover:text-white"
              >
                <FaTimes size={16} />
              </button>
              <motion.div
                key={step}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Icon className="text-white" size={28} />
              </motion.div>
              <motion.h2
                key={`title-${step}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-white font-bold text-xl"
              >
                {currentStep.title}
              </motion.h2>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <motion.p
                key={`desc-${step}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-gray-600 text-center text-sm leading-relaxed"
              >
                {currentStep.description}
              </motion.p>

              {/* Navigation dots */}
              <div className="flex justify-center gap-2 mt-6">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === step ? 'bg-blue-500 w-6' : 'bg-gray-200 hover:bg-gray-300'}`}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={dismiss}
                  className="text-sm text-gray-400 hover:text-gray-600 font-medium"
                >
                  Skip
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={next}
                  className={`px-6 py-2.5 rounded-xl bg-gradient-to-r ${currentStep.gradient} text-white font-semibold text-sm shadow-lg`}
                >
                  {step === STEPS.length - 1 ? 'Get Started' : 'Next'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
