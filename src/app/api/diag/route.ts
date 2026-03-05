import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    const { data: profiles, error: pError } = await supabase.from('profiles').select('id, username')
    const { data: designs, error: dError } = await supabase.from('designs').select('id, user_id, title')

    // Fetch specifically joining profiles to designs
    const { data: joined, error: jError } = await supabase.from('designs').select('id, user_id, title, profiles(username)')

    return NextResponse.json({
        profiles,
        profilesError: pError,
        designs,
        designsError: dError,
        joined,
        joinedError: jError
    })
}
