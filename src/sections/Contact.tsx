import { useState, type FormEvent } from 'react'
import { Mail, Github, Linkedin, Instagram, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import Section from '../components/Section'
import { LINKS } from '../lib/asset'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const defaultEndpoint = `https://formsubmit.co/ajax/${LINKS.email}`
const customEndpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined
const endpoint = customEndpoint || defaultEndpoint
const accessKey = import.meta.env.VITE_FORM_ACCESS_KEY as string | undefined

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

const emptyForm: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

const fieldStyle =
  'w-full rounded-lg border border-white/15 bg-ink/60 px-4 py-3 text-sm text-fg placeholder:text-muted/70 focus:border-cyan focus:outline-none transition'

export default function Contact() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'activation' | 'fail'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const mailtoLink = `mailto:${LINKS.email}?subject=${encodeURIComponent(
    form.subject || 'Project inquiry'
  )}&body=${encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.email})`)}`

  const validate = (): boolean => {
    const errs: Partial<FormState> = {}
    if (form.name.trim().length < 2) {
      errs.name = 'Please enter your name (at least 2 characters).'
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address.'
    }
    if (form.subject.trim().length < 3) {
      errs.subject = 'Please add a subject (at least 3 characters).'
    }
    if (form.message.trim().length < 10) {
      errs.message = 'Please write a message (at least 10 characters).'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('sending')
    setErrorMessage('')

    try {
      // 1. Prepare payload
      const payload: Record<string, string> = accessKey
        ? {
          ...form,
          access_key: accessKey,
        }
        : {
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          _subject: `New Portfolio Message from ${form.name}: ${form.subject}`,
          _replyto: form.email.trim(),
          _template: 'table',
          _captcha: 'false',
        }

      // 2. Submit to email service
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => null)

      // Also save backup to Supabase messages table if configured
      if (supabase && isSupabaseConfigured) {
        try {
          await supabase.from('messages').insert([
            {
              name: form.name.trim(),
              email: form.email.trim(),
              subject: form.subject.trim(),
              message: form.message.trim(),
            },
          ])
        } catch {
          // ignore backup save error
        }
      }

      if (response.ok && (data?.success === 'true' || data?.success === true || response.status === 200)) {
        if (data?.message && typeof data.message === 'string' && data.message.includes('Activation')) {
          setStatus('activation')
        } else {
          setStatus('ok')
          setForm(emptyForm)
        }
      } else {
        if (data?.message && typeof data.message === 'string' && data.message.includes('Activation')) {
          setStatus('activation')
        } else {
          throw new Error(data?.message || 'Server returned an error status')
        }
      }
    } catch (err: any) {
      console.error('Contact form submission error:', err)
      setStatus('fail')
      setErrorMessage(err?.message || '')
    }
  }

  const handleChange =
    (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [k]: e.target.value }))
      if (errors[k]) {
        setErrors(prev => ({ ...prev, [k]: undefined }))
      }
    }

  return (
    <Section id="contact" eyebrow="Contact" title="Have a Project in Mind? Let's Build Something Great.">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-4 text-muted">
          <p className="leading-relaxed">
            Open to freelance projects, collaborations, and full-time opportunities. Send a message here and it will
            be delivered directly to my email.
          </p>
          <a
            href={`mailto:${LINKS.email}`}
            className="flex items-center gap-3 transition hover:text-cyan"
            title="Send direct email"
          >
            <Mail size={18} className="text-cyan" />
            <span>{LINKS.email}</span>
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 transition hover:text-cyan"
          >
            <Linkedin size={18} className="text-cyan" />
            <span>LinkedIn</span>
          </a>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 transition hover:text-cyan"
          >
            <Github size={18} className="text-cyan" />
            <span>GitHub</span>
          </a>
          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 transition hover:text-cyan"
          >
            <Instagram size={18} className="text-cyan" />
            <span>@uniqstack_ai</span>
          </a>
        </div>

        <form onSubmit={handleSubmit} noValidate className="glass space-y-4 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted">Your Name</span>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className={fieldStyle}
                  value={form.name}
                  onChange={handleChange('name')}
                  aria-invalid={Boolean(errors.name)}
                  required
                />
              </label>
              {errors.name && <span className="mt-1 block text-xs text-rose-400">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted">Your Email</span>
                <input
                  type="email"
                  placeholder="e.g. client@example.com"
                  className={fieldStyle}
                  value={form.email}
                  onChange={handleChange('email')}
                  aria-invalid={Boolean(errors.email)}
                  required
                />
              </label>
              {errors.email && <span className="mt-1 block text-xs text-rose-400">{errors.email}</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted">Subject</span>
              <input
                type="text"
                placeholder="e.g. Freelance Web Development / AI Project"
                className={fieldStyle}
                value={form.subject}
                onChange={handleChange('subject')}
                aria-invalid={Boolean(errors.subject)}
                required
              />
            </label>
            {errors.subject && <span className="mt-1 block text-xs text-rose-400">{errors.subject}</span>}
          </div>

          <div>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted">Message</span>
              <textarea
                rows={5}
                placeholder="Tell me about your project, timeline, and requirements..."
                className={fieldStyle}
                value={form.message}
                onChange={handleChange('message')}
                aria-invalid={Boolean(errors.message)}
                required
              />
            </label>
            {errors.message && <span className="mt-1 block text-xs text-rose-400">{errors.message}</span>}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-violet to-cyan px-6 text-sm font-semibold text-ink shadow-lg shadow-violet/20 transition hover:opacity-90 active:scale-95 disabled:opacity-60"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Send message
                </>
              )}
            </button>

            <a href={mailtoLink} className="text-xs text-muted transition hover:text-cyan">
              Or email directly: <span className="underline">{LINKS.email}</span>
            </a>
          </div>

          {/* Status feedback */}
          <div aria-live="polite" className="pt-2 text-sm">
            {status === 'ok' && (
              <div className="flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 p-3 text-cyan">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>Thank you! Your message has been sent successfully. I will get back to you shortly.</span>
              </div>
            )}

            {status === 'activation' && (
              <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-400" />
                <div>
                  <p className="font-semibold text-amber-300">First-Time Form Activation Required</p>
                  <p className="mt-0.5 text-xs text-amber-200/90 leading-relaxed">
                    FormSubmit has sent an activation email to <strong>{LINKS.email}</strong>. Please check your Gmail
                    and click <strong>"Activate Form"</strong> once. After that single click, all messages will arrive
                    instantly in your inbox!
                  </p>
                </div>
              </div>
            )}

            {status === 'fail' && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-400" />
                <div>
                  <span>Could not send message automatically. </span>
                  <a href={mailtoLink} className="font-medium text-cyan underline">
                    Click here to send directly via your email client
                  </a>
                  {errorMessage && <span className="block text-xs text-rose-300/80 mt-1">({errorMessage})</span>}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </Section>
  )
}
