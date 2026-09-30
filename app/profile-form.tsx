"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function ProfileForm({
                                        userId,
                                        initialFirstName = "",
                                        initialLastName = "",
                                    }: {
    userId: string;
    initialFirstName?: string;
    initialLastName?: string;
}) {
    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);
    const [photo, setPhoto] = useState<File | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
        );

        let avatarUrl: string | null = null;

        // Upload the selected photo to Supabase Storage
        if (photo) {
            const fileExtension = photo.name.split(".").pop();
            const fileName = `${userId}-${Date.now()}.${fileExtension}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(fileName, photo);

            if (uploadError) {
                alert(uploadError.message);
                return;
            }

            const { data } = supabase.storage
                .from("avatars")
                .getPublicUrl(fileName);

            avatarUrl = data.publicUrl;
        }

        // Update the user's profile
        const updates: {
            first_name: string;
            last_name: string;
            avatar_url?: string;
        } = {
            first_name: firstName,
            last_name: lastName,
        };

        if (avatarUrl) {
            updates.avatar_url = avatarUrl;
        }

        const { error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", userId);

        if (error) {
            alert(error.message);
            return;
        }

        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={{
                    fontSize: "18px",
                    padding: "10px",
                    marginRight: "10px",
                }}
            />

            <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={{
                    fontSize: "18px",
                    padding: "10px",
                    marginRight: "10px",
                }}
            />

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                style={{
                    fontSize: "16px",
                    marginRight: "10px",
                }}
            />

            <button
                type="submit"
                style={{
                    fontSize: "18px",
                    padding: "10px 16px",
                    cursor: "pointer",
                }}
            >
                Save
            </button>
        </form>
    );
}