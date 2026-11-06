import type { ReactNode } from 'react'
type P = { href: string; variant?: 'primary' | 'ghost'; external?: boolean; download?: boolean; children: ReactNode }
export default function Button({ href, variant = 'primary', external, download, children }: P) {
  const base = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition duration-200'
  const v = variant === 'primary' ? 'bg-gradient-to-r from-violet to-azure text-white hover:brightness-110' : 'border border-white/15 text-fg hover:border-cyan/60 hover:text-cyan'
  return <a href={href} download={download || undefined} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={`${base} ${v}`}>{children}</a>
}
