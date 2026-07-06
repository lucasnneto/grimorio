<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGrimorioStore } from '../stores/grimorio'

const route = useRoute()
const router = useRouter()
const store = useGrimorioStore()

const schools = [
  'Abjuração',
  'Adivinhação',
  'Conjuração',
  'Encantamento',
  'Evocação',
  'Ilusão',
  'Necromancia',
  'Transmutação',
]

const blankSpell = {
  nome: '',
  nivel: 0,
  escola: 'Abjuração',
  tempo: '',
  alcance: '',
  componentes: '',
  duracao: '',
  ritual: false,
  concentracao: false,
  preparada: false,
  descricao: '',
}

const spellForm = ref({ ...blankSpell })
const isEditing = ref(false)

const isNewSpell = computed(() => route.params.id === 'new')
const existingSpell = computed(() => store.spells.find((spell) => spell.id === route.params.id))

const loadSpell = () => {
  if (isNewSpell.value) {
    spellForm.value = { ...blankSpell }
    isEditing.value = true
    return
  }

  const spell = existingSpell.value
  if (!spell) {
    router.replace({ name: 'home' })
    return
  }

  spellForm.value = { ...spell }
  isEditing.value = false
}

watch(() => route.params.id, loadSpell, { immediate: true })

const saveSpell = () => {
  if (isNewSpell.value) {
    const created = store.addSpell(spellForm.value)
    router.push({ name: 'spell-detail', params: { id: created.id } })
    return
  }

  store.updateSpell(route.params.id, spellForm.value)
  isEditing.value = false
}

const startEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  if (isNewSpell.value) {
    spellForm.value = { ...blankSpell }
    return
  }

  spellForm.value = { ...existingSpell.value }
  isEditing.value = false
}

const removeSpell = () => {
  if (window.confirm('Deseja excluir esta magia do grimório?')) {
    store.deleteSpell(route.params.id)
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <main class="page-shell">
    <section class="page-card">
      <div class="page-heading">
        <div>
          <p class="eyebrow">{{ isNewSpell ? 'Nova Magia' : 'Detalhes da Magia' }}</p>
          <h1>{{ isNewSpell ? 'Registrar Magia' : spellForm.nome || 'Magia' }}</h1>
        </div>
        <div class="page-actions">
          <button class="ghost-button" @click="router.push({ name: 'home' })">Voltar</button>
          <template v-if="!isNewSpell && !isEditing">
            <button class="ghost-button" @click="startEditing">Editar</button>
            <button class="danger-button" @click="removeSpell">Excluir</button>
          </template>
        </div>
      </div>

      <form v-if="isEditing || isNewSpell" class="spell-form" @submit.prevent="saveSpell">
        <div class="form-grid">
          <label>
            Nome
            <input v-model="spellForm.nome" required placeholder="Nome da magia" />
          </label>
          <label>
            Nível
            <input v-model.number="spellForm.nivel" type="number" min="0" max="9" required />
          </label>
          <label>
            Escola
            <select v-model="spellForm.escola">
              <option v-for="school in schools" :key="school" :value="school">{{ school }}</option>
            </select>
          </label>
          <label>
            Tempo de Conjuração
            <input v-model="spellForm.tempo" required placeholder="1 ação" />
          </label>
          <label>
            Alcance
            <input v-model="spellForm.alcance" required placeholder="30 pés" />
          </label>
          <label>
            Componentes
            <input v-model="spellForm.componentes" required placeholder="V, S" />
          </label>
          <label>
            Duração
            <input v-model="spellForm.duracao" required placeholder="Instantânea" />
          </label>
          <label class="checkbox-row">
            <input v-model="spellForm.ritual" type="checkbox" />
            Ritual
          </label>
          <label class="checkbox-row">
            <input v-model="spellForm.concentracao" type="checkbox" />
            Concentração
          </label>
          <label class="checkbox-row">
            <input v-model="spellForm.preparada" type="checkbox" />
            Preparada
          </label>
        </div>

        <label>
          Descrição
          <textarea v-model="spellForm.descricao" rows="7" required placeholder="Descreva os efeitos da magia" />
        </label>

        <div class="form-actions">
          <button class="primary-button" type="submit">Salvar</button>
          <button v-if="!isNewSpell" class="ghost-button" type="button" @click="cancelEditing">Cancelar</button>
        </div>
      </form>

      <div v-else class="spell-details">
        <div class="detail-grid">
          <div><strong>Escola</strong><span>{{ spellForm.escola }}</span></div>
          <div><strong>Nível</strong><span>{{ spellForm.nivel === 0 ? 'Truque' : `${spellForm.nivel}º nível` }}</span></div>
          <div><strong>Tempo</strong><span>{{ spellForm.tempo }}</span></div>
          <div><strong>Alcance</strong><span>{{ spellForm.alcance }}</span></div>
          <div><strong>Componentes</strong><span>{{ spellForm.componentes }}</span></div>
          <div><strong>Duração</strong><span>{{ spellForm.duracao }}</span></div>
          <div><strong>Ritual</strong><span>{{ spellForm.ritual ? 'Sim' : 'Não' }}</span></div>
          <div><strong>Concentração</strong><span>{{ spellForm.concentracao ? 'Sim' : 'Não' }}</span></div>
          <div><strong>Preparada</strong><span>{{ spellForm.preparada ? 'Sim' : 'Não' }}</span></div>
        </div>

        <div class="description-block">
          <h2>Descrição</h2>
          <p>{{ spellForm.descricao }}</p>
        </div>
      </div>
    </section>
  </main>
</template>
