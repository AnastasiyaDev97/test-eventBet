import type { App, ComponentPublicInstance } from 'vue'

export class ErrorHandler {
  private static instance: ErrorHandler

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  setupGlobalErrorHandler(app: App): void {
    app.config.errorHandler = (
      err: unknown,
      instance: ComponentPublicInstance | null,
      info: string,
    ) => {
      this.handleError(err, 'Vue', {
        component: instance?.$options?.name || 'Unknown',
        lifecycle: info,
      })
    }

    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'Global', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Promise', {
        type: 'UnhandledRejection',
      })
      event.preventDefault()
    })
  }

  handleError(error: unknown, type: string, context: Record<string, any> = {}): void {
    if (import.meta.env.DEV) {
      console.group(`🚨 ${type} Error`)
      console.error('Error:', error)
      console.log('Context:', context)
      console.groupEnd()
    }
  }

  captureError(error: unknown, component: string, action: string): void {
    this.handleError(error, 'Component', {
      component,
      action,
    })
  }
}

export const errorHandler = ErrorHandler.getInstance()
