import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Icon from "@/components/ui/icon"

interface Track {
  id: number
  title: string
  artist: string
  duration: string
  coverUrl: string
}

interface PlayQueueProps {
  isOpen: boolean
  onClose: () => void
  queue: Track[]
  currentTrack: Track | null
  onTrackSelect: (track: Track) => void
  onQueueUpdate: (newQueue: Track[]) => void
}

const PlayQueue = ({ 
  isOpen, 
  onClose, 
  queue, 
  currentTrack, 
  onTrackSelect, 
  onQueueUpdate 
}: PlayQueueProps) => {
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [dragOverItem, setDragOverItem] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverItem(index)
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedItem === null) return

    const newQueue = [...queue]
    const draggedTrack = newQueue[draggedItem]
    
    // Remove dragged item
    newQueue.splice(draggedItem, 1)
    
    // Insert at new position
    const insertIndex = draggedItem < dropIndex ? dropIndex - 1 : dropIndex
    newQueue.splice(insertIndex, 0, draggedTrack)
    
    onQueueUpdate(newQueue)
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleRemoveFromQueue = (index: number) => {
    const newQueue = queue.filter((_, i) => i !== index)
    onQueueUpdate(newQueue)
  }

  const clearQueue = () => {
    onQueueUpdate([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-lg border-l border-gray-700 z-40 animate-slide-in-right">
      <CardHeader className="border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Очередь воспроизведения</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="p-2 hover:bg-gray-800"
          >
            <Icon name="X" size={16} className="text-gray-400" />
          </Button>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{queue.length} треков</span>
          {queue.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearQueue}
              className="text-gray-400 hover:text-white text-xs"
            >
              Очистить
            </Button>
          )}
        </div>
      </CardHeader>

      <ScrollArea className="h-full pb-24">
        <CardContent className="p-0">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="Music" size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">
                Очередь пуста
              </h3>
              <p className="text-gray-500 text-sm">
                Добавьте треки, чтобы начать воспроизведение
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {queue.map((track, index) => {
                const isCurrentTrack = currentTrack?.id === track.id
                const isDraggedOver = dragOverItem === index
                const isDragged = draggedItem === index

                return (
                  <div
                    key={`${track.id}-${index}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`
                      group relative p-3 rounded-lg transition-all cursor-move
                      ${isCurrentTrack 
                        ? 'bg-gray-700 border border-white/20' 
                        : 'bg-gray-800/50 hover:bg-gray-800'
                      }
                      ${isDraggedOver ? 'bg-gray-600 border-2 border-white/30' : ''}
                      ${isDragged ? 'opacity-50 scale-95' : ''}
                    `}
                  >
                    {/* Drag indicator */}
                    <div className="absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="GripVertical" size={12} className="text-gray-500" />
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                      {/* Track number or play indicator */}
                      <div className="w-6 flex justify-center">
                        {isCurrentTrack ? (
                          <div className="flex space-x-0.5">
                            <div className="w-1 h-4 bg-white animate-pulse-wave" style={{ animationDelay: '0ms' }} />
                            <div className="w-1 h-4 bg-white animate-pulse-wave" style={{ animationDelay: '150ms' }} />
                            <div className="w-1 h-4 bg-white animate-pulse-wave" style={{ animationDelay: '300ms' }} />
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 font-mono">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                        )}
                      </div>

                      {/* Track cover */}
                      <img 
                        src={track.coverUrl} 
                        alt="Track cover"
                        className="w-10 h-10 rounded"
                      />

                      {/* Track info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium truncate text-sm ${isCurrentTrack ? 'text-white' : 'text-gray-200'}`}>
                          {track.title}
                        </h4>
                        <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                      </div>

                      {/* Duration */}
                      <span className="text-xs text-gray-500 font-mono">
                        {track.duration}
                      </span>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onTrackSelect(track)}
                          className="p-1 h-6 w-6"
                        >
                          <Icon name="Play" size={12} className="text-gray-400" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFromQueue(index)}
                          className="p-1 h-6 w-6"
                        >
                          <Icon name="X" size={12} className="text-gray-400" />
                        </Button>
                      </div>
                    </div>

                    {/* Drop indicator */}
                    {isDraggedOver && (
                      <div className="absolute -top-1 left-0 right-0 h-0.5 bg-white rounded-full" />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </div>
  )
}

export default PlayQueue