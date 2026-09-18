import { ConnectDB } from "@/lib/db";
import { Note } from "@/lib/models/Notes";

export async function POST(request) {
    await ConnectDB();


    const { title, content } = await request.json();

    const note = await Note.create({
        title, content
    });

    return Response.json(note, {
        status: 201
    })
}
export async function GET(request) {
    await ConnectDB();

    const note = await Note.find().sort({ createdAt: -1 });

    return Response.json(note, {
        status: 200
    })
}