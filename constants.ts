
import type { Recipe, UserProfile, DailyGoal, CalorieRecord, RecipeType, Achievement, WeightRecord } from './types';

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    name: 'Salada de Quinoa com Frango Grelhado',
    time: '30 min',
    calories: 450,
    difficulty: 'Fácil',
    type: 'Salada',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    ingredients: ['200g de peito de frango', '1 xícara de quinoa cozida', 'Mix de folhas verdes', 'Tomate cereja', 'Pepino', 'Molho de limão e ervas'],
    steps: ['Grelhe o frango até dourar.', 'Em uma tigela, misture a quinoa, as folhas, o tomate e o pepino.', 'Fatie o frango e adicione à salada.', 'Regue com o molho e sirva.'],
    tags: ['High-Protein']
  },
  {
    id: 2,
    name: 'Salmão Assado com Aspargos',
    time: '25 min',
    calories: 550,
    difficulty: 'Fácil',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 postas de salmão', '1 maço de aspargos', 'Azeite de oliva', 'Sal, pimenta e alecrim a gosto', '1 limão siciliano'],
    steps: ['Tempere o salmão e os aspargos com azeite, sal, pimenta e alecrim.', 'Asse em forno pré-aquecido a 200°C por 15-20 minutos.', 'Sirva com fatias de limão.'],
    tags: ['Gluten-Free', 'High-Protein', 'Keto']
  },
  {
    id: 3,
    name: 'Smoothie Verde Detox',
    time: '5 min',
    calories: 180,
    difficulty: 'Fácil',
    type: 'Bebida',
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 folha de couve', '1/2 maçã verde', '1/2 pepino', 'Suco de 1 limão', '150ml de água de coco', 'Gengibre a gosto'],
    steps: ['Bata todos os ingredientes no liquidificador até obter uma mistura homogênea.', 'Sirva imediatamente.'],
    tags: ['Vegan', 'Vegetarian', 'Detox']
  },
  {
    id: 4,
    name: 'Omelete de Espinafre e Queijo Branco',
    time: '10 min',
    calories: 320,
    difficulty: 'Fácil',
    type: 'Café da Manhã',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 ovos', '1 xícara de espinafre fresco', '50g de queijo branco ou cottage', 'Sal e pimenta a gosto', '1 fio de azeite'],
    steps: ['Bata os ovos com sal e pimenta.', 'Refogue o espinafre rapidamente no azeite.', 'Despeje os ovos e adicione o queijo.', 'Dobre e sirva quando dourar.'],
    tags: ['Vegetarian', 'High-Protein', 'Keto']
  },
  {
    id: 5,
    name: 'Sopa de Abóbora com Gengibre',
    time: '40 min',
    calories: 250,
    difficulty: 'Médio',
    type: 'Sopa',
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a98c095ea?q=80&w=800&auto=format&fit=crop',
    ingredients: ['500g de abóbora cabotiá', '1 cebola picada', '1 pedaço de gengibre ralado', '500ml de caldo de legumes', 'Azeite', 'Salsinha para decorar'],
    steps: ['Refogue a cebola e o gengibre no azeite.', 'Adicione a abóbora em cubos e o caldo.', 'Cozinhe até a abóbora amolecer.', 'Bata no liquidificador e sirva.'],
    tags: ['Vegan', 'Vegetarian', 'Gluten-Free']
  },
  {
    id: 6,
    name: 'Crepioca de Frango Cremoso',
    time: '15 min',
    calories: 380,
    difficulty: 'Fácil',
    type: 'Lanche',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a2750?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 ovo', '2 colheres de goma de tapioca', '100g de frango desfiado', '1 colher de requeijão light', 'Sal a gosto'],
    steps: ['Misture o ovo e a tapioca e faça um disco na frigideira.', 'Recheie com o frango misturado com requeijão.', 'Dobre ao meio e deixe dourar.'],
    tags: ['High-Protein']
  },
  {
    id: 7,
    name: 'Poke Bowl de Atum',
    time: '20 min',
    calories: 480,
    difficulty: 'Médio',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    ingredients: ['100g de atum fresco em cubos', '1/2 xícara de arroz gohan ou integral', 'Abacate fatiado', 'Pepino', 'Manga', 'Gergelim e Shoyu Light'],
    steps: ['Monte o bowl com o arroz na base.', 'Disponha o atum, abacate, pepino e manga por cima.', 'Finalize com gergelim e shoyu.'],
    tags: ['Pescetarian', 'High-Protein']
  },
  {
    id: 8,
    name: 'Mingau de Aveia com Frutas Vermelhas',
    time: '10 min',
    calories: 290,
    difficulty: 'Fácil',
    type: 'Café da Manhã',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800&auto=format&fit=crop',
    ingredients: ['3 colheres de aveia em flocos', '200ml de leite vegetal ou desnatado', '1 colher de mel', 'Morangos e Mirtilos'],
    steps: ['Cozinhe a aveia com o leite até engrossar.', 'Adoce com mel.', 'Sirva com as frutas por cima.'],
    tags: ['Vegetarian']
  },
  {
    id: 9,
    name: 'Espaguete de Abobrinha à Bolonhesa',
    time: '25 min',
    calories: 350,
    difficulty: 'Médio',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1626844131082-256783844137?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 abobrinhas fatiadas em tiras', '200g de carne moída magra', '1 lata de tomate pelado', 'Alho e cebola', 'Manjericão'],
    steps: ['Refogue a carne com alho e cebola.', 'Adicione o tomate e cozinhe o molho.', 'Refogue rapidamente a abobrinha e sirva com o molho por cima.'],
    tags: ['Low-Carb', 'Gluten-Free']
  },
  {
    id: 10,
    name: 'Moqueca Vegana de Banana da Terra',
    time: '45 min',
    calories: 420,
    difficulty: 'Médio',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 bananas da terra maduras', '200ml de leite de coco', 'Pimentões coloridos', 'Tomate', 'Cebola', 'Azeite de dendê (opcional)', 'Coentro'],
    steps: ['Em uma panela, faça camadas com os vegetais e a banana em rodelas.', 'Adicione o leite de coco e tempere.', 'Cozinhe em fogo baixo por 20 min.'],
    tags: ['Vegan', 'Vegetarian', 'Gluten-Free']
  },
  {
    id: 11,
    name: 'Panqueca de Banana Fit',
    time: '10 min',
    calories: 220,
    difficulty: 'Fácil',
    type: 'Café da Manhã',
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 banana madura amassada', '1 ovo', '1 colher de aveia', 'Canela a gosto'],
    steps: ['Misture todos os ingredientes em um bowl.', 'Despeje em uma frigideira antiaderente untada.', 'Doure dos dois lados e sirva.'],
    tags: ['Vegetarian', 'Gluten-Free']
  },
  {
    id: 12,
    name: 'Salada Caprese no Pote',
    time: '10 min',
    calories: 280,
    difficulty: 'Fácil',
    type: 'Salada',
    image: 'https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Tomates cereja', 'Mussarela de búfala', 'Folhas de manjericão', 'Azeite de oliva', 'Aceto balsâmico'],
    steps: ['Intercale os tomates, o queijo e o manjericão.', 'Tempere com azeite e balsâmico.', 'Ótimo para levar de marmita.'],
    tags: ['Vegetarian', 'Gluten-Free']
  },
  {
    id: 13,
    name: 'Lasanha de Berinjela',
    time: '50 min',
    calories: 320,
    difficulty: 'Médio',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1574868235863-236369e9928c?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 berinjelas grandes fatiadas', '500g de carne moída ou lentilha (veg)', 'Molho de tomate', 'Queijo mussarela light', 'Queijo parmesão'],
    steps: ['Grelhe as fatias de berinjela.', 'Monte camadas de berinjela, molho e queijo em um refratário.', 'Gratine no forno por 20 min.'],
    tags: ['Low-Carb', 'Gluten-Free']
  },
  {
    id: 14,
    name: 'Iogurte com Granola Caseira',
    time: '5 min',
    calories: 250,
    difficulty: 'Fácil',
    type: 'Lanche',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 pote de iogurte natural', '1/2 xícara de granola sem açúcar', '1 colher de mel', 'Frutas picadas'],
    steps: ['Coloque o iogurte em uma tigela.', 'Cubra com granola, frutas e mel.'],
    tags: ['Vegetarian']
  },
  {
    id: 15,
    name: 'Strogonoff de Grão de Bico',
    time: '30 min',
    calories: 380,
    difficulty: 'Médio',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1511690656952-34342d2c7135?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 xícaras de grão de bico cozido', '1 lata de creme de leite light ou creme de soja', 'Molho de tomate', 'Champignon', 'Mostarda e Ketchup'],
    steps: ['Refogue o grão de bico com temperos.', 'Adicione o molho de tomate, mostarda e ketchup.', 'Finalize com o creme de leite e champignon.'],
    tags: ['Vegan', 'Vegetarian']
  },
  {
    id: 16,
    name: 'Suco Verde Energizante',
    time: '5 min',
    calories: 120,
    difficulty: 'Fácil',
    type: 'Bebida',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 folhas de couve', '1 laranja', '1 pedaço de gengibre', '200ml de água'],
    steps: ['Bata tudo no liquidificador.', 'Coe se preferir e sirva gelado.'],
    tags: ['Vegan', 'Detox']
  },
  {
    id: 17,
    name: 'Wrap de Atum e Folhas',
    time: '10 min',
    calories: 350,
    difficulty: 'Fácil',
    type: 'Lanche',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 pão folha integral (rap10)', '1/2 lata de atum', 'Alface americana', 'Cenoura ralada', 'Requeijão light'],
    steps: ['Passe o requeijão no pão.', 'Adicione o atum, alface e cenoura.', 'Enrole como um wrap.'],
    tags: ['High-Protein']
  },
  {
    id: 18,
    name: 'Risoto de Quinoa com Cogumelos',
    time: '35 min',
    calories: 400,
    difficulty: 'Médio',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 xícara de quinoa', '200g de cogumelos variados (shimeji/shitake)', 'Caldo de legumes', 'Vinho branco (opcional)', 'Queijo parmesão'],
    steps: ['Refogue os cogumelos e reserve.', 'Cozinhe a quinoa no caldo como um risoto.', 'Misture os cogumelos e finalize com queijo.'],
    tags: ['Vegetarian', 'Gluten-Free']
  },
  {
    id: 19,
    name: 'Abacate Recheado com Ovo',
    time: '20 min',
    calories: 350,
    difficulty: 'Fácil',
    type: 'Café da Manhã',
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1/2 abacate maduro', '1 ovo pequeno', 'Sal, pimenta e cebolinha'],
    steps: ['Retire um pouco da polpa do abacate para caber o ovo.', 'Quebre o ovo dentro da cavidade.', 'Asse por 15 min até a clara firmar.'],
    tags: ['Vegetarian', 'Keto', 'Low-Carb']
  },
  {
    id: 20,
    name: 'Chá de Hibisco com Limão',
    time: '5 min',
    calories: 10,
    difficulty: 'Fácil',
    type: 'Bebida',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 colher de flores de hibisco secas', '500ml de água quente', 'Limão espremido'],
    steps: ['Faça a infusão do hibisco na água quente por 5 min.', 'Coe, adicione limão e sirva quente ou gelado.'],
    tags: ['Vegan', 'Detox', 'Sugar-Free']
  },
  {
    id: 21,
    name: 'Tacos de Alface com Carne',
    time: '20 min',
    calories: 300,
    difficulty: 'Fácil',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1623428187298-28b517b3c769?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Folhas grandes de alface americana', '300g de carne moída refogada', 'Vinagrete', 'Queijo ralado'],
    steps: ['Use as folhas de alface como "conchas" de taco.', 'Recheie com a carne e o vinagrete.', 'Salpique queijo por cima.'],
    tags: ['Low-Carb', 'Gluten-Free']
  },
  {
    id: 22,
    name: 'Overnight Oats (Aveia Dormida)',
    time: '5 min',
    calories: 300,
    difficulty: 'Fácil',
    type: 'Café da Manhã',
    image: 'https://images.unsplash.com/photo-1646328742397-2402e09e700a?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1/2 xícara de aveia', '1/2 xícara de leite', '1 colher de chia', 'Mel e frutas'],
    steps: ['Misture a aveia, leite e chia em um pote.', 'Deixe na geladeira durante a noite.', 'Consuma na manhã seguinte com frutas.'],
    tags: ['Vegetarian']
  },
  {
    id: 23,
    name: 'Sopa de Legumes com Frango',
    time: '40 min',
    calories: 280,
    difficulty: 'Fácil',
    type: 'Sopa',
    image: 'https://images.unsplash.com/photo-1547592166-23acbe3b624b?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Cenoura, batata, chuchu em cubos', '300g de peito de frango em cubos', 'Caldo de galinha caseiro', 'Macarrão integral (opcional)', 'Salsinha para decorar'],
    steps: ['Cozinhe o frango e os legumes no caldo.', 'Deixe apurar até os legumes ficarem macios.', 'Acerte o sal e sirva.'],
    tags: ['High-Protein']
  },
  {
    id: 24,
    name: 'Chips de Batata Doce Assada',
    time: '30 min',
    calories: 150,
    difficulty: 'Fácil',
    type: 'Lanche',
    image: 'https://images.unsplash.com/photo-1576024267263-70f1caffd6fe?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 batata doce grande', 'Azeite', 'Sal e alecrim'],
    steps: ['Fatie a batata bem fina (mandolin ajuda).', 'Distribua em uma assadeira, regue com azeite e temperos.', 'Asse até ficar crocante.'],
    tags: ['Vegan', 'Gluten-Free']
  },
  {
    id: 25,
    name: 'Macarrão Integral com Pesto',
    time: '20 min',
    calories: 450,
    difficulty: 'Fácil',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop',
    ingredients: ['200g de macarrão integral', 'Molho pesto (manjericão, azeite, nozes, queijo)', 'Tomatinhos cereja'],
    steps: ['Cozinhe o macarrão al dente.', 'Misture com o molho pesto.', 'Adicione os tomatinhos frescos.'],
    tags: ['Vegetarian']
  },
  {
    id: 26,
    name: 'Sanduíche Natural de Frango',
    time: '10 min',
    calories: 320,
    difficulty: 'Fácil',
    type: 'Lanche',
    image: 'https://images.unsplash.com/photo-1550507992-eb63facee732?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 fatias de pão integral', 'Pasta de frango (frango desfiado, ricota, cenoura)', 'Alface e tomate'],
    steps: ['Espalhe a pasta de frango no pão.', 'Adicione a salada.', 'Feche o sanduíche e corte ao meio.'],
    tags: ['High-Protein']
  },
  {
    id: 27,
    name: 'Gelatina Colorida com Iogurte',
    time: '15 min',
    calories: 100,
    difficulty: 'Fácil',
    type: 'Lanche',
    image: 'https://images.unsplash.com/photo-1542367578-6a332547d112?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Gelatina zero açúcar de sabores variados', 'Iogurte natural'],
    steps: ['Prepare as gelatinas e corte em cubos.', 'Misture com o iogurte natural para um creme colorido.'],
    tags: ['Low-Calorie']
  },
  {
    id: 28,
    name: 'Peixe ao Molho de Camarão',
    time: '40 min',
    calories: 500,
    difficulty: 'Difícil',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a2750?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Filé de tilápia', 'Camarões limpos', 'Molho de tomate', 'Leite de coco', 'Pimentões'],
    steps: ['Grelhe o peixe.', 'Faça um molho com os camarões, leite de coco e temperos.', 'Sirva o molho sobre o peixe.'],
    tags: ['High-Protein', 'Pescetarian']
  },
  {
    id: 29,
    name: 'Escondidinho de Batata Doce',
    time: '45 min',
    calories: 420,
    difficulty: 'Médio',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=800&auto=format&fit=crop',
    ingredients: ['500g de batata doce cozida e amassada', '400g de carne moída refogada', 'Queijo ralado'],
    steps: ['Faça um purê com a batata doce.', 'Em um refratário, coloque a carne e cubra com o purê.', 'Polvilhe queijo e gratine.'],
    tags: ['Gluten-Free', 'High-Protein']
  },
  {
    id: 30,
    name: 'Água Aromatizada de Limão e Hortelã',
    time: '2 min',
    calories: 5,
    difficulty: 'Fácil',
    type: 'Bebida',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 litro de água gelada', 'Rodelas de limão', 'Ramos de hortelã fresca'],
    steps: ['Coloque tudo em uma jarra.', 'Deixe descansar por 30 min antes de servir.'],
    tags: ['Vegan', 'Detox', 'Sugar-Free']
  },
  {
    id: 31,
    name: 'Bowl de Açaí com Granola',
    time: '5 min',
    calories: 350,
    difficulty: 'Fácil',
    type: 'Café da Manhã',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
    ingredients: ['200g de polpa de açaí', '1 banana', 'Granola sem açúcar', 'Mirtilos', 'Mel'],
    steps: ['Bata o açaí com a banana.', 'Sirva em uma tigela com granola, mirtilos e mel por cima.'],
    tags: ['Vegetarian', 'Gluten-Free']
  },
  {
    id: 32,
    name: 'Frango Grelhado com Purê de Batata Doce',
    time: '35 min',
    calories: 480,
    difficulty: 'Fácil',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop',
    ingredients: ['300g de peito de frango', '2 batatas doces médias', 'Azeite', 'Alecrim', 'Sal e pimenta'],
    steps: ['Cozinhe e amasse as batatas doces.', 'Grelhe o frango temperado com alecrim.', 'Sirva o purê com o frango por cima.'],
    tags: ['High-Protein', 'Gluten-Free']
  },
  {
    id: 33,
    name: 'Salada de Grão de Bico e Rúcula',
    time: '15 min',
    calories: 320,
    difficulty: 'Fácil',
    type: 'Salada',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 xícara de grão de bico cozido', 'Rúcula fresca', 'Tomate cereja', 'Cebola roxa', 'Azeite e limão'],
    steps: ['Misture o grão de bico com os vegetais.', 'Tempere com azeite, limão e sal.', 'Sirva fresca.'],
    tags: ['Vegan', 'Vegetarian', 'High-Protein']
  },
  {
    id: 34,
    name: 'Smoothie de Morango e Banana',
    time: '5 min',
    calories: 200,
    difficulty: 'Fácil',
    type: 'Bebida',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 xícara de morangos', '1 banana', '200ml de leite ou iogurte', 'Mel'],
    steps: ['Bata todos os ingredientes no liquidificador.', 'Sirva gelado.'],
    tags: ['Vegetarian']
  },
  {
    id: 35,
    name: 'Quiche de Espinafre sem Massa',
    time: '45 min',
    calories: 280,
    difficulty: 'Médio',
    type: 'Café da Manhã',
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=800&auto=format&fit=crop',
    ingredients: ['4 ovos', '200g de espinafre', '100g de queijo cottage', 'Cebola', 'Sal e pimenta'],
    steps: ['Refogue o espinafre com cebola.', 'Misture com ovos e queijo.', 'Asse em forminhas por 25 min.'],
    tags: ['Vegetarian', 'Low-Carb', 'Gluten-Free']
  },
  {
    id: 36,
    name: 'Ceviche de Tilápia',
    time: '30 min',
    calories: 220,
    difficulty: 'Médio',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop',
    ingredients: ['300g de tilápia em cubos', 'Suco de 3 limões', 'Cebola roxa', 'Coentro', 'Pimenta dedo de moça'],
    steps: ['Marine o peixe no suco de limão por 20 min.', 'Adicione cebola, coentro e pimenta.', 'Sirva com batata doce cozida.'],
    tags: ['High-Protein', 'Gluten-Free', 'Low-Carb']
  },
  {
    id: 37,
    name: 'Sopa Cremosa de Brócolis',
    time: '25 min',
    calories: 180,
    difficulty: 'Fácil',
    type: 'Sopa',
    image: 'https://images.unsplash.com/photo-1547592166-23acbe3b624b?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 maço de brócolis', '1 cebola', 'Caldo de legumes', 'Leite de coco', 'Noz moscada'],
    steps: ['Cozinhe o brócolis e a cebola no caldo.', 'Bata no liquidificador.', 'Adicione leite de coco e tempere.'],
    tags: ['Vegan', 'Vegetarian', 'Gluten-Free']
  },
  {
    id: 38,
    name: 'Tapioca com Ovo e Queijo',
    time: '10 min',
    calories: 250,
    difficulty: 'Fácil',
    type: 'Café da Manhã',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a2750?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 colheres de goma de tapioca', '1 ovo', 'Queijo mussarela', 'Tomate e orégano'],
    steps: ['Faça a tapioca na frigideira.', 'Adicione ovo mexido e queijo.', 'Finalize com tomate e orégano.'],
    tags: ['Vegetarian', 'Gluten-Free']
  },
  {
    id: 39,
    name: 'Hambúrguer de Grão de Bico',
    time: '40 min',
    calories: 380,
    difficulty: 'Médio',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 xícara de grão de bico cozido', 'Cebola e alho', 'Farinha de aveia', 'Temperos', 'Pão integral'],
    steps: ['Amasse o grão de bico e misture com temperos.', 'Forme hambúrgueres e grelhe.', 'Sirva no pão com salada.'],
    tags: ['Vegan', 'Vegetarian', 'High-Protein']
  },
  {
    id: 40,
    name: 'Salada de Couve com Laranja',
    time: '10 min',
    calories: 150,
    difficulty: 'Fácil',
    type: 'Salada',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 maço de couve', '2 laranjas', 'Nozes', 'Azeite e limão', 'Sal'],
    steps: ['Massageie a couve com sal até amolecer.', 'Adicione laranja em gomos e nozes.', 'Tempere com azeite e limão.'],
    tags: ['Vegan', 'Vegetarian', 'Gluten-Free']
  },
  {
    id: 41,
    name: 'Frango ao Curry com Arroz Integral',
    time: '35 min',
    calories: 520,
    difficulty: 'Médio',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800&auto=format&fit=crop',
    ingredients: ['400g de peito de frango', 'Leite de coco', 'Curry em pó', 'Cebola e alho', 'Arroz integral'],
    steps: ['Refogue o frango com cebola e alho.', 'Adicione curry e leite de coco.', 'Cozinhe até engrossar e sirva com arroz.'],
    tags: ['High-Protein', 'Gluten-Free']
  },
  {
    id: 42,
    name: 'Pudim de Chia com Frutas',
    time: '10 min',
    calories: 180,
    difficulty: 'Fácil',
    type: 'Lanche',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
    ingredients: ['3 colheres de chia', '200ml de leite de coco', 'Mel', 'Frutas vermelhas'],
    steps: ['Misture chia, leite e mel.', 'Deixe na geladeira por 2 horas.', 'Sirva com frutas por cima.'],
    tags: ['Vegan', 'Vegetarian', 'Gluten-Free']
  },
  {
    id: 43,
    name: 'Ratatouille',
    time: '50 min',
    calories: 200,
    difficulty: 'Médio',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Berinjela', 'Abobrinha', 'Tomate', 'Pimentão', 'Cebola', 'Alho', 'Azeite e ervas'],
    steps: ['Corte os vegetais em rodelas.', 'Monte em camadas em um refratário.', 'Asse por 40 min com ervas.'],
    tags: ['Vegan', 'Vegetarian', 'Gluten-Free']
  },
  {
    id: 44,
    name: 'Chá Verde com Gengibre',
    time: '5 min',
    calories: 2,
    difficulty: 'Fácil',
    type: 'Bebida',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 sachê de chá verde', '1 pedaço de gengibre', '500ml de água quente', 'Limão'],
    steps: ['Faça a infusão do chá com gengibre.', 'Deixe por 5 minutos.', 'Adicione limão e sirva.'],
    tags: ['Vegan', 'Detox', 'Sugar-Free']
  },
  {
    id: 45,
    name: 'Torta de Frango Fit',
    time: '50 min',
    calories: 350,
    difficulty: 'Médio',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Massa de batata doce', 'Frango desfiado', 'Cenoura e ervilha', 'Requeijão light'],
    steps: ['Faça a massa com batata doce.', 'Recheie com frango e legumes.', 'Asse até dourar.'],
    tags: ['High-Protein', 'Gluten-Free']
  },
  {
    id: 46,
    name: 'Salada de Atum com Feijão Branco',
    time: '15 min',
    calories: 320,
    difficulty: 'Fácil',
    type: 'Salada',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 lata de atum', '1 xícara de feijão branco', 'Cebola roxa', 'Azeite e limão', 'Salsinha'],
    steps: ['Misture o atum com o feijão.', 'Adicione cebola e salsinha.', 'Tempere com azeite e limão.'],
    tags: ['High-Protein', 'Gluten-Free']
  },
  {
    id: 47,
    name: 'Panqueca Americana Integral',
    time: '15 min',
    calories: 280,
    difficulty: 'Fácil',
    type: 'Café da Manhã',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 xícara de farinha integral', '1 ovo', 'Leite', 'Fermento', 'Mel e frutas'],
    steps: ['Misture os ingredientes secos e úmidos.', 'Frite as panquecas em frigideira.', 'Sirva com mel e frutas.'],
    tags: ['Vegetarian']
  },
  {
    id: 48,
    name: 'Espetinho de Frango e Vegetais',
    time: '30 min',
    calories: 300,
    difficulty: 'Fácil',
    type: 'Prato Principal',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Cubos de frango', 'Pimentões coloridos', 'Cebola', 'Abobrinha', 'Temperos'],
    steps: ['Espete frango e vegetais alternados.', 'Tempere e grelhe.', 'Sirva com arroz ou salada.'],
    tags: ['High-Protein', 'Gluten-Free']
  },
  {
    id: 49,
    name: 'Sopa de Lentilha',
    time: '40 min',
    calories: 280,
    difficulty: 'Fácil',
    type: 'Sopa',
    image: 'https://images.unsplash.com/photo-1547592166-23acbe3b624b?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 xícara de lentilha', 'Cenoura e cebola', 'Caldo de legumes', 'Cominho', 'Coentro'],
    steps: ['Refogue os vegetais.', 'Adicione lentilha e caldo.', 'Cozinhe até a lentilha amolecer.'],
    tags: ['Vegan', 'Vegetarian', 'High-Protein']
  },
  {
    id: 50,
    name: 'Biscoito de Aveia e Banana',
    time: '20 min',
    calories: 120,
    difficulty: 'Fácil',
    type: 'Lanche',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 bananas maduras', '1 xícara de aveia', 'Canela', 'Gotas de chocolate 70%'],
    steps: ['Amasse as bananas e misture com aveia.', 'Adicione canela e chocolate.', 'Asse por 15 min.'],
    tags: ['Vegetarian', 'Gluten-Free']
  }
];

export let MOCK_USER_PROFILE: UserProfile = {
  name: 'Alex',
  age: 28,
  height: 175,
  weight: 72,
  bmi: 23.5,
  dietaryPreference: 'Omnivore',
  gender: 'male',
  activityLevel: 'moderate',
  objective: 'maintain',
  takesMultivitamin: false 
};

export const updateUserProfile = (newProfile: UserProfile) => {
    MOCK_USER_PROFILE = newProfile;
};

export const MOCK_DAILY_GOALS: DailyGoal = {
    calories: { current: 1850, target: 2200 },
    protein: { current: 110, target: 140 },
    carbs: { current: 200, target: 250 },
    fat: { current: 60, target: 70 },
    water: { current: 1200, target: 2500 },
    supplementTaken: false, 
    vitaminC: { current: 45, target: 90 }, 
    vitaminD: { current: 200, target: 600 }, 
    iron: { current: 8, target: 18 }, 
    calcium: { current: 600, target: 1000 }, 
    magnesium: { current: 200, target: 400 }, 
    vitaminA: { current: 400, target: 900 }, 
    vitaminB12: { current: 1.5, target: 2.4 }, 
    potassium: { current: 2000, target: 3500 }, 
    sodium: { current: 1500, target: 2300 }, 
    zinc: { current: 5, target: 11 }, 
};

export const MOCK_CALORIE_HISTORY: CalorieRecord[] = (() => {
    const records: CalorieRecord[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        records.push({
            date: date.toISOString().split('T')[0],
            kcal: 1800 + Math.floor(Math.random() * 600)
        });
    }
    return records;
})();

export const MOCK_FREQUENT_FOODS = ['Frango Grelhado', 'Brócolis', 'Arroz Integral', 'Salmão', 'Ovos'];

export const MOCK_WEIGHT_HISTORY: WeightRecord[] = (() => {
    const records: WeightRecord[] = [];
    const today = new Date();
    for (let i = 12; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - (i * 7));
        records.push({
            date: date.toISOString().split('T')[0],
            weight: 74 - (Math.random() * 2)
        });
    }
    return records;
})();

export const ACHIEVEMENTS_LIST: Achievement[] = [
    {
        id: 'hydration_master',
        titleKey: 'gamification.badges.hydrationMaster',
        descKey: 'gamification.badges.hydrationMasterDesc',
        icon: 'water',
        condition: (goals: DailyGoal) => goals.water.current >= goals.water.target
    },
    {
        id: 'protein_pro',
        titleKey: 'gamification.badges.proteinPro',
        descKey: 'gamification.badges.proteinProDesc',
        icon: 'fire',
        condition: (goals: DailyGoal) => goals.protein.current >= goals.protein.target
    },
    {
        id: 'vitamin_boost',
        titleKey: 'gamification.badges.vitaminBoost',
        descKey: 'gamification.badges.vitaminBoostDesc',
        icon: 'trophy',
        condition: (goals: DailyGoal) => goals.supplementTaken === true
    },
    {
        id: 'active_life',
        titleKey: 'gamification.badges.activeLife',
        descKey: 'gamification.badges.activeLifeDesc',
        icon: 'trophy',
        condition: (_: any, activityCount: number) => activityCount >= 1
    }
];
