<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGrimorioStore } from '../stores/grimorio'

const router = useRouter()
const store = useGrimorioStore()

const search = ref('')
const selectedLevel = ref('all')
const selectedSchool = ref('all')
const preparedOnly = ref(false)
const sortBy = ref('nivel')

const schools = ['all', 'Abjuração', 'Adivinhação', 'Conjuração', 'Encantamento', 'Evocação', 'Ilusão', 'Necromancia', 'Transmutação']

const filteredSpells = computed(() => {
  const query = search.value.toLowerCase()

  return [...store.spells]
    .filter((spell) => {
      const matchesSearch = spell.nome.toLowerCase().includes(query)
      const matchesLevel = selectedLevel.value === 'all' || String(spell.nivel) === selectedLevel.value
      const matchesSchool = selectedSchool.value === 'all' || spell.escola === selectedSchool.value
      const matchesPrepared = !preparedOnly.value || spell.preparada
      return matchesSearch && matchesLevel && matchesSchool && matchesPrepared
    })
    .sort((a, b) => {
      if (sortBy.value === 'nome') {
        return a.nome.localeCompare(b.nome)
      }

      return a.nivel - b.nivel
    })
})

const openSpell = (id) => {
  router.push({ name: 'spell-detail', params: { id } })
}

const togglePrepared = (id) => {
  store.togglePrepared(id)
}
</script>

<template>
  <main class="page-shell">
    <section class="page-card">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Grimório</p>
          <h1>Magias e truques</h1>
        </div>
        <button class="primary-button" @click="router.push({ name: 'spell-detail', params: { id: 'new' } })">Nova Magia</button>
      </div>

      <div class="stats-grid">
        <article class="stat-card">
          <h3>Magias Conhecidas</h3>
          <p>{{ store.knownCount }}</p>
        </article>
        <article class="stat-card">
          <h3>Preparadas</h3>
          <p>{{ store.preparedCount }}</p>
        </article>
        <article class="stat-card">
          <h3>Truques</h3>
          <p>{{ store.cantripCount }}</p>
        </article>
      </div>

      <div class="toolbar">
        <input v-model="search" placeholder="Pesquisar por nome" />
        <select v-model="selectedLevel">
          <option value="all">Todos os níveis</option>
          <option value="0">Truques</option>
          <option value="1">1º Nível</option>
          <option value="2">2º Nível</option>
          <option value="3">3º Nível</option>
          <option value="4">4º Nível</option>
          <option value="5">5º Nível</option>
          <option value="6">6º Nível</option>
          <option value="7">7º Nível</option>
          <option value="8">8º Nível</option>
          <option value="9">9º Nível</option>
        </select>
        <select v-model="selectedSchool">
          <option v-for="school in schools" :key="school" :value="school">{{ school === 'all' ? 'Todas as escolas' : school }}</option>
        </select>
        <label class="checkbox-row">
          <input v-model="preparedOnly" type="checkbox" />
          Somente Preparadas
        </label>
        <select v-model="sortBy">
          <option value="nivel">Ordenar por nível</option>
          <option value="nome">Ordenar por nome</option>
        </select>
      </div>

      <div class="spell-grid">
        <article v-for="spell in filteredSpells" :key="spell.id" class="spell-card" @click="openSpell(spell.id)">
          <div class="spell-meta">
            <span>{{ spell.nivel === 0 ? 'Truque' : `${spell.nivel}º nível` }}</span>
            <span>{{ spell.escola }}</span>
          </div>
          <h3>{{ spell.nome }}</h3>
          <p>{{ spell.tempo }} • {{ spell.alcance }}</p>
          <div class="spell-footer">
            <span v-if="spell.preparada" class="prepare-pill">● Preparada</span>
            <span v-else>Não preparada</span>
            <button class="ghost-button" type="button" @click.stop="togglePrepared(spell.id)">Marcar</button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
