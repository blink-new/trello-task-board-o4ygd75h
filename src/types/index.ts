export interface Board {
  id: string
  title: string
  description?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Column {
  id: string
  title: string
  boardId: string
  position: number
  color: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  columnId: string
  position: number
  tags: string[]
  priority: 'low' | 'medium' | 'high'
  userId: string
  createdAt: string
  updatedAt: string
}

export interface DragEndEvent {
  active: {
    id: string
    data: {
      current?: {
        type: 'task' | 'column'
        task?: Task
        column?: Column
      }
    }
  }
  over: {
    id: string
    data: {
      current?: {
        type: 'task' | 'column'
        accepts?: string[]
      }
    }
  } | null
}

export const TAG_COLORS = [
  { name: 'Red', value: '#ef4444', bg: '#fef2f2' },
  { name: 'Orange', value: '#f97316', bg: '#fff7ed' },
  { name: 'Yellow', value: '#eab308', bg: '#fefce8' },
  { name: 'Green', value: '#22c55e', bg: '#f0fdf4' },
  { name: 'Blue', value: '#3b82f6', bg: '#eff6ff' },
  { name: 'Purple', value: '#a855f7', bg: '#faf5ff' },
  { name: 'Pink', value: '#ec4899', bg: '#fdf2f8' },
  { name: 'Gray', value: '#6b7280', bg: '#f9fafb' }
] as const