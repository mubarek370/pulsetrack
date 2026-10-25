import { supabase } from '../lib/supabaseClient'
import { supabaseUpdateProfile } from './supabaseAuth'

const MAX_AVATAR_SIZE = 3 * 1024 * 1024 // 3 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/**
 * Uploads a profile avatar image to Supabase Storage and updates the profiles table.
 * @param {string} userId
 * @param {File} file
 * @returns {Promise<string>} publicUrl
 */
export async function uploadAvatar(userId, file) {
  if (!supabase) throw new Error('Supabase is not configured.')
  if (!userId) throw new Error('User ID is required.')

  if (!file) throw new Error('Please select an image file.')

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Please upload a PNG, JPEG, WebP, or GIF image.')
  }

  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error('Image file is too large. Maximum size is 3MB.')
  }

  const fileExt = file.name.split('.').pop() || 'png'
  const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`

  // 1. Upload file to Supabase Storage bucket 'avatars'
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) throw uploadError

  // 2. Retrieve public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath)

  // 3. Persist public URL to profiles table
  await supabaseUpdateProfile(userId, { avatar_url: publicUrl })

  return publicUrl
}

/**
 * Removes avatar from Supabase Storage and sets profiles.avatar_url to null.
 * @param {string} userId
 */
export async function removeAvatar(userId) {
  if (!supabase) throw new Error('Supabase is not configured.')
  if (!userId) return

  // 1. Remove files in user's avatar folder
  try {
    const { data: existingFiles } = await supabase.storage.from('avatars').list(userId)
    if (existingFiles && existingFiles.length > 0) {
      const paths = existingFiles.map((f) => `${userId}/${f.name}`)
      await supabase.storage.from('avatars').remove(paths)
    }
  } catch (err) {
    console.error('Failed to clear old avatar files:', err)
  }

  // 2. Set avatar_url to null in profiles table
  await supabaseUpdateProfile(userId, { avatar_url: null })
}
