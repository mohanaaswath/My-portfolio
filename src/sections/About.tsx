import Section from '../components/Section'
export default function About() {
  return (
    <Section id="about" eyebrow="About" title="Curious builder, steady learner">
      <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
        <p>I started with web development and grew into building complete full-stack applications: responsive frontends in React, REST APIs with Node and Express, and databases such as MySQL, MongoDB and Supabase.</p>
        <p>My interest has since moved toward AI. I'm learning to build with large language models, prompt engineering and API integration, and I put that to work in projects like Pennywise AI and Jarvis, a voice assistant.</p>
        <p>I care about building useful, real-world products and about learning in public: every project here is a step in that direction, and I'm always working on the next one.</p>
      </div>
    </Section>
  )
}
