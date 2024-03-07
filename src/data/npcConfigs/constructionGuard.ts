import { NPCConfig } from "../npcs";

export const constructionGuard = {
  id: 'construction-guard',
  displayName: 'Guard',
  defaultStatement: 'start',
  statements: {
    'start': {
      text: 'Sorry, you aren\'t allowed to go in there.',
      replyId: 'why'
    },
    'why': {
      text: 'It\'s dangerous, obviously! What if something fell and hit you in the head? It would be my responsibility if I let you go in and you got hurt. Move along, you don\'t have any reason to go in anyways.',
    },
    'end': {
      text: 'Stay out of trouble!'
    }
  },
  replies: {
    'why': [
      {
        nextStatementId: 'why',
        text: 'Why not?'
      },
      {
        nextStatementId: 'end',
        text: 'Ok.'
      }
    ]
  }
} as NPCConfig