import { setupDatabase } from "../supabase/setupDB";

async function initDB() {
    await setupDatabase();
}

initDB();