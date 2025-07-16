import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, Settings, LogOut } from 'lucide-react'
import { blink } from '@/blink/client'
import type { Board } from '@/types'

interface BoardHeaderProps {
  board: Board | null
  user: any
  onCreateColumn: () => void
}

export function BoardHeader({ board, user, onCreateColumn }: BoardHeaderProps) {
  const handleLogout = () => {
    blink.auth.logout()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {board?.title || 'Task Board'}
          </h1>
          {board?.description && (
            <p className="text-gray-600 text-sm">{board.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateColumn}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Column
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>

          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                {user?.email || 'User'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}