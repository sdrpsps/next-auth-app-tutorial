import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    return new NextResponse("You are not authorized to access this page", { status: 403 })
  }

  return new NextResponse("OK!", { status: 200 })
}