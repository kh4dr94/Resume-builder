import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { FaGripVertical, FaListUl } from 'react-icons/fa'
import DraggableSection from './DraggableSection'

const SECTION_LABELS = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  languages: 'Languages',
}

export const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'education',
  'skills',
  'certifications',
  'languages',
]

export default function SectionOrderPanel({ sectionOrder, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.indexOf(active.id)
      const newIndex = sectionOrder.indexOf(over.id)
      onReorder(arrayMove(sectionOrder, oldIndex, newIndex))
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-green-50 to-emerald-100/80 rounded-xl flex items-center justify-center ring-1 ring-green-100/50">
            <FaListUl className="text-green-600" size={14} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-[13px]">Section Order</h3>
            <p className="text-[11px] text-gray-400">Drag to reorder resume sections</p>
          </div>
        </div>
        <button
          onClick={() => onReorder([...DEFAULT_SECTION_ORDER])}
          className="text-[11px] text-gray-500 hover:text-gray-700 transition-colors font-medium"
          title="Reset to default order"
        >
          Reset
        </button>
      </div>

      <div className="p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sectionOrder}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1.5">
              {sectionOrder.map((sectionId, index) => (
                <DraggableSection key={sectionId} id={sectionId}>
                  <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                    <span className="text-[10px] font-bold text-gray-300 w-4">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700 font-medium flex-1">
                      {SECTION_LABELS[sectionId]}
                    </span>
                    <FaGripVertical className="text-gray-300" size={10} />
                  </div>
                </DraggableSection>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
