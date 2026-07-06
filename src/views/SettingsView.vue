<script setup>
import { useGrimorioStore } from '../stores/grimorio'

const store = useGrimorioStore()
</script>

<template>
  <main class="page-shell">
    <section class="page-card">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Configurações</p>
          <h1>Dados do personagem</h1>
        </div>
      </div>

      <form class="spell-form" @submit.prevent>
        <div class="form-grid">
          <label>
            Nome do personagem
            <input v-model="store.settings.personagem" @input="store.updateSettings({ personagem: store.settings.personagem })" />
          </label>
          <label>
            Classe
            <input v-model="store.settings.classe" @input="store.updateSettings({ classe: store.settings.classe })" />
          </label>
          <label>
            Nível
            <input v-model.number="store.settings.nivel" type="number" min="1" @input="store.updateSettings({ nivel: Number(store.settings.nivel) })" />
          </label>
          <label>
            Modificador de Inteligência
            <input v-model.number="store.settings.inteligencia" type="number" @input="store.updateSettings({ inteligencia: Number(store.settings.inteligencia) })" />
          </label>
          <label>
            Bônus de Proficiência
            <input v-model.number="store.settings.proficiencia" type="number" @input="store.updateSettings({ proficiencia: Number(store.settings.proficiencia) })" />
          </label>
          <label>
            CD das Magias
            <input v-model.number="store.settings.cd" type="number" @input="store.updateSettings({ cd: Number(store.settings.cd) })" />
          </label>
          <label>
            Ataque Mágico
            <input v-model.number="store.settings.ataque" type="number" @input="store.updateSettings({ ataque: Number(store.settings.ataque) })" />
          </label>
        </div>
      </form>
    </section>
  </main>
</template>
