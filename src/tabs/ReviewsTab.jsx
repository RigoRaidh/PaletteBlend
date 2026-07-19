import { useState, useEffect, useCallback } from 'react'
import { Loader2, MessageSquareOff } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/useAuth'
import { Avatar } from '../components/Header'
import LoginGateBanner from '../components/LoginGateBanner'
import StarRating from '../components/StarRating'

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [label, secs] of units) {
    const amount = Math.floor(seconds / secs)
    if (amount >= 1) return `${amount} ${label}${amount > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export default function ReviewsTab() {
  const { user, profile } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setLoadError(error.message)
    else setReviews(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || rating === 0) return
    setSubmitting(true)
    setFormError(null)

    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      discord_id: profile.discordId,
      discord_username: profile.username,
      discord_avatar_url: profile.avatarUrl,
      rating,
      comment: comment.trim(),
    })

    if (error) {
      setFormError(error.message)
    } else {
      setRating(0)
      setComment('')
      fetchReviews()
    }
    setSubmitting(false)
  }

  return (
    <div className="animate-fade-up py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center mb-8">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          What clients say
        </h2>
        <p className="mt-3 font-body text-sm text-mist sm:text-base">
          {averageRating
            ? `${averageRating} average across ${reviews.length} review${reviews.length === 1 ? '' : 's'}.`
            : 'Reviews from the communities we\u2019ve worked with.'}
        </p>
      </div>

      <div className="mx-auto mb-10 max-w-xl">
        {user ? (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-5">
            <span className="mb-2 block font-mono text-xs uppercase tracking-wide text-mist">
              Your rating
            </span>
            <StarRating value={rating} onChange={setRating} size={24} />

            <label className="mt-4 block">
              <span className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-mist">
                Your review
              </span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was working with PaletteBlend?"
                maxLength={500}
                rows={3}
                className="w-full resize-none rounded-lg glass px-3 py-2 font-body text-sm text-ink placeholder:text-mist/60 focus:outline-none"
              />
            </label>

            {formError && <p className="mt-2 font-body text-xs text-red-400">{formError}</p>}

            <button
              type="submit"
              disabled={rating === 0 || submitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue to-blue-soft px-4 py-2.5 font-body text-sm font-semibold text-void transition-opacity disabled:opacity-40"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
          </form>
        ) : (
          <LoginGateBanner />
        )}
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass h-40 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : loadError ? (
        <p className="text-center font-body text-sm text-mist">
          Couldn't load reviews right now. ({loadError})
        </p>
      ) : reviews.length === 0 ? (
        <div className="glass mx-auto max-w-md rounded-2xl px-6 py-10 text-center">
          <MessageSquareOff size={22} className="mx-auto mb-3 text-mist" />
          <p className="font-body text-sm text-mist">No reviews yet — yours could be the first.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="glass flex flex-col rounded-2xl p-5">
              <StarRating value={review.rating} readOnly size={15} />
              <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-ink/90">
                {review.comment || <span className="text-mist italic">No comment left.</span>}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar
                    profile={{ username: review.discord_username, avatarUrl: review.discord_avatar_url }}
                    size={22}
                  />
                  <span className="truncate font-body text-xs font-medium text-ink">
                    {review.discord_username}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-mist">
                  {timeAgo(review.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
