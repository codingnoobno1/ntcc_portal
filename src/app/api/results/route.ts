import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import NTCCEvaluation from '@/models/NTCCEvaluation';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const student_id = searchParams.get('student_id');

        if (!student_id) {
            return NextResponse.json({ message: 'Student ID is required' }, { status: 400 });
        }

        const evaluations = await NTCCEvaluation.find({ student_id }).populate('submission_id');
        return NextResponse.json(evaluations, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
