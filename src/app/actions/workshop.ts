'use server';

import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function revalidateWorkshopAfterPublish(): Promise<{ revalidated: boolean }> {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims?.sub) {
        return { revalidated: false };
    }

    revalidatePath('/');
    return { revalidated: true };
}
