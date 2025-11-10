import type { Balance } from '@/entities/balance/Balance'
import { reactive, readonly } from 'vue'

const state = reactive({
  balances: [] as Balance[],
})

export function useBalanceStore() {
  function set(balances: Balance[]) {
    state.balances = balances
  }

  return {
    state: readonly(state),
    set,
  }
}
