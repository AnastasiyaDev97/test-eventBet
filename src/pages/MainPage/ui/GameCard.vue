<template>
  <div class="card" @click="goToGame">
    <div class="card-image">
      <img
        alt="game"
        :src="effectiveImage"
        class="image"
        @error="handleImageError"
        @load="handleImageLoad"
        loading="lazy"
      />
    </div>
    <h3 class="game-title">{{ props.title }}</h3>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import fallbackImage from '@/assets/game-placeholder.jpg'
import { errorHandler } from '@/shared/utils/errorHandler'
import { Game } from '@/entities/game/Game'
import { gameStorageService } from '@/entities/game/service/gameStorage'

const router = useRouter()

const props = defineProps<{
  id: string
  title: string
  image: string
}>()

const imageLoaded = ref(false)
const imageError = ref(false)

watch(
  () => props.image,
  (newImage, oldImage) => {
    if (newImage !== oldImage) {
      imageError.value = false
      imageLoaded.value = false
    }
  },
)

const effectiveImage = computed(() => {
  if (imageError.value) {
    return fallbackImage
  }
  return props.image
})

function goToGame() {
  gameStorageService.save(new Game(props.id, props.title, props.image))
  router.push({ name: 'GamePage', params: { id: props.id } })
}

function handleImageError() {
  imageError.value = true
  errorHandler.captureError(
    new Error(`Image load failed: ${props.image}`),
    'GameCard',
    'image_load',
  )
}

function handleImageLoad() {
  imageLoaded.value = true
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 16px;
  width: 200px;
  height: 250px;
  box-sizing: border-box;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: #999;
  cursor: pointer;
}

.game-title {
  font-weight: 600;
}

.card-image {
  width: 100%;
  height: 150px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;

  opacity: 0;
  animation: fade-in 0.25s forwards;
}

.game-title {
  font-weight: 600;
  margin: 12px 0;
  text-align: center;
  flex-grow: 1;
}

.placeholder {
  width: 100%;
  height: 100%;
  background: #ececec;
  border-radius: 6px;
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}
</style>
