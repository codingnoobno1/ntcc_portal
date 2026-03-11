import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { student_id, type, title, description, file_url, stage_id } = await req.json();

        if (!student_id || !type || !title || !file_url) {
            return NextResponse.json({ message: "Missing submission fields" }, { status: 400 });
        }

        const { data: submission, error } = await supabase
            .from("submissions")
            .insert({
                student_id,
                stage_id: stage_id || "default", // Fallback if not provided
                type,
                file_url,
                status: "pending",
                submitted_at: new Date().toISOString() // Or let Supabase handle it
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ message: "Submission created successfully", submission }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const student_id = searchParams.get("student_id");

        if (!student_id) {
            return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
        }

        const { data: submissions, error } = await supabase
            .from("submissions")
            .select("*")
            .eq("student_id", student_id)
            .order("submitted_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json(submissions, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}
