import { NextResponse } from "next/server";

// In-memory storage for demo purposes
// In production, use a database like Prisma with your existing setup
let todos = [
  {
    id: 1,
    title: "Welcome to Arise Chat!",
    description: "This is your first todo item created by the AI assistant",
    priority: "medium",
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let nextId = 2;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const completed = searchParams.get("completed");

  try {
    let filteredTodos = todos;

    // Filter by completed status if specified
    if (completed !== null) {
      const isCompleted = completed === "true";
      filteredTodos = todos.filter(todo => todo.completed === isCompleted);
    }

    // Limit results
    const limitedTodos = filteredTodos
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);

    return NextResponse.json({
      todos: limitedTodos,
      total: filteredTodos.length,
      limit
    });

  } catch (error) {
    console.error("Todo GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, priority = "medium" } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const newTodo = {
      id: nextId++,
      title: title.trim(),
      description: description?.trim() || null,
      priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    todos.push(newTodo);

    return NextResponse.json(newTodo, { status: 201 });

  } catch (error) {
    console.error("Todo POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, title, description, priority, completed } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Todo ID is required" },
        { status: 400 }
      );
    }

    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }

    const existingTodo = todos[todoIndex];
    const updatedTodo = {
      ...existingTodo,
      title: title !== undefined ? title.trim() : existingTodo.title,
      description: description !== undefined ? (description?.trim() || null) : existingTodo.description,
      priority: priority !== undefined && ["low", "medium", "high"].includes(priority) ? priority : existingTodo.priority,
      completed: completed !== undefined ? Boolean(completed) : existingTodo.completed,
      updated_at: new Date().toISOString()
    };

    todos[todoIndex] = updatedTodo;

    return NextResponse.json(updatedTodo);

  } catch (error) {
    console.error("Todo PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Todo ID is required" },
        { status: 400 }
      );
    }

    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];

    return NextResponse.json({
      message: "Todo deleted successfully",
      todo: deletedTodo
    });

  } catch (error) {
    console.error("Todo DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}