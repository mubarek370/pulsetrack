import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useForm from '../hooks/useForm'
import { validatePassword, validateConfirm } from '../utils/validation'
import AuthLayout from '../components/auth/AuthLayout'
import FormAlert from '../components/auth/FormAlert'
import PasswordField from '../components/auth/PasswordField'
import PasswordStrength from '../components/auth/PasswordStrength'
import Button from '../components/ui/Button'
import { supabaseUpdatePassword } from '../services/supabaseAuth'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [done, setDone] = useState(false)

  const form = useForm({
    initialValues: { password: '', confirmPassword: '' },
    validators: {
      password: validatePassword,
      confirmPassword: (value, values) => validateConfirm(value, values.password),
    },
    onSubmit: async ({ password }) => {
      await supabaseUpdatePassword(password)
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    },
  })

  return (
    <AuthLayout
      title={done ? 'Password updated' : 'Set a new password'}
      subtitle={
        done
          ? 'Your password has been changed. Redirecting to login…'
          : 'Choose a strong password for your account.'
      }
    >
      {done ? (
        <div className="space-y-4">
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
            Password updated successfully! You will be redirected shortly.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-500 hover:text-indigo-400"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Go to login now
          </Link>
        </div>
      ) : (
        <form noValidate onSubmit={form.handleSubmit} className="space-y-4">
          <FormAlert message={form.formError} />

          <div>
            <PasswordField
              label="New password"
              autoComplete="new-password"
              placeholder="Enter a new password"
              {...form.fieldProps('password')}
            />
            <PasswordStrength password={form.values.password} />
          </div>

          <PasswordField
            label="Confirm new password"
            autoComplete="new-password"
            placeholder="Repeat your new password"
            {...form.fieldProps('confirmPassword')}
          />

          <Button type="submit" disabled={form.submitting} className="w-full">
            {form.submitting ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
