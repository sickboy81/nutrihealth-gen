
const translations = {
  pt: {
    nav: {
      dashboard: "Dashboard",
      nutriscan: "NutriScan",
      plan: "Plano",
      recipes: "Receitas",
      chat: "{name}"
    },
    header: {
      dashboard: "Dashboard",
      nutriscan: "NutriScan",
      recipes: "Receitas",
      healthPlan: "Plano de Saúde",
      settings: "Configurações",
      chat: "{name} - Nutri IA",
      default: "NutriHealth Gen"
    },
    dashboard: {
      greeting: "Olá, {name}!",
      subtitle: "Aqui está o resumo da sua jornada.",
      weight: "Peso",
      height: "Altura",
      bmi: "IMC",
      dailyGoals: "Metas Diárias",
      caloriesOf: "de {target} kcal",
      netCalories: "Saldo Líquido",
      eaten: "Ingerido",
      burned: "Queimado",
      protein: "Proteínas",
      carbs: "Carboidratos",
      fats: "Gorduras",
      calorieHistory: "Histórico de Calorias",
      frequentFoods: "Alimentos Frequentes",
      water: "Hidratação",
      waterOf: "de {target} ml",
      addGlass: "+250ml",
      addCup: "+300ml",
      addBottle: "+500ml",
      level: "Nível {level}",
      xp: "{current} / {next} XP",
      mood: {
          title: "Como você está se sentindo?",
          great: "Ótimo!",
          good: "Bem",
          okay: "Ok",
          tired: "Cansado",
          stressed: "Estressado",
          logged: "Humor registrado!"
      },
      sleep: {
          title: "Monitor de Sono",
          log: "Registrar Sono",
          duration: "Duração (horas)",
          quality: "Qualidade",
          qualities: {
              poor: "Ruim",
              fair: "Regular",
              good: "Bom",
              excellent: "Excelente"
          },
          logged: "Sono registrado!",
          average: "Média Semanal: {hours}h"
      },
      fasting: {
        title: "Jejum Intermitente",
        start: "Iniciar Jejum",
        end: "Terminar Jejum",
        elapsed: "Tempo Decorrido",
        goal: "Meta",
        startedAt: "Iniciado às",
        endsAt: "Termina às",
        protocolLabel: "Protocolo",
        selectProtocol: "Selecione o protocolo"
      },
      micros: {
        title: "Vitaminas & Minerais",
        takeVitamin: "Tomar Multivitamínico",
        vitaminReminder: "Lembrete Diário",
        didYouTake: "Você tomou seu multivitamínico hoje?",
        taken: "Tomado!",
        notTaken: "Marcar como tomado",
        vitaminC: "Vitamina C",
        vitaminD: "Vitamina D",
        iron: "Ferro",
        calcium: "Cálcio",
        magnesium: "Magnésio",
        vitaminA: "Vitamina A",
        vitaminB12: "Vitamina B12",
        potassium: "Potássio",
        sodium: "Sódio",
        zinc: "Zinco"
      },
      activity: {
          title: "Atividade Física",
          log: "Registrar",
          selectActivity: "Selecione a atividade",
          placeholderName: "Nome da atividade",
          placeholderCal: "kcal",
          placeholderDur: "min",
          todayLog: "Hoje",
          types: {
            custom: "Outro / Personalizado",
            walking: "Caminhada (Leve)",
            running: "Corrida",
            cycling: "Ciclismo",
            weights: "Musculação",
            yoga: "Yoga / Alongamento",
            swimming: "Natação",
            hiit: "HIIT / Crossfit",
            sports: "Esportes (Futebol/Vôlei)"
          }
      },
      challenge: {
          title: "Desafio 30 Dias",
          start: "Gerar Desafio 30 Dias",
          generating: "Criando seu desafio...",
          day: "Dia {day}",
          complete: "Marcar como Concluído",
          completed: "Tarefa Concluída!",
          error: "Erro ao gerar desafio."
      }
    },
    gamification: {
        levelUp: "Subiu de Nível!",
        achievementUnlocked: "Conquista Desbloqueada!",
        badges: {
            hydrationMaster: "Rei da Hidratação",
            hydrationMasterDesc: "Atingiu a meta de água diária.",
            proteinPro: "Monstro da Proteína",
            proteinProDesc: "Bateu a meta de proteínas.",
            vitaminBoost: "Boost de Imunidade",
            vitaminBoostDesc: "Tomou o multivitamínico.",
            activeLife: "Vida Ativa",
            activeLifeDesc: "Registrou uma atividade física."
        }
    },
    nutriscan: {
      description: "Tire uma foto do seu prato, embalagem ou código de barras. A IA detecta os nutrientes automaticamente!",
      uploadPrompt: "Foto do Prato ou Código de Barras",
      uploadHint: "Suporta rótulos e embalagens",
      changePhoto: "Trocar Foto",
      analyze: "Analisar",
      analyzing: "Lendo rótulo/alimento...",
      analysisError: "Falha ao analisar. Tente uma foto mais nítida do rótulo ou prato.",
      analysisResults: "Resultados da Análise",
      totalCalories: "Calorias Estimadas",
      protein: "Proteínas",
      carbs: "Carbs",
      fats: "Gorduras",
      identifiedFoods: "Item Identificado:",
      addToLog: "Adicionar ao Diário",
      addedToLog: "Adicionado!",
      servingSize: "Porção"
    },
    recipes: {
      searchPlaceholder: "Buscar por nome...",
      ingredients: "Ingredientes",
      steps: "Modo de Preparo",
      saveButton: 'Salvar',
      savedButton: 'Salvo',
      showSavedFilter: 'Mostrar apenas salvas',
      regenerateImage: "✨ Gerar Nova Imagem IA",
      regeneratingImage: "Criando imagem...",
      difficulty: {
          "Fácil": "Fácil",
          "Médio": "Médio",
          "Difícil": "Difícil"
      },
      generator: {
        title: "Gerar receita com seus ingredientes",
        placeholder: "Ex: frango, arroz, tomate...",
        button: "Gerar Receita",
        generatingButton: "Gerando...",
        error: "Falha ao gerar a receita. Tente novamente."
      },
      filters: {
        title: "Filtros",
        clear: "Limpar Filtros",
        noResults: "Nenhuma receita encontrada com os filtros selecionados.",
        difficulty: {
          label: "Dificuldade",
          all: "Todas"
        },
        time: {
          label: "Tempo de Preparo",
          any: "Qualquer",
          upTo15: "Até 15 min",
          upTo30: "Até 30 min"
        },
        calories: {
          label: "Calorias",
          any: "Qualquer",
          upTo300: "Até 300 kcal",
          between300_500: "300-500 kcal",
          over500: "Mais de 500 kcal"
        },
        type: {
          label: "Tipo de Prato",
          all: "Todos",
          "Salada": "Salada",
          "Prato Principal": "Prato Principal",
          "Bebida": "Bebida",
          "Café da Manhã": "Café da Manhã",
          "Sopa": "Sopa",
          "Lanche": "Lanche"
        },
        diet: {
          label: "Dieta",
          all: "Todos",
          vegan: "Vegano",
          vegetarian: "Vegetariano",
          omnivore: "Onívoro"
        }
      }
    },
    healthPlan: {
      formTitle: "Gerar Plano Alimentar",
      goalLabel: "Seu objetivo principal",
      goalOptions: {
        lose: "Perder Peso",
        maintain: "Manter Peso",
        gain: "Ganhar Massa Muscular"
      },
      caloriesLabel: "Meta de Calorias (kcal)",
      restrictionsLabel: "Restrições Alimentares",
      restrictionsPlaceholder: "Ex: sem glúten, sem lactose...",
      generateButton: "Gerar Plano Alimentar",
      generatingButton: "Gerando Plano...",
      generationError: "Falha ao gerar o plano. Por favor, tente novamente.",
      regenerationError: "Falha ao substituir a refeição. Tente novamente.",
      replaceMeal: "Substituir refeição",
      savePlan: "Salvar Plano",
      planSaved: "Plano Salvo!",
      planTitle: "Seu Plano Semanal",
      days: {
        monday: "Segunda",
        tuesday: "Terça",
        wednesday: "Quarta",
        thursday: "Quinta",
        friday: "Sexta",
        saturday: "Sábado",
        sunday: "Domingo"
      },
      dayShort: {
          monday: "Seg",
          tuesday: "Ter",
          wednesday: "Qua",
          thursday: "Qui",
          friday: "Sex",
          saturday: "Sáb",
          sunday: "Dom"
      },
      meals: {
          breakfast: "Café da Manhã",
          lunch: "Almoço",
          dinner: "Jantar"
      },
      viewRecipe: "Ver Receita",
      totalCalories: "Total estimado para o dia:",
      emptyStateTitle: "Crie seu plano alimentar personalizado",
      emptyStateDescription: "Preencha suas metas e restrições acima para que a IA gere um plano semanal feito para você.",
      shoppingList: {
          button: "Lista de Compras Inteligente",
          title: "Lista de Compras",
          generating: "Gerando lista...",
          generateError: "Erro ao gerar lista.",
          empty: "Gere um plano primeiro para criar a lista."
      }
    },
    settings: {
      title: "Editar Perfil",
      preferencesTitle: "Preferências do App",
      enableGamification: "Ativar Gamificação (XP e Níveis)",
      enableChallenges: "Ativar Desafios 30 Dias",
      nameLabel: "Nome",
      ageLabel: "Idade",
      weightLabel: "Peso (kg)",
      heightLabel: "Altura (cm)",
      bmiLabel: "IMC (Índice de Masa Corporal)",
      saveButton: "Salvar Alterações",
      savingButton: "Salvando...",
      saveSuccess: "Perfil atualizado com sucesso!",
      language: "Idioma",
      assistant: "Assistente IA",
      dietLabel: "Preferência Alimentar",
      genderLabel: "Gênero",
      activityLabel: "Nível de Atividade",
      objectiveLabel: "Objetivo Principal",
      multivitaminLabel: "Tomo multivitamínico diariamente",
      genders: {
          male: "Masculino",
          female: "Feminino"
      },
      activityLevels: {
          sedentary: "Sedentário",
          light: "Levemente Ativo",
          moderate: "Moderadamente Ativo",
          active: "Muito Ativo",
          very_active: "Extremamente Ativo"
      },
      objectives: {
          lose_weight: "Perder Peso (-500kcal)",
          maintain: "Manter Peso",
          gain_muscle: "Ganhar Massa (+300kcal)"
      },
      diets: {
        Omnivore: "Onívoro (Tudo)",
        Vegetarian: "Vegetariano",
        Vegan: "Vegan"
      },
      exportButton: "Exportar Dados (PDF)",
      includeRecipesInPdf: "Incluir receitas salvas no PDF",
      includeHealthPlanInPdf: "Incluir plano alimentar no PDF",
      goalsTitle: "Metas Nutricionais (Macros)",
      microsTitle: "Metas de Micronutrientes",
      waterGoalLabel: "Meta de Água (ml)",
      calorieGoalLabel: "Meta de Calorias (kcal)",
      proteinGoalLabel: "Meta de Proteínas (g)",
      carbsGoalLabel: "Meta de Carboidratos (g)",
      fatGoalLabel: "Meta de Gorduras (g)",
      historyTitle: "Histórico de Metas",
      noHistory: "Nenhum dado histórico disponível.",
      savedPlansTitle: "Planos Salvos",
      noSavedPlans: "Você ainda não salvou nenhum plano.",
      loadPlan: "Carregar",
      deletePlan: "Excluir",
      savedOn: "Salvo em: {date}",
      autoRecalculated: "Metas recalculadas automaticamente com base no seu perfil.",
      weightChart: "Evolução de Peso",
      achievements: "Conquistas Desbloqueadas"
    },
    pdf: {
      title: "Relatório NutriHealth Gen",
      generatedOn: "Gerado em: {date}",
      profileTitle: "Perfil do Usuário",
      goalsTitle: "Metas Diárias",
      current: "Atual",
      target: "Meta",
      historyTitle: "Histórico de Calorias (Últimos 30 Dias)",
      weightHistoryTitle: "Evolução de Peso (Últimos 30 Dias)",
      day: "Day",
      calories: "Calorias",
      planTitle: "Plano de Refeições Semanal",
      noPlan: "Nenhum plano de refeições foi gerado ainda.",
      recipesTitle: "Receitas Salvas",
      noRecipes: "Nenhuma receita salva.",
      water: "Hidratação"
    },
    chat: {
        welcome: "Olá! Sou {name} 🌿. Sua assistente pessoal de nutrição. O que vamos discutir sobre saúde hoje?",
        placeholder: "Digite sua pergunta...",
        sending: "Enviando...",
        clear: "Limpar conversa"
    }
  },
  en: {
    nav: {
      dashboard: "Dashboard",
      nutriscan: "NutriScan",
      plan: "Plan",
      recipes: "Recipes",
      chat: "{name}"
    },
    header: {
      dashboard: "Dashboard",
      nutriscan: "NutriScan",
      recipes: "Recipes",
      healthPlan: "Health Plan",
      settings: "Settings",
      chat: "{name} - Nutri AI",
      default: "NutriHealth Gen"
    },
    dashboard: {
      greeting: "Hello, {name}!",
      subtitle: "Here's a summary of your journey.",
      weight: "Weight",
      height: "Height",
      bmi: "BMI",
      dailyGoals: "Daily Goals",
      caloriesOf: "of {target} kcal",
      netCalories: "Net Balance",
      eaten: "Eaten",
      burned: "Burned",
      protein: "Protein",
      carbs: "Carbs",
      fats: "Fats",
      calorieHistory: "Calorie History",
      frequentFoods: "Frequent Foods",
      water: "Hydration",
      waterOf: "of {target} ml",
      addGlass: "+250ml",
      addCup: "+300ml",
      addBottle: "+500ml",
      level: "Level {level}",
      xp: "{current} / {next} XP",
      mood: {
          title: "How are you feeling?",
          great: "Great!",
          good: "Good",
          okay: "Okay",
          tired: "Tired",
          stressed: "Stressed",
          logged: "Mood logged!"
      },
      sleep: {
          title: "Sleep Tracker",
          log: "Log Sleep",
          duration: "Duration (hours)",
          quality: "Quality",
          qualities: {
              poor: "Poor",
              fair: "Fair",
              good: "Good",
              excellent: "Excellent"
          },
          logged: "Sleep logged!",
          average: "Weekly Avg: {hours}h"
      },
      fasting: {
        title: "Intermittent Fasting",
        start: "Start Fast",
        end: "End Fast",
        elapsed: "Elapsed Time",
        goal: "Goal",
        startedAt: "Started at",
        endsAt: "Ends at",
        protocolLabel: "Protocol",
        selectProtocol: "Select protocol"
      },
      micros: {
        title: "Vitamins & Minerals",
        takeVitamin: "Take Multivitamin",
        vitaminReminder: "Daily Reminder",
        didYouTake: "Did you take your vitamins today?",
        taken: "Taken!",
        notTaken: "Mark as taken",
        vitaminC: "Vitamin C",
        vitaminD: "Vitamin D",
        iron: "Iron",
        calcium: "Calcium",
        magnesium: "Magnesium",
        vitaminA: "Vitamin A",
        vitaminB12: "Vitamin B12",
        potassium: "Potassium",
        sodium: "Sodium",
        zinc: "Zinc"
      },
      activity: {
          title: "Physical Activity",
          log: "Log",
          selectActivity: "Select activity",
          placeholderName: "Activity Name",
          placeholderCal: "kcal",
          placeholderDur: "min",
          todayLog: "Today",
          types: {
            custom: "Other / Custom",
            walking: "Walking (Light)",
            running: "Running",
            cycling: "Cycling",
            weights: "Weight Lifting",
            yoga: "Yoga / Stretching",
            swimming: "Swimming",
            hiit: "HIIT / Crossfit",
            sports: "Sports (Soccer/Volleyball)"
          }
      },
      challenge: {
          title: "30-Day Challenge",
          start: "Generate 30-Day Challenge",
          generating: "Creating your challenge...",
          day: "Day {day}",
          complete: "Mark as Complete",
          completed: "Task Completed!",
          error: "Error generating challenge."
      }
    },
    gamification: {
        levelUp: "Level Up!",
        achievementUnlocked: "Achievement Unlocked!",
        badges: {
            hydrationMaster: "Hydration Master",
            hydrationMasterDesc: "Reached daily water goal.",
            proteinPro: "Protein Pro",
            proteinProDesc: "Hit your protein target.",
            vitaminBoost: "Immunity Boost",
            vitaminBoostDesc: "Took your daily vitamins.",
            activeLife: "Active Life",
            activeLifeDesc: "Logged a physical activity."
        }
    },
    nutriscan: {
      description: "Take a photo of your dish, package, or barcode. AI detects nutrients automatically!",
      uploadPrompt: "Food or Barcode Photo",
      uploadHint: "Supports labels & packages",
      changePhoto: "Change Photo",
      analyze: "Analyze",
      analyzing: "Reading label/food...",
      analysisError: "Failed to analyze. Try a clearer photo of label or food.",
      analysisResults: "Analysis Results",
      totalCalories: "Estimated Calories",
      protein: "Protein",
      carbs: "Carbs",
      fats: "Fats",
      identifiedFoods: "Identified Item:",
      addToLog: "Add to Diary",
      addedToLog: "Added!",
      servingSize: "Serving Size"
    },
    recipes: {
      searchPlaceholder: "Search by name...",
      ingredients: "Ingredients",
      steps: "Preparation Steps",
      saveButton: 'Save',
      savedButton: 'Saved',
      showSavedFilter: 'Show saved only',
      regenerateImage: "✨ Generate AI Image",
      regeneratingImage: "Creating image...",
      difficulty: {
          "Fácil": "Easy",
          "Médio": "Medium",
          "Difícil": "Hard"
      },
      generator: {
        title: "Generate recipe with your ingredients",
        placeholder: "e.g., chicken, rice, tomatoes...",
        button: "Generate Recipe",
        generatingButton: "Generating...",
        error: "Failed to generate recipe. Please try again."
      },
       filters: {
        title: "Filters",
        clear: "Clear Filters",
        noResults: "No recipes found with the selected filters.",
        difficulty: {
          label: "Difficulty",
          all: "All"
        },
        time: {
          label: "Prep Time",
          any: "Any",
          upTo15: "Up to 15 min",
          upTo30: "Up to 30 min"
        },
        calories: {
          label: "Calories",
          any: "Any",
          upTo300: "Up to 300 kcal",
          between300_500: "300-500 kcal",
          over500: "Over 500 kcal"
        },
        type: {
          label: "Meal Type",
          all: "All",
          "Salada": "Salad",
          "Prato Principal": "Main Course",
          "Bebida": "Drink",
          "Café da Manhã": "Breakfast",
          "Sopa": "Soup",
          "Lanche": "Snack"
        },
        diet: {
          label: "Diet",
          all: "All",
          vegan: "Vegan",
          vegetarian: "Vegetarian",
          omnivore: "Omnivore"
        }
      }
    },
    healthPlan: {
      formTitle: "Generate Meal Plan",
      goalLabel: "Your primary goal",
      goalOptions: {
        lose: "Lose Weight",
        maintain: "Maintain Weight",
        gain: "Gain Muscle Mass"
      },
      caloriesLabel: "Calorie Goal (kcal)",
      restrictionsLabel: "Dietary Restrictions",
      restrictionsPlaceholder: "e.g., gluten-free, vegan...",
      generateButton: "Generate Meal Plan",
      generatingButton: "Generating Plan...",
      generationError: "Failed to generate plan. Please try again.",
      regenerationError: "Failed to replace meal. Please try again.",
      replaceMeal: "Replace meal",
      savePlan: "Save Plan",
      planSaved: "Plan Saved!",
      planTitle: "Your Weekly Plan",
      days: {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday"
      },
      dayShort: {
          monday: "Mon",
          tuesday: "Tue",
          wednesday: "Wed",
          thursday: "Thu",
          friday: "Fri",
          saturday: "Sat",
          sunday: "Sun"
      },
      meals: {
          breakfast: "Breakfast",
          lunch: "Lunch",
          dinner: "Dinner"
      },
      viewRecipe: "View Recipe",
      totalCalories: "Total estimated for the day:",
      emptyStateTitle: "Create your personalized meal plan",
      emptyStateDescription: "Fill in your goals and restrictions above for the AI to generate a weekly plan tailored for you.",
      shoppingList: {
          button: "Smart Shopping List",
          title: "Shopping List",
          generating: "Generating list...",
          generateError: "Error generating list.",
          empty: "Generate a plan first to create the list."
      }
    },
    settings: {
      title: "Edit Profile",
      preferencesTitle: "App Preferences",
      enableGamification: "Enable Gamification (XP & Levels)",
      enableChallenges: "Enable 30-Day Challenges",
      nameLabel: "Name",
      ageLabel: "Age",
      weightLabel: "Weight (kg)",
      heightLabel: "Height (cm)",
      bmiLabel: "BMI (Body Mass Index)",
      saveButton: "Save Changes",
      savingButton: "Saving...",
      saveSuccess: "Profile updated successfully!",
      language: "Language",
      assistant: "AI Assistant",
      dietLabel: "Dietary Preference",
      genderLabel: "Gender",
      activityLabel: "Activity Level",
      objectiveLabel: "Primary Objective",
      multivitaminLabel: "I take a multivitamin daily",
      genders: {
          male: "Male",
          female: "Female"
      },
      activityLevels: {
          sedentary: "Sedentary",
          light: "Lightly Active",
          moderate: "Moderately Active",
          active: "Very Active",
          very_active: "Extremamente Active"
      },
      objectives: {
          lose_weight: "Lose Weight (-500kcal)",
          maintain: "Maintain Weight",
          gain_muscle: "Gain Muscle (+300kcal)"
      },
      diets: {
        Omnivore: "Omnivore",
        Vegetarian: "Vegetarian",
        Vegan: "Vegan"
      },
      exportButton: "Export Data (PDF)",
      includeRecipesInPdf: "Include saved recipes in PDF",
      includeHealthPlanInPdf: "Include health plan in PDF",
      goalsTitle: "Nutritional Goals (Macros)",
      microsTitle: "Micronutrient Goals",
      waterGoalLabel: "Water Goal (ml)",
      calorieGoalLabel: "Calorie Goal (kcal)",
      proteinGoalLabel: "Protein Goal (g)",
      carbsGoalLabel: "Carbs Goal (g)",
      fatGoalLabel: "Fat Goal (g)",
      historyTitle: "Goal History",
      noHistory: "No historical data available.",
      savedPlansTitle: "Saved Plans",
      noSavedPlans: "You haven't saved any plans yet.",
      loadPlan: "Load",
      deletePlan: "Delete",
      savedOn: "Saved on: {date}",
      autoRecalculated: "Goals automatically recalculated based on your profile.",
      weightChart: "Weight Evolution",
      achievements: "Unlocked Achievements"
    },
     pdf: {
      title: "NutriHealth Gen Report",
      generatedOn: "Generated on: {date}",
      profileTitle: "User Profile",
      goalsTitle: "Daily Goals",
      current: "Current",
      target: "Target",
      historyTitle: "Calorie History (Last 30 Days)",
      weightHistoryTitle: "Weight Evolution (Last 30 Days)",
      day: "Day",
      calories: "Calories",
      planTitle: "Weekly Meal Plan",
      noPlan: "No meal plan has been generated yet.",
      recipesTitle: "Saved Recipes",
      noRecipes: "No saved recipes.",
      water: "Hydration"
    },
    chat: {
        welcome: "Hello! I'm {name} 🌿. Your personal AI nutritionist. What shall we discuss about your health today?",
        placeholder: "Type your question...",
        sending: "Sending...",
        clear: "Clear chat"
    }
  },
};

// Simple fallback logic for missing keys in other languages
['es', 'de', 'fr', 'ru'].forEach(lang => {
    if (translations[lang as keyof typeof translations]) {
        const target = translations[lang as keyof typeof translations] as any;
        const source = translations.en;
        
        target.dashboard.mood = source.dashboard.mood;
        target.dashboard.level = source.dashboard.level;
        target.dashboard.xp = source.dashboard.xp;
        target.dashboard.challenge = source.dashboard.challenge;
        target.dashboard.sleep = source.dashboard.sleep;
        target.gamification = source.gamification;
        target.settings.preferencesTitle = source.settings.preferencesTitle;
        target.settings.enableGamification = source.settings.enableGamification;
        target.settings.enableChallenges = source.settings.enableChallenges;
        target.settings.weightChart = source.settings.weightChart;
        target.settings.achievements = source.settings.achievements;
        target.pdf.weightHistoryTitle = source.pdf.weightHistoryTitle;
    }
});

export default translations;
