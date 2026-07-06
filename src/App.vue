<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pageTitle = computed(() => {
  if (route.name === 'slots') return 'Espaços de Magia'
  if (route.name === 'settings') return 'Configurações'
  if (route.name === 'spell-detail') return 'Magia'
  return 'Grimório'
})
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">Livro de Magias</p>
        <h1>{{ pageTitle }}</h1>
      </div>
      <nav class="topnav">
        <RouterLink to="/">Magias</RouterLink>
        <RouterLink to="/espacos">Espaços de Magia</RouterLink>
        <RouterLink to="/configuracoes">Configurações</RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
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

.topnav a {
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text);
  transition: 180ms ease;
}

.topnav a.router-link-active {
  background: var(--color-highlight);
  color: #111;
  border-color: var(--color-highlight);
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
