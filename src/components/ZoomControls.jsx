import { motion } from 'framer-motion'
import { FaSearchPlus, FaSearchMinus, FaExpand } from 'react-icons/fa'

export default function ZoomControls({ scale, onZoomIn, onZoomOut, onReset }) {
  const percentage = Math.round(scale * 100)

  return (
    <div className="flex items-center gap-1.5">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onZoomOut}
        disabled={scale <= 0.3}
        className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
          scale <= 0.3 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'
        } text-gray-500`}
        title="Zoom out"
      >
        <FaSearchMinus size={10} />
      </motion.button>

      <span className="text-[10px] font-mono text-gray-500 min-w-[32px] text-center">
        {percentage}%
      </span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onZoomIn}
        disabled={scale >= 1}
        className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
          scale >= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'
        } text-gray-500`}
        title="Zoom in"
      >
        <FaSearchPlus size={10} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onReset}
        className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-gray-200 text-gray-500 transition-all"
        title="Reset zoom"
      >
        <FaExpand size={9} />
      </motion.button>
    </div>
  )
}
