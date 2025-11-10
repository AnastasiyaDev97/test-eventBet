<template>
  <button
    :type="type"
    :disabled="disabled"
    @click="$emit('click')"
    :class="['base-button', { 'base-button-disabled': disabled }]"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()

const type = props.type ?? 'button'
const disabled = props.disabled ?? false
</script>

<style scoped>
.base-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  color: #ffffff;
  background-color: #2563eb;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s;
}

.base-button:hover:not(.base-button-disabled) {
  background-color: #1d4ed8;
}

.base-button-disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>
