<template>
  <aside class="sidebar">
    <h2 class="title">Account</h2>

    <div class="container">
      <BalanceDisplay
        v-for="({ bonus, available }, index) of balances"
        :key="index"
        :bonus="bonus"
        :available="available"
      />
    </div>

    <BaseButton class="logout-btn" @click="logout"> Logout </BaseButton>
  </aside>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, computed } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { authService, casinoFacade } from '@/app/providers/container'
import { useBalanceStore } from '@/features/casino/model/balanceStore'
import BalanceDisplay from '@/pages/MainPage/ui/BalanceDisplay.vue'

const balanceStore = useBalanceStore()

const balances = computed(
  () =>
    balanceStore.state.balances ?? [
      { available: { amount: 0, currency: 'USD' }, bonus: { amount: 0, currency: 'USD' } },
    ],
)

onMounted(() => {
  casinoFacade.startBalancePolling()
})

onUnmounted(() => {
  casinoFacade.stopBalancePolling()
})

function logout() {
  authService.logout()
  window.location.href = '/login'
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: #0f172a;
  color: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title {
  font-size: 20px;
  font-weight: 600;
}
</style>
