
import { GoogleGenAI, Type } from "@google/genai";
import type { WeeklyPlan, MealAnalysis, Recipe, Meal, ShoppingItem, ChallengeTask } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const languageMap: { [key: string]: string } = {
  pt: 'Portuguese',
  en: 'English',
  es: 'Spanish',
  de: 'German',
  fr: 'French',
  ru: 'Russian',
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

export const analyzeMeal = async (imageFile: File, language: string): Promise<MealAnalysis> => {
  const base64Image = await fileToBase64(imageFile);
  const languageName = languageMap[language as keyof typeof languageMap] || 'English';
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
        parts: [
            {
                text: `Analyze the nutritional content of the food, meal, or product in this image. Act as an expert nutritionist. 
                
                **CRITICAL instructions for Commercial Products:**
                If the image contains a **Nutrition Facts label**, a **barcode**, or is a clear photo of a **product package** (front or back):
                1. Prioritize reading the EXACT nutritional values printed on the label over estimating.
                2. If a barcode is visible, attempt to read the numbers to identify the product context.
                3. **IMPORTANT**: Look for the "Serving Size" or "Porção" on the label. Calculate and return values for **ONE SERVING** as stated on the label.
                4. Extract this serving size as a text string (e.g., "25g (3 squares)", "1 bottle (200ml)").
                
                If the image is a prepared meal (plate of food):
                1. Estimate portion sizes and ingredients visually.
                2. Set serving size to "1 plate" or "1 portion".

                Provide a realistic estimate of:
                1. Total calories
                2. Macronutrients (protein, carbohydrates, fat) in grams.
                3. Micronutrients: Vitamin C (mg), Vitamin D (IU), Iron (mg), Calcium (mg), Magnesium (mg), Vitamin A (mcg), Vitamin B12 (mcg), Potassium (mg), Sodium (mg), and Zinc (mg).
                
                Also, list the main food items (or product name) you can identify. The list of identified food items must be in ${languageName}.
                Return the response as a valid JSON object. Do not include any text outside the JSON object. The JSON should have the following structure:
                {
                  "calories": number,
                  "macros": { "protein": number, "carbs": number, "fat": number },
                  "micros": { "vitaminC": number, "vitaminD": number, "iron": number, "calcium": number, "magnesium": number, "vitaminA": number, "vitaminB12": number, "potassium": number, "sodium": number, "zinc": number },
                  "identifiedFoods": ["food1", "food2", ...],
                  "servingSize": "string"
                }`
            },
            {
                inlineData: {
                    mimeType: imageFile.type,
                    data: base64Image,
                }
            }
        ]
    },
    config: {
        seed: 42,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                calories: { type: Type.NUMBER },
                macros: {
                    type: Type.OBJECT,
                    properties: {
                        protein: { type: Type.NUMBER },
                        carbs: { type: Type.NUMBER },
                        fat: { type: Type.NUMBER },
                    },
                    required: ["protein", "carbs", "fat"],
                },
                micros: {
                    type: Type.OBJECT,
                    properties: {
                        vitaminC: { type: Type.NUMBER },
                        vitaminD: { type: Type.NUMBER },
                        iron: { type: Type.NUMBER },
                        calcium: { type: Type.NUMBER },
                        magnesium: { type: Type.NUMBER },
                        vitaminA: { type: Type.NUMBER },
                        vitaminB12: { type: Type.NUMBER },
                        potassium: { type: Type.NUMBER },
                        sodium: { type: Type.NUMBER },
                        zinc: { type: Type.NUMBER },
                    },
                    required: ["vitaminC", "vitaminD", "iron", "calcium", "magnesium", "vitaminA", "vitaminB12", "potassium", "sodium", "zinc"],
                },
                identifiedFoods: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
                servingSize: { type: Type.STRING }
            },
            required: ["calories", "macros", "micros", "identifiedFoods", "servingSize"],
        }
    }
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText) as MealAnalysis;
};

export const generateHealthPlan = async (goal: string, restrictions: string, calories: number, language: string, diet: string): Promise<WeeklyPlan> => {
    const languageName = languageMap[language as keyof typeof languageMap] || 'English';
    const prompt = `Create a 7-day healthy meal plan for a person whose primary goal is "${goal}".
    Dietary Preference (Strict): ${diet}.
    Additional Dietary restrictions: "${restrictions || 'None'}".
    The daily calorie target is approximately ${calories} kcal.
    Provide varied and balanced options for breakfast, lunch, and dinner for each day of the week.
    For each meal, provide a "name", a brief "description", an estimated "calories" count, a list of "ingredients", and the preparation "steps".
    The entire response, including meal names, descriptions, ingredients and steps, must be in ${languageName}.
    Return the response as a valid JSON object, with keys for each day of the week (e.g., "monday", "tuesday").
    Do not include any text or markdown formatting outside of the main JSON object.`;

    const mealSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['name', 'description', 'calories', 'ingredients', 'steps']
    };

    const daySchema = {
        type: Type.OBJECT,
        properties: {
            breakfast: mealSchema,
            lunch: mealSchema,
            dinner: mealSchema
        },
        required: ['breakfast', 'lunch', 'dinner']
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    monday: daySchema,
                    tuesday: daySchema,
                    wednesday: daySchema,
                    thursday: daySchema,
                    friday: daySchema,
                    saturday: daySchema,
                    sunday: daySchema,
                },
                 required: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            }
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as WeeklyPlan;
};

export const regenerateMeal = async (
    goal: string, 
    restrictions: string, 
    calories: number, 
    language: string, 
    mealType: 'breakfast' | 'lunch' | 'dinner', 
    mealToReplace: string,
    otherMeals: Meal[],
    diet: string
): Promise<Meal> => {
    const languageName = languageMap[language as keyof typeof languageMap] || 'English';
    const otherMealsText = otherMeals.map(m => `${m.name} (${m.calories} kcal)`).join(', ');
    
    const prompt = `Create a new, different suggestion for a single meal.
    The user's details are:
    - Goal: "${goal}"
    - Dietary Preference (Strict): ${diet}
    - Dietary Restrictions: "${restrictions || 'None'}"
    - Daily calorie target: ${calories} kcal
    
    The meal to replace is:
    - Type: ${mealType}
    - Current meal: "${mealToReplace}"
    
    The other meals for the day are: ${otherMealsText}. The new meal should fit well with these.
    
    Provide a new, creative, and healthy meal suggestion that is different from "${mealToReplace}".
    For the new meal, provide a "name", a brief "description", an estimated "calories" count, a list of "ingredients", and the preparation "steps".
    The entire response must be in ${languageName}.
    Return the response as a valid JSON object. Do not include any text or markdown formatting outside the object.`;

    const mealSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['name', 'description', 'calories', 'ingredients', 'steps']
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: mealSchema,
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Meal;
};


export const generateRecipeFromIngredients = async (ingredients: string, language: string): Promise<Recipe> => {
    const languageName = languageMap[language as keyof typeof languageMap] || 'English';
    const prompt = `Create a recipe using mainly these ingredients: "${ingredients}". You can add other common ingredients if needed.
    The recipe should be healthy and creative.
    Provide a name, preparation time (e.g., "30 min"), estimated calories, difficulty ('Fácil', 'Médio', or 'Difícil'), a list of all ingredients used, and the preparation steps.
    Also, classify the recipe type from the following options: 'Salada', 'Prato Principal', 'Bebida', 'Café da Manhã', 'Sopa', 'Lanche'.
    Additionally, suggest tags for the recipe such as 'Vegan', 'Vegetarian', 'Gluten-Free' based on the ingredients.
    Finally, provide a detailed, descriptive "imageQuery" in English that describes the visual appearance of the dish for an image generator. For example: "A high resolution, professional food photography shot of a gourmet chicken salad with quinoa and avocado, bright lighting, top-down view".
    The entire response, including the name, ingredients, steps, etc., must be in ${languageName}, except for the "imageQuery" which must be in English.
    Return the response as a valid JSON object. Do not include any text or markdown formatting outside of the main JSON object.`;

    const recipeSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            time: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            difficulty: { type: Type.STRING, enum: ['Fácil', 'Médio', 'Difícil'] },
            type: { type: Type.STRING, enum: ['Salada', 'Prato Principal', 'Bebida', 'Café da Manhã', 'Sopa', 'Lanche'] },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            imageQuery: { type: Type.STRING, description: "Detailed English prompt for an image generator." }
        },
        required: ['name', 'time', 'calories', 'difficulty', 'type', 'ingredients', 'steps', 'imageQuery']
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.8,
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
        }
    });

    const jsonText = response.text.trim();
    const generatedData = JSON.parse(jsonText);
    
    // Generate the image using Imagen
    const imageUrl = await generateImageForRecipe(generatedData.imageQuery || `${generatedData.name} food photography`);

    return {
        ...generatedData,
        id: Date.now(),
        image: imageUrl,
    } as Recipe;
};

export const generateImageForRecipe = async (imageQuery: string): Promise<string> => {
    let imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'; // Fallback
    try {
        const imageResponse = await ai.models.generateImages({
            model: 'imagen-3.0-generate-001',
            prompt: imageQuery,
            config: {
                numberOfImages: 1,
                aspectRatio: '4:3',
                outputMimeType: 'image/jpeg'
            }
        });
        
        if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
            const base64Image = imageResponse.generatedImages[0].image.imageBytes;
            imageUrl = `data:image/jpeg;base64,${base64Image}`;
        }
    } catch (imageError) {
        console.error("Failed to generate image with Imagen, using fallback.", imageError);
    }
    return imageUrl;
}


export const sendNutritionChatMessage = async (history: {role: 'user' | 'model', text: string}[], message: string, language: string, assistantName: string): Promise<string> => {
    const languageName = languageMap[language as keyof typeof languageMap] || 'English';
    
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are ${assistantName}, a friendly, empathetic, and knowledgeable nutritionist assistant created for the NutriHealth Gen app. 
            Your goal is to help users with quick nutrition questions, healthy eating tips, and food facts. 
            Always introduce yourself as ${assistantName} if asked.
            Answer concisely and helpfuly in ${languageName}. 
            Do not provide medical advice for serious conditions; suggest seeing a doctor in those cases.`,
        },
        history: history.map(h => ({
            role: h.role,
            parts: [{ text: h.text }]
        }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
};

export const generateShoppingListFromPlan = async (plan: WeeklyPlan, language: string): Promise<ShoppingItem[]> => {
     const languageName = languageMap[language as keyof typeof languageMap] || 'English';
     // Extract all ingredients string
     const allIngredients: string[] = [];
     Object.values(plan).forEach(day => {
         day.breakfast.ingredients.forEach(i => allIngredients.push(i));
         day.lunch.ingredients.forEach(i => allIngredients.push(i));
         day.dinner.ingredients.forEach(i => allIngredients.push(i));
     });

     const prompt = `Given this list of ingredients from a weekly meal plan, consolidate them into a smart shopping list.
     Combine similar items and sum up quantities where possible (e.g., "2 tomatoes" and "3 tomatoes" becomes "5 tomatoes").
     Categorize each item (e.g., "Vegetables", "Meat", "Dairy", "Pantry", "Fruit").
     The input list is: ${JSON.stringify(allIngredients.slice(0, 500))} (truncated for brevity if too long).
     
     Return a JSON array of objects with "item" (string, name + quantity) and "category" (string).
     The language of the output must be ${languageName}.
     
     Response structure:
     {
        "items": [
            {"item": "5 Tomatoes", "category": "Vegetables"},
            ...
        ]
     }`;

     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                item: { type: Type.STRING },
                                category: { type: Type.STRING }
                            },
                            required: ["item", "category"]
                        }
                    }
                }
            }
        }
     });

     const json = JSON.parse(response.text.trim());
     return json.items.map((i: any) => ({ ...i, checked: false }));
};

export const generate30DayChallenge = async (goal: string, language: string): Promise<ChallengeTask[]> => {
    const languageName = languageMap[language as keyof typeof languageMap] || 'English';
    const prompt = `Create a 30-day health and wellness challenge for a user whose primary goal is "${goal}".
    Provide a JSON array containing exactly 30 tasks, one for each day.
    Each task should be simple, actionable, and related to nutrition, hydration, mental health, or light activity.
    For each task, provide a "day" (integer 1-30), a "title" (short summary), and a "description" (one sentence instruction).
    The language of the output must be ${languageName}.
    
    Example output format:
    [
        { "day": 1, "title": "Drink More Water", "description": "Drink 3 liters of water today." },
        ...
    ]
    
    Return only the JSON array.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ["day", "title", "description"]
                }
            }
        }
    });

    const tasks = JSON.parse(response.text.trim()) as Omit<ChallengeTask, 'completed'>[];
    return tasks.map(t => ({ ...t, completed: false }));
};
