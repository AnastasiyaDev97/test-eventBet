<template>
  <div class="main-layout">
    <SideBar />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/app/layouts/ui/SideBar.vue'
</script>

<style scoped>
.main-layout {
  display: flex;
  align-items: flex-start;
}

.content {
  flex-grow: 1;
  padding: 24px;
}
</style>
