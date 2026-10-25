import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import TextField from '../ui/TextField'

/** TextField with a show/hide toggle. Accepts the same props as TextField. */
export default function PasswordField(props) {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      icon={Lock}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="rounded-md p-1.5 text-subtle-color transition-colors hover:text-base-color"
        >
          {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      }
    />
  )
}
