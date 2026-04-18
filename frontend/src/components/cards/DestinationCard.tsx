import { Star, MapPin, Thermometer, Heart, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { Destination } from '../../types'

interface Props {
  destination: Destination
  onClick?: () => void
  compact?: boolean
}

const seasonColors: Record<string, string> = {
  spring: '#10B981',
  summer: '#F97316',
  fall:   '#D97706',
  winter: '#3B82F6',
}

const priceDots = (level: number) =>
  Array.from({ length: 4 }, (_, i) => (
    <div
      key={i}
      style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: i < level ? '#4F46E5' : '#E2E8F0',
      }}
    />
  ))

export default function DestinationCard({ destination, onClick, compact }: Props) {
  const [liked, setLiked] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '22px', overflow: 'hidden', cursor: 'pointer', position: 'relative',
        background: '#fff',
        boxShadow: hovered ? '0 24px 64px rgba(0,0,0,0.16)' : '0 4px 20px rgba(0,0,0,0.07)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', height: compact ? '180px' : '240px', overflow: 'hidden' }}>
        <img
          src={destination.image}
          alt={destination.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
          }}
        />

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.15) 45%, transparent 70%)' }} />

        {/* Season pill — top left */}
        {destination.seasons[0] && (
          <div style={{
            position: 'absolute', top: '14px', left: '14px',
            padding: '4px 12px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.32)',
          }}>
            <span style={{
              color: '#fff', fontSize: '11px', fontWeight: '700',
              textTransform: 'capitalize', fontFamily: "'Plus Jakarta Sans',sans-serif",
              letterSpacing: '0.2px',
            }}>
              {destination.seasons[0]}
            </span>
          </div>
        )}

        {/* Heart — top right, icon only (no button frame) */}
        <div
          onClick={e => { e.stopPropagation(); setLiked(!liked) }}
          style={{
            position: 'absolute', top: '14px', right: '14px',
            width: '34px', height: '34px', borderRadius: '50%',
            background: liked ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(14px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.22s ease',
            opacity: hovered || liked ? 1 : 0.7,
          }}
        >
          <Heart
            size={14}
            fill={liked ? '#EF4444' : 'transparent'}
            color={liked ? '#EF4444' : 'rgba(255,255,255,0.9)'}
          />
        </div>

        {/* Bottom overlay: name + country + rating */}
        <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px' }}>
          <h3 style={{
            color: '#fff', fontSize: '19px', fontWeight: '800', marginBottom: '5px',
            fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.3px',
            lineHeight: 1.1,
          }}>
            {destination.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={11} color="rgba(255,255,255,0.6)" />
              <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: '12px' }}>{destination.country}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(8px)', padding: '3px 10px', borderRadius: '10px' }}>
              <Star size={11} fill="#FFD166" color="#FFD166" />
              <span style={{ color: '#FFD166', fontSize: '12px', fontWeight: '700' }}>{destination.rating}</span>
            </div>
          </div>
        </div>

        {/* Hover arrow — elegant circle, slides in */}
        <div style={{
          position: 'absolute', bottom: '16px', right: '16px',
          width: '34px', height: '34px', borderRadius: '50%',
          background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1) translateY(0)' : 'scale(0.75) translateY(6px)',
          transition: 'all 0.26s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <ChevronRight size={14} color="#4F46E5" />
        </div>
      </div>

      {/* Card footer */}
      {!compact && (
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {destination.tags.slice(0, 2).map(tag => (
                <span key={tag} style={{
                  fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px',
                  background: '#F1F5F9', color: '#475569', textTransform: 'capitalize',
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Thermometer size={11} color="#4F46E5" />
              <span style={{ color: '#4F46E5', fontSize: '12px', fontWeight: '600' }}>{destination.avgTemp}°C</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              {priceDots(destination.priceLevel)}
            </div>
            <span style={{ color: '#94A3B8', fontSize: '11px' }}>
              {(destination.reviews / 1000).toFixed(1)}k reviews
            </span>
          </div>
        </div>
      )}
    </div>
  )
}