import { useState, useEffect, useCallback } from 'react'
import { Heart, ImagePlus, Loader2, X, ImageOff } from 'lucide-react'
import { supabase, SHOWCASE_BUCKET } from '../lib/supabaseClient'
import { useAuth } from '../lib/useAuth'
import { Avatar } from '../components/Header'
import LoginGateBanner from '../components/LoginGateBanner'

const MAX_FILE_BYTES = 5 * 1024 * 1024

export default function ShowcaseTab() {
  const { user, profile } = useAuth()
  const [posts, setPosts] = useState([])
  const [likedIds, setLikedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    const { data, error } = await supabase
      .from('showcase_posts_with_counts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setLoadError(error.message)
    else setPosts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    if (!user) {
      setLikedIds(new Set())
      return
    }
    supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data) setLikedIds(new Set(data.map((l) => l.post_id)))
      })
  }, [user])

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    setFormError(null)
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setFormError('Please choose an image file.')
      return
    }
    if (f.size > MAX_FILE_BYTES) {
      setFormError('Images must be under 5MB.')
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const clearForm = () => {
    setFile(null)
    setPreview(null)
    setTitle('')
    setFormError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !file) return
    setSubmitting(true)
    setFormError(null)

    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage.from(SHOWCASE_BUCKET).upload(path, file)
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from(SHOWCASE_BUCKET).getPublicUrl(path)

      const { error: insertError } = await supabase.from('showcase_posts').insert({
        user_id: user.id,
        discord_id: profile.discordId,
        discord_username: profile.username,
        discord_avatar_url: profile.avatarUrl,
        title: title.trim() || 'Untitled',
        image_url: urlData.publicUrl,
      })
      if (insertError) throw insertError

      clearForm()
      fetchPosts()
    } catch (err) {
      setFormError(err.message || 'Something went wrong — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleLike = async (post) => {
    if (!user) return
    const isLiked = likedIds.has(post.id)

    setLikedIds((prev) => {
      const next = new Set(prev)
      isLiked ? next.delete(post.id) : next.add(post.id)
      return next
    })
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, like_count: p.like_count + (isLiked ? -1 : 1) } : p))
    )

    const { error } = isLiked
      ? await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id)
      : await supabase.from('likes').insert({ user_id: user.id, post_id: post.id })

    if (error) {
      setLikedIds((prev) => {
        const next = new Set(prev)
        isLiked ? next.add(post.id) : next.delete(post.id)
        return next
      })
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, like_count: p.like_count + (isLiked ? 1 : -1) } : p))
      )
    }
  }

  return (
    <div className="animate-fade-up py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center mb-8">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Community showcase
        </h2>
        <p className="mt-3 font-body text-sm text-mist sm:text-base">
          Members share screenshots of servers they've built or contributed to.
        </p>
      </div>

      <div className="mx-auto mb-10 max-w-xl">
        {user ? (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-5">
            <label className="mb-3 block">
              <span className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-mist">
                Title
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What did you build?"
                maxLength={80}
                className="w-full rounded-lg glass px-3 py-2 font-body text-sm text-ink placeholder:text-mist/60 focus:outline-none"
              />
            </label>

            {preview ? (
              <div className="relative mb-3 overflow-hidden rounded-lg">
                <img src={preview} alt="Upload preview" className="max-h-56 w-full object-cover" />
                <button
                  type="button"
                  onClick={clearForm}
                  className="absolute right-2 top-2 rounded-full bg-void/70 p-1.5 text-ink hover:bg-void"
                  aria-label="Remove selected image"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="mb-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 py-8 text-mist transition-colors hover:border-gold/40 hover:text-gold-soft">
                <ImagePlus size={20} />
                <span className="font-body text-xs">PNG or JPG, up to 5MB</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}

            {formError && <p className="mb-3 font-body text-xs text-red-400">{formError}</p>}

            <button
              type="submit"
              disabled={!file || submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-soft px-4 py-2.5 font-body text-sm font-semibold text-void transition-opacity disabled:opacity-40"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {submitting ? 'Posting…' : 'Share to showcase'}
            </button>
          </form>
        ) : (
          <LoginGateBanner />
        )}
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass aspect-square animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : loadError ? (
        <p className="text-center font-body text-sm text-mist">
          Couldn't load the showcase right now. ({loadError})
        </p>
      ) : posts.length === 0 ? (
        <div className="glass mx-auto max-w-md rounded-2xl px-6 py-10 text-center">
          <ImageOff size={22} className="mx-auto mb-3 text-mist" />
          <p className="font-body text-sm text-mist">
            No posts yet — be the first to share what you've built.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="glass overflow-hidden rounded-2xl">
              <div className="aspect-square overflow-hidden bg-white/5">
                <img src={post.image_url} alt={post.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-semibold text-ink truncate">{post.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Avatar profile={{ username: post.discord_username, avatarUrl: post.discord_avatar_url }} size={20} />
                    <span className="truncate font-body text-xs text-mist">{post.discord_username}</span>
                  </div>
                  {user ? (
                    <button
                      onClick={() => toggleLike(post)}
                      className="flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:bg-white/5"
                      aria-pressed={likedIds.has(post.id)}
                      aria-label="Like this post"
                    >
                      <Heart
                        size={15}
                        fill={likedIds.has(post.id) ? '#d4af37' : 'transparent'}
                        stroke={likedIds.has(post.id) ? '#d4af37' : '#96969f'}
                      />
                      <span className="font-mono text-xs text-mist">{post.like_count}</span>
                    </button>
                  ) : (
                    <div className="flex shrink-0 items-center gap-1.5 px-2 py-1 opacity-60">
                      <Heart size={15} stroke="#96969f" />
                      <span className="font-mono text-xs text-mist">{post.like_count}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
