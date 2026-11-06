import { motion } from 'framer-motion'
import { Code2, Brain, Globe, Server, LayoutTemplate } from 'lucide-react'
import Section from '../components/Section'
import Button from '../components/Button'
const services = [
  [Code2, 'Full Stack Web Development', 'Responsive business websites and web applications.'],
  [Brain, 'AI-Powered Web Applications', 'AI integrations, intelligent assistants and LLM-powered features.'],
  [Globe, 'Business Websites', 'Professional websites for startups and small businesses.'],
  [Server, 'API and Backend Development', 'Backend services, REST APIs and database integration.'],
  [LayoutTemplate, 'Portfolio and Landing Pages', 'Modern personal portfolios and conversion-focused landing pages.'],
] as const
export default function Services() {
  return (
    <Section id="services" eyebrow="Services" title="How I can help">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(([Icon, t, d]) => (
          <motion.div key={t} whileHover={{ y: -3 }} className="glass glass-hover p-6">
            <Icon className="text-cyan" size={26} strokeWidth={1.6} />
            <h3 className="mt-4 font-display text-lg font-semibold">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
          </motion.div>
        ))}
        <div className="glass flex flex-col items-start justify-center gap-4 border-violet/40 p-6"><p className="font-display text-lg font-semibold">Have a project in mind?</p><Button href="#contact">Start a conversation</Button></div>
      </div>
    </Section>
  )
}
