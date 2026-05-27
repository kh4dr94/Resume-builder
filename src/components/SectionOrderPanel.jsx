import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import DraggableSection from './DraggableSection'
import { FaLayerGroup } from 'react-icons/fa'

const DEFAULT_SECTION_ORDER = ['summary', 'experience', 'education', 'skills', 'certifications', 'languages']

const SECTION_LABELS = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  languages: 'Languages',
}

export { DEFAULT_SECTION_ORDER }

export default function SectionOrderPanel({ sectionOrder, onReorder, darkMode }) {
  const order = sectionOrder || DEFAULT_SECTION_ORDER

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = order.indexOf(active.id)
      const newIndex = order.indexOf(over.id)
      onReorder(arrayMove(order, oldIndex, newIndex))
    }
  }

  return (
    <div className={`rounded-xl border p-4 transition-colors ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${darkMode ? 'bg-purple-900/50' : 'bg-purple-50'}`}>
          <FaLayerGroup className="text-purple-500" size={12} />
        </div>
        <h3 className={`text-[13px] font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Section Order
        </h3>
      </div>
      <p className={`text-[11px] mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Drag to reorder resume sections
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {order.map((sectionId) => (
              <DraggableSection
                key={sectionId}
                id={sectionId}
                label={SECTION_LABELS[sectionId] || sectionId}
                darkMode={darkMode}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
