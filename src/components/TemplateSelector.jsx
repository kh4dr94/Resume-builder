import { motion } from 'framer-motion'
import { FaCheck, FaPalette } from 'react-icons/fa'
import { templates } from './templates'

export default function TemplateSelector({ selectedTemplate, onSelect }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
          <FaPalette className="text-purple-600" size={16} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Choose Template</h3>
          <p className="text-xs text-gray-500">Select a design that fits your style</p>
        </div>
      </div>
      <div className="p-4 grid grid-cols-3 gap-3">
        {templates.map((template) => (
          <motion.button
            key={template.id}
            onClick={() => onSelect(template.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 shadow-lg shadow-blue-100'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Mini preview */}
            <div className={`h-24 bg-gradient-to-br ${template.color} relative`}>
              {/* Template skeleton preview */}
              <div className="absolute inset-2 flex flex-col">
                {template.id === 'modern' && (
                  <>
                    <div className="h-6 flex items-center justify-start px-2">
                      <div className="w-12 h-1.5 bg-white/60 rounded"></div>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-b mt-1 p-1.5">
                      <div className="w-8 h-1 bg-white/40 rounded mb-1"></div>
                      <div className="w-full h-0.5 bg-white/20 rounded mb-0.5"></div>
                      <div className="w-3/4 h-0.5 bg-white/20 rounded"></div>
                    </div>
                  </>
                )}
                {template.id === 'classic' && (
                  <>
                    <div className="h-5 flex items-center justify-center">
                      <div className="w-14 h-1.5 bg-white/60 rounded"></div>
                    </div>
                    <div className="w-full h-px bg-white/30 my-0.5"></div>
                    <div className="flex-1 p-1">
                      <div className="w-6 h-1 bg-white/40 rounded mb-1"></div>
                      <div className="w-full h-0.5 bg-white/20 rounded mb-0.5"></div>
                      <div className="w-5/6 h-0.5 bg-white/20 rounded mb-1.5"></div>
                      <div className="w-6 h-1 bg-white/40 rounded mb-1"></div>
                      <div className="w-full h-0.5 bg-white/20 rounded"></div>
                    </div>
                  </>
                )}
                {template.id === 'creative' && (
                  <div className="flex h-full">
                    <div className="w-[35%] bg-black/20 rounded-l p-1">
                      <div className="w-full h-1 bg-white/50 rounded mb-1"></div>
                      <div className="w-3/4 h-0.5 bg-white/30 rounded mb-2"></div>
                      <div className="w-full h-0.5 bg-white/20 rounded mb-0.5"></div>
                      <div className="w-full h-0.5 bg-white/20 rounded"></div>
                    </div>
                    <div className="w-[65%] bg-white/10 rounded-r p-1">
                      <div className="w-8 h-1 bg-white/40 rounded mb-1"></div>
                      <div className="w-full h-0.5 bg-white/20 rounded mb-0.5"></div>
                      <div className="w-3/4 h-0.5 bg-white/20 rounded mb-1.5"></div>
                      <div className="w-8 h-1 bg-white/40 rounded mb-1"></div>
                      <div className="w-full h-0.5 bg-white/20 rounded"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected checkmark */}
              {selectedTemplate === template.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md"
                >
                  <FaCheck size={10} className="text-white" />
                </motion.div>
              )}
            </div>

            {/* Label */}
            <div className="px-2 py-2 bg-white">
              <p className="text-[11px] font-semibold text-gray-800">{template.name}</p>
              <p className="text-[9px] text-gray-500 leading-tight">{template.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
