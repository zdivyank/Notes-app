import mongoose from "mongoose"

const NotesSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
)

export const Note = mongoose.models.Note || mongoose.model("Note", NotesSchema)