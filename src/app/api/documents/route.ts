import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdminApi } from "@/lib/auth-guard";

export async function GET() {
  const guard = await guardAdminApi();
  if (guard.error) return guard.error;

  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(documents);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
