/*
  Warnings:

  - You are about to drop the `_RecipeIngredients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RecipeIngredients" DROP CONSTRAINT "_RecipeIngredients_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeIngredients" DROP CONSTRAINT "_RecipeIngredients_B_fkey";

-- DropTable
DROP TABLE "_RecipeIngredients";

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "quantity" INTEGER,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
