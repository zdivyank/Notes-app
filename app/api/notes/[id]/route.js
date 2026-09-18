import { ConnectDB } from "@/lib/db";
import { Note } from "@/lib/models/Notes";
import mongoose from "mongoose";

export async function DELETE(request, { params }) {
  await ConnectDB();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json(
      { message: "Invalid note ID" },
      { status: 400 }
    );
  }

  const deletedNote = await Note.findByIdAndDelete(id);

  if (!deletedNote) {
    return Response.json(
      { message: "Note not found" },
      { status: 404 }
    );
  }

  return Response.json({
    success: true,
    message: "Note deleted successfully",
    note: deletedNote,
  });
}

export async function PUT(request, { params }) {
  try {
    await ConnectDB();

    const { id } = await params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { message: "Invalid note ID" },
        { status: 400 }
      );
    }

    // Get data from request body
    const { title, content } = await request.json();

    // Validate fields
    if (!title || !content) {
      return Response.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    // Update note
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      {
        title,
        content,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    // Note not found
    if (!updatedNote) {
      return Response.json(
        { message: "Note not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    console.error("PUT error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update note",
        error: error.message,
      },
      { status: 500 }
    );
  }
}