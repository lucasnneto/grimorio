import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  defaultSettings,
  defaultSlots,
  defaultSpells,
  readJSON,
  STORAGE_KEYS,
  writeJSON,
} from '../services/localStorage'

export const useGrimorioStore = defineStore('grimorio', () => {
  const spells = ref(readJSON(STORAGE_KEYS.spells, defaultSpells))
  const settings = ref(readJSON(STORAGE_KEYS.settings, defaultSettings))
  const slots = ref(readJSON(STORAGE_KEYS.slots, defaultSlots))

  const knownCount = computed(() => spells.value.length)
  const preparedCount = computed(() => spells.value.filter((spell) => spell.preparada).length)
  const cantripCount = computed(() => spells.value.filter((spell) => spell.nivel === 0).length)

  const persistSpells = () => writeJSON(STORAGE_KEYS.spells, spells.value)
  const persistSettings = () => writeJSON(STORAGE_KEYS.settings, settings.value)
  const persistSlots = () => writeJSON(STORAGE_KEYS.slots, slots.value)

  const addSpell = (spell) => {
    const normalizedSpell = {
      ...spell,
      id: spell.id || `spell-${Date.now()}`,
      nivel: Number(spell.nivel) || 0,
      ritual: Boolean(spell.ritual),
      concentracao: Boolean(spell.concentracao),
      preparada: Boolean(spell.preparada),
    }

    spells.value = [normalizedSpell, ...spells.value]
    persistSpells()
    return normalizedSpell
  }

  const updateSpell = (id, spell) => {
    spells.value = spells.value.map((item) => (item.id === id ? { ...item, ...spell } : item))
    persistSpells()
  }

  const deleteSpell = (id) => {
    spells.value = spells.value.filter((spell) => spell.id !== id)
    persistSpells()
  }

  const togglePrepared = (id) => {
    spells.value = spells.value.map((spell) =>
      spell.id === id ? { ...spell, preparada: !spell.preparada } : spell,
    )
    persistSpells()
  }

  const updateSettings = (payload) => {
    settings.value = { ...settings.value, ...payload }
    persistSettings()
  }

  const setSlotUsage = (level, usados) => {
    const max = Number(slots.value[level]?.max || 0)
    const safeUsage = Math.max(0, Math.min(Number(usados) || 0, max))

    slots.value = {
      ...slots.value,
      [level]: {
        ...slots.value[level],
        usados: safeUsage,
      },
    }

    persistSlots()
  }

  return {
    spells,
    settings,
    slots,
    knownCount,
    preparedCount,
    cantripCount,
    addSpell,
    updateSpell,
    deleteSpell,
    togglePrepared,
    updateSettings,
    setSlotUsage,
  }
})
