<template>
  <div class="game-page">
    <button class="back-btn" @click="goBack">← Back</button>

    <h1 class="title">{{ game?.title }}</h1>

    <div class="game-container">
      <div class="image-wrapper">
        <img :src="game?.image" :alt="game?.title" class="game-image" />
      </div>

      <h3 class="game-title">{{ game?.title }}</h3>

      <button class="play-btn" @click="playGame">Play</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { casinoFacade } from '@/app/providers/container'
import type { Game } from '@/entities/game/Game'
import { gameStorageService } from '@/entities/game/service/gameStorage'
import { onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  id: string
}

const props = defineProps<Props>()
const router = useRouter()

const game = ref<Game | null>(gameStorageService.load(props.id))

async function playGame() {
  try {
    const { url } = await casinoFacade.openGame(props.id, 'USD')
    window.open(url, '_blank')
  } catch (e: any) {
    alert('Unable to open game: ' + (e?.message ?? 'Error'))
  }
}

function goBack() {
  router.back()
}

onUnmounted(() => {
  gameStorageService.remove(props.id)
})
</script>

<style scoped>
.game-page {
  padding: 20px;
  margin: 0 auto;
}

.back-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: #334155;
}

.title {
  margin-bottom: 20px;
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.image-wrapper {
  width: 100%;
  max-width: 520px;

  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  background: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.game-title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  color: #1e293b;
}

.play-btn {
  width: 100%;
  max-width: 240px;
  background-color: #0f172a;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.1s ease;
}

.play-btn:hover {
  background-color: #1e293b;
}

.play-btn:active {
  transform: scale(0.97);
}
</style>
