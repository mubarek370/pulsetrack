import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useForm from '../hooks/useForm'
import { loginValidators } from '../utils/validation'
import AuthLayout from '../components/auth/AuthLayout'
import FormAlert from '../components/auth/FormAlert'
import PasswordField from '../components/auth/PasswordField'
import TextField from '../components/ui/TextField'
import Button from '../components/ui/Button'

export default function Login() {
  const { login } = useAuth()

  // After a successful login, <GuestRoute> redirects to the page the user originally wanted.
  const form = useForm({
    initialValues: { email: '', password: '', remember: true },
    validators: loginValidators,
    onSubmit: async (values) => {
      try {
        await login(values)
      } catch (err) {
        if (err?.message?.toLowerCase().includes('email not confirmed')) {
          throw new Error(
            'Email not confirmed. Please check your inbox or click "Auto Confirm" on this user in your Supabase Dashboard.',
            { cause: err },
          )
        }
        throw err
      }
    },
  })

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to keep your streaks going."
      footer={
        <>
          New to PulseTrack?{' '}
          <Link to="/signup" className="font-medium text-indigo-500 hover:text-indigo-400">Create an account</Link>
        </>
      }
    >
      <form noValidate onSubmit={form.handleSubmit} className="space-y-4">
        <FormAlert message={form.formError} />

        <TextField label="Email" type="email" icon={Mail} autoComplete="email" placeholder="you@example.com" {...form.fieldProps('email')} />

        <PasswordField label="Password" autoComplete="current-password" placeholder="Your password" {...form.fieldProps('password')} />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-color">
            <input
              type="checkbox"
              checked={form.values.remember}
              onChange={(event) => form.setValue('remember', event.target.checked)}
              className="size-4 rounded border-base bg-surface accent-indigo-500"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-indigo-500 hover:text-indigo-400">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={form.submitting} className="w-full">
          {form.submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  )
}
