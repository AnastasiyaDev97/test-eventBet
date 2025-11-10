<template>
  <div class="login-page">
    <form class="form" @submit.prevent="onSubmit">
      <h1 class="title">Login</h1>

      <BaseInput v-model="login" label="Login" placeholder="Enter your login" />

      <BaseInput
        v-model="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
      />

      <BaseButton :disabled="loading" type="submit">
        {{ loading ? 'Logging in...' : 'Login' }}
      </BaseButton>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { authService } from '@/app/providers/container'

const login = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

async function onSubmit() {
  loading.value = true
  error.value = ''

  try {
    await authService.login(login.value, password.value)
    router.push('/')
  } catch (e: any) {
    error.value = e?.message ?? 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  padding-top: 120px;
}

.form {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.error {
  color: #dc2626;
  font-size: 14px;
  margin-top: -4px;
  text-align: center;
}
</style>
