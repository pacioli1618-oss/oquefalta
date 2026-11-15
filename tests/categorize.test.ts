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

test('guesses items in English', () => {
  assert.equal(guessIcon('bananas'), 'hortifruti');
  assert.equal(guessIcon('Milk'), 'laticinios');
  assert.equal(guessIcon('eggs'), 'laticinios');
  assert.equal(guessIcon('toilet paper'), 'higiene');
  assert.equal(guessIcon('dish soap'), 'limpeza');
  assert.equal(guessIcon('rice'), 'mercearia');
  assert.equal(guessIcon('ice cream'), 'congelados');
  assert.equal(guessIcon('peanut butter'), 'mercearia');
  assert.equal(guessIcon('cat food'), 'pet');
  assert.equal(guessIcon('orange juice'), 'bebidas');
});

test('guesses items in Spanish', () => {
  assert.equal(guessIcon('leche'), 'laticinios');
  assert.equal(guessIcon('huevos'), 'laticinios');
  assert.equal(guessIcon('pan'), 'padaria');
  assert.equal(guessIcon('lejía'), 'limpeza');
  assert.equal(guessIcon('pollo'), 'carnes');
  assert.equal(guessIcon('cerveza'), 'bebidas');
  assert.equal(guessIcon('aceite de oliva'), 'mercearia');
  assert.equal(guessIcon('pasta de dientes'), 'higiene');
  assert.equal(guessIcon('leche condensada'), 'mercearia');
});

test('short English and Spanish words only match whole words', () => {
  assert.equal(guessIcon('ice'), 'congelados');
  assert.equal(guessIcon('té verde'), 'bebidas');
  assert.equal(guessIcon('panela'), null);
});
