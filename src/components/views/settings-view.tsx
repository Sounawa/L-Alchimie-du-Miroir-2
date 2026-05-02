'use client'

import React, { useRef, useState } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Type,
  Eye,
  Globe,
  RotateCcw,
  Info,
  Download,
  Upload,
  Check,
  Sparkles,
  Volume2,
  VolumeX,
  Moon,
} from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const fontOptions = [
  { value: 'system' as const, label: 'Système', description: 'Geist Sans (par défaut)' },
  { value: 'serif' as const, label: 'Serif', description: 'Georgia, serif' },
  { value: 'reading' as const, label: 'Lecture', description: 'Literata, Merriweather, Georgia' },
]

const readingModeOptions = [
  { value: 'normal' as const, label: 'Normal', description: 'Affichage par défaut' },
  { value: 'focus' as const, label: 'Focus', description: 'Barre latérale masquée, contenu plein écran' },
  { value: 'soothing' as const, label: 'Sombre apaisant', description: 'Tons chauds sombres, contraste réduit' },
  { value: 'night' as const, label: 'Lecture nocturne', description: 'Tons chauds très doux, idéal pour la nuit' },
]

const languageOptions = [
  { code: 'fr', label: 'Français', available: true },
  { code: 'ar', label: 'العربية', available: false },
  { code: 'en', label: 'English', available: false },
]

export function SettingsView() {
  const {
    fontFamily,
    readingMode,
    setFontFamily,
    setReadingMode,
    resetAllData,
    exportAllData,
    nightModeEnabled,
    toggleNightMode,
    importData,
  } = useAppStore()

  const [soundEnabled, setSoundEnabled] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)

  const handleExportAllData = () => {
    try {
      const json = exportAllData()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `alchimie-du-miroir-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Données exportées avec succès !')
    } catch {
      toast.error("Erreur lors de l'exportation des données.")
    }
  }

  const handleImportData = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const jsonString = event.target?.result as string
      const success = importData(jsonString)
      if (success) {
        toast.success('Données importées avec succès !')
      } else {
        toast.error("Fichier invalide. Vérifiez le format d'export.")
      }
      setImporting(false)
      // Reset the input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.onerror = () => {
      toast.error('Erreur lors de la lecture du fichier.')
      setImporting(false)
    }
    reader.readAsText(file)
  }

  const handleResetAllData = () => {
    resetAllData()
    toast.success('Toutes les données ont été réinitialisées.')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Live Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-amber-200/60 dark:border-amber-800/30 overflow-hidden">
          <CardContent className="p-0">
            {/* Miniature book page */}
            <div className="relative mx-4 my-4 rounded-lg border border-amber-200/50 dark:border-amber-700/30 bg-gradient-to-b from-amber-50/80 via-stone-50 to-amber-50/60 dark:from-amber-950/30 dark:via-stone-900/50 dark:to-amber-950/20 p-5 shadow-inner">
              {/* Page margin line */}
              <div className="absolute left-12 top-0 bottom-0 w-px bg-amber-200/30 dark:bg-amber-700/20" />
              {/* Chapter number */}
              <div className="text-center mb-3">
                <span className="text-[9px] font-semibold uppercase tracking-widest text-amber-600/50 dark:text-amber-400/40">
                  Chapitre A1
                </span>
              </div>
              {/* Arabic verse sample */}
              <p
                dir="rtl"
                lang="ar"
                className="arabic-verse text-center text-base text-amber-800/70 dark:text-amber-200/60 mb-2"
                style={{
                  fontFamily:
                    fontFamily === 'system'
                      ? 'var(--font-geist-sans), sans-serif'
                      : fontFamily === 'serif'
                        ? 'Georgia, serif'
                        : '"Literata", "Merriweather", Georgia, serif',
                }}
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
              {/* Translation sample */}
              <p
                className="text-center text-xs leading-relaxed text-stone-600/70 dark:text-stone-300/80 italic"
                style={{
                  fontFamily:
                    fontFamily === 'system'
                      ? 'var(--font-geist-sans), sans-serif'
                      : fontFamily === 'serif'
                        ? 'Georgia, serif'
                        : '"Literata", "Merriweather", Georgia, serif',
                  filter: readingMode === 'soothing' ? 'sepia(0.15) brightness(0.95)' : undefined,
                }}
              >
                Au nom de Dieu, le Tout-Miséricordieux, le Très-Miséricordieux
              </p>
              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="h-px flex-1 bg-amber-300/20 dark:bg-amber-600/20" />
                <span className="text-[8px] text-amber-400/30 dark:text-amber-500/20 select-none">✦</span>
                <span className="h-px flex-1 bg-amber-300/20 dark:bg-amber-600/20" />
              </div>
              {/* Reading mode indicator */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-[8px] text-amber-600/40 dark:text-amber-400/30 uppercase tracking-wider">
                  Mode : {readingModeOptions.find((o) => o.value === readingMode)?.label || 'Normal'}
                </span>
                <span className="text-[8px] text-stone-300 dark:text-stone-600">•</span>
                <span className="text-[8px] text-amber-600/40 dark:text-amber-400/30 uppercase tracking-wider">
                  Police : {fontOptions.find((o) => o.value === fontFamily)?.label || 'Système'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-500" />
          Paramètres
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Personnalisez votre expérience de lecture
        </p>
      </motion.div>

      {/* Font Family Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="border-amber-200/60 dark:border-amber-800/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Type className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Police de caractères
            </CardTitle>
            <CardDescription>
              Choisissez la police pour la lecture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {fontOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFontFamily(option.value)}
                className={`
                  w-full flex items-center justify-between rounded-lg border px-4 py-3
                  transition-all duration-150 text-left active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-amber-400
                  ${fontFamily === option.value
                    ? 'border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/30'
                    : 'border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm"
                    style={{
                      fontFamily:
                        option.value === 'system'
                          ? 'var(--font-geist-sans), sans-serif'
                          : option.value === 'serif'
                            ? 'Georgia, serif'
                            : '"Literata", "Merriweather", Georgia, serif',
                    }}
                  >
                    {option.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    — {option.description}
                  </span>
                </div>
                {fontFamily === option.value && (
                  <Check className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Reading Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-amber-200/60 dark:border-amber-800/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Mode de lecture
            </CardTitle>
            <CardDescription>
              Adaptez l&apos;affichage à votre environnement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {readingModeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setReadingMode(option.value)}
                className={`
                  w-full flex items-center justify-between rounded-lg border px-4 py-3
                  transition-all duration-150 text-left active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-amber-400
                  ${readingMode === option.value
                    ? 'border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/30'
                    : 'border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }
                `}
              >
                <div>
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    — {option.description}
                  </span>
                </div>
                {readingMode === option.value && (
                  <Check className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Night Reading Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card className="border-amber-200/60 dark:border-amber-800/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Mode lecture nocturne
            </CardTitle>
            <CardDescription>
              Tons chauds et doux pour la lecture tardive — réduit la lumière bleue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-sm font-medium">
                  {nightModeEnabled ? 'Activé' : 'Désactivé'}
                </span>
                <p className="text-xs text-muted-foreground">
                  Raccourci clavier : N
                </p>
              </div>
              <button
                onClick={toggleNightMode}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${nightModeEnabled ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-600'}
                `}
                role="switch"
                aria-checked={nightModeEnabled}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
                    ${nightModeEnabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sound Effects Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.13 }}
      >
        <Card className="border-amber-200/60 dark:border-amber-800/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-stone-400" />
              )}
              Effets sonores
            </CardTitle>
            <CardDescription>
              Sons de tour de page lors de la navigation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center justify-between w-full rounded-lg border px-4 py-3 transition-all duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-amber-400 border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Sons de navigation</span>
                <span className="text-xs text-muted-foreground">
                  — {soundEnabled ? 'Activés' : 'Désactivés'}
                </span>
              </div>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${soundEnabled ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-600'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </button>
            <p className="text-[10px] text-muted-foreground mt-2 italic">
              Les effets sonores seront disponibles dans une prochaine mise à jour.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Language Preference */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card className="border-amber-200/60 dark:border-amber-800/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Langue
            </CardTitle>
            <CardDescription>
              Langue de l&apos;interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {languageOptions.map((lang) => (
              <div
                key={lang.code}
                className={`
                  flex items-center justify-between rounded-lg border px-4 py-3
                  border-stone-200 dark:border-stone-700
                  ${!lang.available ? 'opacity-60' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{lang.label}</span>
                  {lang.available && (
                    <Check className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                {!lang.available && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 border-0"
                  >
                    Bientôt disponible
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border-amber-200/60 dark:border-amber-800/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Gestion des données
            </CardTitle>
            <CardDescription>
              Exportez, importez ou réinitialisez vos données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleExportAllData}
                variant="outline"
                className="flex-1 gap-2 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
              >
                <Download className="h-4 w-4" />
                Exporter (JSON)
              </Button>
              <Button
                onClick={handleImportData}
                variant="outline"
                className="flex-1 gap-2 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                disabled={importing}
              >
                <Upload className="h-4 w-4" />
                {importing ? 'Importation...' : 'Importer (JSON)'}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Fichier JSON à importer"
            />
            <Separator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full gap-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <RotateCcw className="h-4 w-4" />
                  Réinitialiser toutes les données
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action supprimera définitivement toutes vos notes, progression,
                    favoris, entrées de journal et paramètres. Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetAllData}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Réinitialiser
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <Card className="border-amber-200/60 dark:border-amber-800/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              À propos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Application</span>
              <span className="text-sm font-medium">L&apos;Alchimie du Miroir</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300 border-0">
                2.0
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Niveau</span>
              <span className="text-sm font-medium">2 — L&apos;Approfondissement</span>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Application de méditation coranique inspirée par l&apos;ouvrage
              &quot;L&apos;Alchimie du Miroir&quot;. Conçue pour approfondir la
              compréhension du Coran à travers la réflexion, le munajat et
              l&apos;exercice spirituel quotidien.
            </p>
            <Separator />
            <p className="text-xs text-muted-foreground">
              Crédits : Conception &amp; développement — L&apos;Alchimie du Miroir Team ✦
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
