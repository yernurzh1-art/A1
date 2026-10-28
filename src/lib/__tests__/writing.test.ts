import { describe, expect, it } from 'vitest'
import { checkWriting } from '../writing'
import { WRITING_TASKS } from '@/data/writing'

const aboutMe = WRITING_TASKS.find((t) => t.id === 'w2')!

describe('checkWriting', () => {
  it('gives a high score to the example answer', () => {
    for (const task of WRITING_TASKS) {
      const r = checkWriting(task.example, task)
      expect(r.score, task.id).toBeGreaterThanOrEqual(80)
    }
  })
  it('scores an empty text as 0', () => {
    expect(checkWriting('', aboutMe).score).toBe(0)
  })
  it('spots common A1 mistakes', () => {
    const r = checkWriting('my name is tom. i am 20 years old. she have a cat. He like football. I have a apple.', aboutMe)
    const tips = r.grammarIssues.map((g) => g.tip).join(' ')
    expect(tips).toMatch(/capital letter/)
    expect(tips).toMatch(/has/)
    expect(tips).toMatch(/verb \+ s/)
    expect(tips).toMatch(/an apple/)
  })
  it('does not flag correct questions', () => {
    const r = checkWriting('Does she like tea? Does he have a car? Where does she live?', { minWords: 3, minSentences: 1, checks: [], keywords: [] })
    expect(r.grammarIssues).toEqual([])
  })
})
