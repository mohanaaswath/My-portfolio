import { useState, type FormEvent } from 'react'
import { Mail, Github, Linkedin, Instagram, Send } from 'lucide-react'
import Section from '../components/Section'
import { LINKS } from '../lib/asset'
const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined
const key = import.meta.env.VITE_FORM_ACCESS_KEY as string | undefined
type F = { name: string; email: string; subject: string; message: string }
const empty: F = { name: '', email: '', subject: '', message: '' }
const field = 'w-full rounded-lg border border-white/15 bg-ink/60 px-4 py-3 text-sm placeholder:text-muted/70 focus:border-cyan focus:outline-none'
export default function Contact() {
  const [v, setV] = useState<F>(empty), [err, setErr] = useState<Partial<F>>({}), [st, setSt] = useState<'idle' | 'sending' | 'ok' | 'fail' | 'off'>('idle')
  const mailto = `mailto:${LINKS.email}?subject=${encodeURIComponent(v.subject || 'Project inquiry')}&body=${encodeURIComponent(`${v.message}\n\n${v.name}\n${v.email}`)}`
  async function submit(e: FormEvent) {
    e.preventDefault()
    const n: Partial<F> = {}
    if (v.name.trim().length < 2) n.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(v.email)) n.email = 'Please enter a valid email.'
    if (v.subject.trim().length < 3) n.subject = 'Please add a subject.'
    if (v.message.trim().length < 10) n.message = 'Message should be at least 10 characters.'
    setErr(n); if (Object.keys(n).length) return
    if (!endpoint) { setSt('off'); return }
    setSt('sending')
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...v, ...(key ? { access_key: key } : {}) }) })
      if (!r.ok) throw new Error(String(r.status)); setSt('ok'); setV(empty)
    } catch { setSt('fail') }
  }
  const set = (k: keyof F) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value })
  const L = ({ k, label, area }: { k: keyof F; label: string; area?: boolean }) => (
    <label className="block text-sm"><span className="mb-1.5 block text-muted">{label}</span>
      {area ? <textarea rows={5} className={field} value={v[k]} onChange={set(k)} aria-invalid={!!err[k]} /> : <input className={field} type={k === 'email' ? 'email' : 'text'} value={v[k]} onChange={set(k)} aria-invalid={!!err[k]} />}
      {err[k] && <span role="alert" className="mt-1 block text-xs text-red-400">{err[k]}</span>}</label>)
  return (
    <Section id="contact" eyebrow="Contact" title="Have a Project in Mind? Let's Build Something Great.">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-4 text-muted">
          <p>Open to freelance projects, collaborations and full-time opportunities. Send a message and I'll get back to you.</p>
          <a href={`mailto:${LINKS.email}`} className="flex items-center gap-3 hover:text-cyan"><Mail size={18} />{LINKS.email}</a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-cyan"><Linkedin size={18} />LinkedIn</a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-cyan"><Github size={18} />GitHub</a>
          <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-cyan"><Instagram size={18} />@uniqstack_ai</a>
        </div>
        <form onSubmit={submit} noValidate className="glass space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">{L({ k: 'name', label: 'Name' })}{L({ k: 'email', label: 'Email' })}</div>
          {L({ k: 'subject', label: 'Subject' })}{L({ k: 'message', label: 'Message', area: true })}
          <button disabled={st === 'sending'} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-violet to-azure px-6 text-sm font-medium disabled:opacity-60"><Send size={15} />{st === 'sending' ? 'Sending…' : 'Send message'}</button>
          <p aria-live="polite" className="text-sm">
            {st === 'ok' && <span className="text-cyan">Thanks! Your message was sent.</span>}
            {st === 'fail' && <span className="text-red-400">Something went wrong. Please email me directly at {LINKS.email}.</span>}
            {st === 'off' && <span className="text-muted">The form service isn't configured yet. <a className="text-cyan underline" href={mailto}>Send this by email instead</a>.</span>}
          </p>
        </form>
      </div>
    </Section>
  )
}
