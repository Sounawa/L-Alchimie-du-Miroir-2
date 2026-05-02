'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { getChapterById } from '@/data/chapters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Send, Sparkles, Bot, User, Trash2, BookOpen, Lightbulb } from 'lucide-react'

// ─── Lightweight Markdown Renderer ──────────────────────────────────────────────
// Parses **bold**, *italic*, numbered lists, and bullet lists.
// No external dependencies.

interface MarkdownSegment {
  type: 'text' | 'bold' | 'italic' | 'bold-italic'
  content: string
}

function parseInlineMarkdown(text: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = []
  // Match ***bold-italic***, **bold**, or *italic*
  const regex = /(\*{3})(.+?)\1|(\*{2})(.+?)\3|(\*)(.+?)\5/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    // Add any plain text before this match
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }

    if (match[1]) {
      // ***bold-italic***
      segments.push({ type: 'bold-italic', content: match[2] })
    } else if (match[3]) {
      // **bold**
      segments.push({ type: 'bold', content: match[4] })
    } else if (match[5]) {
      // *italic*
      segments.push({ type: 'italic', content: match[6] })
    }

    lastIndex = regex.lastIndex
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return segments.length > 0 ? segments : [{ type: 'text', content: text }]
}

function renderInlineMarkdown(text: string) {
  const segments = parseInlineMarkdown(text)
  return segments.map((seg, i) => {
    switch (seg.type) {
      case 'bold':
        return <strong key={i} className="font-semibold">{seg.content}</strong>
      case 'italic':
        return <em key={i} className="italic">{seg.content}</em>
      case 'bold-italic':
        return <strong key={i} className="font-semibold italic">{seg.content}</strong>
      default:
        return <span key={i}>{seg.content}</span>
    }
  })
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Numbered list: "1. text" or "1) text"
    const numberedMatch = line.match(/^(\d+)[.)]\s+(.*)/)
    if (numberedMatch) {
      const items: string[] = [numberedMatch[2]]
      let num = parseInt(numberedMatch[1])
      while (i + 1 < lines.length) {
        const nextMatch = lines[i + 1].match(/^(\d+)[.)]\s+(.*)/)
        if (nextMatch && parseInt(nextMatch[1]) === num + 1) {
          items.push(nextMatch[2])
          num++
          i++
        } else {
          break
        }
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 my-2 pl-2">
          {items.map((item, j) => (
            <li key={j} className="leading-relaxed">{renderInlineMarkdown(item)}</li>
          ))}
        </ol>
      )
      i++
      continue
    }

    // Bullet list: "- text" or "* text" or "• text"
    const bulletMatch = line.match(/^[-*•]\s+(.*)/)
    if (bulletMatch) {
      const items: string[] = [bulletMatch[1]]
      while (i + 1 < lines.length) {
        const nextBullet = lines[i + 1].match(/^[-*•]\s+(.*)/)
        if (nextBullet) {
          items.push(nextBullet[1])
          i++
        } else {
          break
        }
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-2 pl-2">
          {items.map((item, j) => (
            <li key={j} className="leading-relaxed">{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      )
      i++
      continue
    }

    // Empty line → paragraph break
    if (line.trim() === '') {
      elements.push(<div key={`br-${i}`} className="h-2" />)
      i++
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {renderInlineMarkdown(line)}
      </p>
    )
    i++
  }

  return <div className="space-y-0.5">{elements}</div>
}

// ─── Typing Indicator ────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-2 justify-start">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
        <Bot className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="bg-white dark:bg-stone-800/80 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm border border-stone-100 dark:border-stone-700/50">
        <span className="w-2 h-2 bg-amber-400 dark:bg-amber-500 rounded-full animate-[chatBounce_1.4s_ease-in-out_infinite]" />
        <span className="w-2 h-2 bg-amber-400 dark:bg-amber-500 rounded-full animate-[chatBounce_1.4s_ease-in-out_0.2s_infinite]" />
        <span className="w-2 h-2 bg-amber-400 dark:bg-amber-500 rounded-full animate-[chatBounce_1.4s_ease-in-out_0.4s_infinite]" />
        <span className="sr-only">L&apos;assistant écrit...</span>
      </div>
    </div>
  )
}

// ─── Main Chat Panel ─────────────────────────────────────────────────────────────

const MAX_INPUT_LENGTH = 500
const CHAR_COUNTER_THRESHOLD = 100

export function AiChatPanel() {
  const chatOpen = useAppStore((s) => s.chatOpen)
  const toggleChat = useAppStore((s) => s.toggleChat)
  const chatMessages = useAppStore((s) => s.chatMessages)
  const addChatMessage = useAppStore((s) => s.addChatMessage)
  const clearChat = useAppStore((s) => s.clearChat)
  const currentChapterId = useAppStore((s) => s.currentChapterId)

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentChapter = useMemo(
    () => (currentChapterId ? getChapterById(currentChapterId) : null),
    [currentChapterId]
  )

  const showCharCounter = input.length > CHAR_COUNTER_THRESHOLD

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages, isLoading])

  // Auto-focus input when chat opens
  useEffect(() => {
    if (chatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [chatOpen])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    addChatMessage('user', userMessage)
    setIsLoading(true)

    try {
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
  }, [input, isLoading, currentChapter, addChatMessage])

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
      className="fixed right-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-full sm:w-[400px] border-l bg-background shadow-xl flex flex-col"
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-amber-50/80 via-background to-amber-50/40 dark:from-amber-950/20 dark:via-background dark:to-amber-950/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/30 shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Assistant Spirituel</h3>
            <AnimatePresence mode="wait">
              {currentChapter ? (
                <motion.div
                  key={currentChapterId}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-700/30">
                    <BookOpen className="h-2.5 w-2.5" />
                    {currentChapter.number} — {currentChapter.title}
                  </span>
                </motion.div>
              ) : (
                <motion.p
                  key="no-context"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11px] text-muted-foreground"
                >
                  Guide de méditation coranique
                </motion.p>
              )}
            </AnimatePresence>
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

      {/* ── Context Glow Bar ───────────────────────────────────── */}
      {currentChapter && (
        <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 dark:via-amber-500 to-transparent animate-[contextPulse_3s_ease-in-out_infinite]" />
      )}

      {/* ── Messages ───────────────────────────────────────────── */}
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
        {chatMessages.length === 0 ? (
          <div className="text-center py-8 space-y-5">
            {/* Empty state decoration */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative inline-block"
            >
              <div className="text-5xl">🪞</div>
              <div className="absolute -inset-4 bg-amber-200/20 dark:bg-amber-600/10 rounded-full blur-xl -z-10" />
            </motion.div>

            <div>
              <h4 className="text-base font-semibold">Assistant Spirituel</h4>
              <p className="text-xs text-muted-foreground max-w-[260px] mx-auto mt-1.5 leading-relaxed">
                Posez vos questions sur le Coran, le tadabbur, ou demandez des
                conseils pour approfondir votre méditation.
              </p>
            </div>

            {/* Suggestion Chips */}
            <div className="space-y-2 pt-1">
              {suggestions.map((suggestion, idx) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  onClick={() => setInput(suggestion)}
                  className="group flex items-center gap-2.5 w-full text-left text-xs px-3.5 py-2.5 rounded-xl border border-amber-200/50 dark:border-amber-800/30 bg-amber-50/40 dark:bg-amber-950/10 hover:bg-amber-100/70 dark:hover:bg-amber-900/20 hover:border-amber-300/60 dark:hover:border-amber-700/40 hover:shadow-sm hover:shadow-amber-200/20 dark:hover:shadow-amber-900/10 transition-all duration-200"
                >
                  <Sparkles className="h-3 w-3 text-amber-500 dark:text-amber-400 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="leading-relaxed">{suggestion}</span>
                </motion.button>
              ))}
            </div>

            {/* Tip text */}
            <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-muted-foreground/60">
              <Lightbulb className="h-3 w-3 text-amber-500/60" />
              <span>Conseil : Soyez précis pour des réponses plus profondes</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`flex gap-2.5 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/30 shadow-sm mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 shadow-md shadow-amber-500/20 dark:shadow-amber-900/30'
                      : 'bg-white dark:bg-stone-800/80 rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm border border-stone-100 dark:border-stone-700/50 text-foreground'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <MarkdownContent content={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-stone-700 to-stone-800 dark:from-stone-600 dark:to-stone-700 shadow-sm mt-0.5">
                    <User className="h-3.5 w-3.5 text-stone-200" />
                  </div>
                )}
              </motion.div>
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </ScrollArea>

      {/* ── Input ──────────────────────────────────────────────── */}
      <div className="p-3 border-t bg-gradient-to-t from-amber-50/30 to-transparent dark:from-amber-950/10">
        <div className="relative">
          {/* Focus glow ring */}
          <div
            className={`absolute -inset-0.5 rounded-lg transition-opacity duration-300 pointer-events-none ${
              isFocused
                ? 'opacity-100 bg-gradient-to-r from-amber-200/60 via-amber-300/40 to-amber-200/60 dark:from-amber-700/30 dark:via-amber-600/20 dark:to-amber-700/30 blur-sm'
                : 'opacity-0'
            }`}
          />
          <div className="relative flex gap-2 items-center">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Posez votre question..."
                className="text-sm pr-12 border-stone-200 dark:border-stone-700 focus-visible:ring-amber-400/50 dark:focus-visible:ring-amber-500/30"
                disabled={isLoading}
                maxLength={MAX_INPUT_LENGTH}
              />
              {/* Character counter */}
              {showCharCounter && (
                <span
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] tabular-nums transition-colors ${
                    input.length > MAX_INPUT_LENGTH * 0.9
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-muted-foreground/40'
                  }`}
                >
                  {input.length}/{MAX_INPUT_LENGTH}
                </span>
              )}
            </div>
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="shrink-0 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 dark:shadow-amber-900/30 hover:shadow-lg hover:shadow-amber-500/30 dark:hover:shadow-amber-900/40 transition-all duration-200 disabled:opacity-40 disabled:shadow-none rounded-lg h-9 w-9"
              aria-label="Envoyer"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-2 text-center">
          L&apos;assistant oriente vers la réflexion, ne remplace pas un savant.
        </p>
      </div>
    </motion.aside>
  )
}
