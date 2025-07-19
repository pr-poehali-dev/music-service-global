import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Icon from "@/components/ui/icon"

interface Track {
  id: number
  title: string
  artist: string
  duration: string
  coverUrl: string
}

interface AudioPlayerProps {
  currentTrack?: Track
  isVisible: boolean
  queue: Track[]
  onNextTrack: () => void
  onPrevTrack: () => void
  onQueueToggle: () => void
}

const AudioPlayer = ({ 
  currentTrack, 
  isVisible, 
  queue, 
  onNextTrack, 
  onPrevTrack, 
  onQueueToggle 
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(220) // 3:40 in seconds
  const [volume, setVolume] = useState(75)
  const [isLiked, setIsLiked] = useState(false)
  const [waveformData, setWaveformData] = useState<number[]>([])

  // Generate random waveform data
  useEffect(() => {
    const generateWaveform = () => {
      return Array.from({ length: 80 }, () => Math.random() * 100 + 10)
    }
    setWaveformData(generateWaveform())
  }, [currentTrack])

  // Simulate time progression and auto-advance
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            // Auto-advance to next track
            onNextTrack()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration, onNextTrack])

  // Reset time when track changes
  useEffect(() => {
    setCurrentTime(0)
    setIsPlaying(true)
  }, [currentTrack])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimeSeek = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  if (!isVisible || !currentTrack) return null

  const progressPercentage = (currentTime / duration) * 100

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 animate-slide-in-bottom">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <img 
              src={currentTrack.coverUrl} 
              alt="Track cover"
              className="w-14 h-14 rounded-lg animate-scale-in"
            />
            <div className="min-w-0">
              <h4 className="font-semibold text-white truncate">{currentTrack.title}</h4>
              <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 hover:bg-gray-800"
            >
              <Icon 
                name="Heart" 
                size={16} 
                className={`transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
              />
            </Button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
            {/* Controls */}
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-800">
                <Icon name="Shuffle" size={16} className="text-gray-400" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="p-2 hover:bg-gray-800"
                onClick={onPrevTrack}
              >
                <Icon name="SkipBack" size={16} className="text-white" />
              </Button>
              <Button
                size="sm"
                onClick={handlePlayPause}
                className="bg-white text-black hover:bg-gray-200 rounded-full w-10 h-10 p-0"
              >
                <Icon 
                  name={isPlaying ? "Pause" : "Play"} 
                  size={16} 
                  className={isPlaying ? "" : "ml-0.5"}
                />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="p-2 hover:bg-gray-800"
                onClick={onNextTrack}
              >
                <Icon name="SkipForward" size={16} className="text-white" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-800">
                <Icon name="Repeat" size={16} className="text-gray-400" />
              </Button>
            </div>

            {/* Progress Bar with Waveform */}
            <div className="w-full flex items-center space-x-3">
              <span className="text-xs text-gray-400 font-mono">
                {formatTime(currentTime)}
              </span>
              
              {/* Waveform Visualization */}
              <div className="flex-1 relative h-8 flex items-center justify-center space-x-0.5">
                {waveformData.map((height, index) => {
                  const isActive = (index / waveformData.length) * 100 <= progressPercentage
                  return (
                    <div
                      key={index}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-white' : 'bg-gray-600'
                      } ${isPlaying && isActive ? 'animate-pulse' : ''}`}
                      style={{ 
                        height: `${Math.max(height / 5, 8)}px`,
                        animationDelay: `${index * 20}ms`
                      }}
                    />
                  )
                })}
                
                {/* Invisible slider for seeking */}
                <div className="absolute inset-0">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    onValueChange={handleTimeSeek}
                    className="w-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              
              <span className="text-xs text-gray-400 font-mono">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume and Additional Controls */}
          <div className="flex items-center space-x-4 min-w-0 flex-1 justify-end">
            <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-800 hidden md:flex">
              <Icon name="Mic2" size={16} className="text-gray-400" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="p-2 hover:bg-gray-800 hidden md:flex"
              onClick={onQueueToggle}
            >
              <Icon name="ListMusic" size={16} className="text-gray-400" />
              {queue.length > 0 && (
                <span className="ml-1 text-xs bg-white text-black rounded-full w-4 h-4 flex items-center justify-center">
                  {queue.length}
                </span>
              )}
            </Button>
            <div className="flex items-center space-x-2 hidden lg:flex">
              <Icon 
                name={volume === 0 ? "VolumeX" : volume < 50 ? "Volume1" : "Volume2"} 
                size={16} 
                className="text-gray-400" 
              />
              <div className="w-20">
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-full"
                />
              </div>
            </div>
            <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-800">
              <Icon name="Maximize2" size={16} className="text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer