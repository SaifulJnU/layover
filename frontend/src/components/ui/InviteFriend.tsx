import { useState, useEffect } from 'react'
import { X, UserPlus, Mail, Copy, Check, Trash2, Clock, CheckCircle, XCircle, Send, Link } from 'lucide-react'
import axios from 'axios'

interface Invite {
  id: string; tripId: string; tripName: string; fromUser: string
  toEmail: string; message: string; status: string; inviteLink: string; createdAt: string
}

interface Props {
  tripId: string
  tripName: string
  onClose: () => void
}

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  pending:  { color: '#F59E0B', icon: Clock,       label: 'Pending'  },
  accepted: { color: '#10B981', icon: CheckCircle, label: 'Accepted' },
  declined: { color: '#EF4444', icon: XCircle,     label: 'Declined' },
}

export default function InviteFriend({ tripId, tripName, onClose }: Props) {
  const [invites, setInvites]   = useState<Invite[]>([])
  const [email, setEmail]       = useState('')
  const [message, setMessage]   = useState(`Hey! Join our trip to ${tripName} 🌍`)
  const [sending, setSending]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [copied, setCopied]     = useState<string | null>(null)
  const [tab, setTab]           = useState<'invite' | 'manage'>('invite')

  useEffect(() => {
    axios.get(`/api/invites?tripId=${tripId}`).then(r => setInvites(r.data.invites || []))
  }, [tripId])

  const sendInvite = async () => {
    if (!email) return
    setSending(true)
    const res = await axios.post('/api/invites', { tripId, tripName, toEmail: email, message })
    setInvites(prev => [...prev, res.data])
    setSent(true)
    setEmail('')
    setSending(false)
    setTimeout(() => setSent(false), 2500)
  }

  const copyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const deleteInvite = async (id: string) => {
    await axios.delete(`/api/invites/${id}`)
    setInvites(prev => prev.filter(i => i.id !== id))
  }

  const generateLink = () => {
    const link = `https://layover.app/join/${tripId}?ref=${Date.now().toString(36)}`
    navigator.clipboard.writeText(link)
    setCopied('gen')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ width: '100%', maxWidth: '520px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '24px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={18} color="white" />
            </div>
            <div>
              <h3 style={{ color: '#0F172A', fontSize: '18px', fontWeight: '800' }}>Invite Friends</h3>
              <p style={{ color: '#64748B', fontSize: '12px' }}>{tripName}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', margin: '20px 24px 0', background: 'rgba(0,0,0,0.025)', borderRadius: '10px', padding: '4px' }}>
          {(['invite', 'manage'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '8px', borderRadius: '7px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', background: tab === t ? 'rgba(79,70,229,0.15)' : 'transparent', color: tab === t ? '#4F46E5' : '#64748B', transition: 'all 0.2s ease' }}>
              {t === 'invite' ? '✉️ Send Invite' : `📋 Manage (${invites.length})`}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          {tab === 'invite' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Share link */}
              <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link size={16} color="#4F46E5" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#0F172A', fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>Share invite link</p>
                  <p style={{ color: '#64748B', fontSize: '11px' }}>Anyone with this link can request to join</p>
                </div>
                <button onClick={generateLink}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', background: copied === 'gen' ? 'rgba(6,214,160,0.15)' : 'rgba(79,70,229,0.15)', border: `1px solid ${copied === 'gen' ? 'rgba(6,214,160,0.3)' : 'rgba(79,70,229,0.3)'}`, color: copied === 'gen' ? '#10B981' : '#4F46E5', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}>
                  {copied === 'gen' ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy Link</>}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                <span style={{ color: '#94A3B8', fontSize: '12px' }}>or invite by email</span>
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              </div>

              {/* Email input */}
              <div>
                <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="#94A3B8" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    className="input-glass"
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendInvite()}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Personal Message</label>
                <textarea
                  className="input-glass"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>

              {/* Quick invite suggestions */}
              <div>
                <p style={{ color: '#64748B', fontSize: '11px', fontWeight: '600', marginBottom: '8px' }}>Quick invite</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['alex@example.com', 'sam@example.com', 'jordan@example.com'].map(e => (
                    <button key={e} onClick={() => setEmail(e)}
                      style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '20px', border: '1px solid #E2E8F0', background: 'rgba(0,0,0,0.025)', color: '#64748B', cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onMouseEnter={el => { (el.currentTarget as HTMLElement).style.color = '#4F46E5'; (el.currentTarget as HTMLElement).style.borderColor = 'rgba(79,70,229,0.3)' }}
                      onMouseLeave={el => { (el.currentTarget as HTMLElement).style.color = '#64748B'; (el.currentTarget as HTMLElement).style.borderColor = '#E2E8F0' }}
                    >
                      {e.split('@')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={sendInvite}
                disabled={!email || sending}
                style={{
                  width: '100%', padding: '13px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: '700', cursor: email ? 'pointer' : 'not-allowed',
                  background: sent ? 'linear-gradient(135deg, #10B981, #4F46E5)' : email ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : 'rgba(0,0,0,0.03)',
                  color: email ? 'white' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s ease'
                }}
              >
                {sent ? <><Check size={16} /> Invite Sent!</> : sending ? 'Sending...' : <><Send size={16} /> Send Invite</>}
              </button>
            </div>
          )}

          {tab === 'manage' && (
            <div>
              {invites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <UserPlus size={40} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: '#64748B', fontSize: '14px' }}>No invites sent yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {invites.map(inv => {
                    const cfg = statusConfig[inv.status] || statusConfig.pending
                    const Icon = cfg.icon
                    return (
                      <div key={inv.id} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(0,0,0,0.02)', border: '1px solid #E2E8F0', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `${cfg.color}15`, border: `1px solid ${cfg.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={16} color={cfg.color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: '#0F172A', fontSize: '13px', fontWeight: '700', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.toEmail}</p>
                          <p style={{ color: '#64748B', fontSize: '11px', marginBottom: '6px' }}>{new Date(inv.createdAt).toLocaleDateString()}</p>
                          <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}20` }}>
                            {cfg.label}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                          <button onClick={() => copyLink(inv.inviteLink, inv.id)}
                            style={{ width: '30px', height: '30px', borderRadius: '8px', background: copied === inv.id ? 'rgba(6,214,160,0.12)' : 'rgba(0,0,0,0.03)', border: '1px solid #E2E8F0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: copied === inv.id ? '#10B981' : '#64748B' }}>
                            {copied === inv.id ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                          <button onClick={() => deleteInvite(inv.id)}
                            style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,107,107,0.05)', border: '1px solid rgba(255,107,107,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}