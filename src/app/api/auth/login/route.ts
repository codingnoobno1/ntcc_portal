import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import NTCCUser from '@/models/NTCCUser';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { university_id, password } = await req.json();

        if (!university_id || !password) {
            return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
        }

        const user = await NTCCUser.findOne({ university_id });

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // In a real app, you'd generate a JWT here. 
        // For this simple clean implementation, we'll return user info.
        return NextResponse.json({
            message: 'Login successful',
            user: {
                name: user.name,
                university_id: user.university_id,
                email: user.email,
                batch: user.batch,
                department: user.department
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
