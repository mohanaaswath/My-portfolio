import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
export default function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 py-16 sm:py-20">
      <motion.div className="mx-auto max-w-6xl px-5" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }}>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">{eyebrow}</p>
        <h2 className="mb-10 mt-2 font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
        {children}
      </motion.div>
    </section>
  )
}
