import { motion } from 'framer-motion'
import Section from '../components/Section'
import { skills } from '../data/skills'
export default function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="Technical toolkit">
      <div className="grid gap-5 sm:grid-cols-2">
        {skills.map(g => (
          <motion.div key={g.title} whileHover={{ y: -3 }} className="glass glass-hover p-6">
            <h3 className="font-display text-lg font-semibold">{g.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2">{g.items.map(i => <span key={i} className="chip text-fg/90">{i}</span>)}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
