import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { university_id, password } = await req.json();

        if (!university_id || !password) {
            return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
        }

        // Find user by university_id with program and batch info
        const { data: user, error } = await supabase
            .from("students")
            .select("*, batches(name, program_id)")
            .eq("university_id", university_id)
            .single();

        if (error || !user) {
            return NextResponse.json({ message: "Invalid University ID or Password" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return NextResponse.json({ message: "Invalid University ID or Password" }, { status: 401 });
        }

        // Return user info
        return NextResponse.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                university_id: user.university_id,
                enrollment_number: user.enrollment_number,
                enrollment_year: user.enrollment_year,
                batch_id: user.batch_id,
                batch_name: user.batches?.name,
                program_id: user.batches?.program_id,
                section: user.section,
                current_semester: user.current_semester
            }
        }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
