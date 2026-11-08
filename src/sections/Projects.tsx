import { useEffect, useRef, useState } from 'react'
import { Plus, Upload, X, CheckCircle2, Image as ImageIcon, Github, ExternalLink, Loader2, Database, AlertCircle } from 'lucide-react'
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import { initialProjects, smallProjects, type Project } from '../data/projects'
import { asset } from '../lib/asset'
import { supabase, isSupabaseConfigured, type SupabaseProject } from '../lib/supabase'

const STORAGE_PROJECTS_KEY = 'mohana_saved_projects'

const saveProjectsToStorage = (items: Project[]) => {
  try {
    const sanitized = items.map(({ icon, ...rest }) => rest)
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(sanitized))
  } catch {}
}

export default function Projects() {
  const [projectList, setProjectList] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Project[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(item => ({
            ...item,
            icon: undefined,
          }))
        }
      }
    } catch {
      // fallback
    }
    return initialProjects
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // Form State
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formTech, setFormTech] = useState('')
  const [formRepo, setFormRepo] = useState('')
  const [formLive, setFormLive] = useState('')
  const [formStatus, setFormStatus] = useState('')
  const [formDetails, setFormDetails] = useState('')
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch from Supabase on mount
  useEffect(() => {
    const fetchSupabaseProjects = async () => {
      if (!supabase || !isSupabaseConfigured) return
      setLoading(true)
      try {
        const { data, error: sbErr } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (!sbErr && data && data.length > 0) {
          const mapped: Project[] = (data as SupabaseProject[]).map(row => ({
            id: String(row.id),
            title: row.title,
            desc: row.description,
            tech: Array.isArray(row.tech) ? row.tech : [],
            repo: row.repo || '',
            live: row.live || '',
            img: row.img_url || '',
            status: row.status || undefined,
            details: Array.isArray(row.details) ? row.details : [],
            isCustom: true,
          }))

          // Merge with initialProjects: keep any from initialProjects that haven't been replaced
          const dbIds = new Set(mapped.map(m => m.id))
          const remainingInitials = initialProjects.filter(ip => !dbIds.has(ip.id))
          const combined = [...mapped, ...remainingInitials]
          setProjectList(combined)
          saveProjectsToStorage(combined)
        }
      } catch (err) {
        console.warn('Notice loading projects from Supabase:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSupabaseProjects()
  }, [])

  // Open modal for NEW project
  const handleAddNew = () => {
    setEditingProject(null)
    setFormTitle('')
    setFormDesc('')
    setFormTech('')
    setFormRepo('')
    setFormLive('')
    setFormStatus('')
    setFormDetails('')
    setPreviewImg(null)
    setSelectedFile(null)
    setFileName('')
    setError('')
    setSuccess(false)
    setIsModalOpen(true)
  }

  // Open modal to EDIT existing project
  const handleEdit = (p: Project) => {
    setEditingProject(p)
    setFormTitle(p.title)
    setFormDesc(p.desc)
    setFormTech(p.tech.join(', '))
    setFormRepo(p.repo)
    setFormLive(p.live || '')
    setFormStatus(p.status || '')
    setFormDetails(p.details.join('\n'))
    setPreviewImg(p.img || null)
    setSelectedFile(null)
    setFileName('')
    setError('')
    setSuccess(false)
    setIsModalOpen(true)
  }

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (PNG, JPG, WEBP).')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.')
      return
    }

    setError('')
    setSelectedFile(file)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImg(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) {
      setError('Project title is required.')
      return
    }
    if (!formDesc.trim()) {
      setError('Project description is required.')
      return
    }

    setSaving(true)
    setError('')

    try {
      let finalImgUrl = previewImg || ''

      // Attempt upload to Supabase storage bucket if available
      if (selectedFile && supabase && isSupabaseConfigured) {
        try {
          const fileExt = selectedFile.name.split('.').pop() || 'png'
          const sName = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`
          const { data: stData, error: stErr } = await supabase.storage
            .from('certificates')
            .upload(sName, selectedFile, { cacheControl: '3600', upsert: false })

          if (!stErr && stData) {
            const { data: pubData } = supabase.storage.from('certificates').getPublicUrl(sName)
            if (pubData?.publicUrl) {
              finalImgUrl = pubData.publicUrl
            }
          }
        } catch {
          // fallback to base64 previewImg
        }
      }

      const techArray = formTech
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)

      const detailsArray = formDetails
        .split('\n')
        .map(d => d.trim())
        .filter(Boolean)

      const projectId = editingProject ? editingProject.id : 'custom-' + Date.now()

      const projectData: Project = {
        id: projectId,
        title: formTitle.trim(),
        desc: formDesc.trim(),
        tech: techArray.length ? techArray : ['Web Development'],
        repo: formRepo.trim(),
        live: formLive.trim() || undefined,
        img: finalImgUrl || undefined,
        status: formStatus.trim() || undefined,
        details: detailsArray,
        isCustom: true,
        icon: editingProject?.icon,
      }

      // Upsert to Supabase if configured
      if (supabase && isSupabaseConfigured) {
        try {
          await supabase.from('projects').upsert([
            {
              id: editingProject && !editingProject.id.startsWith('proj-') && !editingProject.id.startsWith('custom-')
                ? editingProject.id
                : undefined,
              title: projectData.title,
              description: projectData.desc,
              tech: projectData.tech,
              repo: projectData.repo,
              live: projectData.live || '',
              img_url: projectData.img || '',
              status: projectData.status || '',
              details: projectData.details,
            },
          ])
        } catch (dbErr: any) {
          console.warn('Supabase projects table write notice:', dbErr?.message)
        }
      }

      // Update local state
      let updated: Project[]
      if (editingProject) {
        updated = projectList.map(p => (p.id === editingProject.id ? { ...p, ...projectData } : p))
      } else {
        updated = [projectData, ...projectList]
      }

      setProjectList(updated)
      saveProjectsToStorage(updated)

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setIsModalOpen(false)
        setEditingProject(null)
      }, 700)
    } catch (err: any) {
      setError(err?.message || 'Failed to save project.')
    } finally {
      setSaving(false)
    }
  }

  // Delete project
  const handleDelete = async (id: string) => {
    // Delete from Supabase if configured
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('projects').delete().eq('id', id)
      } catch (err) {
        console.warn('Supabase delete notice:', err)
      }
    }

    const updated = projectList.filter(p => p.id !== id)
    setProjectList(updated)
    saveProjectsToStorage(updated)
  }

  return (
    <Section id="projects" eyebrow="Projects" title="Featured work">
      {/* Action Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted">
            Showing <span className="font-semibold text-fg">{projectList.length}</span> featured projects
          </p>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-mono ${
            isSupabaseConfigured ? 'border border-cyan/40 bg-cyan/10 text-cyan' : 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
          }`}>
            <Database size={11} />
            {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Mode'}
          </span>
        </div>

        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet to-cyan px-4 py-2 text-sm font-semibold text-ink shadow-lg shadow-violet/20 transition hover:opacity-90 active:scale-95"
        >
          <Plus size={16} />
          Add New Project
        </button>
      </div>

      {loading && (
        <div className="my-6 flex items-center justify-center gap-2 text-sm text-cyan">
          <Loader2 size={16} className="animate-spin" />
          <span>Syncing projects with Supabase...</span>
        </div>
      )}

      {/* Main Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectList.map(p => (
          <ProjectCard
            key={p.id}
            p={p}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Smaller Projects */}
      <h3 className="mb-4 mt-14 font-display text-xl font-semibold">Smaller projects</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {smallProjects.map(s => (
          <a
            key={s.title}
            href={s.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover flex items-center gap-4 p-3"
          >
            <img
              src={asset(s.img)}
              alt={`${s.title} screenshot`}
              loading="lazy"
              className="h-16 w-24 rounded-md object-cover object-top"
            />
            <div className="flex-1">
              <p className="font-medium text-fg">{s.title}</p>
              <p className="text-xs text-muted">{s.tech}</p>
            </div>
            <Github size={18} className="mr-2 text-muted hover:text-cyan" />
          </a>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => !saving && setIsModalOpen(false)}
          className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-md"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="glass relative my-8 w-full max-w-xl rounded-2xl border border-white/15 bg-surface/95 p-6 shadow-2xl"
          >
            <button
              onClick={() => !saving && setIsModalOpen(false)}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/5 text-muted transition hover:bg-white/10 hover:text-fg"
              aria-label="Close modal"
              disabled={saving}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet/20 text-cyan">
                {editingProject ? <Upload size={20} /> : <Plus size={20} />}
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-fg">
                  {editingProject ? `Edit "${editingProject.title}"` : 'Add New Project'}
                </h3>
                <p className="text-xs text-muted">
                  {editingProject
                    ? 'Update project details, change image, or description'
                    : 'Showcase a new project on your portfolio'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            {success ? (
              <div className="my-10 flex flex-col items-center justify-center text-center">
                <CheckCircle2 size={44} className="text-cyan animate-bounce" />
                <p className="mt-3 text-base font-semibold text-fg">
                  {editingProject ? 'Project Updated Successfully!' : 'Project Added Successfully!'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-5 space-y-4">
                {/* Project Image */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Project Cover Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-4 text-center transition hover:border-cyan/50 hover:bg-white/[0.05]"
                  >
                    {previewImg ? (
                      <div className="space-y-2">
                        <img
                          src={asset(previewImg)}
                          alt="Preview"
                          className="max-h-36 rounded-lg object-cover shadow-md mx-auto"
                        />
                        <p className="text-xs font-mono text-cyan truncate max-w-xs">{fileName || 'Current Cover Image'}</p>
                        <p className="text-[11px] text-muted underline">Click to change cover image</p>
                      </div>
                    ) : (
                      <>
                        <ImageIcon size={26} className="text-muted" />
                        <p className="mt-1 text-sm font-medium text-fg">Click to choose image or drag & drop</p>
                        <p className="text-xs text-muted">PNG, JPG, WEBP up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Project Title *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. AI Autonomous Agent"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-cyan focus:outline-none"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Description *</label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    placeholder="Brief description of the project and what problem it solves..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-cyan focus:outline-none"
                    required
                  />
                </div>

                {/* Tech Stack */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      value={formTech}
                      onChange={e => setFormTech(e.target.value)}
                      placeholder="e.g. React, TypeScript, Supabase"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Status Badge</label>
                    <input
                      type="text"
                      value={formStatus}
                      onChange={e => setFormStatus(e.target.value)}
                      placeholder="e.g. Live / In development / Prototype"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-cyan focus:outline-none"
                    />
                  </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">GitHub Repository URL</label>
                    <input
                      type="url"
                      value={formRepo}
                      onChange={e => setFormRepo(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Live Demo URL</label>
                    <input
                      type="url"
                      value={formLive}
                      onChange={e => setFormLive(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-cyan focus:outline-none"
                    />
                  </div>
                </div>

                {/* Bullet Details */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">
                    Key Highlights / Details (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formDetails}
                    onChange={e => setFormDetails(e.target.value)}
                    placeholder="Built with React 18&#10;Integrated OpenAI GPT-4 API&#10;Supabase Auth and storage"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-cyan focus:outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-fg"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet to-cyan px-5 py-2 text-sm font-semibold text-ink shadow-lg shadow-violet/20 transition hover:opacity-90 active:scale-95 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Upload size={15} />
                        {editingProject ? 'Update Project' : 'Add Project'}
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
