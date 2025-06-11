import React from 'react';
import { Document, Page, Text, View, Image, Link } from '@react-pdf/renderer';
import { styles, colors } from './styles';
import { MealPlan, Recipe } from '@/lib/claude';

interface MealPlanPDFProps {
  mealPlan: MealPlan;
  generatedDate?: Date;
  title?: string;
  seasonalFocus?: string;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Create day names for the meal plan
const getDayNames = (): string[] => {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
};

const MealPlanPDF: React.FC<MealPlanPDFProps> = ({
  mealPlan,
  generatedDate = new Date(),
  title = 'Your 5-Day Meal Plan',
  seasonalFocus = 'Seasonal',
}) => {
  const dayNames = getDayNames();

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        {/* Header with logo and date */}
        <View style={styles.header}>
          <Image
            src="/images/seasonally-simple-logo.png"
            style={styles.logo}
          />
          <Text style={styles.smallText}>
            Generated on {formatDate(generatedDate)}
          </Text>
        </View>

        {/* Title */}
        <View style={{ marginTop: 40, marginBottom: 30, alignItems: 'center' }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.text, { textAlign: 'center' }]}>
            A {seasonalFocus} meal plan designed for simple, delicious cooking
          </Text>
        </View>

        {/* Week Overview */}
        <View style={styles.weekOverview}>
          <Text style={styles.subtitle}>Week at a Glance</Text>
          {mealPlan.meals.map((meal, index) => {
            // Only show the first 5 meals (one per day)
            if (index >= 5) return null;
            
            return (
              <View key={index} style={styles.dayCard}>
                <Text style={styles.dayTitle}>{dayNames[index]}</Text>
                <View style={styles.mealRow}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                </View>
                <Text style={styles.smallText}>
                  {meal.prepTime} prep • {meal.cookTime} cook • {meal.difficulty}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Shopping List */}
        <Text style={styles.subtitle}>Shopping List</Text>
        <Text style={styles.text}>
          Estimated Cost: {mealPlan.totalEstimatedCost}
        </Text>

        <View style={styles.shoppingList}>
          {/* Group shopping list by categories */}
          {groupShoppingListByCategory(mealPlan.shoppingList).map((category, index) => (
            <View key={index} style={styles.shoppingSection}>
              <Text style={styles.shoppingCategory}>{category.name}</Text>
              <View style={styles.list}>
                {category.items.map((item, itemIndex) => (
                  <Text key={itemIndex} style={styles.listItem}>
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Prep Tips */}
        <Text style={styles.subtitle}>Preparation Tips</Text>
        <View style={styles.tipBox}>
          {mealPlan.prepTips.map((tip, index) => (
            <Text key={index} style={styles.text}>
              • {tip}
            </Text>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.smallText}>
            Created with Seasonally Simple • seasonallysimple.com
          </Text>
          <Text style={styles.smallText}>Page 1 of {mealPlan.meals.length + 1}</Text>
        </View>
      </Page>

      {/* Individual Recipe Pages */}
      {mealPlan.meals.map((recipe, index) => (
        <Page key={index} size="A4" style={styles.page}>
          {/* Header with logo and date */}
          <View style={styles.header}>
            <Image
              src="/images/seasonally-simple-logo.png"
              style={styles.logo}
            />
            <Text style={styles.smallText}>
              {dayNames[index % 5]} • {formatDate(generatedDate)}
            </Text>
          </View>

          {/* Recipe title and description */}
          <View style={styles.recipeHeader}>
            <Text style={styles.recipeTitle}>{recipe.name}</Text>
            {recipe.seasonalNote && (
              <Text style={styles.text}>{recipe.seasonalNote}</Text>
            )}
          </View>

          {/* Recipe metrics */}
          <View style={styles.recipeMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{recipe.prepTime}</Text>
              <Text style={styles.metricLabel}>Prep Time</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{recipe.cookTime}</Text>
              <Text style={styles.metricLabel}>Cook Time</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{recipe.totalTime}</Text>
              <Text style={styles.metricLabel}>Total Time</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{recipe.servings}</Text>
              <Text style={styles.metricLabel}>Servings</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{recipe.difficulty}</Text>
              <Text style={styles.metricLabel}>Difficulty</Text>
            </View>
          </View>

          {/* Ingredients */}
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientSection}>
            <View style={styles.list}>
              {recipe.ingredients.map((ingredient, i) => (
                <Text key={i} style={styles.listItem}>
                  • {ingredient}
                </Text>
              ))}
            </View>
          </View>

          {/* Instructions */}
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.list}>
            {recipe.instructions.map((instruction, i) => (
              <View key={i} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{i + 1}</Text>
                <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
                  {instruction}
                </Text>
              </View>
            ))}
          </View>

          {/* Tips and notes */}
          {recipe.tips && recipe.tips.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Chef's Tips</Text>
              <View style={styles.tipBox}>
                {recipe.tips.map((tip, i) => (
                  <Text key={i} style={styles.text}>
                    • {tip}
                  </Text>
                ))}
              </View>
            </>
          )}

          {/* Footer */}
          <View style={styles.footer} fixed>
            <Text style={styles.smallText}>
              Created with Seasonally Simple • seasonallysimple.com
            </Text>
            <Text style={styles.smallText}>
              Page {index + 2} of {mealPlan.meals.length + 1}
            </Text>
          </View>
        </Page>
      ))}

      {/* Leftovers Ideas Page */}
      <Page size="A4" style={styles.page}>
        {/* Header with logo and date */}
        <View style={styles.header}>
          <Image
            src="/images/seasonally-simple-logo.png"
            style={styles.logo}
          />
          <Text style={styles.smallText}>
            Generated on {formatDate(generatedDate)}
          </Text>
        </View>

        <Text style={styles.subtitle}>Leftover Ideas</Text>
        <Text style={styles.text}>
          Make the most of your ingredients with these creative ideas for leftovers:
        </Text>

        <View style={styles.list}>
          {mealPlan.leftoverIdeas.map((idea, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Idea {index + 1}:</Text> {idea}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.smallText}>
            Created with Seasonally Simple • seasonallysimple.com
          </Text>
          <Text style={styles.smallText}>
            Page {mealPlan.meals.length + 2} of {mealPlan.meals.length + 2}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Helper function to group shopping list items by category
const groupShoppingListByCategory = (shoppingList: string[]) => {
  const categories = [
    { name: 'Produce', items: [] as string[] },
    { name: 'Meat & Seafood', items: [] as string[] },
    { name: 'Dairy & Eggs', items: [] as string[] },
    { name: 'Pantry', items: [] as string[] },
    { name: 'Other', items: [] as string[] },
  ];

  shoppingList.forEach(item => {
    // Check if the item specifies a section
    if (item.includes('(Produce)') || item.toLowerCase().includes('fresh')) {
      categories[0].items.push(item.replace('(Produce)', '').trim());
    } else if (
      item.includes('(Meat)') || 
      item.includes('(Seafood)') || 
      item.toLowerCase().includes('meat') || 
      item.toLowerCase().includes('chicken') || 
      item.toLowerCase().includes('beef') || 
      item.toLowerCase().includes('fish') || 
      item.toLowerCase().includes('seafood')
    ) {
      categories[1].items.push(item.replace('(Meat)', '').replace('(Seafood)', '').trim());
    } else if (
      item.includes('(Dairy)') || 
      item.toLowerCase().includes('milk') || 
      item.toLowerCase().includes('cheese') || 
      item.toLowerCase().includes('yogurt') || 
      item.toLowerCase().includes('butter') || 
      item.toLowerCase().includes('cream') || 
      item.toLowerCase().includes('egg')
    ) {
      categories[2].items.push(item.replace('(Dairy)', '').trim());
    } else if (
      item.includes('(Pantry)') || 
      item.toLowerCase().includes('canned') || 
      item.toLowerCase().includes('dried') || 
      item.toLowerCase().includes('spice') || 
      item.toLowerCase().includes('oil') || 
      item.toLowerCase().includes('flour') || 
      item.toLowerCase().includes('sugar') || 
      item.toLowerCase().includes('pasta') || 
      item.toLowerCase().includes('rice')
    ) {
      categories[3].items.push(item.replace('(Pantry)', '').trim());
    } else {
      categories[4].items.push(item);
    }
  });

  // Remove empty categories
  return categories.filter(category => category.items.length > 0);
};

export default MealPlanPDF;