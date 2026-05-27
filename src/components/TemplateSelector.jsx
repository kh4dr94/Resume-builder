import { motion } from 'framer-motion'
import { FaCheck, FaPalette } from 'react-icons/fa'
import { templates } from './templates'

function TemplateSkeleton({ id }) {
  switch (id) {
    case 'modern':
      return (
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
      )
    case 'classic':
      return (
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
      )
    case 'creative':
      return (
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
      )
    case 'minimal':
      return (
        <div className="flex flex-col h-full p-1.5">
          <div className="w-14 h-1.5 bg-white/70 rounded mb-1"></div>
          <div className="w-8 h-0.5 bg-white/30 rounded mb-2"></div>
          <div className="w-full h-px bg-white/20 mb-2"></div>
          <div className="flex gap-2 flex-1">
            <div className="w-[25%] space-y-1">
              <div className="w-full h-0.5 bg-white/20 rounded"></div>
              <div className="w-full h-0.5 bg-white/20 rounded"></div>
            </div>
            <div className="w-[75%] space-y-1">
              <div className="w-8 h-1 bg-white/40 rounded"></div>
              <div className="w-full h-0.5 bg-white/20 rounded"></div>
              <div className="w-5/6 h-0.5 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      )
    case 'executive':
      return (
        <>
          <div className="h-8 bg-black/20 rounded-t p-1.5 flex flex-col justify-center">
            <div className="w-12 h-1.5 bg-white/60 rounded mb-0.5"></div>
            <div className="w-8 h-0.5 bg-[#d4a853]/80 rounded"></div>
          </div>
          <div className="flex-1 p-1.5">
            <div className="w-5 h-0.5 bg-white/30 rounded mb-1 flex items-center gap-0.5">
              <div className="w-0.5 h-0.5 bg-[#d4a853]/60 rounded-full"></div>
            </div>
            <div className="w-full h-0.5 bg-white/20 rounded mb-0.5"></div>
            <div className="w-3/4 h-0.5 bg-white/20 rounded mb-1.5"></div>
            <div className="w-5 h-0.5 bg-white/30 rounded mb-1"></div>
            <div className="w-full h-0.5 bg-white/15 rounded"></div>
          </div>
        </>
      )
    default:
      return null
  }
}

export default function TemplateSelector({ selectedTemplate, onSelect }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-50 to-fuchsia-100/80 rounded-xl flex items-center justify-center ring-1 ring-purple-100/50">
            <FaPalette className="text-purple-600" size={14} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-[13px]">Choose Template</h3>
            <p className="text-[11px] text-gray-400">5 professional designs</p>
          </div>
        </div>
        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 font-medium">
          {templates.find((t) => t.id === selectedTemplate)?.name}
        </span>
      </div>

      {/* Scrollable row for 5 templates */}
      <div className="p-4">
        <div className="grid grid-cols-5 gap-2">
          {templates.map((template) => (
            <motion.button
              key={template.id}
              onClick={() => onSelect(template.id)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                selectedTemplate === template.id
                  ? 'border-blue-500 shadow-lg shadow-blue-100/80 ring-2 ring-blue-100'
                  : 'border-gray-200/80 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Mini preview */}
              <div className={`h-[72px] bg-gradient-to-br ${template.color} relative`}>
                <div className="absolute inset-1.5 flex flex-col">
                  <TemplateSkeleton id={template.id} />
                </div>

                {/* Selected checkmark */}
                {selectedTemplate === template.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-md ring-2 ring-white"
                  >
                    <FaCheck size={7} className="text-white" />
                  </motion.div>
                )}
              </div>

              {/* Label */}
              <div className="px-1.5 py-1.5 bg-white text-center">
                <p className="text-[10px] font-semibold text-gray-700 leading-tight truncate">{template.name}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Description of selected */}
        <div className="mt-3 px-1">
          <p className="text-[11px] text-gray-400 text-center">
            {templates.find((t) => t.id === selectedTemplate)?.description}
          </p>
        </div>
      </div>
    </div>
  )
}
