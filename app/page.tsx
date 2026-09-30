// import { supabase } from "@/lib/supabase";
//
// export default async function Home() {
//     const { data: movies, error } = await supabase
//         .from("movies")
//         .select("*");
//
//     if (error) {
//         return (
//             <main>
//                 <h1>Error loading movies</h1>
//                 <p>{error.message}</p>
//             </main>
//         );
//     }
//
//     return (
//         <main>
//             <h1>My Movies</h1>
//
//             <ul>
//                 {movies.map((movie) => (
//                     <li key={movie.id}>
//                         {movie.title} - {movie.genre}
//                     </li>
//                 ))}
//             </ul>
//         </main>
//     );
// }

import LoginButton from "./login-button";
import { createClient } from "@/lib/supabase-server";
import ProfileForm from "./profile-form";
import Link from "next/link";

export default async function Home() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Not logged in
    if (!user) {
        return (
            <main style={{ padding: "40px" }}>
                <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
                    Welcome
                </h1>

                <LoginButton />
            </main>
        );
    }

    // Get logged-in user's profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

    return (
        <main style={{ padding: "40px" }}>
            <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
                Welcome
            </h1>

            <p style={{ fontSize: "20px", marginBottom: "20px" }}>
                Logged in as {user.email}
            </p>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "30px",
                    fontSize: "18px",
                }}
            >
                <Link href="/profile">Profile</Link>
                <Link href="/dashboard">Dashboard</Link>
            </div>

            {(!profile?.first_name || !profile?.last_name) && (
                <div>
                    <p style={{ fontSize: "20px", marginBottom: "15px" }}>
                        Please complete your profile by adding your first and last name.
                    </p>

                    <ProfileForm userId={user.id} />
                </div>
            )}
        </main>
    );
}