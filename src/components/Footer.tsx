import { Github, Linkedin, Instagram } from 'lucide-react'
import { LINKS } from '../lib/asset'
const nav = ['about', 'skills', 'projects', 'experience', 'services', 'contact']
export default function Footer() {
  const s = [[Github, LINKS.github, 'GitHub'], [Linkedin, LINKS.linkedin, 'LinkedIn'], [Instagram, LINKS.instagram, 'Instagram']] as const
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-display font-semibold tracking-widest">MOHANA ASWATH</p><p className="text-sm text-muted">AI Full Stack Developer</p></div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm capitalize text-muted">{nav.map(n => <a key={n} href={`#${n}`} className="hover:text-fg">{n}</a>)}</nav>
        <div className="flex gap-4">{s.map(([Icon, href, label]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-muted hover:text-cyan"><Icon size={20} /></a>)}</div>
      </div>
      <p className="mt-8 text-center text-xs text-muted">© {new Date().getFullYear()} Mohana Aswath. All rights reserved.</p>
    </footer>
  )
}
