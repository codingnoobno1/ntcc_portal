import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const program_id = searchParams.get("program_id");

        let query = supabase
            .from("academic_stage_rules")
            .select("*")
            .eq("is_visible", true);

        if (program_id) {
            query = query.eq("program_id", program_id);
        }

        const { data, error } = await query.order("semester_number", { ascending: true });

        if (error) throw error;

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error("API Error [/api/stages]:", error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}
