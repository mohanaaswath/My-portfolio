import { GraduationCap } from 'lucide-react'
import Section from '../components/Section'
export default function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Academic background">
      <div className="glass flex items-start gap-4 p-6">
        <GraduationCap className="mt-1 shrink-0 text-violet" />
        <div><p className="font-mono text-xs text-cyan">2023 – Present</p><h3 className="font-display text-xl font-semibold">Bachelor of Science in Computer Science</h3><p className="text-muted">Thiruvalluvar University · In progress</p></div>
      </div>
    </Section>
  )
}
