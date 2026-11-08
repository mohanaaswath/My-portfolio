import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Github,
  ChevronDown,
  Pencil,
  Trash2,
  Code2,
  Wallet,
  Mic,
  Gamepad2,
  Bus,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'
import type { Project } from '../data/projects'
import { asset } from '../lib/asset'

const iconMap: Record<string, LucideIcon> = {
  'pennywise-ai': Wallet,
  'jarvis-ai': Mic,
  'chess-game-ai': Gamepad2,
  'bus-tracking': Bus,
  'covid-19': BarChart3,
}

function resolveIcon(p: Project): LucideIcon {
  if (typeof p.icon === 'function') {
    return p.icon
  }
  if (p.icon && typeof p.icon === 'object' && ('$$typeof' in p.icon || 'render' in (p.icon as any))) {
    return p.icon
  }
  if (p.id && iconMap[p.id]) {
    return iconMap[p.id]
  }
  return Code2
}

export default function ProjectCard({
  p,
  onEdit,
  onDelete,
}: {
  p: Project
  onEdit?: (p: Project) => void
  onDelete?: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const Icon = resolveIcon(p)

  return (
    <motion.article whileHover={{ y: -4 }} className="glass glass-hover group relative flex flex-col overflow-hidden rounded-xl">
      {/* Top action buttons (Edit & Delete) */}
      <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 opacity-90 transition group-hover:opacity-100">
        {onEdit && (
          <button
            onClick={e => {
              e.stopPropagation()
              onEdit(p)
            }}
            className="grid h-8 w-8 place-items-center rounded-full bg-ink/80 text-muted backdrop-blur-md transition hover:bg-violet hover:text-white"
            title="Edit project"
            aria-label={`Edit ${p.title}`}
          >
            <Pencil size={13} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={e => {
              e.stopPropagation()
              if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                onDelete(p.id)
              }
            }}
            className="grid h-8 w-8 place-items-center rounded-full bg-ink/80 text-muted backdrop-blur-md transition hover:bg-rose-500 hover:text-white"
            title="Delete project"
            aria-label={`Delete ${p.title}`}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {p.img ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink/40">
          <img
            src={asset(p.img)}
            alt={`${p.title} screenshot`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="grid aspect-[16/9] place-items-center bg-gradient-to-br from-violet/25 via-azure/15 to-cyan/20">
          <Icon size={44} className="text-fg/80" strokeWidth={1.4} />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-fg">{p.title}</h3>
          {p.status && (
            <span className="shrink-0 rounded-full border border-cyan/40 px-2.5 py-0.5 text-xs text-cyan">
              {p.status}
            </span>
          )}
        </div>

        <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>

        {p.tech && p.tech.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {p.tech.map(t => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        )}

        {p.details && p.details.length > 0 && (
          <>
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              className="mt-4 flex items-center gap-1 text-sm text-violet hover:text-cyan"
            >
              Details <ChevronDown size={16} className={`transition ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {p.details.map(d => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
          </>
        )}

        <div className="mt-auto flex flex-wrap gap-3 pt-5">
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-violet to-azure px-4 text-sm font-medium text-white transition hover:opacity-90"
            >
              <ExternalLink size={15} />
              Live Demo
            </a>
          )}
          {p.repo && (
            <a
              href={p.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm text-fg transition hover:border-cyan/60 hover:text-cyan"
            >
              <Github size={15} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
