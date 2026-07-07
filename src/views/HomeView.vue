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
const showFilters = ref(false)
const showCapacityBreakdown = ref(false)

const schools = ['all', 'Abjuração', 'Adivinhação', 'Conjuração', 'Encantamento', 'Evocação', 'Ilusão', 'Necromancia', 'Transmutação']

const levelOptions = [
  { value: 'all', text: 'Todos os níveis' },
  { value: '0', text: 'Truques' },
  { value: '1', text: '1º Nível' },
  { value: '2', text: '2º Nível' },
  { value: '3', text: '3º Nível' },
  { value: '4', text: '4º Nível' },
  { value: '5', text: '5º Nível' },
  { value: '6', text: '6º Nível' },
  { value: '7', text: '7º Nível' },
  { value: '8', text: '8º Nível' },
  { value: '9', text: '9º Nível' },
]

const schoolOptions = schools.map((school) => ({
  value: school,
  text: school === 'all' ? 'Todas as escolas' : school,
}))

const sortOptions = [
  { value: 'nivel', text: 'Ordenar por nível' },
  { value: 'nome', text: 'Ordenar por nome' },
]

const filteredSpells = computed(() => {
  const query = search.value.toLowerCase()

  return [...store.spells]
    .filter((spell) => {
      const matchesSearch = spell.nome.toLowerCase().includes(query)
      const matchesLevel = selectedLevel.value === 'all' || String(spell.nivel) === selectedLevel.value
      const matchesSchool = selectedSchool.value === 'all' || spell.escola === selectedSchool.value
      const matchesPrepared = !preparedOnly.value || (spell.nivel > 0 && spell.preparada)
      return matchesSearch && matchesLevel && matchesSchool && matchesPrepared
    })
    .sort((a, b) => {
      if (sortBy.value === 'nome') {
        return a.nome.localeCompare(b.nome)
      }

      return a.nivel - b.nivel
    })
})

const cantrips = computed(() => filteredSpells.value.filter((spell) => spell.nivel === 0))
const spells = computed(() => filteredSpells.value.filter((spell) => spell.nivel > 0))

const preparedLimit = computed(() => Number(store.settings.nivel || 1) + Number(store.settings.inteligencia || 0))
const totalKnownLimit = computed(() => {
  const level = Number(store.settings.nivel || 1)
  return Math.max(0, 6 + (level - 1) * 2)
})
const spellLevelBreakdown = computed(() => {
  const counts = {}

  store.spells.forEach((spell) => {
    if (spell.nivel > 0) {
      counts[spell.nivel] = (counts[spell.nivel] || 0) + 1
    }
  })

  return Object.entries(counts)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([level, count]) => ({
      level: Number(level),
      count: Number(count),
    }))
})

const openSpell = (id) => {
  router.push({ name: 'spell-detail', params: { id } })
}

const togglePrepared = (id) => {
  store.togglePrepared(id)
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const toggleCapacityBreakdown = () => {
  showCapacityBreakdown.value = !showCapacityBreakdown.value
}

const formatRange = (value) => {
  if (!value) return '—'
  const normalized = String(value).trim().toLowerCase()
  if (normalized.includes('pé') || normalized.includes('pés') || normalized.includes('foot') || normalized.includes('feet')) {
    const number = Number(normalized.replace(/[^0-9.]/g, ''))
    if (!Number.isNaN(number)) {
      return `${(number * 0.3048).toFixed(0)} m`
    }
  }
  return value
}
</script>

<template>
  <main class="page-shell">
    <section class="page-card">
      <div class="page-heading">
        <div class="page-heading-copy">
          <p class="eyebrow">Grimório</p>
          <h1>Magias e truques</h1>
          <p class="heading-description">Organize feitiços, acompanhe o que foi preparado e mantenha o catálogo pronto
            para a próxima sessão.</p>
        </div>
        <PineBtn class="primary-button" color="#1f5d35"
          @click="router.push({ name: 'spell-detail', params: { id: 'new' } })">
          <PineIcon name="Plus" color="currentColor" size="16" />
          <span>Nova Magia</span>
        </PineBtn>
      </div>

      <div class="stats-grid">
        <article class="stat-card stat-card-expandable">
          <div class="stat-card-header">
            <div>
              <h3>Magias no Grimório</h3>
              <p class="stat-value">{{ store.knownCount }} / {{ totalKnownLimit }}</p>
            </div>
            <button class="collapse-button" type="button" @click="toggleCapacityBreakdown">
              <PineIcon :name="showCapacityBreakdown ? 'ChevronDown' : 'ChevronRight'" color="currentColor" size="16" />
            </button>
          </div>
          <span class="stat-caption">Limite estimado para o seu nível</span>
          <div v-if="showCapacityBreakdown" class="capacity-breakdown">
            <div v-for="entry in spellLevelBreakdown" :key="entry.level">
              <span>{{ entry.level === 1 ? '1º Nível' : `${entry.level}º Nível` }}</span>
              <strong>{{ entry.count }}</strong>
            </div>
          </div>
        </article>
        <article class="stat-card">
          <h3>Preparadas</h3>
          <p>{{ store.preparedCount }} / {{ preparedLimit }}</p>
          <span class="stat-caption">Limite por dia</span>
        </article>
        <article class="stat-card">
          <h3>Truques</h3>
          <p>{{ store.cantripCount }}</p>
          <span class="stat-caption">Sempre disponíveis</span>
        </article>
      </div>

      <div class="toolbar">
        <PineTextField v-model="search" label="Pesquisar por nome" placeholder="Nome da magia" />
        <div class="toolbar-actions">
          <PineBtn class="ghost-button" color="#2f8f4b" @click="toggleFilters">
            <PineIcon name="AdjustmentsHorizontal" color="currentColor" size="16" />
            <span>{{ showFilters ? 'Ocultar filtros' : 'Filtros' }}</span>
          </PineBtn>
        </div>
      </div>

      <div v-if="showFilters" class="filter-panel">
        <PineSelect v-model="selectedLevel" label="Nível" placeholder="Selecione o nível" :items="levelOptions" />
        <PineSelect v-model="selectedSchool" label="Escola" placeholder="Selecione a escola" :items="schoolOptions" />
        <label class="checkbox-row">
          <PineCheckbox v-model="preparedOnly" />
          Somente Preparadas
        </label>
        <PineSelect v-model="sortBy" label="Ordenação" placeholder="Selecione a ordenação" :items="sortOptions" />
      </div>

      <div v-if="!cantrips.length && !spells.length" class="empty-state">
        <h2>Nenhuma magia encontrada</h2>
        <p>Tente ajustar os filtros ou registre uma nova magia para começar a montar seu grimório.</p>
      </div>

      <div v-if="cantrips.length" class="spell-group">
        <div class="spell-group-header">
          <h2>Truques</h2>
          <span>{{ cantrips.length }} {{ cantrips.length === 1 ? 'item' : 'itens' }}</span>
        </div>
        <div class="spell-grid">
          <PineCard v-for="spell in cantrips" :key="`${spell.id}-${spell.preparada}-${spell.nivel}`" class="spell-card"
            :class="{ prepared: spell.preparada }">
            <div class="spell-meta">
              <span>Truque</span>
              <span>{{ spell.escola }}</span>
            </div>
            <div class="spell-card-title-row">
              <h3>{{ spell.nome }}</h3>
              <div class="icon-actions">
                <button class="icon-button" type="button" title="Editar magia" @click.stop="openSpell(spell.id)">
                  <PineIcon name="PencilSquare" color="currentColor" size="16" />
                </button>
              </div>
            </div>
            <p class="spell-brief">{{ spell.tempo }} • {{ formatRange(spell.alcance) }}</p>
            <p class="spell-description">{{ spell.descricao }}</p>
          </PineCard>
        </div>
      </div>

      <div v-if="spells.length" class="spell-group">
        <div class="spell-group-header">
          <h2>Feitiços</h2>
          <span>{{ spells.length }} {{ spells.length === 1 ? 'item' : 'itens' }}</span>
        </div>
        <div class="spell-grid">
          <PineCard v-for="spell in spells" :key="`${spell.id}-${spell.preparada}-${spell.nivel}`" class="spell-card"
            :class="{ prepared: spell.preparada }">
            <div class="spell-meta">
              <span>{{ `${spell.nivel}º nível` }}</span>
              <span>{{ spell.escola }}</span>
            </div>
            <div class="spell-card-title-row">
              <h3>{{ spell.nome }}</h3>
              <div class="icon-actions">
                <button class="icon-button" type="button"
                  :title="spell.preparada ? 'Marcar como não preparada' : 'Marcar como preparada'"
                  @click.stop="togglePrepared(spell.id)">
                  <PineIcon :name="spell.preparada ? 'CheckCircle' : 'MinusCircle'" color="currentColor" size="16" />
                </button>
                <button class="icon-button" type="button" title="Editar magia" @click.stop="openSpell(spell.id)">
                  <PineIcon name="PencilSquare" color="currentColor" size="16" />
                </button>
              </div>
            </div>
            <p class="spell-brief">{{ spell.tempo }} • {{ formatRange(spell.alcance) }}</p>
            <p class="spell-description">{{ spell.descricao }}</p>
            <div class="spell-footer">
              <span v-if="spell.preparada" class="prepare-pill">Preparada</span>
              <span v-else class="status-pill">Não preparada</span>
            </div>
          </PineCard>
        </div>
      </div>
    </section>
  </main>
</template>
