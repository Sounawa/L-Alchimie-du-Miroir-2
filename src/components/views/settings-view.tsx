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
    importData,
  } = useAppStore()

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
                  transition-all duration-150 text-left
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
                  transition-all duration-150 text-left
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
