'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { getChapterById } from '@/data/chapters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Send, Sparkles, Bot, User, Trash2 } from 'lucide-react'

export function AiChatPanel() {
  const chatOpen = useAppStore((s) => s.chatOpen)
  const toggleChat = useAppStore((s) => s.toggleChat)
  const chatMessages = useAppStore((s) => s.chatMessages)
  const addChatMessage = useAppStore((s) => s.addChatMessage)
  const clearChat = useAppStore((s) => s.clearChat)
  const currentChapterId = useAppStore((s) => s.currentChapterId)

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  // Auto-focus input when chat opens
  useEffect(() => {
    if (chatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [chatOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    addChatMessage('user', userMessage)
    setIsLoading(true)

    try {
      // Get chapter context if viewing a chapter
      const currentChapter = currentChapterId
        ? getChapterById(currentChapterId)
        : null
      const chapterContext = currentChapter
        ? `${currentChapter.number} — ${currentChapter.title}: ${currentChapter.translation}`
        : undefined

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          chapterContext,
        }),
      })

      const data = await response.json()

      if (data.message) {
        addChatMessage('assistant', data.message)
      } else if (data.error) {
        addChatMessage(
          'assistant',
          'Je suis désolé, une erreur est survenue. Veuillez réessayer.'
        )
      }
    } catch {
      addChatMessage(
        'assistant',
        'Je suis désolé, une erreur de connexion est survenue. Veuillez réessayer.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = [
    'Comment approfondir ma méditation du Coran ?',
    'Expliquez-moi le concept de miroir dans le tadabbur',
    'Quelle est la différence entre Rahman et Rahim ?',
    'Comment vivre le Bismillah au quotidien ?',
  ]

  return (
    <motion.aside
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-full sm:w-96 border-l bg-background shadow-lg flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Assistant Spirituel</h3>
            {currentChapterId && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400">
                Contexte : Chapitre {currentChapterId.toUpperCase()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            aria-label="Effacer la conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleChat}
            className="h-7 w-7"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
        {chatMessages.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <div className="text-4xl">🪞</div>
            <h4 className="text-sm font-semibold">Assistant Spirituel</h4>
            <p className="text-xs text-muted-foreground max-w-[260px] mx-auto">
              Posez vos questions sur le Coran, le tadabbur, ou demandez des
              conseils pour approfondir votre méditation.
            </p>
            <div className="space-y-2 pt-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="block w-full text-left text-xs px-3 py-2.5 rounded-lg border border-amber-200/50 dark:border-amber-800/30 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3 pb-2">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mt-0.5">
                    <Bot className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-600 text-white'
                      : 'bg-muted'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary mt-0.5">
                    <User className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Bot className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="bg-muted rounded-xl px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question..."
            className="text-sm"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-1.5 text-center">
          L&apos;assistant oriente vers la réflexion, ne remplace pas un savant.
        </p>
      </div>
    </motion.aside>
  )
}
