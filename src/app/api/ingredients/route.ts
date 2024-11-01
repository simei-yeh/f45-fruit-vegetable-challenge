import { NextApiRequest } from 'next';
import prisma from '../../../../lib/prisma'; // Adjust the import based on your setup

export async function GET(req: NextApiRequest) {
  try {
    const ingredients = await prisma.ingredient.findMany();
    return new Response(JSON.stringify(ingredients), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch ingredients' }), { status: 500 });
  }
}
