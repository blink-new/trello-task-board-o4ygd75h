import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageSquare, Paperclip } from 'lucide-react'
import { TAG_COLORS } from '@/types'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-yellow-500'
      case 'low':
        return 'border-l-green-500'
      default:
        return 'border-l-gray-300'
    }
  }

  const getTagColor = (tagName: string) => {
    const colorIndex = tagName.length % TAG_COLORS.length
    return TAG_COLORS[colorIndex]
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(task.priority)} ${
        isDragging || isSortableDragging ? 'rotate-3 shadow-lg' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3">
        <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">
          {task.title}
        </h4>
        
        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag, index) => {
              const tagColor = getTagColor(tag)
              return (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-1"
                  style={{
                    backgroundColor: tagColor.bg,
                    color: tagColor.value,
                    border: `1px solid ${tagColor.value}20`
                  }}
                >
                  {tag}
                </Badge>
              )
            })}
          </div>
        )}

        {/* Footer with metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {task.description && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>1</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              <span>0</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}