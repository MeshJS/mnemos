import dotenv from "dotenv";
import { Client } from "pg";
dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = Number(process.env.DB_PORT) || 5432;
const dbUser = process.env.DB_USER;
const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD;

if (!dbHost || !dbUser || !dbName || !dbPassword) {
  throw new Error("Missing one or more required DB environment variables: DB_HOST, DB_USER, DB_NAME, DB_PASSWORD");
}

const client = new Client({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  database: dbName,
  password: dbPassword,
  ssl: { rejectUnauthorized: false }
});

const sqlSchema = `
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents(
    id bigserial primary key,
    content text,
    embedding vector(1536),
    filepath text NOT NULL,
    checksum text NOT NULL,
    created_at timestampz DEFAULT now() NOT NULL,
    updated_at timestampz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_filepath ON documents (filepath);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_trigger ON documents;
CREATE TRIGGER set_updated_at_trigger
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
`;


const matchdocumentsSchema = `
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE(
  id bigint,
  content text,
  similarity float,
  filepath text,
  checksum text
)
LANGUAGE sql STABLE
AS $$
  SELECT
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) AS similarity,
    documents.filepath,
    documents.checksum
  FROM documents
  WHERE documents.embedding <=> query_embedding < 1 - match_threshold
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
$$;
`

const createVectorIndex = `
CREATE INDEX IF NOT EXISTS isx_embedding_cosine
ON documents USING hnsw (embedding vector_cosine_ops);
`

export async function setupDatabase() {
  try {
    await client.connect();
    await client.query(sqlSchema);
    await client.query(matchdocumentsSchema);
    await client.query(createVectorIndex);
    await client.query("ANALYZE documents");
    console.log("Database schema setup completed");
  } catch(error) {
    console.error("Error setting up database:", error);
    throw error;
  } finally {
    await client.end();
    console.log("Disconnected from database");
  }
}
