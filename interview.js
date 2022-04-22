const { categories, recipes, ingredients } = require("./data.js");

const prompt = require("prompt-sync")({ sigint: true });

var currentIngredientId =
  ingredients[ingredients.length - 1]["ingredientId"] + 1;

while (true) {
  var result = parseInt(
    prompt(
      "Press 1.) Update ingredient inventory. Press 2.) Update recipe collection. Press 3.) Check if you have enough ingredients to make a given recipe. Input: "
    )
  );

  if (result === 1) {
    result = parseInt(
      prompt(
        "1.) Add new ingredients. 2.) Delete ingredients. 3.) Update quantities. Input: "
      )
    );
    if (result === 1) {
      ingredient = prompt("Enter ingredient name to add: ");
      ingredient.trim().toLowerCase();
      console.log(ingredient);
      quantity = prompt("Enter quantity of this ingredient: ");
      if (!haveIngredientGivenName(ingredient, ingredients)) {
        ingredients.push({
          ingredientId: currentIngredientId,
          name: ingredient,
          quantity: quantity,
        });
        currentIngredientId++;
        console.log(
          `Here is the ${ingredient} and here is the quantity ${quantity}`
        );
        console.log(ingredients);
      } else {
        updateQuantityGivenName(quantity, ingredient, ingredients);
      }
    } else if (result === 2) {
      ingredient = prompt("Enter ingredient name to delete: ");
      ingredient.toLowerCase().replace(/\s/g, "");
      console.log(ingredient);
      for (var i = 0; i < ingredients.length; i++) {
        if (ingredients[i].name === ingredient) {
          ingredients.pop(ingredient);
        }
      }
    } else if (result === 3) {
      var ingredient_list_string = prompt(
        "Enter a comma-separated list of ingredients to modify: "
      );
      var quantity_list_string = prompt(
        "Enter a comma-separated list of updated quantities with units: "
      );
      var ingredient_list = ingredient_list_string.split(",");
      var quantity_list = quantity_list_string.split(",");
      if (ingredient_list.length === quantity_list.length) {
        for (var i = 0; i < ingredient_list.length; i++) {
          for (var j = 0; j < ingredients.length; j++) {
            if (
              ingredient_list[i].trim().toLowerCase() ===
              ingredients[j]["name"].trim().toLowerCase()
            ) {
              ingredients.pop(ingredients[j]);
            } else {
              console.log("This ingredient is not in your inventory.");
            }
          }
        }
      } else {
        console.log("Length of your comma-separated lists doesn't match.");
      }
    }
  } else if (result === 2) {
    result = parseInt(
      prompt("1.) Add new recipes. 2.) Delete recipes. 3.) Update recipes")
    );
    if (result === 1) {
      var name = prompt("Enter name of recipe: ");
      var desc = prompt("Enter description of recipe: ");
      ingredient_list_string = prompt(
        "Enter list of ingredients sepatated by commas: "
      );
      quantity_list_string = prompt(
        "Enter quantity of each ingredient separated by commas: "
      );
      var ingredient_list = ingredient_list_string.split(",");
      var quantity_list = quantity_list_string.split(",");
      var ingredient_quantity_tuple_list = [];
      if (ingredient_list.length === quantity_list.length) {
        for (var i = 0; i < ingredient_list.length; i++) {
          ingredient_quantity_tuple_list.push([
            getIngredientIdGivenName(ingredient_list[i], ingredients),
            quantity_list[i],
          ]);
        }
      } else {
        console.log("Length of your comma-separated lists doesn't match.");
      }
      recipes.push({
        title: name,
        description: desc,
        ingredients: ingredient_quantity_tuple_list,
      });
    } else if (result === 2) {
      for (var i = 0; i < recipes.length; i++) {
        console.log(i + ".) " + JSON.stringify(recipes[i]) + "\n");
      }
      result = parseInt(
        prompt("Enter the number of which recipe you would like to delete: ")
      );
      if (result < recipes.length && result >= 0) {
        console.log("Deleting recipe " + JSON.stringify(recipes[result]));
        recipes.pop(recipes[result]);
      } else {
        console.log("Invalid input.");
      }
    } else if (result === 3) {
      for (var i = 0; i < recipes.length; i++) {
        console.log(i + ".) " + JSON.stringify(recipes[i]) + "\n");
      }
      result = parseInt(
        prompt("Enter the number of which recipe you would like to update: ")
      );
      if (result < recipes.length && result >= 0) {
        console.log("Selected this recipe: " + JSON.stringify(recipes[result]));
        var desiredRecipe = recipes[result];
      } else {
        console.log("Invalid input.");
      }
      for (var i = 0; i < desiredRecipe["ingredients"].length; i++) {
        console.log(
          i +
            ".) " +
            getIngredientAndQuantity(
              desiredRecipe["ingredients"][i][0],
              ingredients
            ) +
            "\n"
        );
      }
      var desiredIngredientIndex = parseInt(
        prompt(
          "What is the number of the ingredient you would like to update? "
        )
      );
      result = prompt("Enter new quantity of this ingredient with units: ");

      desiredRecipe["ingredients"][desiredIngredientIndex][1] = result;
      console.log("New quantities are as follows: ");
      for (var i = 0; i < desiredRecipe["ingredients"].length; i++) {
        console.log(
          i +
            ".) " +
            getIngredientAndQuantity(
              desiredRecipe["ingredients"][i][0],
              ingredients
            ) +
            "\n"
        );
      }
    }
  } else if (result === 3) {
    for (var i = 0; i < recipes.length; i++) {
      console.log(i + ".) " + JSON.stringify(recipes[i]) + "\n");
    }
    result = prompt(
      "Enter a comma-separated list of the numbers of each recipe you want to check."
    );
    var list_of_recipe_numbers = result.split(",");
    console.log(list_of_recipe_numbers);
    for (var i = 0; i < list_of_recipe_numbers.length; i++) {
      var recipeIndex = parseInt(list_of_recipe_numbers[i]);
      if (!isNaN(recipeIndex)) {
        var r = recipes[recipeIndex];
        console.log(JSON.stringify(ingredients) + " " + JSON.stringify(r));
        if (!checkRightQuantities(ingredients, r)) {
          console.log(
            "❌ Incorrect quantities found in recipe " +
              JSON.stringify(r) +
              "\n"
          );
        } else {
          console.log(
            "✅ Correct quantities found for recipe " + JSON.stringify(r) + "\n"
          );
        }
      } else {
        console.log("Error within your comma-separated list of numbers input.");
        break;
      }

      for (var j = 0; j < r["ingredients"].length; j++) {
        if (!haveIngredientGivenId(r["ingredients"][j][0], ingredients)) {
          console.log("Cannot make recipe " + list_of_recipe_numbers[i]);
          break;
        }
      }
    }
  } else if (result === 4) {
    printRecipes(recipes);
  } else if (result === 5) {
    printIngredients(ingredients);
  }
}

function getIngredientIdGivenName(ingredientName, ingredients) {
  for (var i = 0; i < ingredients.length; i++) {
    if (ingredients[i]["name"] === ingredientName) {
      return ingredients[i]["ingredientId"];
    }
  }
}

function updateQuantityGivenName(newQuantity, ingredientName, ingredients) {
  ingredientName = ingredientName.trim().toLowerCase();
  for (var i = 0; i < ingredients.length; i++) {
    if (ingredients[i]["name"].trim().toLowerCase() === ingredientName) {
      ingredients[i]["quantity"] = newQuantity;
      break;
    }
  }
}

function getQuantity(ingredientId, ingredients) {
  for (var i = 0; i < ingredients.length; i++) {
    if (ingredients[i]["ingredientId"] === ingredientId) {
      return ingredients[i]["quantity"];
    }
  }
}

function getIngredientAndQuantity(ingredientId, ingredients) {
  for (var i = 0; i < ingredients.length; i++) {
    if (ingredients[i]["ingredientId"] === ingredientId) {
      return ingredients[i]["name"].concat(" - ", ingredients[i]["quantity"]);
    }
  }
}

function haveIngredientGivenName(ingredientName, ingredients) {
  for (var i = 0; i < ingredients.length; i++) {
    console.log("ingredientName is " + JSON.stringify(ingredientName));
    if (
      ingredients[i]["name"].trim().toLowerCase() ===
      ingredientName.trim().toLowerCase()
    ) {
      return true;
    }
  }

  return false;
}

function haveIngredientGivenId(ingredientId, ingredients) {
  for (var i = 0; i < ingredients.length; i++) {
    if (ingredients[i]["ingredientId"] === ingredientId) {
      return true;
    }
  }

  return false;
}

function checkRightQuantities(ingredients, recipe) {
  for (var i = 0; i < recipe["ingredients"].length; i++) {
    console.log(
      "recipe[ingredients][i][0] is " +
        JSON.stringify(recipe["ingredients"][i][0])
    );
    var quantity = getQuantity(recipe["ingredients"][i][0], ingredients);
    console.log("quantity is " + quantity);
    const [, ...arr1] = quantity.match(/(\d*)([\s\S]*)/);
    const [, ...arr2] = recipe["ingredients"][i][1].match(/(\d*)([\s\S]*)/);
    console.log(
      "arr 1 " + JSON.stringify(arr1) + "   ----- arr 2" + JSON.stringify(arr2)
    );
    if (arr1[0] !== arr2[0]) {
      return false;
    }
  }
  return true;
}

function printIngredients(ingredients) {
  for (var i = 0; i < ingredients.length; i++) {
    console.log(ingredients[i]);
  }
}

function printRecipes(recipes) {
  for (var i = 0; i < recipes.length; i++) {
    console.log(recipes[i]);
  }
}
