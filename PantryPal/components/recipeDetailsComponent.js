// RecipeDetailComponent.js
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet } from 'react-native';
import axios from 'axios';

const RecipeDetails = ({ navigation, route }) => {
    const { recipeId } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const apiKey = 'ebd2997c2bmshaf4f87ff8121c4ep1494b1jsnf8a459f3a414'; 
      const apiUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`;

      try {
        const response = await axios.get(apiUrl, {
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
          }
        });
        setRecipeDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch recipe details', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <View><Text>Error: {error}</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      {recipeDetails && (
        <View style={styles.details}>
          <Text style={styles.title}>{recipeDetails.title}</Text>
          <Image source={{ uri: recipeDetails.image }} style={styles.image} />
          <Text>Instructions: {recipeDetails.instructions}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  details: {
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical: 10,
  }
});

export default RecipeDetails;
