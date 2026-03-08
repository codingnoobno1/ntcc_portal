import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
    try {
        const { name, university_id, enrollment_number, email, password, batch, course, school } = await req.json();

        if (!name || !university_id || !enrollment_number || !email || !password || !batch || !course) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // 1. Sign up user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                }
            }
        });

        if (authError) {
            return NextResponse.json({ message: authError.message }, { status: 400 });
        }

        if (!authData.user) {
            return NextResponse.json({ message: 'User creation failed' }, { status: 500 });
        }

        // 2. Insert profile data into the custom 'profiles' table
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([
                {
                    id: authData.user.id,
                    full_name: name,
                    university_id,
                    enrollment_number,
                    email,
                    course,
                    batch,
                    school: school || 'Amity School of Engineering and Technology',
                    role: 'student'
                }
            ]);

        if (profileError) {
            // Recommendation: In a production environment, you might want to delete the Auth user if profile creation fails
            console.error('Profile Creation Error:', profileError);
            return NextResponse.json({ message: 'Account created but profile setup failed. Please contact support.' }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Student registered successfully',
            user: { name, id: university_id }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
