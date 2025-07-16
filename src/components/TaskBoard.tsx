import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Plus, Settings } from 'lucide-react'
import { TaskColumn } from './TaskColumn'
import { TaskCard } from './TaskCard'
import { CreateTaskModal } from './CreateTaskModal'
import { CreateColumnModal } from './CreateColumnModal'
import { BoardHeader } from './BoardHeader'
import { blink } from '@/blink/client'
import type { Board, Column, Task } from '@/types'

export function TaskBoard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [boards, setBoards] = useState<Board[]>([])
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null)
  const [columns, setColumns] = useState<Column[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState<string>('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Define callback functions first
  const loadBoards = useCallback(async () => {
    if (!user?.id) return
    
    try {
      // Load boards from localStorage for now (can be upgraded to database later)
      const savedBoards = localStorage.getItem(`boards_${user.id}`)
      if (savedBoards) {
        const boards = JSON.parse(savedBoards)
        setBoards(boards)
        setCurrentBoard(boards[0] || null)
      } else {
        // Create a default board if none exists
        const defaultBoard: Board = {
          id: 'default-board',
          title: 'My Task Board',
          description: 'Default task board',
          userId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setBoards([defaultBoard])
        setCurrentBoard(defaultBoard)
        localStorage.setItem(`boards_${user.id}`, JSON.stringify([defaultBoard]))
      }
    } catch (error) {
      console.error('Error loading boards:', error)
    }
  }, [user])

  const loadBoardData = useCallback(async () => {
    if (!currentBoard?.id || !user?.id) return
    
    try {
      // Load columns and tasks from localStorage
      const savedColumns = localStorage.getItem(`columns_${user.id}_${currentBoard.id}`)
      const savedTasks = localStorage.getItem(`tasks_${user.id}_${currentBoard.id}`)
      
      if (savedColumns && savedTasks) {
        setColumns(JSON.parse(savedColumns))
        setTasks(JSON.parse(savedTasks))
      } else {
        // Create default columns if none exist
        const defaultColumns: Column[] = [
          {
            id: 'todo',
            title: 'To Do',
            boardId: currentBoard.id,
            position: 0,
            color: '#ef4444',
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'in-progress',
            title: 'In Progress',
            boardId: currentBoard.id,
            position: 1,
            color: '#f97316',
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'done',
            title: 'Done',
            boardId: currentBoard.id,
            position: 2,
            color: '#22c55e',
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
        
        // Sample tasks
        const sampleTasks: Task[] = [
          {
            id: 'task-1',
            title: 'Design new landing page',
            description: 'Create a modern and responsive landing page design',
            columnId: 'todo',
            position: 0,
            tags: ['Design', 'UI/UX'],
            priority: 'high',
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'task-2',
            title: 'Implement user authentication',
            description: 'Set up login and registration functionality',
            columnId: 'in-progress',
            position: 0,
            tags: ['Backend', 'Security'],
            priority: 'medium',
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'task-3',
            title: 'Write documentation',
            description: 'Create comprehensive API documentation',
            columnId: 'done',
            position: 0,
            tags: ['Documentation'],
            priority: 'low',
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]

        setColumns(defaultColumns)
        setTasks(sampleTasks)
        
        // Save to localStorage
        localStorage.setItem(`columns_${user.id}_${currentBoard.id}`, JSON.stringify(defaultColumns))
        localStorage.setItem(`tasks_${user.id}_${currentBoard.id}`, JSON.stringify(sampleTasks))
      }
    } catch (error) {
      console.error('Error loading board data:', error)
    }
  }, [currentBoard, user])

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Load initial data
  useEffect(() => {
    if (user?.id) {
      loadBoards()
    }
  }, [user?.id, loadBoards])

  // Load board data when current board changes
  useEffect(() => {
    if (currentBoard?.id) {
      loadBoardData()
    }
  }, [currentBoard?.id, loadBoardData])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const saveTasks = useCallback((updatedTasks: Task[]) => {
    if (user?.id && currentBoard?.id) {
      localStorage.setItem(`tasks_${user.id}_${currentBoard.id}`, JSON.stringify(updatedTasks))
    }
  }, [user?.id, currentBoard?.id])

  const saveColumns = useCallback((updatedColumns: Column[]) => {
    if (user?.id && currentBoard?.id) {
      localStorage.setItem(`columns_${user.id}_${currentBoard.id}`, JSON.stringify(updatedColumns))
    }
  }, [user?.id, currentBoard?.id])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeTask = tasks.find(t => t.id === active.id)
    if (!activeTask) return

    const overId = over.id as string
    const overColumn = columns.find(c => c.id === overId)
    const overTask = tasks.find(t => t.id === overId)

    let updatedTasks = tasks

    if (overColumn) {
      // Dropped on a column
      const columnTasks = tasks.filter(t => t.columnId === overColumn.id)
      const newPosition = columnTasks.length

      const updatedTask = {
        ...activeTask,
        columnId: overColumn.id,
        position: newPosition,
        updatedAt: new Date().toISOString()
      }

      updatedTasks = tasks.map(t => t.id === activeTask.id ? updatedTask : t)
      setTasks(updatedTasks)
      saveTasks(updatedTasks)
    } else if (overTask && overTask.columnId !== activeTask.columnId) {
      // Dropped on a task in different column
      const targetColumnTasks = tasks.filter(t => t.columnId === overTask.columnId && t.id !== activeTask.id)
      const targetIndex = targetColumnTasks.findIndex(t => t.id === overTask.id)
      
      const updatedTask = {
        ...activeTask,
        columnId: overTask.columnId,
        position: targetIndex,
        updatedAt: new Date().toISOString()
      }

      updatedTasks = tasks.map(t => t.id === activeTask.id ? updatedTask : t)
      setTasks(updatedTasks)
      saveTasks(updatedTasks)
    } else if (overTask && overTask.columnId === activeTask.columnId) {
      // Reordering within same column
      const columnTasks = tasks.filter(t => t.columnId === activeTask.columnId)
      const oldIndex = columnTasks.findIndex(t => t.id === activeTask.id)
      const newIndex = columnTasks.findIndex(t => t.id === overTask.id)
      
      const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex)
      updatedTasks = tasks.map(task => {
        const reorderedTask = reorderedTasks.find(rt => rt.id === task.id)
        if (reorderedTask) {
          return { ...task, position: reorderedTasks.indexOf(reorderedTask), updatedAt: new Date().toISOString() }
        }
        return task
      })

      setTasks(updatedTasks)
      saveTasks(updatedTasks)
    }
  }

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
  }

  const handleCreateColumn = (columnData: Omit<Column, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'boardId' | 'position'>) => {
    const newColumn: Column = {
      ...columnData,
      id: `column-${Date.now()}`,
      boardId: currentBoard!.id,
      position: columns.length,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updatedColumns = [...columns, newColumn]
    setColumns(updatedColumns)
    saveColumns(updatedColumns)
  }

  const openCreateTask = (columnId: string) => {
    setSelectedColumnId(columnId)
    setEditingTask(null)
    setIsCreateTaskOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setSelectedColumnId(task.columnId)
    setIsCreateTaskOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId)
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
  }

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        ...taskData,
        updatedAt: new Date().toISOString()
      }
      const updatedTasks = tasks.map(t => t.id === editingTask.id ? updatedTask : t)
      setTasks(updatedTasks)
      saveTasks(updatedTasks)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Task Board</h1>
          <p className="text-gray-600 mb-6">Please sign in to manage your tasks</p>
          <Button onClick={() => blink.auth.login()}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <BoardHeader 
        board={currentBoard}
        user={user}
        onCreateColumn={() => setIsCreateColumnOpen(true)}
      />
      
      <div className="p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-6">
            <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
              {columns.map(column => (
                <TaskColumn
                  key={column.id}
                  column={column}
                  tasks={tasks.filter(task => task.columnId === column.id)}
                  onCreateTask={() => openCreateTask(column.id)}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </SortableContext>
            
            <Button
              variant="outline"
              className="min-w-[280px] h-12 border-dashed border-2 border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => setIsCreateColumnOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Column
            </Button>
          </div>

          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} isDragging />}
          </DragOverlay>
        </DndContext>
      </div>

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => {
          setIsCreateTaskOpen(false)
          setEditingTask(null)
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        columnId={selectedColumnId}
        editingTask={editingTask}
      />

      <CreateColumnModal
        isOpen={isCreateColumnOpen}
        onClose={() => setIsCreateColumnOpen(false)}
        onSubmit={handleCreateColumn}
      />
    </div>
  )
}