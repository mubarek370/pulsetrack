import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Check, LogOut, Mail, Moon, Sun, Trash2, Upload, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import useForm from '../hooks/useForm'
import { profileValidators } from '../utils/validation'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import TextField from '../components/ui/TextField'
import FormAlert from '../components/auth/FormAlert'
import { inputClass, labelClass } from '../components/ui/formStyles'
import { TIMEZONES } from '../data/mockData'

function Section({ id, title, description, children }) {
  return (
    <section aria-labelledby={id} className="rounded-2xl border border-base bg-surface p-5">
      <h2 id={id} className="text-base font-semibold text-base-color">{title}</h2>
      <p className="mb-5 mt-0.5 text-sm text-muted-color">{description}</p>
      {children}
    </section>
  )
}

export default function Settings() {
  const { profile, units, setUnits, timezone, setTimezone, theme, setTheme, uploadAvatar, removeAvatar } = useApp()
  const { logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [zones] = useState(() => Array.from(new Set([timezone, ...TIMEZONES])))

  const form = useForm({
    initialValues: { name: profile.name, email: profile.email },
    validators: profileValidators,
    onSubmit: async (values, { setFieldError }) => {
      try {
        await updateProfile(values)
        setSaved(true)
      } catch (error) {
        if (error?.field) {
          setFieldError(error.field, error.message)
          document.getElementById(error.field)?.focus()
          return
        }
        throw error
      }
    },
  })

  useEffect(() => {
    if (!saved) return undefined
    const timer = setTimeout(() => setSaved(false), 3000)
    return () => clearTimeout(timer)
  }, [saved])

  const initials = form.values.name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadAvatar(file)
    } catch {
      // Toast notifications already managed by AppContext
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemovePhoto = async () => {
    if (window.confirm('Are you sure you want to remove your profile photo?')) {
      setUploading(true)
      try {
        await removeAvatar()
      } finally {
        setUploading(false)
      }
    }
  }

  const localTime = (() => {
    try {
      return new Date().toLocaleTimeString([], { timeZone: timezone, hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  })()

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile and preferences." />

      <div className="max-w-2xl space-y-4">
        {/* Profile */}
        <Section id="profile" title="Profile" description="How you appear in PulseTrack.">
          {/* Avatar upload section */}
          <div className="mb-6 flex flex-wrap items-center gap-5">
            <div className="group relative">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="size-20 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
              ) : (
                <span
                  className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl font-semibold text-white shadow-inner"
                  aria-hidden="true"
                >
                  {initials || '?'}
                </span>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Change photo"
                className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <Camera className="size-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-xs py-1.5 px-3"
                >
                  <Upload className="size-3.5" aria-hidden="true" />
                  {uploading ? 'Uploading…' : 'Upload photo'}
                </Button>

                {profile.avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={uploading}
                    className="rounded-lg p-1.5 text-muted-color hover:bg-rose-500/10 hover:text-rose-500 transition"
                    title="Remove photo"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-color">PNG, JPG, or WebP up to 3MB.</p>
            </div>
          </div>

          <form noValidate onSubmit={form.handleSubmit} className="space-y-4">
            <FormAlert message={form.formError} />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Name" icon={User} autoComplete="name" {...form.fieldProps('name')} />
              <TextField label="Email" type="email" icon={Mail} autoComplete="email" {...form.fieldProps('email')} />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" loading={form.submitting}>
                {form.submitting ? 'Saving…' : 'Save profile'}
              </Button>
              <p role="status" aria-live="polite" className="flex items-center gap-1.5 text-sm text-emerald-500">
                {saved && (
                  <>
                    <Check className="size-4" aria-hidden="true" />
                    Saved
                  </>
                )}
              </p>
            </div>
          </form>
        </Section>

        {/* Appearance */}
        <Section id="appearance" title="Appearance" description="Choose how PulseTrack looks.">
          <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
            <button
              type="button"
              onClick={() => setTheme('light')}
              aria-pressed={theme === 'light'}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors ${
                theme === 'light'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-semibold'
                  : 'border-base bg-surface text-muted-color hover:border-strong hover:text-base-color'
              }`}
            >
              <Sun className="size-4" aria-hidden="true" />
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              aria-pressed={theme === 'dark'}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-semibold'
                  : 'border-base bg-surface text-muted-color hover:border-strong hover:text-base-color'
              }`}
            >
              <Moon className="size-4" aria-hidden="true" />
              Dark
            </button>
          </div>
        </Section>

        {/* Preferences */}
        <Section id="preferences" title="Preferences" description="Customize units and time display.">
          <div className="space-y-4">
            <div>
              <span className={labelClass}>Unit system</span>
              <div className="mt-1.5 flex gap-2">
                {['kg', 'lbs'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnits(u)}
                    aria-pressed={units === u}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium uppercase transition-colors ${
                      units === u
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-semibold'
                        : 'border-base bg-surface text-muted-color hover:border-strong hover:text-base-color'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="settings-tz" className={labelClass}>Timezone</label>
              <select
                id="settings-tz"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className={`${inputClass} max-w-sm`}
              >
                {zones.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
              {localTime && (
                <p className="mt-1.5 text-xs text-subtle-color">
                  Current time in this timezone: <span className="font-medium text-base-color">{localTime}</span>
                </p>
              )}
            </div>
          </div>
        </Section>

        {/* Account */}
        <Section id="account" title="Account" description="Manage your session.">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-base-color">Sign out</p>
              <p className="text-xs text-muted-color">End your current session on this device.</p>
            </div>
            <Button variant="danger" onClick={handleLogout}>
              <LogOut className="size-4" aria-hidden="true" />
              Log out
            </Button>
          </div>
        </Section>
      </div>
    </div>
  )
}
