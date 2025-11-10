<template>
  <div class="input-wrapper">
    <label v-if="label" :for="inputId" class="input-label">{{ label }}</label>
    <input
      :id="inputId"
      :type="type"
      v-model="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['input-field', { 'input-error': error }]"
    />
    <span v-if="error" class="input-error-message">{{ error }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const value = defineModel<string>({ required: true })

const props = defineProps<{
  type?: 'text' | 'password' | 'email'
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  id?: string
}>()

const inputId = computed(() => props.id ?? `input-${Math.random().toString(36).substr(2, 9)}`)
const type = computed(() => props.type ?? 'text')
const placeholder = computed(() => props.placeholder ?? '')
const disabled = computed(() => props.disabled ?? false)
const label = computed(() => props.label ?? '')
const error = computed(() => props.error ?? '')
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-label {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.input-field {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
}

.input-error-message {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #ef4444;
}
</style>
