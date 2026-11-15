// Guesses the category of a new item from its name, by the category's icon key
// (the icon is stable even when people rename the category). Unknown → "Outros".
// Words in Portuguese, Spanish and English are checked together: a list can be shared between
// people who use the app in different languages.
// Order matters: more specific groups first ("papel higiênico" before anything with "papel").

const WORDS: [icon: string, words: string[]][] = [
  ['higiene', ['papel higi', 'sabonete', 'shampoo', 'xampu', 'condicionador', 'pasta de dente', 'creme dental', 'desodorante', 'escova de dente', 'absorvente', 'fio dental', 'cotonete', 'fralda', 'toilet paper', 'soap', 'conditioner', 'toothpaste', 'toothbrush', 'deodorant', 'dental floss', 'floss', 'diaper', 'tampon', 'cotton swab', 'razor', 'papel higiénico', 'jabón', 'jabon', 'champú', 'champu', 'acondicionador', 'pasta de dientes', 'pasta dental', 'cepillo de dientes', 'hilo dental', 'pañal', 'panal', 'toallas femeninas', 'hisopo', 'maquinilla', 'crema dental', 'toilet roll']],
  ['limpeza', ['detergente', 'sabão', 'sabao', 'amaciante', 'esponja', 'desinfetante', 'sanitária', 'sanitaria', 'saco de lixo', 'multiuso', 'papel toalha', 'lustra', 'alvejante', 'vassoura', 'pano de chão', 'detergent', 'dish soap', 'dishwasher', 'laundry', 'bleach', 'fabric softener', 'softener', 'sponge', 'disinfectant', 'trash bag', 'garbage bag', 'bin bag', 'paper towel', 'all-purpose', 'cleaner', 'broom', 'mop', 'lavavajillas', 'jabón para platos', 'jabon para platos', 'lejía', 'lejia', 'cloro', 'suavizante', 'desinfectante', 'bolsas de basura', 'bolsa de basura', 'papel de cocina', 'toallas de papel', 'escoba', 'trapeador', 'fregona', 'limpiador']],
  ['pet', ['ração', 'racao', 'areia de gato', 'areia do gato', 'petisco', 'sachê', 'sache', 'dog food', 'cat food', 'pet food', 'cat litter', 'kitty litter', 'dog treats', 'cat treats', 'comida para perro', 'comida de perro', 'comida para gato', 'comida de gato', 'pienso', 'croquetas', 'arena para gato', 'arena de gato', 'alimento para perro', 'alimento para gato', 'fish food']],
  ['congelados', ['sorvete', 'pizza', 'gelo', 'lasanha', 'congelad', 'nuggets', 'hambúrguer', 'hamburguer', 'polpa', 'ice cream', 'frozen', 'ice', 'fries', 'hamburger', 'burger', 'fish sticks', 'helado', 'congelado', 'hielo', 'papas fritas', 'hamburguesa', 'palitos de pescado']],
  ['carnes', ['carne', 'frango', 'peixe', 'linguiça', 'linguica', 'picanha', 'bife', 'salsicha', 'patinho', 'costela', 'alcatra', 'filé', 'file', 'acém', 'acem', 'moída', 'moida', 'peito de', 'coxa', 'bacon', 'tilápia', 'tilapia', 'salmão', 'salmao', 'camarão', 'camarao', 'beef', 'chicken', 'pork', 'fish', 'steak', 'ground beef', 'sausage', 'ribs', 'salmon', 'tuna steak', 'shrimp', 'turkey breast', 'lamb', 'pollo', 'pescado', 'cerdo', 'bistec', 'carne molida', 'carne picada', 'salchicha', 'chorizo', 'tocino', 'costillas', 'salmón', 'camarón', 'camarones', 'gambas', 'cordero', 'pechuga', 'turkey']],
  ['laticinios', ['leite', 'queijo', 'iogurte', 'manteiga', 'ovo', 'requeijão', 'requeijao', 'presunto', 'margarina', 'muçarela', 'mucarela', 'mussarela', 'creme de leite', 'nata', 'mortadela', 'peito de peru', 'milk', 'cheese', 'yogurt', 'yoghurt', 'butter', 'egg', 'cream cheese', 'sour cream', 'heavy cream', 'cream', 'ham', 'leche', 'queso', 'yogur', 'mantequilla', 'manteca', 'huevo', 'crema', 'jamón', 'jamon']],
  ['padaria', ['pão', 'pao', 'pães', 'paes', 'bolo', 'torrada', 'biscoito', 'bisnaguinha', 'bolacha', 'croissant', 'sonho', 'bread', 'bagel', 'bun', 'rolls', 'toast', 'cookies', 'cookie', 'crackers', 'cake', 'muffin', 'pan', 'pan de molde', 'galletas', 'galleta', 'bizcocho', 'pastel', 'tostadas', 'medialunas', 'bollos']],
  ['hortifruti', ['banana', 'tomate', 'alface', 'cebola', 'alho', 'batata', 'maçã', 'maca', 'laranja', 'limão', 'limao', 'cenoura', 'fruta', 'verdura', 'legume', 'abacate', 'mamão', 'mamao', 'uva', 'morango', 'abobrinha', 'pepino', 'pimentão', 'pimentao', 'brócolis', 'brocolis', 'couve', 'rúcula', 'rucula', 'manga', 'melancia', 'melão', 'melao', 'abacaxi', 'cheiro verde', 'salsinha', 'coentro', 'mandioca', 'apple', 'orange', 'lemon', 'lime', 'tomato', 'lettuce', 'onion', 'garlic', 'potato', 'carrot', 'fruit', 'vegetable', 'avocado', 'grape', 'strawberr', 'cucumber', 'zucchini', 'bell pepper', 'broccoli', 'spinach', 'mango', 'watermelon', 'melon', 'pineapple', 'cilantro', 'parsley', 'celery', 'pear', 'peach', 'berries', 'blueberr', 'manzana', 'naranja', 'limón', 'lima', 'lechuga', 'cebolla', 'ajo', 'papa', 'patata', 'zanahoria', 'palta', 'aguacate', 'fresa', 'frutilla', 'calabacín', 'calabacin', 'pimiento', 'brócoli', 'espinaca', 'sandía', 'sandia', 'melón', 'piña', 'perejil', 'apio', 'pera', 'durazno', 'melocotón']],
  ['bebidas', ['água', 'agua', 'suco', 'refrigerante', 'refri', 'cerveja', 'vinho', 'coca', 'guaraná', 'guarana', 'energético', 'energetico', 'cachaça', 'cachaca', 'chá', 'cha mate', 'water', 'juice', 'soda', 'beer', 'wine', 'coke', 'energy drink', 'tea', 'sparkling water', 'jugo', 'zumo', 'refresco', 'gaseosa', 'cerveza', 'vino', 'té', 'bebida energética', 'agua con gas', 'lemonade', 'limonada', 'orange juice', 'apple juice', 'jugo de naranja', 'zumo de naranja', 'suco de laranja', 'iced tea', 'ice tea']],
  ['mercearia', ['arroz', 'feijão', 'feijao', 'café', 'cafe', 'açúcar', 'acucar', 'óleo', 'oleo', 'azeite', 'macarrão', 'macarrao', 'farinha', 'sal', 'molho', 'aveia', 'granola', 'achocolatado', 'extrato', 'milho', 'ervilha', 'atum', 'sardinha', 'vinagre', 'tempero', 'maionese', 'ketchup', 'mostarda', 'fubá', 'fuba', 'leite condensado', 'chocolate', 'cereal', 'pipoca', 'lentilha', 'grão de bico', 'grao de bico', 'rice', 'beans', 'coffee', 'sugar', 'oil', 'olive oil', 'pasta', 'spaghetti', 'noodles', 'flour', 'salt', 'sauce', 'tomato sauce', 'oats', 'oatmeal', 'tuna', 'sardines', 'vinegar', 'mayo', 'mayonnaise', 'mustard', 'popcorn', 'lentils', 'chickpeas', 'peanut butter', 'honey', 'jam', 'corn', 'canned', 'condensed milk', 'cocoa', 'spices', 'frijoles', 'porotos', 'azúcar', 'azucar', 'aceite', 'aceite de oliva', 'fideos', 'espagueti', 'harina', 'salsa', 'salsa de tomate', 'avena', 'atún', 'atun', 'sardinas', 'mayonesa', 'mostaza', 'palomitas', 'lentejas', 'garbanzos', 'mantequilla de maní', 'mantequilla de mani', 'miel', 'mermelada', 'maíz', 'maiz', 'enlatado', 'leche condensada', 'cacao', 'especias', 'baking soda', 'bicarbonato']],
  ['farmacia', ['remédio', 'remedio', 'dipirona', 'paracetamol', 'curativo', 'band-aid', 'protetor solar', 'vitamina', 'medicine', 'ibuprofen', 'acetaminophen', 'aspirin', 'bandage', 'sunscreen', 'vitamin', 'medicamento', 'medicina', 'ibuprofeno', 'aspirina', 'curita', 'tirita', 'protector solar', 'bloqueador solar']],
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
