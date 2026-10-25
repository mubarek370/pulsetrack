import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Mail, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useForm from '../hooks/useForm'
import { signupValidators } from '../utils/validation'
import AuthLayout from '../components/auth/AuthLayout'
import FormAlert from '../components/auth/FormAlert'
import PasswordField from '../components/auth/PasswordField'
import PasswordStrength from '../components/auth/PasswordStrength'
import TextField from '../components/ui/TextField'
import Button from '../components/ui/Button'

export default function Signup() {
  const { signup } = useAuth()
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const form = useForm({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validators: signupValidators,
    onSubmit: async (values, { setFieldError }) => {
      try {
        const created = await signup(values)
        if (created && !created.hasSession) {
          setNeedsConfirmation(true)
        }
      } catch (error) {
        if (error.field) {
          setFieldError(error.field, error.message)
          document.getElementById(error.field)?.focus()
          return
        }
        throw error
      }
    },
  })

  return (
    <AuthLayout
      title={needsConfirmation ? 'Check your inbox' : 'Create your account'}
      subtitle={
        needsConfirmation
          ? `We sent a confirmation link to ${form.values.email}. Please verify it to log in.`
          : 'Start tracking habits and workouts in under a minute.'
      }
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-500 hover:text-indigo-400">Log in</Link>
        </>
      }
    >
      {needsConfirmation ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium">Account created successfully!</p>
              <p className="mt-1 text-xs opacity-90">
                Supabase sent a confirmation email. If you prefer to bypass email confirmation for local testing, turn off <strong>Confirm email</strong> in your Supabase Dashboard.
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-500 hover:text-indigo-400"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Go to login
          </Link>
        </div>
      ) : (
        <form noValidate onSubmit={form.handleSubmit} className="space-y-4">
          <FormAlert message={form.formError} />

          <TextField label="Name" icon={User} autoComplete="name" placeholder="Alex Morgan" {...form.fieldProps('name')} />

          <TextField label="Email" type="email" icon={Mail} autoComplete="email" placeholder="you@example.com" {...form.fieldProps('email')} />

          <div>
            <PasswordField label="Password" autoComplete="new-password" placeholder="Create a password" {...form.fieldProps('password')} />
            <PasswordStrength password={form.values.password} />
          </div>

          <PasswordField label="Confirm password" autoComplete="new-password" placeholder="Repeat your password" {...form.fieldProps('confirmPassword')} />

          <Button type="submit" disabled={form.submitting} className="w-full">
            {form.submitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
