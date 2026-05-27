import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FaGripVertical } from 'react-icons/fa'

export default function DraggableSection({ id, label, darkMode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
        isDragging
          ? darkMode ? 'bg-gray-700 border-indigo-500 shadow-lg' : 'bg-indigo-50 border-indigo-300 shadow-lg'
          : darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className={`cursor-grab active:cursor-grabbing p-1 rounded ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
        title="Drag to reorder"
      >
        <FaGripVertical size={12} />
      </button>
      <span className={`text-[12px] font-medium select-none ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {label}
      </span>
    </div>
  )
}
