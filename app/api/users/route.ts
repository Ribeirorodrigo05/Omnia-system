import { NextRequest, NextResponse } from "next/server";
import {
  createUserService,
  listUsersService,
  getUserStatsService,
} from "@/server/services/user";

// GET /api/users - Listar usuários ou obter estatísticas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Se for solicitação de estatísticas
    if (searchParams.get("stats") === "true") {
      const result = await getUserStatsService();

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(result.data);
    }

    // Parâmetros de listagem
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const onlyActive = searchParams.get("onlyActive") !== "false";
    const sortBy =
      (searchParams.get("sortBy") as "name" | "email" | "createdAt") ||
      "createdAt";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const result = await listUsersService({
      page,
      limit,
      search,
      onlyActive,
      sortBy,
      sortOrder,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST /api/users - Criar usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await createUserService(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: result.message,
        data: result.data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
