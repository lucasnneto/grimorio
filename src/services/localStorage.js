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

const defaultSpells = [
  {
    id: 'spell-1',
    nome: 'Mão de Mage',
    nivel: 0,
    escola: 'Conjuração',
    tempo: '1 ação',
    alcance: '30 pés',
    componentes: 'V, S',
    duracao: '1 minuto',
    ritual: false,
    concentracao: false,
    preparada: true,
    descricao:
      'Você cria uma mão espectral flutuante que pode realizar tarefas simples, como manipular objetos e abrir portas.',
  },
  {
    id: 'spell-2',
    nome: 'Mísseis Mágicos',
    nivel: 1,
    escola: 'Evocação',
    tempo: '1 ação',
    alcance: '120 pés',
    componentes: 'V, S',
    duracao: 'Instantânea',
    ritual: false,
    concentracao: false,
    preparada: true,
    descricao:
      'Você cria três dardos de energia mágica que acertam alvos separados e causam dano de força.',
  },
  {
    id: 'spell-3',
    nome: 'Detectar Magia',
    nivel: 1,
    escola: 'Adivinhação',
    tempo: '1 ação',
    alcance: 'Si mesmo',
    componentes: 'V, S',
    duracao: '10 minutos',
    ritual: true,
    concentracao: false,
    preparada: false,
    descricao:
      'Você sente a presença de magia em uma área ao seu redor e pode identificar a escola de cada efeito.',
  },
  {
    id: 'spell-4',
    nome: 'Queda de Pluma',
    nivel: 1,
    escola: 'Transmutação',
    tempo: '1 reação',
    alcance: '60 pés',
    componentes: 'V, M (uma pena ou fragmento de pena)',
    duracao: '1 minuto',
    ritual: false,
    concentracao: false,
    preparada: false,
    descricao:
      'Você faz com que uma criatura caia mais lentamente, reduzindo a queda de dano e permitindo deslocamento seguro.',
  },
]

export { STORAGE_KEYS, readJSON, writeJSON, defaultSettings, defaultSlots, defaultSpells }
