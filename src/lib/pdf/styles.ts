import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: '/fonts/Montserrat-Regular.ttf' },
    { src: '/fonts/Montserrat-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/Montserrat-Light.ttf', fontWeight: 'light' },
  ],
});

Font.register({
  family: 'Playfair Display',
  fonts: [
    { src: '/fonts/PlayfairDisplay-Regular.ttf' },
    { src: '/fonts/PlayfairDisplay-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/PlayfairDisplay-Italic.ttf', fontStyle: 'italic' },
  ],
});

// Brand colors
export const colors = {
  primary: '#94a89a', // Sage green
  secondary: '#dd9a7c', // Terracotta
  accent: '#f8c05c', // Golden yellow
  background: '#f8f5f0', // Cream
  lightBg: '#ffffff', // White
  border: '#d1ddd3', // Light sage
  text: {
    dark: '#333333', // Near black
    medium: '#666666', // Dark gray
    light: '#999999', // Medium gray
  },
  success: '#6cb87e', // Green
  warning: '#f5b95a', // Amber
};

// Shared styles
export const styles = StyleSheet.create({
  // Page layouts
  page: {
    padding: 30,
    backgroundColor: colors.background,
    fontFamily: 'Montserrat',
  },
  
  // Typography
  title: {
    fontFamily: 'Playfair Display',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Playfair Display',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: colors.secondary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    color: colors.primary,
  },
  text: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.5,
    color: colors.text.dark,
  },
  smallText: {
    fontSize: 9,
    color: colors.text.medium,
    lineHeight: 1.4,
  },
  
  // Layout components
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  logo: {
    width: 120,
    height: 40,
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: colors.lightBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  column: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Lists
  list: {
    marginLeft: 10,
    marginBottom: 15,
  },
  listItem: {
    fontSize: 11,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  
  // Recipe specific
  recipeHeader: {
    marginBottom: 15,
  },
  recipeTitle: {
    fontFamily: 'Playfair Display',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.primary,
  },
  recipeMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: colors.primary + '15', // 15% opacity
    padding: 10,
    borderRadius: 5,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  metricLabel: {
    fontSize: 9,
    color: colors.text.medium,
  },
  ingredientSection: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  instructionItem: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  instructionNumber: {
    backgroundColor: colors.secondary,
    color: colors.lightBg,
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    marginRight: 10,
    fontSize: 11,
    padding: 2,
  },
  
  // Tips and notes
  tipBox: {
    backgroundColor: colors.accent + '20', // 20% opacity
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 15,
  },
  tipTitle: {
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 5,
    color: colors.secondary,
  },
  nutritionHighlight: {
    backgroundColor: colors.success + '15', // 15% opacity
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  
  // Meal plan specific
  weekOverview: {
    marginBottom: 20,
  },
  dayCard: {
    backgroundColor: colors.lightBg,
    marginBottom: 15,
    padding: 12,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  dayTitle: {
    fontFamily: 'Playfair Display',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    fontSize: 10,
  },
  mealType: {
    width: '20%',
    fontWeight: 'bold',
    color: colors.text.medium,
  },
  mealName: {
    width: '80%',
    color: colors.text.dark,
  },
  shoppingList: {
    marginTop: 20,
    marginBottom: 20,
  },
  shoppingSection: {
    marginBottom: 15,
  },
  shoppingCategory: {
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.secondary,
    marginBottom: 8,
    backgroundColor: colors.background,
    padding: 5,
    borderRadius: 3,
  },
});

export default styles;