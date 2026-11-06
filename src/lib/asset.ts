export const asset = (p: string) => {
  if (!p) return ''
  if (p.startsWith('data:') || p.startsWith('blob:') || p.startsWith('http://') || p.startsWith('https://')) {
    return p
  }
  return import.meta.env.BASE_URL + p.replace(/^\//, '')
}

export const LINKS = {
  github: 'https://github.com/mohanaaswath',
  linkedin: 'https://www.linkedin.com/in/mohana-aswath-m-010265312/',
  instagram: 'https://www.instagram.com/uniqstack_ai/',
  email: 'mohanaaswath6@gmail.com',
  resume: 'Mohana_Aswath_Resume.pdf',
}
