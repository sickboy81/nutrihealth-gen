
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
