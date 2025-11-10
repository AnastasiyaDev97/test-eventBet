import { ref, computed, readonly, type Ref } from 'vue'

export interface InfiniteScrollOptions {
  perPage?: number
  initialPage?: number
  autoLoadFirstPage?: boolean
  signal?: AbortSignal
}

export interface InfiniteScrollReturn {
  page: Readonly<Ref<number>>
  pageCount: Readonly<Ref<number>>
  loading: Readonly<Ref<boolean>>
  error: Readonly<Ref<string | null>>
  hasMore: Readonly<Ref<boolean>>
  loadMore: () => Promise<void>
  reset: () => void
  retry: () => Promise<void>
}

export function useInfiniteScroll<T>(
  loadFn: (
    page: number,
    perPage: number,
    signal?: AbortSignal,
  ) => Promise<{ list: T[]; pageCount: number }>,
  options: InfiniteScrollOptions = {},
): InfiniteScrollReturn {
  const { perPage = 50, initialPage = 1, autoLoadFirstPage = true, signal } = options

  const page = ref(initialPage)
  const pageCount = ref(1)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const hasMore = computed(() => page.value <= pageCount.value && !loading.value)

  const loadMore = async (): Promise<void> => {
    if (loading.value || !hasMore.value) return

    loading.value = true
    error.value = null

    try {
      if (signal?.aborted) {
        throw new Error('Request aborted')
      }

      const result = await loadFn(page.value, perPage, signal)
      pageCount.value = result.pageCount
      page.value++
    } catch (e: any) {
      if (e.name !== 'AbortError' && e.message !== 'Request aborted') {
        error.value = e?.message ?? 'Network error'
      }
    } finally {
      loading.value = false
    }
  }

  const reset = (): void => {
    page.value = initialPage
    pageCount.value = 1
    loading.value = false
    error.value = null
  }

  const retry = async (): Promise<void> => {
    if (page.value > 1) {
      page.value--
    }
    return loadMore()
  }

  if (autoLoadFirstPage) {
    loadMore()
  }

  if (signal) {
    const handleAbort = () => {
      if (loading.value) {
        loading.value = false
        error.value = 'Request cancelled'
      }
    }

    signal.addEventListener('abort', handleAbort)
  }

  return {
    page: readonly(page),
    pageCount: readonly(pageCount),
    loading: readonly(loading),
    error: readonly(error),
    hasMore: readonly(hasMore),
    loadMore,
    reset,
    retry,
  }
}
