import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from '@/features/auth/model/authStore'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage/LoginPage.vue'),
    },
    {
      path: '/',
      component: () => import('@/app/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/MainPage/MainPage.vue'),
        },
        {
          path: 'game/:id',
          name: 'GamePage',
          component: () => import('@/pages/GamePage/GamePage.vue'),
          props: true,
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = authStore

  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return { name: 'login' }
  }
})
