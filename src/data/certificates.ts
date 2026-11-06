export type Certificate = {
  title: string
  org: string
  date: string
  img: string
  isCustom?: boolean
  id?: string
}

export const certificates: Certificate[] = [
  { title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate', org: 'Oracle University', date: 'Aug 2025', img: 'img/oracle.webp' },
  { title: 'Full Stack Web Development Internship', org: 'EDU TANTR', date: 'May – Jun 2025', img: 'img/internship.webp' },
  { title: 'Introduction to Front End Development', org: 'Simplilearn SkillUP', date: 'Aug 2025', img: 'img/frontend.webp' },
  { title: 'React JS Free Course', org: 'Scaler Topics', date: 'Nov 2025', img: 'img/react.webp' },
  { title: 'Explore Machine Learning using Python', org: 'Infosys Springboard', date: 'Mar 2025', img: 'img/py-ml.webp' },
  { title: 'Basics of Python', org: 'Infosys Springboard', date: 'Aug 2024', img: 'img/py-basics.webp' },
  { title: 'Object Oriented Programming using Python', org: 'Infosys Springboard', date: 'Aug 2024', img: 'img/py-oop.webp' },
  { title: 'Introduction to MongoDB for Students', org: 'MongoDB', date: 'Jul 2024', img: 'img/mongodb.webp' },
  { title: 'Getting Started with MongoDB Atlas', org: 'MongoDB', date: 'Jul 2024', img: 'img/atlas.webp' },
]
