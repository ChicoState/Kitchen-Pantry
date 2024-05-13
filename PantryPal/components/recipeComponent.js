class Recipe {
  constructor(json) {
    this.id = json.id || 0;
    this.title = json.title || '';
    this.image = Recipe.processApiImageUrl(json.image);
    this.vegetarian = json.vegetarian || false;
    this.vegan = json.vegan || false;
    this.glutenFree = json.glutenFree || false;
    this.dairyFree = json.dairyFree || false;
    this.ketogenic = json.ketogenic || false;
    this.isFavorite = json.isFavorite || false;
    this.instructions = json.instructions || '';
  }

  static processApiImageUrl(imageUrl) {
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      return imageUrl;
    } else {
      return `https://spoonacular.com/recipeImages/${imageUrl}`;
    }
  }
}

class Ingredient {
  constructor(json) {
    this.id = json.id || 0;
    this.aisle = json.aisle || '';
    this.image = json.image || '';
    this.name = json.name || '';
    this.amount = parseFloat(json.amount) || 0.0;
    this.unit = json.unit || '';
    this.unitShort = json.unitShort || '';
    this.unitLong = json.unitLong || '';
    this.originalString = json.original || 'Unknown Ingredient';
    this.metaInformation = json.metaInformation || [];
  }
}

export default Recipe