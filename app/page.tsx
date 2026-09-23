import { supabase } from "@/lib/supabase";

export default async function Home() {
    const { data: movies, error } = await supabase
        .from("movies")
        .select("*");

    if (error) {
        return (
            <main>
                <h1>Error loading movies</h1>
                <p>{error.message}</p>
            </main>
        );
    }

    return (
        <main>
            <h1>My Movies</h1>

            <ul>
                {movies.map((movie) => (
                    <li key={movie.id}>
                        {movie.title} - {movie.genre}
                    </li>
                ))}
            </ul>
        </main>
    );
}