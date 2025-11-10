<template>
  <div class="games">
    <h1 class="title">Games</h1>

    <RecycleScroller
      ref="scrollerRef"
      :items="games"
      :item-size="316"
      :grid-items="gridItems"
      :item-secondary-size="200"
      key-field="id"
      class="scroller"
      v-slot="{ item }"
      @scroll-end="loadMore"
    >
      <div class="game-card-wrapper">
        <GameCard :image="item.image" :title="item.title" :id="item.id" />
      </div>
    </RecycleScroller>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onUnmounted } from 'vue'
import { casinoFacade } from '@/app/providers/container'
import { useContainerResize } from '@/shared/composables/useContainerResize'
import { useInfiniteScroll } from '@/shared/composables/useInfiniteScroll'
import type { Game } from '@/entities/game/Game'
import GameCard from './ui/GameCard.vue'

const scrollerRef = ref<HTMLElement | null>(null)

const { containerWidth } = useContainerResize(scrollerRef)
const controller = new AbortController()

const games = ref<Game[]>([])
const pageCache = new Map<number, Game[]>()
const pageCount = ref<number | null>(null)

const gridItems = computed(() => {
  const cardWidth = 200
  const gap = 16
  return Math.max(1, Math.floor(containerWidth.value / (cardWidth + gap)))
})

const loadGamesPage = async (page: number, perPage: number, signal?: AbortSignal) => {
  if (pageCache.has(page)) {
    const list = pageCache.get(page)!
    if (page === 1) games.value = list
    else games.value.push(...list)

    return { list, pageCount: pageCount.value ?? 1 }
  }

  const result = await casinoFacade.listGames(page, perPage, { signal })

  pageCache.set(page, result.list)
  pageCount.value = result.pageCount

  if (page === 1) games.value = result.list
  else games.value = [...games.value, ...result.list]

  return result
}

const { loadMore } = useInfiniteScroll(loadGamesPage, {
  perPage: 50,
  autoLoadFirstPage: true,
  signal: controller.signal,
})

onUnmounted(() => {
  controller.abort()
})
</script>

<style scoped>
.title {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 20px;
}

.scroller {
  height: calc(100vh - 100px);
}

.game-card-wrapper {
  height: 250px;
  margin-bottom: 16px;
}
</style>
