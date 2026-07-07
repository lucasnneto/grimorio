import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'
import SpellView from '../views/SpellView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/configuracoes',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/magia/:id',
      name: 'spell-detail',
      component: SpellView,
    },
  ],
})

export default router
