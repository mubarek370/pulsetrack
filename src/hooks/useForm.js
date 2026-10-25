import { useCallback, useMemo, useState } from 'react'

/**
 * Small form helper.
 * validators: { fieldName: (value, allValues) => errorMessage | '' }  (keep it module-level so it's stable)
 * onSubmit(values, { setFieldError }) may throw; the message becomes `formError`.
 * Errors show after a field is blurred or after the first submit attempt.
 */
export default function useForm({ initialValues, validators, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [serverErrors, setServerErrors] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const errors = useMemo(() => {
    const found = {}
    Object.entries(validators).forEach(([name, validate]) => {
      const message = validate(values[name], values)
      if (message) found[name] = message
    })
    return found
  }, [validators, values])

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setServerErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
    setFormError('')
  }, [])

  const setFieldError = useCallback((name, message) => {
    setServerErrors((prev) => ({ ...prev, [name]: message }))
  }, [])

  /** Props to spread onto TextField / PasswordField. */
  const fieldProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: (event) => setValue(name, event.target.value),
    onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
    error: serverErrors[name] || (touched[name] || submitAttempted ? errors[name] || '' : ''),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return

    setSubmitAttempted(true)
    const firstInvalid = Object.keys(validators).find((name) => errors[name])
    if (firstInvalid) {
      event.currentTarget.elements[firstInvalid]?.focus()
      return
    }

    setSubmitting(true)
    setFormError('')
    try {
      await onSubmit(values, { setFieldError })
    } catch (error) {
      setFormError(error?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return { values, submitting, formError, setFormError, setValue, fieldProps, handleSubmit }
}
