const STORAGE_KEYS = {
  spells: 'grimorio-spells',
  settings: 'grimorio-settings',
  slots: 'grimorio-slots',
}

function readJSON(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

const defaultSettings = {
  personagem: 'Mago Anônimo',
  classe: 'Mago',
  nivel: 1,
  inteligencia: 3,
  proficiencia: 2,
  cd: 13,
  ataque: 5,
}

const defaultSlots = {
  0: { max: 0, usados: 0 },
  1: { max: 4, usados: 0 },
  2: { max: 3, usados: 0 },
  3: { max: 2, usados: 0 },
}

const defaultSpells = []

export { STORAGE_KEYS, readJSON, writeJSON, defaultSettings, defaultSlots, defaultSpells }
