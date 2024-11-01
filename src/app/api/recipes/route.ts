// app/api/recipes/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Adjust the path to your prisma instance

export async function POST(request: Request) {
  const { ingredientIds, locationId } = await request.json(); // Expecting locationId in the request

  if (!Array.isArray(ingredientIds)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        location_id: locationId, // Filter recipes by location_id
      },
      include: {
        recipe_ingredients: {
          include: {
            ingredient: true, // This fetches the ingredient details
          },
        },
        location: true, // Include location details
      },
    });

    // Calculate non-matching count for each recipe
    const recipesWithNonMatchingCount = recipes.map((recipe) => {
      const nonMatchingCount = recipe.recipe_ingredients.filter((ri) => {
        const isNonMatching = !ingredientIds.includes(ri.ingredient_id);
        
        // Access the ingredient object directly
        const ingredient = ri.ingredient;

        // Check if the ingredient exists and if it's either a fruit or vegetable
        const isFruitOrVegetable = ingredient && (ingredient.is_fruit || ingredient.is_vegetable);
        
        return isNonMatching && isFruitOrVegetable; // Count only if both conditions are true
      }).length;

      return {
        ...recipe,
        nonMatchingCount,
      };
    });

    const sortedRecipes = recipesWithNonMatchingCount.sort(
      (a, b) => b.nonMatchingCount - a.nonMatchingCount
    );

    return NextResponse.json(sortedRecipes, { status: 200 });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
