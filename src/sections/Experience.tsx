import Section from '../components/Section'
import { experience } from '../data/experience'

function ExperienceTimeline({ entries }: { entries: typeof experience }) {
  return (
    <ol className="relative ml-2 space-y-8 border-l border-white/15 pl-8">
      {entries.map(e => (
        <li key={e.role} className="relative">
          <span className="absolute -left-[39px] top-2 h-3 w-3 rounded-full bg-gradient-to-br from-violet to-cyan ring-4 ring-ink" aria-hidden />
          <div className="glass p-6">
            <p className="font-mono text-xs text-cyan">{e.period}</p>
            <h3 className="mt-1 font-display text-xl font-semibold">{e.role}</h3>
            <p className="text-muted">{e.org}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">{e.points.map(p => <li key={p}>{p}</li>)}</ul>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Professional experience">
      <div className="space-y-12">
        <div>
          <h2 className="mb-6 font-display text-2xl font-semibold">Internships</h2>
          <ExperienceTimeline entries={experience.filter(e => e.category === 'internship')} />
        </div>
        <div>
          <h2 className="mb-6 font-display text-2xl font-semibold">Content Creation</h2>
          <ExperienceTimeline entries={experience.filter(e => e.category === 'content')} />
        </div>
      </div>
    </Section>
  )
}
