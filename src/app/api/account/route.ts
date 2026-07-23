import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const STORAGE_BUCKETS = ['design-images', 'private-design-images', 'profile-images'] as const;

async function removeUserStorageFiles(
    adminClient: SupabaseClient,
    bucket: typeof STORAGE_BUCKETS[number],
    userId: string
) {
    while (true) {
        const { data: files, error: listError } = await adminClient.storage
            .from(bucket)
            .list(userId, { limit: 1000 });

        if (listError) {
            // A missing optional bucket should not prevent account erasure.
            console.warn(`Unable to list ${bucket} during account deletion:`, listError.message);
            return;
        }

        const paths = (files ?? [])
            .filter(file => file.name && file.id)
            .map(file => `${userId}/${file.name}`);

        if (paths.length === 0) return;

        const { error: storageError } = await adminClient.storage.from(bucket).remove(paths);
        if (storageError) throw storageError;
    }
}

export async function DELETE(request: Request) {
    const requestOrigin = request.headers.get('origin');
    if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
        return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
        return NextResponse.json(
            { error: 'Account deletion is temporarily unavailable.' },
            { status: 503 }
        );
    }

    const body = await request.json().catch(() => null) as { confirmation?: string } | null;
    if (body?.confirmation !== 'DELETE') {
        return NextResponse.json({ error: 'Invalid confirmation.' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const userClient = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: () => undefined,
        },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    // This client never receives browser cookies and must remain server-only.
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    try {
        const { error: designsError } = await adminClient
            .from('designs')
            .delete()
            .eq('user_id', user.id);
        if (designsError) throw designsError;

        for (const bucket of STORAGE_BUCKETS) {
            await removeUserStorageFiles(adminClient, bucket, user.id);
        }

        const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(user.id);
        if (deleteUserError) throw deleteUserError;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Account deletion failed:', error);
        return NextResponse.json(
            { error: 'We could not complete account deletion. Please try again.' },
            { status: 500 }
        );
    }
}
