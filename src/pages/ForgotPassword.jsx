import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useForm from '../hooks/useForm'
import { validateEmail } from '../utils/validation'
import AuthLayout from '../components/auth/AuthLayout'
import FormAlert from '../components/auth/FormAlert'
import TextField from '../components/ui/TextField'
import Button from '../components/ui/Button'
import { supabaseResetPassword } from '../services/supabaseAuth'

export default function ForgotPassword() {
  const { isSupabaseConfigured } = useAuth()
  const [sent, setSent] = useState(false)

  const form = useForm({
    initialValues: { email: '' },
    validators: { email: validateEmail },
    onSubmit: async ({ email }) => {
      if (!isSupabaseConfigured) {
        throw new Error('Password reset requires Supabase to be configured.')
      }
      await supabaseResetPassword(email)
      setSent(true)
    },
  })

  return (
    <AuthLayout
      title={sent ? 'Check your email' : 'Reset your password'}
      subtitle={
        sent
          ? `We sent a reset link to ${form.values.email}. It may take a minute to arrive.`
          : "Enter your email and we'll send you a link to reset your password."
      }
      footer={
        <>
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-indigo-500 hover:text-indigo-400">
            Log in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="space-y-4">
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
            If an account with that email exists, you'll receive a password reset link shortly.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-500 hover:text-indigo-400"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to login
          </Link>
        </div>
      ) : (
        <form noValidate onSubmit={form.handleSubmit} className="space-y-4">
          <FormAlert message={form.formError} />

          <TextField
            label="Email"
            type="email"
            icon={Mail}
            autoComplete="email"
            placeholder="you@example.com"
            {...form.fieldProps('email')}
          />

          <Button type="submit" disabled={form.submitting} className="w-full">
            {form.submitting ? 'Sending…' : 'Send reset link'}
          </Button>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-color hover:text-base-color"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to login
          </Link>
        </form>
      )}
    </AuthLayout>
  )
}
