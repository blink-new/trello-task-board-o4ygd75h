import { useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreHorizontal } from 'lucide-react'
import { TaskCard } from './TaskCard'
import type { Column, Task } from '@/types'

interface TaskColumnProps {
  column: Column
  tasks: Task[]
  onCreateTask: () => void
}

export function TaskColumn({ column, tasks, onCreateTask }: TaskColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  })

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      accepts: ['task']
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const sortedTasks = tasks.sort((a, b) => a.position - b.position)

  return (
    <div
      ref={(node) => {
        setSortableRef(node)
        setDroppableRef(node)
      }}
      style={style}
      className="bg-gray-50 rounded-lg p-4 min-w-[280px] max-w-[280px] flex flex-col"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="font-semibold text-gray-800">{column.title}</h3>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Tasks */}
      <div className="flex-1 space-y-3 min-h-[200px]">
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Add Task Button */}
      <Button
        variant="ghost"
        className="mt-3 w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        onClick={onCreateTask}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add a card
      </Button>
    </div>
  )
}