import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Plus, X, MapPin, Loader2, Send, Copy, Check } from 'lucide-react'
import axios from 'axios'
import { useTheme } from '../contexts/ThemeContext'

interface Comment { id: string; userName: string; text: string; date: string }
interface Post { id: string; userName: string; userAvatar: string; destination: string; country: string; caption: string; images: string[]; likes: number; comments: Comment[]; tags: string[]; createdAt: string; liked: boolean; tripId?: string }

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function PostCard({ post, onLike, onShare }: { post: Post; onLike: (id: string) => void; onShare: (id: string) => void }) {
  const [showComments, setShowComments] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    onShare(post.id)
    navigator.clipboard.writeText(`https://layover.app/post/${post.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card" style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px' }}>
        {post.userAvatar.startsWith('http') ? (
          <img src={post.userAvatar} alt={post.userName} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #E2E8F0' }} />
        ) : (
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: 'white', flexShrink: 0 }}>
            {post.userAvatar}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <p style={{ color: '#0F172A', fontSize: '14px', fontWeight: '700' }}>@{post.userName}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={11} color="#4F46E5" />
            <span style={{ color: '#4F46E5', fontSize: '12px', fontWeight: '500' }}>{post.destination}, {post.country}</span>
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>· {timeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Image */}
      {post.images[0] && (
        <div style={{ position: 'relative', height: '380px' }}>
          <img src={post.images[0]} alt={post.destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
          <button
            onClick={() => onLike(post.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', padding: '6px 0' }}
          >
            <Heart size={20} fill={post.liked ? '#EF4444' : 'transparent'} color={post.liked ? '#EF4444' : '#64748B'} />
            <span style={{ color: post.liked ? '#EF4444' : '#64748B', fontSize: '14px', fontWeight: '600' }}>{post.likes}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}
          >
            <MessageCircle size={20} color="#8892A4" />
            <span style={{ color: '#64748B', fontSize: '14px', fontWeight: '600' }}>{(post.comments || []).length}</span>
          </button>
          <button
            onClick={handleShare}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', marginLeft: 'auto', color: copied ? '#10B981' : '#64748B', transition: 'color 0.2s' }}
          >
            {copied ? <Check size={20} color="#06D6A0" /> : <Share2 size={20} />}
            <span style={{ fontSize: '13px', fontWeight: '600' }}>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Caption */}
        <p style={{ color: '#0F172A', fontSize: '14px', lineHeight: '1.7', marginBottom: '10px' }}>
          <span style={{ fontWeight: '700' }}>@{post.userName} </span>{post.caption}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: showComments ? '16px' : '0' }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ color: '#4F46E5', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>#{tag}</span>
          ))}
        </div>

        {/* Comments */}
        {showComments && (
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
            {(post.comments || []).map(c => (
              <div key={c.id} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#64748B', flexShrink: 0 }}>
                  {c.userName[0].toUpperCase()}
                </div>
                <div>
                  <span style={{ color: '#0F172A', fontSize: '13px', fontWeight: '700' }}>@{c.userName} </span>
                  <span style={{ color: '#64748B', fontSize: '13px' }}>{c.text}</span>
                  <p style={{ color: '#94A3B8', fontSize: '11px', marginTop: '2px' }}>{timeAgo(c.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Social() {
  const { t } = useTheme()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [sharing, setSharing] = useState<string | null>(null)
  const [form, setForm] = useState({ destination: '', country: '', caption: '', tags: '', imageUrl: '' })
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    axios.get('/api/social/feed').then(r => setPosts(r.data.posts || [])).finally(() => setLoading(false))
  }, [])

  const likePost = async (id: string) => {
    const post = posts.find(p => p.id === id)
    if (!post) return
    if (!post.liked) {
      await axios.post(`/api/social/posts/${id}/like`)
    }
    setPosts(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p))
  }

  const shareTrip = async (tripId: string) => {
    setSharing(tripId)
    await axios.post(`/api/trips/${tripId}/share`)
    setTimeout(() => setSharing(null), 2000)
  }

  const createPost = async () => {
    if (!form.destination || !form.caption) return
    setPosting(true)
    const tags = form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    const res = await axios.post('/api/social/posts', {
      userName: 'you', userAvatar: 'Y',
      destination: form.destination, country: form.country,
      caption: form.caption, tags,
      images: form.imageUrl ? [form.imageUrl] : ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&q=80'],
    })
    setPosts(ps => [res.data, ...ps])
    setForm({ destination: '', country: '', caption: '', tags: '', imageUrl: '' })
    setShowCreate(false)
    setPosting(false)
  }

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', background: t.bg, transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '4px' }}>Travel Feed</h1>
            <p style={{ color: '#64748B', fontSize: '14px' }}>Discover trips, share yours, and get inspired</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn btn-primary btn-sm" style={{ gap: '8px' }}>
            <Plus size={16} /> Share Trip
          </button>
        </div>

        {/* Share my trip CTA */}
        <div className="card" style={{ borderRadius: '16px', padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid rgba(79,70,229,0.15)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: '800', color: 'white', flexShrink: 0 }}>Y</div>
          <button onClick={() => setShowCreate(true)} style={{ flex: 1, textAlign: 'left', background: 'rgba(0,0,0,0.025)', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '10px 16px', color: '#64748B', fontSize: '14px', cursor: 'pointer' }}>
            Share your latest trip adventure...
          </button>
          <button onClick={() => setShowCreate(true)} style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(79,70,229,0.12)', border: '1px solid rgba(79,70,229,0.2)', color: '#4F46E5', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Post
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', gap: '12px', alignItems: 'center' }}>
            <Loader2 size={24} color="#4F46E5" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ color: '#64748B' }}>Loading feed...</span>
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} onLike={likePost} onShare={shareTrip} />
          ))
        )}
      </div>

      {/* Create post modal */}
      {showCreate && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCreate(false) }}
        >
          <div style={{ width: '100%', maxWidth: '500px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: '#0F172A', fontSize: '20px', fontWeight: '800' }}>Share Your Trip</h3>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Destination *</label>
                  <input className="input-glass" placeholder="e.g. Bali" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} />
                </div>
                <div>
                  <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Country</label>
                  <input className="input-glass" placeholder="e.g. Indonesia" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Caption *</label>
                <textarea
                  className="input-glass"
                  placeholder="Tell your travel story..."
                  value={form.caption}
                  onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                  style={{ resize: 'none', minHeight: '100px' }}
                />
              </div>
              <div>
                <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Photo URL (optional)</label>
                <input className="input-glass" placeholder="https://..." value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
              </div>
              <div>
                <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Tags (comma separated)</label>
                <input className="input-glass" placeholder="e.g. beach, sunset, food" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
              </div>
              <button
                onClick={createPost}
                disabled={!form.destination || !form.caption || posting}
                className="btn btn-primary"
                style={{ marginTop: '4px', width: '100%', gap: '8px', opacity: !form.destination || !form.caption ? 0.5 : 1 }}
              >
                {posting ? <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Send size={16} />}
                {posting ? 'Posting...' : 'Share to Feed'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}