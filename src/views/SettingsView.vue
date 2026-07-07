<script setup>
import { computed } from 'vue'
import { useGrimorioStore } from '../stores/grimorio'

const store = useGrimorioStore()

const proficiencyBonus = computed(() => {
    const level = Number(store.settings.nivel || 1)
    return Math.max(2, Math.ceil(level / 4) + 1)
})

const spellSaveDC = computed(() => {
    const intelligence = Number(store.settings.inteligencia || 0)
    return 8 + proficiencyBonus.value + intelligence
})

const spellAttack = computed(() => {
    const intelligence = Number(store.settings.inteligencia || 0)
    return proficiencyBonus.value + intelligence
})

const arcanaRecoveredToday = computed(() => {
    return Boolean(store.settings.recuperacaoArcanaHoje)
})

const arcanaAvailable = computed(() => {
    return Number(store.settings.recuperacaoArcanaDisponivel || 0)
})

const updateSetting = (key, value) => {
    store.updateSettings({ [key]: value })
}
</script>

<template>
    <main class="page-shell">
        <section class="page-card">
            <div class="page-heading">
                <div class="page-heading-copy">
                    <p class="eyebrow">Configurações</p>
                    <h1>Configuração</h1>
                    <p class="heading-description">Preencha os dados básicos do personagem e veja os valores de magia
                        atualizados automaticamente.</p>
                </div>
            </div>

            <form class="spell-form" @submit.prevent>
                <div class="form-grid">
                    <label>
                        Nome do personagem
                        <PineTextField :model-value="store.settings.personagem || ''"
                            @update:model-value="(value) => updateSetting('personagem', value)" />
                    </label>
                    <label>
                        Classe
                        <PineTextField :model-value="store.settings.classe || ''"
                            @update:model-value="(value) => updateSetting('classe', value)" />
                    </label>
                    <label>
                        Nível
                        <PineTextField :model-value="store.settings.nivel || 1" type="number" min="1"
                            @update:model-value="(value) => updateSetting('nivel', Number(value))" />
                    </label>
                    <label>
                        Inteligência
                        <PineTextField :model-value="store.settings.inteligencia || 0" type="number"
                            @update:model-value="(value) => updateSetting('inteligencia', Number(value))" />
                    </label>
                </div>
            </form>

            <div class="settings-summary">
                <div class="settings-summary-header">
                    <div>
                        <p class="eyebrow">Resumo automático</p>
                        <h2>Descanso</h2>
                    </div>
                </div>

                <div class="summary-grid">
                    <div class="summary-card">
                        <span class="summary-label">Recuperação Arcana: </span>
                        <strong>{{ arcanaRecoveredToday ? 'Utilizada hoje' : 'Disponível' }}</strong>
                    </div>
                    <div class="summary-card">
                        <span class="summary-label">Disponível: </span>
                        <strong>{{ arcanaAvailable }}</strong>
                    </div>
                    <div class="summary-card">
                        <span class="summary-label">CD das Magias: </span>
                        <strong>{{ spellSaveDC }}</strong>
                    </div>
                    <div class="summary-card">
                        <span class="summary-label">Ataque Mágico: </span>
                        <strong>+{{ spellAttack }}</strong>
                    </div>
                    <div class="summary-card">
                        <span class="summary-label">Proficiência: </span>
                        <strong>+{{ proficiencyBonus }}</strong>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
