<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGrimorioStore } from '../stores/grimorio'

const route = useRoute()
const router = useRouter()
const store = useGrimorioStore()

const schools = [
    'Sem escola',
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
    escola: 'Sem escola',
    tempo: '1 ação',
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

watch(() => spellForm.value.nivel, (value) => {
    if (Number(value) === 0) {
        spellForm.value.preparada = false
    }
})

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
    const normalizedSpell = {
        ...spellForm.value,
        nivel: Math.max(0, Math.min(5, Number(spellForm.value.nivel) || 0)),
        escola: spellForm.value.escola || 'Sem escola',
        tempo: spellForm.value.tempo || '1 ação',
        alcance: spellForm.value.alcance || '',
    }

    if (isNewSpell.value) {
        store.addSpell(normalizedSpell)
        router.push({ name: 'home' })
        return
    }

    store.updateSpell(route.params.id, normalizedSpell)
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
                <div class="heading-title-wrap">
                    <button class="icon-button back-button" type="button" title="Voltar para o grimório"
                        @click="router.push({ name: 'home' })">
                        <PineIcon name="ArrowLeft" color="currentColor" size="16" />
                    </button>
                    <div>
                        <p class="eyebrow" v-if="!isNewSpell">Detalhes da Magia</p>
                        <h1>{{ isNewSpell ? 'Registrar Magia' : spellForm.nome || 'Magia' }}</h1>
                    </div>
                </div>
                <div class="page-actions">
                    <template v-if="!isNewSpell && !isEditing">
                        <PineBtn class="ghost-button" color="#2f8f4b" @click="startEditing">Editar</PineBtn>
                        <PineBtn class="danger-button" color="#b91c1c" @click="removeSpell">Excluir</PineBtn>
                    </template>
                </div>
            </div>

            <form v-if="isEditing || isNewSpell" class="spell-form" @submit.prevent="saveSpell">
                <div class="form-hero">
                    <p>Preencha os campos abaixo para manter o grimório organizado e pronto para as sessões.</p>
                </div>
                <div class="form-grid">
                    <label>
                        Nome
                        <PineTextField v-model="spellForm.nome" placeholder="Nome da magia" />
                    </label>
                    <label>
                        Nível
                        <PineTextField v-model.number="spellForm.nivel" type="number" min="0" max="5" />
                    </label>
                    <label>
                        Escola
                        <PineSelect v-model="spellForm.escola" placeholder="Selecione a escola"
                            :items="schools.map((school) => ({ value: school, text: school }))" />
                    </label>
                    <label>
                        Tempo de Conjuração
                        <PineTextField v-model="spellForm.tempo" placeholder="1 ação" />
                    </label>
                    <label>
                        Alcance (m)
                        <PineTextField v-model="spellForm.alcance" placeholder="10 m" />
                    </label>
                    <label>
                        Componentes
                        <PineTextField v-model="spellForm.componentes" placeholder="V, S" />
                    </label>
                    <label>
                        Duração
                        <PineTextField v-model="spellForm.duracao" placeholder="Instantânea" />
                    </label>
                    <label class="checkbox-row">
                        <PineCheckbox v-model="spellForm.ritual" />
                        Ritual
                    </label>
                    <label class="checkbox-row">
                        <PineCheckbox v-model="spellForm.concentracao" />
                        Concentração
                    </label>
                    <label v-if="spellForm.nivel > 0" class="checkbox-row">
                        <PineCheckbox v-model="spellForm.preparada" />
                        Preparada
                    </label>
                </div>

                <label class="description-field">
                    Descrição
                    <textarea v-model="spellForm.descricao" rows="7" required
                        placeholder="Descreva os efeitos da magia" />
                </label>

                <div class="form-actions">
                    <PineBtn class="primary-button" color="#1f5d35" type="submit">Salvar</PineBtn>
                    <PineBtn v-if="!isNewSpell" class="ghost-button" color="#2f8f4b" type="button"
                        @click="cancelEditing">Cancelar
                    </PineBtn>
                </div>
            </form>

            <div v-else class="spell-details">
                <div class="detail-grid">
                    <div><strong>Escola</strong><span>{{ spellForm.escola }}</span></div>
                    <div><strong>Nível</strong><span>{{ spellForm.nivel === 0 ? 'Truque' : `${spellForm.nivel}º nível`
                    }}</span>
                    </div>
                    <div><strong>Tempo</strong><span>{{ spellForm.tempo }}</span></div>
                    <div><strong>Alcance</strong><span>{{ formatRange(spellForm.alcance) }}</span></div>
                    <div><strong>Componentes</strong><span>{{ spellForm.componentes }}</span></div>
                    <div><strong>Duração</strong><span>{{ spellForm.duracao }}</span></div>
                    <div><strong>Ritual</strong><span>{{ spellForm.ritual ? 'Sim' : 'Não' }}</span></div>
                    <div><strong>Concentração</strong><span>{{ spellForm.concentracao ? 'Sim' : 'Não' }}</span></div>
                    <div v-if="spellForm.nivel > 0"><strong>Preparada</strong><span>{{ spellForm.preparada ? 'Sim' :
                        'Não' }}</span>
                    </div>
                </div>

                <div class="description-block">
                    <h2>Descrição</h2>
                    <p>{{ spellForm.descricao }}</p>
                </div>
            </div>
        </section>
    </main>
</template>
