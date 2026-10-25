import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from './Button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({ error: this.state.error, reset: this.handleReset })
      }

      return (
        <div className="flex min-h-[280px] w-full flex-col items-center justify-center rounded-2xl border border-base bg-surface p-6 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400">
            <AlertTriangle className="size-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-base-color">Something went wrong</h3>
          <p className="mt-1 max-w-md text-sm text-muted-color">
            {this.props.message || 'An unexpected error occurred while rendering this section.'}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <Button size="sm" onClick={this.handleReset}>
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Try again
            </Button>
            <Button size="sm" variant="ghost" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>

          {import.meta.env.DEV && this.state.error && (
            <details className="mt-4 max-w-lg text-left">
              <summary className="cursor-pointer text-xs text-subtle-color hover:text-muted-color">
                Error details
              </summary>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-surface-2 p-2.5 text-[11px] text-rose-400">
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
