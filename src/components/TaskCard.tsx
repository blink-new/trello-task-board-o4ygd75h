import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Calendar, MessageSquare, Paperclip, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { TAG_COLORS } from '@/types'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

export function TaskCard({ task, isDragging = false, onEdit, onDelete }: TaskCardProps) {
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
      className={`group cursor-pointer hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(task.priority)} ${
        isDragging || isSortableDragging ? 'rotate-3 shadow-lg' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-800 line-clamp-2 flex-1 mr-2">
            {task.title}
          </h4>
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
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