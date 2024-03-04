export interface NPCConfig {
  id: string
  displayName: string
  defaultStatement: string | (() => string),
  statements: Record<string, Statement>
  replies: Record<string, Reply[]>
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
  {
    id: 'home-bookshelf',
    displayName: 'Bookshelf',
    defaultStatement: 'start',
    statements: {
      'start': {
        text: 'You see several familiar books. Which one would you like to read?',
        replyId: 'books'
      },
      'employee manual': {
        text: 'You once again familiarize yourself with the DreamCorp employee manual. It\'s dry corporate language nearly puts you to sleep. You return the book to the shelf. Would you like to read something else?',
        replyId: 'books'
      },
      'end': {
        text: 'Perhaps you\'ll read more later.'
      }
    },
    replies: {
      'books': [
        {
          nextStatementId: 'employee manual',
          text: 'DreamCorp employee manual'
        },
        {
          nextStatementId: 'end',
          text: 'Nevermind'
        }
      ]
    }
  }
] as NPCConfig[]

const npcsById = Object.fromEntries(npcs.map((npc) => [npc.id, npc]))

export const getNpcById = (id: string): NPCConfig | undefined => {
  const npc = npcsById[id]

  if (!npc) {
    console.warn('No npc data found for: ', id)
  }

  return npc
}