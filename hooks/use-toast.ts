/**
 * Toast notification hook
 * 
 * Simple wrapper around react-hot-toast for consistency
 */

import { toast as sonnerToast } from 'sonner'

export interface Toast {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  return {
    toast: ({ title, description, variant }: Toast) => {
      if (variant === 'destructive') {
        sonnerToast.error(title, { description })
      } else {
        sonnerToast.success(title, { description })
      }
    },
  }
}

export { sonnerToast as toast }

