/**
 * Supabase's Discord provider writes profile info into `user.user_metadata`.
 * The exact keys aren't 100% guaranteed across account ages/versions, so this
 * reads defensively with fallbacks rather than trusting one field name.
 *
 * To confirm the real shape for your project: Supabase Dashboard ->
 * Authentication -> Users -> click a signed-in user -> "Raw user meta data".
 * Adjust the fallback chains below if your field names differ.
 */
export function getDiscordProfile(user) {
  if (!user) return null

  const meta = user.user_metadata || {}
  const discordIdentity = user.identities?.find((i) => i.provider === 'discord')
  const identityData = discordIdentity?.identity_data || {}

  const discordId =
    meta.provider_id || meta.sub || identityData.provider_id || identityData.id || user.id

  const username =
    meta.full_name ||
    meta.custom_claims?.global_name ||
    meta.name ||
    meta.preferred_username ||
    identityData.full_name ||
    identityData.name ||
    'Discord Member'

  const avatarUrl = meta.avatar_url || identityData.avatar_url || null

  return {
    discordId: String(discordId),
    username,
    avatarUrl,
  }
}

/** Deterministic fallback color for the initial-avatar badge, so it isn't random on every render. */
export function colorFromString(str) {
  const palette = ['#d4af37', '#4a9eff', '#8a7cff', '#3ec9a7']
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}
