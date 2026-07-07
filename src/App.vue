<script setup>
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const pageTitle = computed(() => {
  if (route.name === 'spell-detail') return 'Magia'
  if (route.name === 'settings') return 'Configurações'
  return 'Grimório'
})
</script>

<template>
  <PineApp>
    <div class="app-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Livro de Magias</p>
          <h1>{{ pageTitle }}</h1>
        </div>
        <nav class="topnav" role="tablist">
          <button type="button" class="tab-link" :class="{ active: route.path === '/' }" @click="router.push('/')">
            <PineIcon name="BookOpen" color="currentColor" size="18" />
            <span>Grimório</span>
          </button>
          <button type="button" class="tab-link" :class="{ active: route.name === 'settings' }"
            @click="router.push({ name: 'settings' })">
            <PineIcon name="Cog6Tooth" color="currentColor" size="18" />
            <span>Configurações</span>
          </button>
        </nav>
      </header>

      <RouterView />
    </div>
  </PineApp>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-border);
  background: rgba(17, 17, 17, 0.95);
  backdrop-filter: blur(8px);
}

.topbar h1 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--color-highlight);
  font-family: 'Georgia', 'Times New Roman', serif;
}

.topnav {
  display: flex;
  gap: 1rem;
}

.topnav .tab-link {
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text);
  transition: 180ms ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
}

.topnav .tab-link.active {
  background: #1f5d35;
  color: #f4fff6;
  border-color: #1f5d35;
}

@media (max-width: 768px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .topnav {
    flex-wrap: wrap;
  }
}
</style>
