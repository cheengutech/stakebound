'use client'

import { useState, useRef, useEffect } from 'react'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  :root {
    --navy:    #0e1825;
    --navy2:   #13212f;
    --border-dark: #1c2d3d;
    --white:   #ffffff;
    --off:     #f7f8fa;
    --ink:     #111827;
    --muted:   #6b7280;
    --light:   #9ca3af;
    --accent:  #1a3a5c;
    --accent2: #254f7a;
    --red-fg:  #b91c1c;
    --border:  #e5e7eb;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb { background: var(--border-dark); }

  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; font-family: inherit; }
  input  { font-family: inherit; outline: none; }

  .serif { font-family: 'DM Serif Display', serif; }
  .mono  { font-family: 'DM Mono', monospace; }
  .sans  { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .fu0 { animation: fadeUp 0.6s ease forwards; }
  .fu1 { animation: fadeUp 0.6s 0.15s ease forwards; opacity: 0; }
  .fu2 { animation: fadeUp 0.6s 0.28s ease forwards; opacity: 0; }
  .fu3 { animation: fadeUp 0.6s 0.42s ease forwards; opacity: 0; }
`

function useInView(ref: React.RefObject<HTMLDivElement | null>, threshold = 0.12) {
    const [v, setV] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return v
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
    const v = useInView(ref)
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? 'none' : 'translateY(20px)',
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

function formatPhone(val: string) {
  const d = val.replace(/\D/g, '').slice(0, 10)
  if (d.length <= 3) return d
  if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3)}`
  return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`
}

const MSGS = [
  { from: 'user', text: 'I want to run 3x this week' },
  { from: 'sb',   text: 'How much do you want to stake? ($25 minimum)' },
  { from: 'user', text: '$50' },
  { from: 'sb',   text: "Who's your judge? Send their number." },
  { from: 'user', text: '+1 (415) 555-0142' },
  { from: 'sb',   text: "Clark is locked in. Deadline Sunday 11:59pm. ⚡" },
]

function PhoneMockup() {
  const [visible, setVisible] = useState<number[]>([])
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null) 
  const inView = useInView(ref, 0.3)

  useEffect(() => {
    if (inView && !started) {
      setStarted(true);
      [500, 1500, 2400, 3300, 4200, 5400].forEach((d, i) =>
        setTimeout(() => setVisible(p => [...p, i]), d)
      )
    }
  }, [inView])

  return (
    <div ref={ref} style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: 264, background: '#0a0f18',
        borderRadius: 44, padding: '14px 8px',
        boxShadow: '0 0 0 1px #1e2a3a, 0 32px 64px rgba(14,24,37,0.18), 0 8px 24px rgba(0,0,0,0.12)',
      }}>
        <div style={{
          width: 80, height: 20, background: '#0a0f18',
          borderRadius: 10, margin: '0 auto 10px',
          border: '1px solid #161e28',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1a2535' }} />
          <div style={{ width: 18, height: 4, borderRadius: 2, background: '#1a2535' }} />
        </div>
        <div style={{ background: '#f9fafb', borderRadius: 34, overflow: 'hidden' }}>
          <div style={{
            background: '#ffffff', padding: '12px 14px 10px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', gap: 9,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', background: '#0e1825',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
              fontSize: 11, color: '#9ca3af', letterSpacing: 1,
            }}>SB</div>
            <div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600, color: '#111827' }}>StakeBound</div>
              <div style={{ fontFamily: 'DM Mono', fontSize: 9, color: '#9ca3af' }}>SMS</div>
            </div>
            <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
          </div>
          <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 7, minHeight: 310, background: '#f9fafb' }}>
            {MSGS.map((msg, i) => {
              const isUser = msg.from === 'user'
              return (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  opacity: visible.includes(i) ? 1 : 0,
                  transform: visible.includes(i) ? 'none' : 'translateY(5px)',
                  transition: 'all 0.32s ease',
                }}>
                  <div style={{
                    maxWidth: '78%', padding: '7px 11px',
                    background: isUser ? '#1a3a5c' : '#ffffff',
                    border: isUser ? 'none' : '1px solid #e5e7eb',
                    borderRadius: isUser ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                    fontFamily: 'DM Sans', fontSize: 11.5, lineHeight: 1.45,
                    color: isUser ? '#e8f0f8' : '#374151',
                    fontWeight: 400,
                  }}>{msg.text}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [phone, setPhone] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const border = '1px solid var(--border)'

  async function handlePhoneSubmit() {
    if (phone.replace(/\D/g, '').length < 10) return
    setLoading(true)
    try {
      await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      setDone(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    const { createClient } = await import('@supabase/supabase-js')
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  
  }

  return (
    <div style={{ background: '#ffffff' }}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)',
        borderBottom: border,
        padding: '0 48px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/sb-logo.svg" height={35} width={35} alt="SB" />
          <span className="sans" style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>
            Stake<span style={{ color: 'var(--accent)' }}>Bound</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {[['How it works', 'how'], ['Why it works', 'why']].map(([label, id]) => (
            <a key={id} href={`#${id}`} style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--muted)' }}>{label}</a>
          ))}
          <button
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'var(--accent)', color: '#ffffff', border: 'none',
              fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500,
              padding: '9px 22px', borderRadius: 6,
            }}>
            Get started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        background: '#ffffff', padding: '80px 48px',
        maxWidth: 1100, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 72, alignItems: 'center',
      }}>
        <div>
          <div className="mono fu0" style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 24 }}>
            Commitment infrastructure
          </div>
          <h1 className="serif fu1" style={{ fontSize: 'clamp(48px, 5.5vw, 72px)', lineHeight: 1.1, color: 'var(--ink)', marginBottom: 24, letterSpacing: '-0.5px' }}>
            You set a goal.<br />
            Money enforces it.<br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Your friend verifies it.</span>
          </h1>
          <p className="sans fu2" style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.75, maxWidth: 440, marginBottom: 40, fontWeight: 300 }}>
            StakeBound is an SMS accountability system. Stake real money on your commitment and name someone who will verify you followed through. No app. No strangers. No excuses.
          </p>
          <div className="fu3" style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 40 }}>
            <button
              onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'var(--accent)', color: '#ffffff', border: 'none', fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500, padding: '13px 28px', borderRadius: 6 }}>
              Start your first stake
            </button>
            <button
              onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'none', border, color: 'var(--muted)', fontFamily: 'DM Sans', fontSize: 14, padding: '13px 24px', borderRadius: 6 }}>
              How it works
            </button>
          </div>
          <div className="fu3" style={{ display: 'flex', gap: 32, paddingTop: 32, borderTop: border }}>
            {[{ val: '94%', label: 'Follow-through rate' }, { val: '$0', label: 'Platform fee' }, { val: 'SMS', label: 'No app needed' }].map((s, i) => (
              <div key={i}>
                <div className="serif" style={{ fontSize: 26, color: 'var(--ink)', lineHeight: 1 }}>{s.val}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--light)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="fu2"><PhoneMockup /></div>
      </div>

      {/* WHY IT WORKS */}
      <div id="why" style={{ background: 'var(--navy)', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div className="mono" style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--border-dark)', marginBottom: 16 }}>Why it works</div>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: '#ffffff', marginBottom: 56 }}>Three mechanisms.<br />One outcome.</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--border-dark)' }}>
            {[
              { n: '01', title: 'Loss Aversion', body: 'Losing $50 hurts more than gaining $50 feels good. We use that asymmetry deliberately. Your brain is wired to avoid loss — we make that work for you.', cap: 'Kahneman & Tversky, 1979' },
              { n: '02', title: 'Social Verification', body: "Your judge is someone who knows you. Not a stranger, not an algorithm. Someone whose opinion carries weight. That relationship is the enforcement mechanism.", cap: 'Human verification only' },
              { n: '03', title: 'Automatic Enforcement', body: "The system runs without negotiation. Deadlines do not move. At the appointed time, your judge receives a verification link. Outcome recorded.", cap: 'No manual override' },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{ background: 'var(--navy2)', padding: '44px 36px' }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--border-dark)', marginBottom: 28 }}>{f.n}</div>
                  <div className="serif" style={{ fontSize: 22, color: '#e8edf2', marginBottom: 14 }}>{f.title}</div>
                  <div className="sans" style={{ fontSize: 14, color: 'var(--light)', lineHeight: 1.8, marginBottom: 24, fontWeight: 300 }}>{f.body}</div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--border-dark)', paddingTop: 20, borderTop: '1px solid var(--border-dark)' }}>{f.cap}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{ background: 'var(--navy)', borderTop: '1px solid var(--border-dark)', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div className="mono" style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--border-dark)', marginBottom: 16 }}>The process</div>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: '#ffffff', marginBottom: 56 }}>Four steps.<br />No exceptions.</h2>
          </Reveal>
          <div style={{ borderTop: '1px solid var(--border-dark)' }}>
            {[
              { n: '01', t: 'State your commitment', b: 'Text StakeBound what you are committing to. Specific, measurable, time-bound.' },
              { n: '02', t: 'Set your stake', b: 'Choose an amount that matters. Minimum $25. Does losing this hurt? It should.' },
              { n: '03', t: 'Name your judge', b: "Provide one phone number. Someone who will not let you off the hook. They verify at the deadline." },
              { n: '04', t: 'Face the deadline', b: "One tap from your judge. Stake returned on success — forfeited on failure. No appeals." },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 60}>
                <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', borderBottom: '1px solid var(--border-dark)', padding: '32px 0', alignItems: 'start' }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--border-dark)', paddingTop: 4 }}>{s.n}</div>
                  <div>
                    <div className="serif" style={{ fontSize: 20, color: '#e8edf2', marginBottom: 8 }}>{s.t}</div>
                    <div className="sans" style={{ fontSize: 14, color: 'var(--light)', lineHeight: 1.7, maxWidth: 500, fontWeight: 300 }}>{s.b}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* SUCCESS / FAILURE */}
      <div style={{ background: 'var(--navy)', borderTop: '1px solid var(--border-dark)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border-dark)' }}>
              <div style={{ background: 'var(--navy2)', padding: '52px 44px' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--border-dark)', marginBottom: 20 }}>On failure</div>
                <div className="serif" style={{ fontSize: 'clamp(32px, 3.5vw, 44px)', color: '#b91c1c', marginBottom: 20, lineHeight: 1.15 }}>The stake<br />is forfeited.</div>
                <p className="sans" style={{ fontSize: 14, color: 'var(--light)', lineHeight: 1.75, fontWeight: 300 }}>Your stake goes directly to your judge. StakeBound takes nothing. The consequence is financial and social — simultaneously.</p>
              </div>
              <div style={{ background: 'var(--navy2)', padding: '52px 44px' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--border-dark)', marginBottom: 20 }}>On success</div>
                <div className="serif" style={{ fontSize: 'clamp(32px, 3.5vw, 44px)', color: '#e8edf2', marginBottom: 20, lineHeight: 1.15 }}>Your stake<br />returns.</div>
                <p className="sans" style={{ fontSize: 14, color: 'var(--light)', lineHeight: 1.75, fontWeight: 300 }}>Full stake returned. Your judge confirms. The record stands. You said you would, and you did.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* CTA */}
      <div id="cta" style={{ background: '#ffffff', borderTop: border, padding: '96px 48px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <Reveal>
            <div className="mono" style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20 }}>Begin</div>
            <h2 className="serif" style={{ fontSize: 'clamp(40px, 5vw, 58px)', color: 'var(--ink)', marginBottom: 16, lineHeight: 1.15 }}>What are you<br />committing to?</h2>
            <p className="sans" style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 44, fontWeight: 300 }}>Enter your number. We will text you to set your first stake. Free to use. No app required.</p>
          </Reveal>
          <Reveal delay={120}>
            {!done ? (
              <div>
                <div style={{ display: 'flex', marginBottom: 12, borderRadius: 6, overflow: 'hidden', border }}>
                  <div style={{ background: 'var(--off)', padding: '0 14px', display: 'flex', alignItems: 'center', borderRight: border, fontFamily: 'DM Mono', fontSize: 13, color: 'var(--muted)' }}>+1</div>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={e => setPhone(formatPhone(e.target.value))}
                    style={{ flex: 1, background: '#ffffff', border: 'none', color: 'var(--ink)', fontFamily: 'DM Sans', fontSize: 15, padding: '14px 16px' }}
                  />
                  <button
                    onClick={handlePhoneSubmit}
                    disabled={loading}
                    style={{ background: 'var(--accent)', color: '#ffffff', border: 'none', fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500, padding: '0 24px', whiteSpace: 'nowrap', borderLeft: border, opacity: loading ? 0.7 : 1 }}>
                    {loading ? '...' : 'Send →'}
                  </button>
                </div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#d1d5db', textAlign: 'center', marginBottom: 12 }}>or</div>
                <button
                  onClick={handleGoogleSignIn}
                  style={{ width: '100%', background: '#ffffff', border, borderRadius: 6, color: 'var(--muted)', fontFamily: 'DM Sans', fontSize: 14, padding: '13px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            ) : (
              <div style={{ background: 'var(--off)', border, borderLeft: '3px solid var(--accent)', borderRadius: 6, padding: '24px 28px' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>Confirmed</div>
                <div className="sans" style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>A text is on its way to {phone}. Follow the instructions to set your first stake.</div>
              </div>
            )}
          </Reveal>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: 'var(--navy)', borderTop: '1px solid var(--border-dark)', padding: '28px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="sans" style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af' }}>Stake<span style={{ color: '#4a6a8a' }}>Bound</span></span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--border-dark)' }}>© 2026 StakeBound LLC</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--border-dark)' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
