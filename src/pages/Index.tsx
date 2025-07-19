import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Icon from "@/components/ui/icon"
import AudioPlayer from "@/components/AudioPlayer"
import PlayQueue from "@/components/PlayQueue"

const Index = () => {
  const [currentTrack, setCurrentTrack] = useState<any>(null)
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)
  const [playQueue, setPlayQueue] = useState<any[]>([])
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  const topTracks = [
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen", plays: "2.1B", duration: "5:55", coverUrl: "/img/32882425-1015-4d5c-8e17-2baae435d8e1.jpg" },
    { id: 2, title: "Hotel California", artist: "Eagles", plays: "1.8B", duration: "6:30", coverUrl: "/img/32882425-1015-4d5c-8e17-2baae435d8e1.jpg" },
    { id: 3, title: "Stairway to Heaven", artist: "Led Zeppelin", plays: "1.5B", duration: "8:02", coverUrl: "/img/32882425-1015-4d5c-8e17-2baae435d8e1.jpg" },
    { id: 4, title: "Imagine", artist: "John Lennon", plays: "1.2B", duration: "3:03", coverUrl: "/img/32882425-1015-4d5c-8e17-2baae435d8e1.jpg" },
    { id: 5, title: "Smells Like Teen Spirit", artist: "Nirvana", plays: "900M", duration: "5:01", coverUrl: "/img/32882425-1015-4d5c-8e17-2baae435d8e1.jpg" }
  ]

  const handlePlayTrack = (track: any) => {
    setCurrentTrack(track)
    setIsPlayerVisible(true)
    
    // Add track to queue if not already there
    if (!playQueue.find(t => t.id === track.id)) {
      setPlayQueue([...playQueue, track])
    }
    
    // Set current track index in queue
    const trackIndex = playQueue.findIndex(t => t.id === track.id)
    if (trackIndex !== -1) {
      setCurrentTrackIndex(trackIndex)
    } else {
      setCurrentTrackIndex(playQueue.length)
    }
  }

  const handleNextTrack = () => {
    if (playQueue.length === 0) return
    
    const nextIndex = (currentTrackIndex + 1) % playQueue.length
    setCurrentTrackIndex(nextIndex)
    setCurrentTrack(playQueue[nextIndex])
  }

  const handlePrevTrack = () => {
    if (playQueue.length === 0) return
    
    const prevIndex = currentTrackIndex === 0 ? playQueue.length - 1 : currentTrackIndex - 1
    setCurrentTrackIndex(prevIndex)
    setCurrentTrack(playQueue[prevIndex])
  }

  const handleQueueUpdate = (newQueue: any[]) => {
    setPlayQueue(newQueue)
    
    // Update current track index if current track is still in queue
    if (currentTrack) {
      const newIndex = newQueue.findIndex(t => t.id === currentTrack.id)
      if (newIndex !== -1) {
        setCurrentTrackIndex(newIndex)
      } else if (newQueue.length > 0) {
        // If current track was removed, play first track in queue
        setCurrentTrackIndex(0)
        setCurrentTrack(newQueue[0])
      } else {
        // If queue is empty, stop playback
        setCurrentTrack(null)
        setIsPlayerVisible(false)
      }
    }
  }

  const handleQueueTrackSelect = (track: any) => {
    const trackIndex = playQueue.findIndex(t => t.id === track.id)
    if (trackIndex !== -1) {
      setCurrentTrackIndex(trackIndex)
      setCurrentTrack(track)
    }
  }

  const toggleQueue = () => {
    setIsQueueOpen(!isQueueOpen)
  }

  const featuredPlaylists = [
    { id: 1, name: "Trending Now", tracks: 50, followers: "2.3M" },
    { id: 2, name: "Global Top 50", tracks: 50, followers: "8.1M" },
    { id: 3, name: "Chill Vibes", tracks: 120, followers: "1.5M" },
    { id: 4, name: "Workout Hits", tracks: 80, followers: "950K" }
  ]

  const pricingPlans = [
    { 
      name: "Free", 
      price: "0₽", 
      period: "/месяц", 
      features: ["Реклама между треками", "Пропуски ограничены", "Качество 128 kbps"],
      popular: false
    },
    { 
      name: "Premium", 
      price: "199₽", 
      period: "/месяц", 
      features: ["Без рекламы", "Неограниченные пропуски", "Качество 320 kbps", "Офлайн режим"],
      popular: true
    },
    { 
      name: "Family", 
      price: "299₽", 
      period: "/месяц", 
      features: ["6 аккаунтов", "Все возможности Premium", "Общие плейлисты", "Родительский контроль"],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Music" size={32} className="text-white" />
            <span className="text-2xl font-bold">SoundWave</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-gray-300 transition-colors">Главная</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Поиск</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Библиотека</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-transparent border-gray-600 text-white hover:bg-gray-800">
              Войти
            </Button>
            <Button className="bg-white text-black hover:bg-gray-200">
              Попробовать бесплатно
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            90+ миллионов треков
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Откройте мир музыки из разных стран. Премиальное качество, социальные функции, общие плейлисты
          </p>
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Найти музыку, исполнителей, альбомы..."
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 h-12"
              />
            </div>
          </div>
          <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg">
            Начать слушать
          </Button>
        </div>
      </section>

      {/* Top Tracks */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Топ треков мира</h2>
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Показать все
              <Icon name="ChevronRight" size={16} className="ml-1" />
            </Button>
          </div>
          <div className="grid gap-4">
            {topTracks.map((track, index) => (
              <Card key={track.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 w-6 text-center font-mono">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <img 
                      src="/img/32882425-1015-4d5c-8e17-2baae435d8e1.jpg" 
                      alt="Album cover"
                      className="w-12 h-12 rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{track.title}</h3>
                      <p className="text-gray-400">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-gray-400">{track.plays} прослушиваний</span>
                    <span className="text-gray-400">{track.duration}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-2"
                      onClick={() => handlePlayTrack(track)}
                    >
                      <Icon name="Play" size={16} className="text-white" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Playlists */}
      <section className="py-16 px-6 bg-gray-950">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Популярные плейлисты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlaylists.map((playlist) => (
              <Card key={playlist.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all hover:scale-105 cursor-pointer">
                <CardContent className="p-6">
                  <img 
                    src="/img/fddeb53f-967d-4b85-9cbb-58c921657fcd.jpg" 
                    alt="Playlist cover"
                    className="w-full aspect-square rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-lg mb-2">{playlist.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{playlist.tracks} треков</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{playlist.followers} подписчиков</span>
                    <Button size="sm" variant="ghost" className="p-2">
                      <Icon name="Play" size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Features */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Социальные функции</h2>
            <p className="text-gray-400 text-lg">Слушайте музыку вместе с друзьями</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="p-8">
                <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold mb-3">Подписки на друзей</h3>
                <p className="text-gray-400">Следите за музыкальными предпочтениями друзей и открывайте новую музыку</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="p-8">
                <Icon name="Share2" size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold mb-3">Общие плейлисты</h3>
                <p className="text-gray-400">Создавайте совместные плейлисты с друзьями и добавляйте любимые треки</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="p-8">
                <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold mb-3">Обсуждения</h3>
                <p className="text-gray-400">Делитесь впечатлениями о музыке и обсуждайте треки с сообществом</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 bg-gray-950">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Тарифные планы</h2>
            <p className="text-gray-400 text-lg">Выберите подходящий план подписки</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-white bg-gray-800' : 'bg-gray-900'} border-gray-800`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-black">
                    Популярный
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Icon name="Check" size={16} className="text-green-400 mr-3" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    {plan.name === 'Free' ? 'Начать бесплатно' : 'Выбрать план'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Music" size={24} />
                <span className="text-xl font-bold">SoundWave</span>
              </div>
              <p className="text-gray-400">Премиальная музыкальная платформа с 90+ миллионами треков</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Поиск</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Плейлисты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Подкасты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Справка</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Сообщество</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Социальные сети</h4>
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="p-2">
                  <Icon name="Twitter" size={18} />
                </Button>
                <Button size="sm" variant="ghost" className="p-2">
                  <Icon name="Instagram" size={18} />
                </Button>
                <Button size="sm" variant="ghost" className="p-2">
                  <Icon name="Facebook" size={18} />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SoundWave. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Audio Player */}
      <AudioPlayer 
        currentTrack={currentTrack}
        isVisible={isPlayerVisible}
        queue={playQueue}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        onQueueToggle={toggleQueue}
      />

      {/* Play Queue */}
      <PlayQueue
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        queue={playQueue}
        currentTrack={currentTrack}
        onTrackSelect={handleQueueTrackSelect}
        onQueueUpdate={handleQueueUpdate}
      />
    </div>
  )
}

export default Index