import { reactive, readonly, computed } from 'vue'
import { Token } from '@/entities/Token'

const state = reactive({
  token: null as Token | null,
})

const isAuthenticated = computed(() => !!state.token?.access)

function setToken(token: Token) {
  state.token = token
}

function clear() {
  state.token = null
}

export const authStore = {
  state: readonly(state),
  isAuthenticated,
  setToken,
  clear,
}
