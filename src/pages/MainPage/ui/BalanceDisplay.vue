<template>
  <div class="balance-container">
    <div class="balance-item">
      <span class="label">Available:</span>
      <span class="value">{{ props.available.amount }} {{ props.available.currency }}</span>
    </div>
    <div class="balance-item">
      <span class="label">Bonus:</span>
      <span class="value">{{ props.bonus.amount }} {{ props.bonus.currency }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Money } from '@/entities/balance/Money'

interface BalanceProps {
  available: Money
  bonus: Money
}

const props = defineProps<BalanceProps>()
</script>

<style scoped>
.balance-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 200px;
  background-color: #f9f9f9;
  color: black;
}

.balance-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.label {
  font-weight: 500;
}

.value {
  font-weight: 700;
}
</style>
