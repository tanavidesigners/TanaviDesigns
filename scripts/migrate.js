import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:SupaBase@2026@db.wnbckffbhhmxxjbetzvs.supabase.co:5432/postgres';

async function runMigrations() {
  console.log('Connecting to Supabase PostgreSQL Database...');
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected successfully to Supabase PostgreSQL!');

    const migrationFiles = [
      'supabase/migrations/00001_tanavi_core_schema.sql',
      'supabase/migrations/00002_tanavi_rls_policies.sql',
      'supabase/migrations/00003_tanavi_functions_and_views.sql',
      'supabase/seed.development.sql'
    ];

    for (const file of migrationFiles) {
      console.log(`Executing SQL migration: ${file}...`);
      const filePath = path.resolve(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
        console.log(`✓ Completed ${file}`);
      } else {
        console.error(`File not found: ${filePath}`);
      }
    }

    console.log('All migrations and initial seed executed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
