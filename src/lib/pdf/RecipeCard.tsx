import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { styles, colors } from './styles';
import { Recipe } from '@/lib/claude';

interface RecipeCardProps {
  recipe: Recipe;
  generatedDate?: Date;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const RecipeCardPDF: React.FC<RecipeCardProps> = ({ 
  recipe, 
  generatedDate = new Date() 
}) => {
  return (
    <Document>
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
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.listItem}>
                • {ingredient}
              </Text>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <Text style={styles.sectionTitle}>Instructions</Text>
        <View style={styles.list}>
          {recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>{index + 1}</Text>
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
              {recipe.tips.map((tip, index) => (
                <Text key={index} style={styles.text}>
                  • {tip}
                </Text>
              ))}
            </View>
          </>
        )}

        {/* Nutrition information */}
        {recipe.nutrition && (
          <>
            <Text style={styles.sectionTitle}>Nutrition Highlights</Text>
            <View style={styles.nutritionHighlight}>
              <View style={styles.row}>
                <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Calories:</Text> {recipe.nutrition.calories} per serving
                </Text>
                <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Protein:</Text> {recipe.nutrition.protein}
                </Text>
                <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Fiber:</Text> {recipe.nutrition.fiber}
                </Text>
              </View>
              {recipe.nutrition.highlights && (
                <View style={styles.list}>
                  {recipe.nutrition.highlights.map((highlight, index) => (
                    <Text key={index} style={styles.listItem}>
                      • {highlight}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.smallText}>
            Created with Seasonally Simple • seasonallysimple.com
          </Text>
          <Text style={styles.smallText}>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default RecipeCardPDF;