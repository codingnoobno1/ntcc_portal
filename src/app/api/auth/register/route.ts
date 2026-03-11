import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { name, email, password, university_id, enrollment_number, batch_id, section, current_semester } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Check if user exists
        const { data: existingUser } = await supabase
            .from("students")
            .select("id")
            .eq("email", email)
            .single();

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const password_hash = await bcrypt.hash(password, 10);
        console.log(`[Register API] Creating student: ${university_id}, Semester: ${current_semester}`);

        const { data: newUser, error } = await supabase
            .from("students")
            .insert({
                full_name: name,
                email,
                password_hash,
                university_id,
                enrollment_number,
                section,
                batch_id,
                enrollment_year: new Date().getFullYear(),
                status: 'active',
                current_semester: Number(current_semester) || 1
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        // Fetch batch details for the session
        const { data: batchData } = await supabase
            .from("batches")
            .select("name, program_id")
            .eq("id", batch_id)
            .single();

        return NextResponse.json({
            message: "User registered successfully",
            user: {
                ...newUser,
                name: newUser.full_name, // Map for consistency
                batch_name: batchData?.name,
                program_id: batchData?.program_id
            }
        }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
