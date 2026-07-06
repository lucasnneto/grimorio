<script setup>
import { computed } from 'vue'
import { useGrimorioStore } from '../stores/grimorio'

const store = useGrimorioStore()

const levels = computed(() => {
  return Object.entries(store.slots)
    .map(([key, value]) => ({
      key,
      label: key === '0' ? 'Truques' : `${key}º Nível`,
      max: Number(value?.max || 0),
      usados: Number(value?.usados || 0),
    }))
    .sort((a, b) => Number(a.key) - Number(b.key))
})

const useSlot = (levelKey, index) => {
  const current = Number(store.slots[levelKey]?.usados || 0)
  const next = current >= index ? index - 1 : index
  store.setSlotUsage(levelKey, next)
}
</script>

<template>
  <main class="page-shell">
    <section class="page-card">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Espaços de Magia</p>
          <h1>Gerencie seus espaços</h1>
        </div>
      </div>

      <div class="slot-list">
        <article v-for="level in levels" :key="level.key" class="slot-card">
          <h2>{{ level.label }}</h2>
          <div class="slot-value">{{ level.key === '0' ? '∞' : level.max }}</div>

          <div v-if="level.key !== '0'" class="slot-buttons">
            <button
              v-for="index in level.max"
              :key="`${level.key}-${index}`"
              class="slot-button"
              :class="{ filled: index <= level.usados }"
              type="button"
              @click="useSlot(level.key, index)"
            >
              {{ index <= level.usados ? '●' : '○' }}
            </button>
          </div>

          <p class="slot-recovery">Recuperação: Descanso Longo</p>
        </article>
      </div>

      <div class="info-block">
        <h3>Todos os espaços de magia são recuperados após um Descanso Longo.</h3>
        <p>
          Recuperação Arcana: uma vez por dia, durante um Descanso Curto, você pode recuperar espaços de magia cuja soma dos níveis seja igual ou inferior à metade do seu nível de Mago (arredondado para cima), sem recuperar espaços de 6º nível ou superior.
        </p>
      </div>
    </section>
  </main>
</template>
