import React, { useState } from 'react';
import { View, Text, Button, FlatList, ImageBackground, TouchableOpacity, StyleSheet, Image } from 'react-native';
import image from './Images/italy.jpg';
import axios from 'axios';
import SearchComponent from './components/searchComponent';
import Recipe from './components/recipeComponent';

const MealScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Uses api to recipe title, image, and id
    const searchRecipes = async (query) => {
        const apiKey = 'ebd2997c2bmshaf4f87ff8121c4ep1494b1jsnf8a459f3a414';
        const apiUrl = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search';
        try {
            const response = await axios.get(apiUrl, {
                params: { query: query },
                headers: {
                    'x-rapidapi-key': apiKey,
                    'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
                }
            });
            const recipes = response.data.results.map(item => new Recipe(item));
            console.log(recipes);
            setSearchResults(response.data.results);
        } catch (error) {
            console.error('Failed to fetch recipes', error);
            setSearchResults([]);
        }
    };

    const handleSearch = () => {
        searchRecipes(searchQuery);
    };


    //Manage the selected category
    const [selectedCategory, setSelectedCategory] = useState(null);

    //Filter meals by category
    const filterMealsByCategory = (category) => {
        // Return all meals if no category is selected
        if (!category) return preCodedMeals;
      
        // Convert input category to lowercase for case-insensitive comparison
        const lowerCaseCategory = category.toLowerCase();
      
        // Filter meals by category, ignoring case
        return preCodedMeals.filter(meal => 
          meal.categories.some(cat => cat.toLowerCase() === lowerCaseCategory)
        );
    };
      

    const CategoryButton = ({ category, setSelectedCategory }) => (
        <TouchableOpacity onPress={() => setSelectedCategory(category)}>
            <View style={styles.categoryButton}>
                <Text style={{ color: 'white' }}>{category.toUpperCase()}</Text>
            </View>
        </TouchableOpacity>
    );

    const mealCategories = ['vegan', 'high protein', 'gluten free'];

    return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20 }}>
            <SearchComponent setSearchQuery={setSearchQuery} handleSearch={handleSearch} />


                <FlatList
                    data={searchResults}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}>
                            <View style={{ height: 50, backgroundColor: 'white', padding: 10, marginVertical: 5, borderRadius: 15 }}>
                                <Text>{item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    addButton: {
        backgroundColor: 'teal',
        padding: 5,
        borderRadius: 3,
    },
    categoryButton: {
        // add your styling for the button here
        backgroundColor: 'navy',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
    },
});

export default MealScreen;