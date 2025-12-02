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
    'salada de quinoa': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    'quinoa': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    'salada': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    'caprese': 'https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?q=80&w=800&auto=format&fit=crop',
    'grão de bico': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop',
    'couve': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    'feijão branco': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop',
    
    // Fish
    'salmão': 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=800&auto=format&fit=crop',
    'poke bowl': 'https://images.unsplash.com/photo-1574920173270-2b1fe7cdfd4a?q=80&w=800&auto=format&fit=crop',
    'atum': 'https://images.unsplash.com/photo-1574920173270-2b1fe7cdfd4a?q=80&w=800&auto=format&fit=crop',
    'peixe': 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=800&auto=format&fit=crop',
    'tilápia': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop',
    'ceviche': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop',
    'camarão': 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=800&auto=format&fit=crop',
    
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
    'frango grelhado': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop',
    'frango': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop',
    'crepioca': 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a2750?q=80&w=800&auto=format&fit=crop',
    'tapioca': 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a2750?q=80&w=800&auto=format&fit=crop',
    'curry': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800&auto=format&fit=crop',
    'espetinho': 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800&auto=format&fit=crop',
    'torta': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
    
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
    
    // Lasagna
    'lasanha': 'https://images.unsplash.com/photo-1574868235863-236369e9928c?q=80&w=800&auto=format&fit=crop',
    
    // Banana
    'banana': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
    'panqueca': 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=800&auto=format&fit=crop',
    'biscoito': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
    
    // Açaí
    'açaí': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
    
    // Lentil
    'lentilha': 'https://images.unsplash.com/photo-1547592166-23acbe3b624b?q=80&w=800&auto=format&fit=crop',
    
    // Ratatouille
    'ratatouille': 'https://images.unsplash.com/photo-1572441713132-51c75654db73?q=80&w=800&auto=format&fit=crop',
    
    // Hamburger
    'hambúrguer': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    
    // Pudim
    'pudim': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
    'chia': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
    
    // Gelatina
    'gelatina': 'https://images.unsplash.com/photo-1542367578-6a332547d112?q=80&w=800&auto=format&fit=crop',
    
    // Escondidinho
    'escondidinho': 'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=800&auto=format&fit=crop',
    
    // Água aromatizada
    'água aromatizada': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
    'hortelã': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
    
    // Chá verde
    'chá verde': 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=800&auto=format&fit=crop',
    
    // Brócolis
    'brócolis': 'https://images.unsplash.com/photo-1547592166-23acbe3b624b?q=80&w=800&auto=format&fit=crop',
    
    // Quiche
    'quiche': 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=800&auto=format&fit=crop',
};

export const getRecipeImageUrl = (recipeName: string, recipeType: string, currentImage?: string): string => {
    const nameLower = recipeName.toLowerCase();
    
    // Priority 1: Check for specific keywords in recipe name (most accurate)
    // Sort by length (longest first) to match more specific keywords first
    const sortedKeywords = Object.entries(RECIPE_IMAGE_MAP).sort((a, b) => b[0].length - a[0].length);
    for (const [keyword, imageUrl] of sortedKeywords) {
        if (nameLower.includes(keyword)) {
            return imageUrl;
        }
    }
    
    // Priority 2: Check recipe type for generic images
    const typeLower = recipeType.toLowerCase();
    if (typeLower.includes('salada')) {
        return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop';
    }
    if (typeLower.includes('bebida') || typeLower.includes('smoothie') || typeLower.includes('suco')) {
        return 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&auto=format&fit=crop';
    }
    if (typeLower.includes('sopa')) {
        return 'https://images.unsplash.com/photo-1476718406336-bb5a98c095ea?q=80&w=800&auto=format&fit=crop';
    }
    if (typeLower.includes('café') || typeLower.includes('cafe') || typeLower.includes('café da manhã')) {
        return 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800&auto=format&fit=crop';
    }
    if (typeLower.includes('lanche')) {
        return 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a2750?q=80&w=800&auto=format&fit=crop';
    }
    if (typeLower.includes('prato principal')) {
        return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
    }
    
    // Priority 3: If current image exists and is valid, use it (but only if it's a proper Unsplash image)
    if (currentImage && currentImage.trim() !== '' && currentImage.includes('images.unsplash.com') && !currentImage.includes('source.unsplash.com')) {
        return currentImage;
    }
    
    // Priority 4: Fallback to Unsplash Source with recipe name
    return getRecipeImage(recipeName, recipeType);
};

