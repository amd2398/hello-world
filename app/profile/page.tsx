import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import ProfileForm from "../profile-form";

export default async function ProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", user.id)
        .single();

    return (
        <main style={{ padding: "40px" }}>
            <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
                Profile
            </h1>

            <p style={{ fontSize: "20px", marginBottom: "20px" }}>
                Email: {user.email}
            </p>

            <ProfileForm
                userId={user.id}
                initialFirstName={profile?.first_name ?? ""}
                initialLastName={profile?.last_name ?? ""}
            />
        </main>
    );
}