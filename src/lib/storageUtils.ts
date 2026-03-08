import { supabase } from './supabaseClient';

/**
 * Utility for handling Supabase Storage for NTCC Portal
 */

export const BUCKETS = {
    CERTIFICATES: 'certificates',
    ID_CARDS: 'id-cards',
    LETTERS: 'letters',
} as const;

export type BucketName = typeof BUCKETS[keyof typeof BUCKETS];

/**
 * Uploads a file to a specific bucket
 */
export async function uploadFile(
    bucket: BucketName,
    path: string,
    file: File
) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            upsert: true,
        });

    if (error) throw error;
    return data;
}

/**
 * Generates a signed URL for a file that expires in 1 hour
 */
export async function getSignedUrl(bucket: BucketName, path: string) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 3600); // 1 hour

    if (error) throw error;
    return data.signedUrl;
}

/**
 * Deletes a file from a bucket
 */
export async function deleteFile(bucket: BucketName, path: string) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) throw error;
    return data;
}

/**
 * Lists files in a folder within a bucket
 */
export async function listFiles(bucket: BucketName, folder?: string) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder);

    if (error) throw error;
    return data;
}
