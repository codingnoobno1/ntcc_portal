-- Run this in Supabase SQL Editor to fully sync the students table schema

-- 1. Ensure all columns exist
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS university_id TEXT,
ADD COLUMN IF NOT EXISTS enrollment_number TEXT,
ADD COLUMN IF NOT EXISTS section TEXT,
ADD COLUMN IF NOT EXISTS enrollment_year INT,
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS current_semester INT DEFAULT 1;

-- 2. Handle potential column naming differences (roll_number vs enrollment_number)
-- If your existing data uses roll_number, keep it. 
-- The Portal and Blazor app are now configured to handle both.

-- 3. Enable RLS and add policies for Admin visibility
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Allow service role (used by Portal) to do everything
DROP POLICY IF EXISTS "Service role full access" ON public.students;
CREATE POLICY "Service role full access" ON public.students
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Allow authenticated users (Admin in Blazor) to read all students
DROP POLICY IF EXISTS "Admins can read all students" ON public.students;
CREATE POLICY "Admins can read all students" ON public.students
FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to update their own record if needed 
-- (Optional, but good for student portal features later)
DROP POLICY IF EXISTS "Students can update own record" ON public.students;
CREATE POLICY "Students can update own record" ON public.students
FOR UPDATE TO authenticated USING (auth.uid()::text = id) WITH CHECK (auth.uid()::text = id);

-- 4. Ensure batch_id foreign key
ALTER TABLE public.students
DROP CONSTRAINT IF EXISTS fk_student_batch,
ADD CONSTRAINT fk_student_batch 
FOREIGN KEY (batch_id) 
REFERENCES public.batches(id);

-- 5. Academic Stage Rules Enhancement
CREATE TABLE IF NOT EXISTS public.academic_stage_rules (
    id TEXT PRIMARY KEY,
    program_id TEXT REFERENCES public.programs(id),
    semester_number INT,
    stage_type TEXT,
    stage_name TEXT,
    is_visible BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'ongoing',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add columns if table already existed
ALTER TABLE public.academic_stage_rules ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE public.academic_stage_rules ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ongoing';
ALTER TABLE public.academic_stage_rules ADD COLUMN IF NOT EXISTS description TEXT;

-- 6. Enable RLS and Policies for Stage Rules
ALTER TABLE public.academic_stage_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service role to manage stage rules" ON public.academic_stage_rules;
CREATE POLICY "Allow service role to manage stage rules" 
ON public.academic_stage_rules 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read stage rules" ON public.academic_stage_rules;
CREATE POLICY "Allow authenticated users to read stage rules" 
ON public.academic_stage_rules 
FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow anon users to read stage rules" ON public.academic_stage_rules;
CREATE POLICY "Allow anon users to read stage rules" 
ON public.academic_stage_rules 
FOR SELECT 
TO anon 
USING (true);
