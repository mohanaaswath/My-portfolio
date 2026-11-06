import { motion } from 'framer-motion'
import { Github, Linkedin } from 'lucide-react'
import Button from '../components/Button'
import { asset, LINKS } from '../lib/asset'
const badges = [['React', '-left-3 top-8'], ['Python', '-right-3 top-24'], ['LLMs', 'left-6 -bottom-3']]
export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 sm:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 lg:grid-cols-[1.15fr_.85fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-mono text-sm text-cyan">AI Full Stack Developer</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] sm:text-6xl">Building <span className="grad-text">Intelligent</span> Digital Experiences.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">I'm Mohana Aswath, an AI Full Stack Developer focused on building modern web applications and intelligent AI-powered solutions. I enjoy turning ideas into functional, scalable digital products using modern technologies.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#projects">Explore My Projects</Button>
            <Button href="#contact" variant="ghost">Let's Work Together</Button>
            <Button href={asset(LINKS.resume)} variant="ghost" download>Download Resume</Button>
          </div>
          <div className="mt-8 flex gap-5 text-muted">
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-cyan"><Github /></a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-cyan"><Linkedin /></a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-violet via-azure to-cyan opacity-60 blur-xl" aria-hidden />
          <img src={asset('img/profile.webp')} alt="Portrait of Mohana Aswath" className="relative aspect-[4/4.2] w-full rounded-2xl border border-white/15 object-cover" />
          {badges.map(([t, pos], i) => <span key={t} style={{ animationDelay: `${i * 1.2}s` }} className={`float chip absolute ${pos} border-cyan/30 bg-ink/90 text-fg shadow-lg`}>{t}</span>)}
        </motion.div>
      </div>
    </section>
  )
}
