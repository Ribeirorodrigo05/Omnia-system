import { NextRequest, NextResponse } from "next/server";
import {
  getUserByIdService,
  updateUserService,
  deleteUserService,
  deactivateUserService,
} from "@/server/services/user";

// GET /api/users/[id] - Obter usuário por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await getUserByIdService(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Usuário não encontrado" ? 404 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error in GET /api/users/[id]:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Atualizar usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const result = await updateUserService(id, body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, errors: result.errors },
        { status: result.error === "Usuário não encontrado" ? 404 : 400 }
      );
    }

    return NextResponse.json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in PUT /api/users/[id]:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Deletar usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);

    // Verificar se é soft delete (desativar) ou hard delete
    const soft = searchParams.get("soft") === "true";

    let result;
    if (soft) {
      result = await deactivateUserService(id);
    } else {
      result = await deleteUserService(id);
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Usuário não encontrado" ? 404 : 400 }
      );
    }

    return NextResponse.json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in DELETE /api/users/[id]:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
