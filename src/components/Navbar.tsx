import { useEffect, useState } from 'react'
import { Menu, X, Download } from 'lucide-react'
import { asset, LINKS } from '../lib/asset'
const NAV = ['home', 'about', 'skills', 'projects', 'experience', 'services', 'contact']
export default function Navbar() {
  const [active, setActive] = useState('home'), [open, setOpen] = useState(false), [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    NAV.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    const s = () => setScrolled(window.scrollY > 12); s()
    window.addEventListener('scroll', s, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', s) }
  }, [])
  const link = (id: string) => `rounded-md px-3 py-2 text-sm capitalize transition ${active === id ? 'text-cyan' : 'text-muted hover:text-fg'}`
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled || open ? 'border-b border-white/10 bg-ink/85 backdrop-blur-md' : ''}`}>
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#home" className="font-display text-lg font-bold tracking-widest grad-text">MOHANA ASWATH</a>
        <div className="hidden items-center gap-1 lg:flex">
          {NAV.map(id => <a key={id} href={`#${id}`} className={link(id)} aria-current={active === id ? 'true' : undefined}>{id}</a>)}
          <a href={asset(LINKS.resume)} download className="ml-3 inline-flex items-center gap-2 rounded-lg border border-violet/60 px-4 py-2 text-sm hover:bg-violet/15"><Download size={15} />Resume</a>
        </div>
        <button className="grid h-11 w-11 place-items-center lg:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && (
        <div className="flex flex-col px-5 pb-4 lg:hidden">
          {NAV.map(id => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className={link(id) + ' py-3'}>{id}</a>)}
          <a href={asset(LINKS.resume)} download className="mt-2 inline-flex items-center gap-2 py-3 text-sm text-violet"><Download size={15} />Download Resume</a>
        </div>
      )}
    </header>
  )
}
