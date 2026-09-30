"use client";

import { createBrowserClient } from "@supabase/ssr";

export default function LoginButton() {
    const signInWithGoogle = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
        );

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <button
            onClick={signInWithGoogle}
            style={{
                fontSize: "20px",
                padding: "12px 20px",
                cursor: "pointer",
            }}
        >
            Sign in with Google
        </button>
    );
}