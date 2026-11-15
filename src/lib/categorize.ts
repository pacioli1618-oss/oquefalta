// Guesses the category of a new item from its name, by the category's icon key
// (the icon is stable even when people rename the category). Unknown → "Outros".
// Order matters: more specific groups first ("papel higiênico" before anything with "papel").

const WORDS: [icon: string, words: string[]][] = [
  ['higiene', ['papel higi', 'sabonete', 'shampoo', 'xampu', 'condicionador', 'pasta de dente', 'creme dental', 'desodorante', 'escova de dente', 'absorvente', 'fio dental', 'cotonete', 'fralda']],
  ['limpeza', ['detergente', 'sabão', 'sabao', 'amaciante', 'esponja', 'desinfetante', 'sanitária', 'sanitaria', 'saco de lixo', 'multiuso', 'papel toalha', 'lustra', 'alvejante', 'vassoura', 'pano de chão']],
  ['pet', ['ração', 'racao', 'areia de gato', 'areia do gato', 'petisco', 'sachê', 'sache']],
  ['congelados', ['sorvete', 'pizza', 'gelo', 'lasanha', 'congelad', 'nuggets', 'hambúrguer', 'hamburguer', 'polpa']],
  ['carnes', ['carne', 'frango', 'peixe', 'linguiça', 'linguica', 'picanha', 'bife', 'salsicha', 'patinho', 'costela', 'alcatra', 'filé', 'file', 'acém', 'acem', 'moída', 'moida', 'peito de', 'coxa', 'bacon', 'tilápia', 'tilapia', 'salmão', 'salmao', 'camarão', 'camarao']],
  ['laticinios', ['leite', 'queijo', 'iogurte', 'manteiga', 'ovo', 'requeijão', 'requeijao', 'presunto', 'margarina', 'muçarela', 'mucarela', 'mussarela', 'creme de leite', 'nata', 'mortadela', 'peito de peru']],
  ['padaria', ['pão', 'pao', 'pães', 'paes', 'bolo', 'torrada', 'biscoito', 'bisnaguinha', 'bolacha', 'croissant', 'sonho']],
  ['hortifruti', ['banana', 'tomate', 'alface', 'cebola', 'alho', 'batata', 'maçã', 'maca', 'laranja', 'limão', 'limao', 'cenoura', 'fruta', 'verdura', 'legume', 'abacate', 'mamão', 'mamao', 'uva', 'morango', 'abobrinha', 'pepino', 'pimentão', 'pimentao', 'brócolis', 'brocolis', 'couve', 'rúcula', 'rucula', 'manga', 'melancia', 'melão', 'melao', 'abacaxi', 'cheiro verde', 'salsinha', 'coentro', 'mandioca']],
  ['bebidas', ['água', 'agua', 'suco', 'refrigerante', 'refri', 'cerveja', 'vinho', 'coca', 'guaraná', 'guarana', 'energético', 'energetico', 'cachaça', 'cachaca', 'chá', 'cha mate']],
  ['mercearia', ['arroz', 'feijão', 'feijao', 'café', 'cafe', 'açúcar', 'acucar', 'óleo', 'oleo', 'azeite', 'macarrão', 'macarrao', 'farinha', 'sal', 'molho', 'aveia', 'granola', 'achocolatado', 'extrato', 'milho', 'ervilha', 'atum', 'sardinha', 'vinagre', 'tempero', 'maionese', 'ketchup', 'mostarda', 'fubá', 'fuba', 'leite condensado', 'chocolate', 'cereal', 'pipoca', 'lentilha', 'grão de bico', 'grao de bico']],
  ['farmacia', ['remédio', 'remedio', 'dipirona', 'paracetamol', 'curativo', 'band-aid', 'protetor solar', 'vitamina']],
];

function normalize(text: string) {
  return ` ${text.toLowerCase().trim()} `;
}

/** Icon key of the category this item most likely belongs to, or null when unknown. */
export function guessIcon(itemName: string): string | null {
  const name = normalize(itemName);
  // "leite condensado" is pantry, not dairy: check the longest matching word across groups.
  let best: {icon: string; length: number} | null = null;
  for (const [icon, words] of WORDS) {
    for (const word of words) {
      const short = word.length <= 3;
      const hit = short ? name.includes(` ${word} `) || name.includes(` ${word}s `) : name.includes(word);
      if (hit && (!best || word.length > best.length)) best = {icon, length: word.length};
    }
  }
  return best?.icon ?? null;
}
