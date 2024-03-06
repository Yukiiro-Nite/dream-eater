import npcConfigs from "./npcConfigs"

export interface NPCConfig {
  id: string
  displayName: string
  defaultStatement: string | (() => string),
  statements: Record<string, Statement>
  replies: Record<string, Reply[]>
  texture?: string
}

export interface Statement {
  text: string,
  replyId?: string,
  action?: () => void
}

export interface Reply {
  nextStatementId: string
  text: string
  condition?: () => boolean
  action?: () => void
}

export const npcs = [
  ...npcConfigs
] as NPCConfig[]

const npcsById = Object.fromEntries(npcs.map((npc) => [npc.id, npc]))

export const getNpcById = (id?: string): NPCConfig | undefined => {
  if (!id) return
  const npc = npcsById[id]

  if (!npc) {
    console.warn('No npc data found for: ', id)
  }

  return npc
}

export const getStatementById = (npcId?: string, statementId?: string): Statement | undefined => {
  const npc = getNpcById(npcId)
  if (!npc || !statementId) return

  const statement = npc.statements[statementId]

  if (!statement) {
    console.warn(`NPC ${npc.id} does not have a statement for: `, statementId)
    return
  }

  return statement
}

export const getDefaultStatement = (npcId?: string): Statement | undefined => {
  const npc = getNpcById(npcId)
  if (!npc) return

  const defaultStatementConf = npc.defaultStatement
  let defaultStatement
  if (typeof defaultStatementConf === 'function') {
    defaultStatement = defaultStatementConf()
  } else {
    defaultStatement = defaultStatementConf
  }

  if (!defaultStatement) {
    console.warn(`NPC ${npc.id} is not configured correctly, please set a defaultStatement`)
    return
  }

  return getStatementById(npcId, defaultStatement)
}
