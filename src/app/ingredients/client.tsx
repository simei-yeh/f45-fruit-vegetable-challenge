"use client"; // This line makes it a Client Component
import React, { useEffect, useState } from "react";

interface Ingredient {
  id: number;
  name: string;
  is_fruit: boolean; // Include isFruit in the Ingredient interface
  is_vegetable: boolean; // Include isVegetable in the Ingredient interface
}

interface Recipe {
  id: number;
  item_name: string;
  location: {
    id: number;
    name: string;
  };
  nonMatchingCount: number;
  recipe_ingredients: {
    id: number;
    ingredient: Ingredient;
    ingredient_id: number;
  }[];
}

const IngredientsList: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [expandedRecipeId, setExpandedRecipeId] = useState<number | null>(null); // State to track the expanded recipe

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch("/api/ingredients"); // Adjust the path based on your routing
        if (!res.ok) {
          throw new Error("Failed to fetch ingredients");
        }
        const data: Ingredient[] = await res.json();
        setIngredients(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Type guard to check if the error is an instance of Error
          setError(error.message); // Set the error message if it's an Error
        } else {
          setError("An unknown error occurred."); // Fallback for unknown errors
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchIngredients();
  }, []);
  

  // Handle checkbox change
  const handleCheckboxChange = (id: number) => {
    setSelectedIngredients((prevSelected) => {
      if (prevSelected.includes(id)) {
        // Remove from selected if already checked
        return prevSelected.filter((ingredientId) => ingredientId !== id);
      } else {
        // Add to selected if not already checked
        return [...prevSelected, id];
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredientIds: selectedIngredients }), // Send selected ingredient IDs to the server
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data: Recipe[] = await res.json();
      setRecipes(data); // Store the fetched recipes in state
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Type guard to check if the error is an instance of Error
        setError(error.message); // Set the error message if it's an Error
      } else {
        setError("An unknown error occurred."); // Fallback for unknown errors
      }
    }
  };

  // Count total selected fruits and vegetables
  const totalFruits = selectedIngredients.filter(
    (id) => ingredients.find((ingredient) => ingredient.id === id)?.is_fruit
  ).length;

  const totalVegetables = selectedIngredients.filter(
    (id) => ingredients.find((ingredient) => ingredient.id === id)?.is_vegetable
  ).length;

  const totalFandV = totalFruits + totalVegetables;

  const totalChecked = selectedIngredients.length; // Count of selected ingredients

  if (loading) return <p className="text-lg">Loading...</p>; // Increased font size
  if (error) return <p className="text-red-500">Error: {error}</p>; // Error message styling

  // Toggle the visibility of the ingredients for a specific recipe
  const toggleIngredientsVisibility = (recipeId: number) => {
    setExpandedRecipeId((prev) => (prev === recipeId ? null : recipeId));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ingredients</h1>{" "}
      {/* Increased font size and margin */}
      <form onSubmit={handleSubmit}>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ingredients.map((ingredient) => (
            <li key={ingredient.id} className="flex items-center">
              {" "}
              {/* Left aligned with flex */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(ingredient.id)}
                  onChange={() => handleCheckboxChange(ingredient.id)}
                  className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out" // Tailwind checkbox styling
                />
                <span className="ml-2 text-md sm:text-lg">
                  {ingredient.name}
                </span>{" "}
                {/* Increased font size for ingredient name */}
              </label>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-xl font-bold">
          Total Selected Ingredients: {totalChecked}
        </div>{" "}
        {/* Bold total count and increased font size */}
        <div className="mt-2 text-xl text-green-600 font-bold">
          Total Fruits and Veggies Selected: {totalFandV}
        </div>
        <button
          className="mt-4 text-white bg-indigo-700 p-4 rounded font-bold"
          type="submit"
        >
          Check for recipe or menu ideas
        </button>
      </form>
      {/* Display recipes */}
      <h2 className="text-xl font-bold mt-6">Recipes</h2>
      <ul className="text-left">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="py-4 mt-2">
            <span className="font-bold text-blue-700 text-xl">
              {recipe.location.name}
            </span>{" "}
            <span className="font-bold text-slate-500 text-xl">
              {recipe.item_name}
            </span>
            <div className="text-green-700 font-semibold">
              More fruits & veggies: {recipe.nonMatchingCount}
            </div>
            {/* Button to toggle the visibility of ingredients */}
            <button
              onClick={() => toggleIngredientsVisibility(recipe.id)}
              className="mt-2 text-blue-500 underline"
            >
              {expandedRecipeId === recipe.id
                ? "Hide Ingredients"
                : "See All Ingredients"}
            </button>
            {/* Show ingredients for the recipe if expanded */}
            {expandedRecipeId === recipe.id && (
              <div>
                <ul className="text-lg mt-2 ml-4 leading-normal">
                  {" "}
                  {/* Adjust line height here */}
                  {expandedRecipeId === recipe.id && (
                    <div>
                      <ul className="text-lg mt-2 ml-4 leading-normal">
                        {recipe.recipe_ingredients
                          .filter(
                            (ri) =>
                              ri.ingredient.is_fruit ||
                              ri.ingredient.is_vegetable
                          ) // Filter for fruits or vegetables
                          .map((ri) => (
                            <li key={ri.id} className="text-gray-700">
                              {ri.ingredient.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsList;
