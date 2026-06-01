// history api
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const messages =
      await prisma.message.findMany({
        orderBy: {
          createdAt: "asc",
        },
      });

    return NextResponse.json(
      messages
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch messages",
      },
      { status: 500 }
    );
  }
}