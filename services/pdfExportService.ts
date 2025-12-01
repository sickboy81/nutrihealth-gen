
declare global {
  interface Window {
    jspdf: any;
  }
}
import type { UserProfile, DailyGoal, WeeklyPlan, Recipe, CalorieRecord, WeightRecord } from '../types';

export const exportToPDF = (
    profile: UserProfile,
    goals: DailyGoal,
    history: CalorieRecord[],
    weightHistory: WeightRecord[],
    plan: WeeklyPlan | null,
    savedRecipes: Recipe[],
    t: (key: string, replacements?: { [key: string]: string | number }) => string,
    includeRecipes: boolean,
    includeHealthPlan: boolean
) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    const checkPageBreak = (currentY: number, requiredSpace = 20): number => {
        if (currentY > 297 - requiredSpace) {
            doc.addPage();
            return 20;
        }
        return currentY;
    };

    // --- HEADER ---
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // Emerald 500
    doc.text(t('pdf.title'), 105, y, { align: 'center' });
    doc.setTextColor(0, 0, 0); // Reset black
    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const today = new Date().toLocaleDateString();
    doc.text(t('pdf.generatedOn', { date: today }), 105, y, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y += 15;

    // --- PROFILE ---
    y = checkPageBreak(y, 40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 253, 244); // bg-emerald-50
    doc.rect(14, y - 6, 182, 8, 'F');
    doc.setTextColor(6, 78, 59); // emerald-900
    doc.text(t('pdf.profileTitle'), 16, y);
    doc.setTextColor(0, 0, 0);
    y += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const col1X = 14;
    const col2X = 80;
    const col3X = 140;
    
    doc.text(`${t('settings.nameLabel')}: ${profile.name}`, col1X, y);
    doc.text(`${t('settings.ageLabel')}: ${profile.age}`, col2X, y);
    doc.text(`${t('settings.genderLabel')}: ${t(`settings.genders.${profile.gender}`)}`, col3X, y);
    y += 6;
    doc.text(`${t('settings.weightLabel')}: ${profile.weight} kg`, col1X, y);
    doc.text(`${t('settings.heightLabel')}: ${profile.height} cm`, col2X, y);
    doc.text(`${t('settings.bmiLabel')}: ${profile.bmi}`, col3X, y);
    y += 15;

    // --- DAILY GOALS ---
    y = checkPageBreak(y, 40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 253, 244);
    doc.rect(14, y - 6, 182, 8, 'F');
    doc.setTextColor(6, 78, 59);
    doc.text(t('pdf.goalsTitle'), 16, y);
    doc.setTextColor(0, 0, 0);
    y += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Helper to draw a mini progress bar text
    const drawStat = (label: string, current: number, target: number, unit: string, x: number, currentY: number) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, x, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(`${Math.round(current)} / ${target} ${unit}`, x + 40, currentY);
    };

    drawStat(t('dashboard.caloriesOf', { target: '' }).replace('de  kcal', 'Calorias'), goals.calories.current, goals.calories.target, 'kcal', 14, y);
    y += 6;
    drawStat(t('dashboard.protein'), goals.protein.current, goals.protein.target, 'g', 14, y);
    y += 6;
    drawStat(t('dashboard.carbs'), goals.carbs.current, goals.carbs.target, 'g', 14, y);
    y += 6;
    drawStat(t('dashboard.fats'), goals.fat.current, goals.fat.target, 'g', 14, y);
    y += 6;
    drawStat(t('pdf.water'), goals.water.current, goals.water.target, 'ml', 14, y);
    y += 15;

    // --- CALORIE HISTORY (CHART) ---
    // Ensure we have enough space for the chart (approx 80 units height)
    y = checkPageBreak(y, 90);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 253, 244);
    doc.rect(14, y - 6, 182, 8, 'F');
    doc.setTextColor(6, 78, 59);
    doc.text(t('pdf.historyTitle'), 16, y);
    doc.setTextColor(0, 0, 0);
    y += 15;

    const historyToExport = history.slice(-30);

    if (historyToExport.length > 1) {
        // Chart Config
        const chartX = 25;
        const chartY = y;
        const chartWidth = 160;
        const chartHeight = 60;
        const bottomY = chartY + chartHeight;
        
        // Calculate Scales
        const maxKcal = Math.max(...historyToExport.map(h => h.kcal), 2500) * 1.1; // +10% padding
        const minKcal = 0;
        const dataCount = historyToExport.length;
        const xStep = chartWidth / (dataCount - 1);

        // Draw Axes
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(chartX, chartY, chartX, bottomY); // Y Axis
        doc.line(chartX, bottomY, chartX + chartWidth, bottomY); // X Axis

        // Draw Grid Lines & Y Labels
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        
        // Max Label
        doc.text(Math.round(maxKcal).toString(), chartX - 2, chartY);
        doc.line(chartX, chartY, chartX + chartWidth, chartY); // Top grid line
        
        // Mid Label
        const midY = chartY + (chartHeight / 2);
        doc.text(Math.round(maxKcal / 2).toString(), chartX - 2, midY);
        doc.line(chartX, midY, chartX + chartWidth, midY); // Mid grid line
        
        // Zero Label
        doc.text("0", chartX - 2, bottomY);

        // Plot Data
        let prevX = 0;
        let prevY = 0;

        historyToExport.forEach((item, index) => {
            const x = chartX + (index * xStep);
            // Invert Y because PDF coords start at top
            const normalizedValue = item.kcal / maxKcal;
            const plotY = bottomY - (normalizedValue * chartHeight);

            // Draw Line from previous point
            if (index > 0) {
                doc.setDrawColor(16, 185, 129); // Emerald 500
                doc.setLineWidth(0.5); // Thin line
                doc.line(prevX, prevY, x, plotY);
            }

            // Draw Point
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(16, 185, 129);
            doc.setLineWidth(0.5);
            doc.circle(x, plotY, 1.5, 'FD');

            // Draw X Labels (Dates) every 5 points to avoid crowding
            if (index % 5 === 0 || index === dataCount - 1) {
                const dateObj = new Date(item.date + 'T00:00:00'); // fix timezone issue slightly
                const dateStr = dateObj.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(dateStr, x, bottomY + 5, { align: 'center', angle: 0 });
            }

            prevX = x;
            prevY = plotY;
        });
        
        y += chartHeight + 15; // Move cursor past chart
    } else {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(t('settings.noHistory'), 14, y);
        y += 10;
    }

    // --- WEIGHT HISTORY (CHART) ---
    y = checkPageBreak(y, 90);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 253, 244);
    doc.rect(14, y - 6, 182, 8, 'F');
    doc.setTextColor(6, 78, 59);
    doc.text(t('pdf.weightHistoryTitle'), 16, y);
    doc.setTextColor(0, 0, 0);
    y += 15;

    const weightHistoryToExport = weightHistory.slice(-30);

    if (weightHistoryToExport.length > 1) {
        const chartX = 25;
        const chartY = y;
        const chartWidth = 160;
        const chartHeight = 60;
        const bottomY = chartY + chartHeight;
        
        // Calculate Scales
        const weights = weightHistoryToExport.map(w => w.weight);
        const maxWeight = Math.max(...weights) * 1.05;
        const minWeight = Math.min(...weights) * 0.95;
        const weightRange = maxWeight - minWeight || 10; 
        const dataCount = weightHistoryToExport.length;
        const xStep = chartWidth / (dataCount - 1);

        // Draw Axes
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(chartX, chartY, chartX, bottomY); // Y Axis
        doc.line(chartX, bottomY, chartX + chartWidth, bottomY); // X Axis

        // Draw Grid Lines & Y Labels
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        
        // Max Label
        doc.text(Math.round(maxWeight).toString(), chartX - 2, chartY);
        doc.line(chartX, chartY, chartX + chartWidth, chartY); // Top grid line
        
        // Mid Label
        const midY = chartY + (chartHeight / 2);
        doc.text(Math.round((maxWeight + minWeight) / 2).toString(), chartX - 2, midY);
        doc.line(chartX, midY, chartX + chartWidth, midY); // Mid grid line
        
        // Min Label
        doc.text(Math.round(minWeight).toString(), chartX - 2, bottomY);

        // Plot Data
        let prevX = 0;
        let prevY = 0;

        weightHistoryToExport.forEach((item, index) => {
            const x = chartX + (index * xStep);
            const normalizedValue = (item.weight - minWeight) / weightRange;
            const plotY = bottomY - (normalizedValue * chartHeight);

            // Draw Line from previous point
            if (index > 0) {
                doc.setDrawColor(16, 185, 129); // Emerald 500
                doc.setLineWidth(0.5); // Thin line
                doc.line(prevX, prevY, x, plotY);
            }

            // Draw Point
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(16, 185, 129);
            doc.setLineWidth(0.5);
            doc.circle(x, plotY, 1.5, 'FD');

            // Draw X Labels (Dates) every 5 points
            if (index % 5 === 0 || index === dataCount - 1) {
                const dateObj = new Date(item.date + 'T00:00:00');
                const dateStr = dateObj.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(dateStr, x, bottomY + 5, { align: 'center', angle: 0 });
            }

            prevX = x;
            prevY = plotY;
        });
        
        y += chartHeight + 15; // Move cursor past chart
    } else {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(t('settings.noHistory'), 14, y);
        y += 10;
    }

    // --- MEAL PLAN ---
    if (includeHealthPlan) {
        y = checkPageBreak(y, 50);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(240, 253, 244);
        doc.rect(14, y - 6, 182, 8, 'F');
        doc.setTextColor(6, 78, 59);
        doc.text(t('pdf.planTitle'), 16, y);
        doc.setTextColor(0, 0, 0);
        y += 12;

        if (plan) {
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            
            days.forEach((dayKey, index) => {
                y = checkPageBreak(y, 35);
                
                // Day Header
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(16, 185, 129);
                doc.text(t(`healthPlan.days.${dayKey}`), 14, y);
                doc.setTextColor(0, 0, 0);
                y += 6;
                
                // Meals
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                const dayPlan = plan[dayKey as keyof WeeklyPlan];
                
                const drawMeal = (type: string, name: string, cals: number) => {
                    doc.setFont('helvetica', 'bold');
                    doc.text(`${type}: `, 18, y);
                    const typeWidth = doc.getTextWidth(`${type}: `);
                    doc.setFont('helvetica', 'normal');
                    doc.text(`${name} (${cals} kcal)`, 18 + typeWidth, y);
                    y += 5;
                }

                drawMeal(t('healthPlan.meals.breakfast'), dayPlan.breakfast.name, dayPlan.breakfast.calories);
                drawMeal(t('healthPlan.meals.lunch'), dayPlan.lunch.name, dayPlan.lunch.calories);
                drawMeal(t('healthPlan.meals.dinner'), dayPlan.dinner.name, dayPlan.dinner.calories);
                
                y += 4;
            });
        } else {
            doc.setFontSize(11);
            doc.text(t('pdf.noPlan'), 14, y);
            y += 10;
        }
    }
    
    // --- SAVED RECIPES ---
    if (includeRecipes) {
        y = checkPageBreak(y, 30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(240, 253, 244);
        doc.rect(14, y - 6, 182, 8, 'F');
        doc.setTextColor(6, 78, 59);
        doc.text(t('pdf.recipesTitle'), 16, y);
        doc.setTextColor(0, 0, 0);
        y += 12;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        if (savedRecipes.length > 0) {
            savedRecipes.forEach(recipe => {
                y = checkPageBreak(y, 10);
                doc.setDrawColor(16, 185, 129);
                doc.setFillColor(16, 185, 129);
                doc.circle(16, y-1, 1, 'F');
                doc.text(`${recipe.name} (${recipe.calories} kcal)`, 20, y);
                y += 7;
            });
        } else {
            doc.text(t('pdf.noRecipes'), 14, y);
        }
    }

    doc.save('NutriHealth-Relatorio.pdf');
};
