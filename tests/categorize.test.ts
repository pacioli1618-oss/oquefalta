import assert from 'node:assert/strict';
import {test} from 'node:test';
import {guessIcon} from '../src/lib/categorize';

test('guesses common items', () => {
  assert.equal(guessIcon('banana'), 'hortifruti');
  assert.equal(guessIcon('Pão de forma'), 'padaria');
  assert.equal(guessIcon('leite'), 'laticinios');
  assert.equal(guessIcon('ovos'), 'laticinios');
  assert.equal(guessIcon('arroz 5kg'), 'mercearia');
  assert.equal(guessIcon('detergente'), 'limpeza');
  assert.equal(guessIcon('papel higiênico'), 'higiene');
  assert.equal(guessIcon('cerveja'), 'bebidas');
  assert.equal(guessIcon('ração do gato'), 'pet');
  assert.equal(guessIcon('sorvete'), 'congelados');
});

test('longest match wins', () => {
  assert.equal(guessIcon('leite condensado'), 'mercearia');
  assert.equal(guessIcon('água sanitária'), 'limpeza');
  assert.equal(guessIcon('creme de leite'), 'laticinios');
});

test('short words only match whole words', () => {
  assert.equal(guessIcon('salsicha'), 'carnes');
  assert.equal(guessIcon('sal grosso'), 'mercearia');
  assert.equal(guessIcon('novo item'), null);
});

test('unknown items return null', () => {
  assert.equal(guessIcon('pilha AA'), null);
});
