import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("students")
            .select("*")
            .limit(1);

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        const columns = data.length > 0 ? Object.keys(data[0]) : "No data to inspect columns";

        // Also check if we can get schema info via RPC if available, 
        // but just checking keys of one record is usually enough to spot camelCase vs snake_case

        return NextResponse.json({
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            table: "students",
            sampleRecordColumns: columns
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
