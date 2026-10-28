import { describe, expect, it } from 'vitest'
import { compareSentence, evaluateOpenAnswer, extractName, normalize, numberToWords, sameAnswer, splitSentences } from '../text'

describe('normalize', () => {
  it('lower-cases, drops punctuation and expands contractions', () => {
    expect(normalize("I'm fine, thanks!")).toBe('i am fine thanks')
    expect(normalize('She doesn’t like it.')).toBe('she does not like it')
    expect(normalize('dont')).toBe('do not')
  })
  it('turns digits into words', () => {
    expect(normalize('I am 19')).toBe('i am nineteen')
    expect(numberToWords(45)).toBe('forty five')
    expect(numberToWords(100)).toBe('one hundred')
  })
  it('is safe with prototype-like words', () => {
    expect(normalize('constructor toString')).toBe('constructor tostring')
  })
})

describe('compareSentence', () => {
  it('scores a perfect repeat as 1', () => {
    const r = compareSentence('Hello! My name is Anna.', 'hello my name is anna')
    expect(r.score).toBe(1)
    expect(r.missed).toEqual([])
  })
  it('finds missed words', () => {
    const r = compareSentence('Good morning! How are you?', 'good morning how you')
    expect(r.missed).toEqual(['are'])
    expect(r.score).toBeCloseTo(4 / 5)
  })
  it('accepts contractions either way', () => {
    expect(compareSentence("I'm fine, thank you.", 'I am fine thank you').score).toBe(1)
    expect(compareSentence('I am from Italy', "I'm from Italy").score).toBe(1)
  })
  it('tolerates small recogniser slips', () => {
    expect(compareSentence('Thursday', 'thursdays').score).toBe(1)
  })
})

describe('evaluateOpenAnswer', () => {
  it('rewards answers that use every key idea', () => {
    const r = evaluateOpenAnswer('My name is Alex and I am 19 years old', [['name'], ['years', 'old']], 6)
    expect(r.usedGroups).toBe(2)
    expect(r.score).toBe(1)
  })
  it('lists missing ideas', () => {
    const r = evaluateOpenAnswer('I live in London', [['from'], ['live']], 3)
    expect(r.missingHints).toEqual(['from'])
    expect(r.score).toBeLessThan(1)
  })
  it('gives 0 for silence', () => {
    expect(evaluateOpenAnswer('', [['name']]).score).toBe(0)
  })
})

describe('helpers', () => {
  it('extracts a name', () => {
    expect(extractName('Hi! My name is anna.')).toBe('Anna')
    expect(extractName("I'm Tom")).toBe('Tom')
    expect(extractName('I am a student')).toBeNull()
  })
  it('compares typed answers loosely', () => {
    expect(sameAnswer('  There Is ', 'there is')).toBe(true)
  })
  it('splits sentences', () => {
    expect(splitSentences('Hello! How are you? I am fine.')).toEqual(['Hello!', 'How are you?', 'I am fine.'])
  })
})
