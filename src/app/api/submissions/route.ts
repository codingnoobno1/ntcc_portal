import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import NTCCSubmission from '@/models/NTCCSubmission';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { student_id, type, title, description, file_url } = await req.json();

        if (!student_id || !type || !title || !file_url) {
            return NextResponse.json({ message: 'Missing submission fields' }, { status: 400 });
        }

        const submission = await NTCCSubmission.create({
            student_id,
            type,
            title,
            description,
            file_url,
        });

        return NextResponse.json({ message: 'Submission created successfully', submission }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const student_id = searchParams.get('student_id');

        if (!student_id) {
            return NextResponse.json({ message: 'Student ID is required' }, { status: 400 });
        }

        const submissions = await NTCCSubmission.find({ student_id }).sort({ createdAt: -1 });
        return NextResponse.json(submissions, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
