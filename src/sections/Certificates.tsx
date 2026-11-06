import { useEffect, useRef, useState } from 'react'
import { X, Upload, Plus, Trash2, Image as ImageIcon, CheckCircle2, Database, AlertCircle, Loader2 } from 'lucide-react'
import Section from '../components/Section'
import { certificates as initialCertificates, type Certificate } from '../data/certificates'
import { asset } from '../lib/asset'
import { supabase, isSupabaseConfigured, type SupabaseCertificate } from '../lib/supabase'

export default function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>(initialCertificates)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [sel, setSel] = useState<Certificate | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  
  const [newTitle, setNewTitle] = useState('')
  const [newOrg, setNewOrg] = useState('')
  const [newDate, setNewDate] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch certificates from Supabase
  const loadSupabaseCertificates = async () => {
    if (!supabase || !isSupabaseConfigured) return
    setLoading(true)
    try {
      const { data, error: fetchErr } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchErr) {
        console.warn('Supabase fetch notice:', fetchErr.message)
      } else if (data) {
        const fetched: Certificate[] = (data as SupabaseCertificate[]).map(row => ({
          id: String(row.id),
          title: row.title,
          org: row.org,
          date: row.date || '2026',
          img: row.img_url,
          isCustom: true,
        }))
        setCerts([...fetched, ...initialCertificates])
      }
    } catch (err) {
      console.warn('Error loading from Supabase:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSupabaseCertificates()
  }, [])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSel(null)
        setIsUploadOpen(false)
      }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Please upload an image file (PNG, JPG, WEBP) or PDF.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.')
      return
    }

    setError('')
    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImg(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      setError('Certificate title is required.')
      return
    }
    if (!newOrg.trim()) {
      setError('Issuing organization is required.')
      return
    }
    if (!selectedFile && !previewImg) {
      setError('Please select a certificate image file.')
      return
    }

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured yet. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
      return
    }

    setUploading(true)
    setError('')

    try {
      let finalImgUrl = previewImg || ''

      // Attempt upload to Supabase storage bucket 'certificates'
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop() || 'png'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
        
        const { data: storageData, error: storageErr } = await supabase.storage
          .from('certificates')
          .upload(fileName, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (!storageErr && storageData) {
          const { data: publicUrlData } = supabase.storage
            .from('certificates')
            .getPublicUrl(fileName)
          if (publicUrlData?.publicUrl) {
            finalImgUrl = publicUrlData.publicUrl
          }
        } else {
          console.warn('Storage bucket upload notice:', storageErr?.message)
          // Storage bucket might not be created or public, fallback to base64 previewImg
        }
      }

      // Insert record into Supabase 'certificates' table
      const { data: insertData, error: insertErr } = await supabase
        .from('certificates')
        .insert([
          {
            title: newTitle.trim(),
            org: newOrg.trim(),
            date: newDate.trim() || '2026',
            img_url: finalImgUrl,
          },
        ])
        .select()
        .single()

      if (insertErr) {
        throw new Error(insertErr.message)
      }

      const addedCert: Certificate = {
        id: String(insertData?.id || Date.now()),
        title: newTitle.trim(),
        org: newOrg.trim(),
        date: newDate.trim() || '2026',
        img: finalImgUrl,
        isCustom: true,
      }

      setCerts([addedCert, ...certs])
      setSuccess(true)

      setTimeout(() => {
        setSuccess(false)
        setIsUploadOpen(false)
        setNewTitle('')
        setNewOrg('')
        setNewDate('')
        setSelectedFile(null)
        setPreviewImg(null)
        setError('')
      }, 900)
    } catch (err: any) {
      console.error('Supabase upload error:', err)
      setError(err?.message || 'Failed to save certificate to Supabase. Check table permissions.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    if (!supabase || !isSupabaseConfigured) return

    try {
      const { error: delErr } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id)

      if (delErr) {
        alert('Failed to delete from Supabase: ' + delErr.message)
        return
      }

      setCerts(certs.filter(c => c.id !== id))
      if (sel?.id === id) setSel(null)
    } catch (err: any) {
      alert('Delete error: ' + (err?.message || 'Unknown error'))
    }
  }

  return (
    <Section id="certificates" eyebrow="Certificates" title="Courses and certifications">
      {/* Top Action Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted">
            Showing <span className="font-semibold text-fg">{certs.length}</span> certificates & credentials
          </p>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-mono ${
            isSupabaseConfigured ? 'border border-cyan/40 bg-cyan/10 text-cyan' : 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
          }`}>
            <Database size={11} />
            {isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Not Connected'}
          </span>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet to-cyan px-4 py-2 text-sm font-semibold text-ink shadow-lg shadow-violet/20 transition hover:opacity-90 active:scale-95"
        >
          <Upload size={16} />
          Upload Certificate
        </button>
      </div>

      {loading && (
        <div className="my-8 flex items-center justify-center gap-2 text-sm text-cyan">
          <Loader2 size={18} className="animate-spin" />
          <span>Syncing with Supabase...</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Upload Card Prompt in the grid */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="glass group flex min-h-[220px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 p-6 text-center transition hover:border-cyan/60 hover:bg-white/[0.04]"
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-violet/15 text-cyan transition group-hover:scale-110 group-hover:bg-cyan/20">
            <Plus size={24} />
          </div>
          <p className="mt-3 font-medium text-fg">Upload to Supabase</p>
          <p className="mt-1 text-xs text-muted">Save certificates directly into your cloud database</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-xs font-mono text-cyan">
            <Upload size={12} /> Add Certificate
          </span>
        </button>

        {certs.map((x, i) => (
          <div key={x.id || `${x.title}-${i}`} className="glass glass-hover group relative overflow-hidden rounded-xl">
            {x.isCustom && (
              <button
                onClick={e => {
                  e.stopPropagation()
                  if (confirm(`Delete "${x.title}" from Supabase?`)) handleDelete(x.id)
                }}
                className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-ink/80 text-muted backdrop-blur-sm transition hover:bg-rose-500 hover:text-white"
                title="Delete certificate from Supabase"
                aria-label="Delete certificate"
              >
                <Trash2 size={14} />
              </button>
            )}
            <button
              onClick={() => setSel(x)}
              className="w-full text-left"
              aria-label={`View certificate: ${x.title}`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                <img
                  src={asset(x.img)}
                  alt={`${x.title} certificate`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-snug line-clamp-2 text-fg">{x.title}</p>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {x.org} · {x.date}
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Certificate Viewer Modal */}
      {sel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={sel.title}
          onClick={() => setSel(null)}
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/90 p-4 backdrop-blur-md"
        >
          <button
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-fg transition hover:bg-white/20"
            aria-label="Close"
            onClick={() => setSel(null)}
          >
            <X size={20} />
          </button>
          <div className="max-w-4xl text-center" onClick={e => e.stopPropagation()}>
            <img
              src={asset(sel.img)}
              alt={`${sel.title} certificate`}
              className="max-h-[80vh] max-w-full rounded-lg shadow-2xl"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-fg">{sel.title}</h3>
              <p className="text-sm text-muted">{sel.org} · {sel.date}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Certificate Modal */}
      {isUploadOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => !uploading && setIsUploadOpen(false)}
          className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-md"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="glass relative w-full max-w-lg rounded-2xl border border-white/15 bg-surface/95 p-6 shadow-2xl"
          >
            <button
              onClick={() => !uploading && setIsUploadOpen(false)}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/5 text-muted transition hover:bg-white/10 hover:text-fg"
              aria-label="Close modal"
              disabled={uploading}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet/20 text-cyan">
                <Database size={20} />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-fg">Upload to Supabase</h3>
                <p className="text-xs text-muted">Store your certificates securely in the cloud database</p>
              </div>
            </div>

            {!isSupabaseConfigured && (
              <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-400" />
                <div>
                  <p className="font-semibold text-amber-300">Supabase Credentials Needed</p>
                  <p className="mt-0.5 text-amber-200/90 leading-relaxed">
                    Please provide your <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in your <code>.env</code> file to enable cloud uploads.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            {success ? (
              <div className="my-8 flex flex-col items-center justify-center text-center">
                <CheckCircle2 size={44} className="text-cyan animate-bounce" />
                <p className="mt-3 text-base font-semibold text-fg">Saved to Supabase Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-5 space-y-4">
                {/* File Upload Zone */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Certificate Image *</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-5 text-center transition hover:border-cyan/50 hover:bg-white/[0.05]"
                  >
                    {previewImg ? (
                      <div className="space-y-2">
                        <img
                          src={previewImg}
                          alt="Preview"
                          className="max-h-36 rounded-lg object-contain shadow-md mx-auto"
                        />
                        <p className="text-xs font-mono text-cyan truncate max-w-xs">{selectedFile?.name}</p>
                        <p className="text-[11px] text-muted underline">Click to change file</p>
                      </div>
                    ) : (
                      <>
                        <ImageIcon size={28} className="text-muted" />
                        <p className="mt-2 text-sm font-medium text-fg">Click to choose image or drag & drop</p>
                        <p className="mt-1 text-xs text-muted">PNG, JPG, WEBP up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Certificate / Course Title *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Artificial Intelligence Internship"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-cyan focus:outline-none"
                    required
                  />
                </div>

                {/* Organization */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Issuing Organization *</label>
                    <input
                      type="text"
                      value={newOrg}
                      onChange={e => setNewOrg(e.target.value)}
                      placeholder="e.g. Code Alpha / Infosys"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-cyan focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Issue Date</label>
                    <input
                      type="text"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      placeholder="e.g. Sep 2026"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-cyan focus:outline-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-fg"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !isSupabaseConfigured}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet to-cyan px-5 py-2 text-sm font-semibold text-ink shadow-lg shadow-violet/20 transition hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Saving to Supabase...
                      </>
                    ) : (
                      <>
                        <Upload size={15} />
                        Save to Supabase
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Section>
  )
}
