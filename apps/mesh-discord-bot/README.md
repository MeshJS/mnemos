# MeshJS Discord Bot

A lightweight Discord bot that serves as a frontend for RAG (Retrieval-Augmented Generation) powered by MeshJS documentation.

## Features

- Registers `/ask-mesh-ai` slash command for intelligent responses
- Sends user queries to backend RAG service
- Displays contextual answers from MeshJS documentation
- Powered by Supabase vector database and OpenAI embeddings

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Discord Developer Account
- Supabase Account
- OpenAI API Key

### Step 1: Backend Setup (RAG Service)

First, set up the backend RAG service:

```bash
git clone git@github.com:MeshJS/mimir.git
cd mimir/apps/mesh-rag-ai

# Install dependencies
npm install
```

#### Documentation Setup (Optional)

The backend comes with pre-installed MeshJS documentation. If you want to use custom documentation:

```bash
mkdir -p docs/markdown
```

**Note:** Only add custom documentation if you want to replace or supplement the default MeshJS docs. Otherwise, skip this step and proceed to environment configuration.

#### Environment Configuration

Create a `.env` file with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database Configuration
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# API Keys
OPENAI_API_KEY=your_openai_api_key
INGEST_KEY=your_secure_ingest_key
```

#### Database Setup

Initialize the database:

```bash
# Initialize the database
npm run setup-db
```

This will:
- Create necessary database tables
- Process and embed documentation files
- Store vectors in Supabase

#### Deploy Backend

Deploy the RAG service to Vercel:

```bash
# Deploy to Vercel
vercel --prod
```

Note the deployment URL for later use in the Discord bot configuration.

---

### Step 2: Discord Bot Setup

Navigate to the Discord bot directory:

```bash
cd ../mesh-discord-bot

# Install dependencies
npm install
```

#### Discord Application Setup

1. **Create Discord Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and fill in basic details

2. **Configure Bot**
   - Navigate to the "Bot" section
   - Enable "Message Content Intent"
   - Copy the bot token and store it securely

3. **Set OAuth Permissions**
   - Go to "OAuth2" → "URL Generator"
   - **Scopes**: Select `bot` and `application.commands`
   - **Bot Permissions**: 
     - Send Messages
     - Use Slash Commands
     - Embed Links
     - View Channels
   - Copy the generated URL and Client ID

4. **Invite Bot to Server**
   - Use the generated URL to add the bot to your Discord server

#### Environment Configuration

Create a `.env` file:

```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id

# Backend API Configuration
API_KEY=your_ingest_key_from_backend
API_BASE_URL=https://your-app.vercel.app
```

#### Deploy Discord Bot

Deploy to [Railway](https://railway.com/):

1. Connect your GitHub repository
2. Add environment variables
3. Deploy the application

---

## Usage

Once deployed, users can interact with the bot using:

```
/ask-mesh-ai query: How do I create a wallet with MeshJS?
```

The bot will:
1. Convert the query to a vector embedding
2. Search the vector database for relevant documentation
3. Generate a contextual response using RAG
4. Return the answer in Discord

---

## API Endpoints

The backend provides these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ask-mesh-ai` | POST | Query the RAG system |
| `/api/ingest` | POST | Add new documentation |
| `/api/health` | GET | Health check |

---

## Local Development

### Prerequisites for Local Development

- Vercel CLI installed: `npm install -g vercel`

### Backend Local Development

```bash
cd mimir/apps/mesh-rag-ai

# Install dependencies
npm install

# Start local development server
vercel dev
```

The backend will be available at `http://localhost:3000` with API endpoints:
- `http://localhost:3000/api/ask-mesh-ai`
- `http://localhost:3000/api/ingest`
- `http://localhost:3000/api/health`

### Discord Bot Local Development

```bash
cd mesh-discord-bot

# Install dependencies
npm install

# Update .env file for local development
# API_BASE_URL=http://localhost:3000

# Start development server
npm run dev
```

### Full Local Development Workflow

1. **Start Backend Service:**
   ```bash
   cd mimir/apps/mesh-rag-ai
   vercel dev
   ```

2. **Start Discord Bot (in new terminal):**
   ```bash
   cd mesh-discord-bot
   npm run dev
   ```

3. **Environment Configuration:**
   - Backend: Use production `.env` in `mesh-rag-ai/`
   - Discord Bot: Update `API_BASE_URL=http://localhost:3000` in `.env`

---

**Built by the MeshJS Team**

[Website](https://meshjs.dev) • [Documentation](https://docs.meshjs.dev) • [Discord](https://discord.com/invite/WvnCNqmAxy)

