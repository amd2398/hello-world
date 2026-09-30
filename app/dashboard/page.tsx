import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If there is no logged-in user, send them back home
    if (!user) {
        redirect("/");
    }

    return (
        <main style={{ padding: "40px" }}>
            <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
                Dashboard
            </h1>

            <p style={{ fontSize: "20px" }}>
                This page is only available to logged-in users.
            </p>

            <p style={{ fontSize: "20px", marginTop: "10px" }}>
                Logged in as {user.email}
            </p>
        </main>
    );
}