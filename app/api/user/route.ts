// import { createUserService } from "@/server/services/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request, res: NextResponse) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await req.json();

  console.log(body);
  return NextResponse.json({ ...body });
  //   const result = await  createUserService(req)
}
