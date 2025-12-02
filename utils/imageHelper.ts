// Helper function to generate Unsplash image URLs based on recipe name
export const getRecipeImage = (recipeName: string, recipeType: string): string => {
    // Create a search query from the recipe name
    const searchQuery = encodeURIComponent(recipeName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim());
    
    // Use Unsplash Source API with food photography
    // This generates a random but relevant image based on the search term
    return `https://source.unsplash.com/800x600/?${searchQuery},food`;
};

// Alternative: Use specific Unsplash photo IDs for common recipe types
const RECIPE_IMAGE_MAP: { [key: string]: string } = {
    // Salads
    'salada': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    'quinoa': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    
    // Fish
    'salmão': 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=800&auto=format&fit=crop',
    'atum': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    'peixe': 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=800&auto=format&fit=crop',
    
    // Smoothies & Drinks
    'smoothie': 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&auto=format&fit=crop',
    'bebida': 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&auto=format&fit=crop',
    
    // Eggs
    'omelete': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=800&auto=format&fit=crop',
    'ovo': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=800&auto=format&fit=crop',
    
    // Soups
    'sopa': 'https://images.unsplash.com/photo-1476718406336-bb5a98c095ea?q=80&w=800&auto=format&fit=crop',
    'abóbora': 'https://images.unsplash.com/photo-1476718406336-bb5a98c095ea?q=80&w=800&auto=format&fit=crop',
    
    // Chicken
    'frango': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop',
    'crepioca': 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a2750?q=80&w=800&auto=format&fit=crop',
    
    // Breakfast
    'aveia': 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800&auto=format&fit=crop',
    'mingau': 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800&auto=format&fit=crop',
    
    // Pasta
    'macarrão': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop',
    'pasta': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop',
    
    // Bread
    'pão': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    'sanduíche': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    
    // Vegetables
    'abobrinha': 'https://images.unsplash.com/photo-1626844131082-256783844137?q=80&w=800&auto=format&fit=crop',
    'berinjela': 'https://images.unsplash.com/photo-1574868235863-236369e9928c?q=80&w=800&auto=format&fit=crop',
    
    // Rice dishes
    'arroz': 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=800&auto=format&fit=crop',
    'risoto': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop',
    
    // Avocado
    'abacate': 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?q=80&w=800&auto=format&fit=crop',
    
    // Tea
    'chá': 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=800&auto=format&fit=crop',
    'hibisco': 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=800&auto=format&fit=crop',
    
    // Tacos/Wraps
    'taco': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop',
    'wrap': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop',
    
    // Overnight oats
    'overnight': 'https://images.unsplash.com/photo-1646328742397-2402e09e700a?q=80&w=800&auto=format&fit=crop',
    
    // Soup
    'canja': 'https://images.unsplash.com/photo-1547592166-23acbe3b624b?q=80&w=800&auto=format&fit=crop',
    
    // Sweet potato
    'batata doce': 'https://images.unsplash.com/photo-1576024267263-70f1caffd6fe?q=80&w=800&auto=format&fit=crop',
    
    // Yogurt
    'iogurte': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop',
    'granola': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop',
    
    // Caprese
    'caprese': 'https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?q=80&w=800&auto=format&fit=crop',
    
    // Lasagna
    'lasanha': 'https://images.unsplash.com/photo-1574868235863-236369e9928c?q=80&w=800&auto=format&fit=crop',
    
    // Chickpea
    'grão de bico': 'https://images.unsplash.com/photo-1511690656952-34342d2c7135?q=80&w=800&auto=format&fit=crop',
    
    // Banana
    'banana': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
};

export const getRecipeImageUrl = (recipeName: string, recipeType: string, currentImage?: string): string => {
    // If current image exists and is valid, use it
    if (currentImage && currentImage.trim() !== '' && !currentImage.includes('source.unsplash.com')) {
        return currentImage;
    }
    
    // Check if we have a specific image for this recipe type/keyword
    const nameLower = recipeName.toLowerCase();
    for (const [keyword, imageUrl] of Object.entries(RECIPE_IMAGE_MAP)) {
        if (nameLower.includes(keyword)) {
            return imageUrl;
        }
    }
    
    // Fallback: use Unsplash Source with recipe name
    return getRecipeImage(recipeName, recipeType);
};

