import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SpellView from '../views/SpellView.vue'
import SpellSlotsView from '../views/SpellSlotsView.vue'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/magia/:id',
      name: 'spell-detail',
      component: SpellView,
    },
    {
      path: '/espacos',
      name: 'slots',
      component: SpellSlotsView,
    },
    {
      path: '/configuracoes',
      name: 'settings',
      component: SettingsView,
    },
  ],
})

export default router
