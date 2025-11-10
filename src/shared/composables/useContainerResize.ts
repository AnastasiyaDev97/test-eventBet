import { ref, onMounted, onBeforeUnmount, readonly, type Ref } from 'vue'

export interface ContainerResizeReturn {
  containerWidth: Readonly<Ref<number>>
  observeContainer: () => void
  disconnectObserver: () => void
}

export function useContainerResize(elementRef: any): ContainerResizeReturn {
  const containerWidth = ref(1200)
  let observer: ResizeObserver | null = null

  const observeContainer = (): void => {
    const el = elementRef.value?.$el?.parentElement ?? elementRef.value
    if (!el) return

    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width
      }
    })
    observer.observe(el)
  }

  const disconnectObserver = (): void => {
    observer?.disconnect()
    observer = null
  }

  onMounted(() => {
    observeContainer()
  })

  onBeforeUnmount(() => {
    disconnectObserver()
  })

  return {
    containerWidth: readonly(containerWidth),
    observeContainer,
    disconnectObserver,
  }
}
