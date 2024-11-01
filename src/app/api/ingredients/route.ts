import prisma from '../../../../lib/prisma'; // Adjust the import based on your setup

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return new Response(JSON.stringify(ingredients), { status: 200 });
  } catch (error: unknown) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch ingredients' }), { status: 500 });
  }
}
