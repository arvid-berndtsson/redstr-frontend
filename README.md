# redstr-frontend

Frontend web interface for the redstr string transformation tool. This React application provides a user-friendly interface to interact with the redstr-server API.

## Features

- 🎨 Modern, responsive UI built with React and Vite
- 🔄 Real-time string transformations
- 📋 Copy-to-clipboard functionality
- 🔧 Configurable API endpoint
- 📱 Mobile-friendly design
- ⚡ Fast and lightweight

## Prerequisites

- [mise](https://mise.jdx.dev) - Development environment manager (for tool management)
- A running instance of [redstr-server](https://github.com/arvid-berndtsson/redstr-server) (default: `http://localhost:8080`)

## Setup

### Step 1: Install mise

If you don't have mise installed, install it using one of these methods:

**macOS/Linux:**
```bash
curl https://mise.run | sh
```

**Or using Homebrew (macOS):**
```bash
brew install mise
```

**Or using npm:**
```bash
npm install -g @mise/cli
```

After installation, restart your terminal or run:
```bash
source ~/.zshrc  # for zsh
# or
source ~/.bashrc  # for bash
```

### Step 2: Clone the Repository

```bash
git clone git@github.com:arvid-berndtsson/redstr-frontend.git
cd redstr-frontend
```

### Step 3: Install Tools and Dependencies

mise will automatically install the required Node.js and pnpm versions specified in `mise.toml`:

```bash
mise install
```

This will install:
- Node.js 22
- pnpm 9

Then install project dependencies:

```bash
pnpm install
```

Or use the mise task (which runs `pnpm install`):

```bash
mise run install
```

### Step 4: Configure Environment (Optional)

Create a `.env` file in the project root for local development:

```bash
echo "VITE_API_URL=http://localhost:8080" > .env
```

This sets the default API URL. You can also change it at runtime using the UI.

### Step 5: Start the Development Server

```bash
mise run dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Step 6: Start redstr-server (Required)

In a separate terminal, start the redstr-server:

```bash
cd ../redstr-server
cargo run --release
```

The server will run on `http://localhost:8080` by default.

## Local Development

### Development Commands

**Start development server:**
```bash
mise run dev
# or
pnpm dev
```

**Run linter:**
```bash
mise run lint
# or
pnpm lint
```

**Preview production build:**
```bash
mise run preview
# or
pnpm preview
```

### Build for Production

```bash
mise run build
# or
pnpm build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
mise run preview
# or
pnpm preview
```

## Deployment to Cloudflare Pages

### Option 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Create a GitHub repository:**
   - Create a new repository at [repo.new](https://repo.new)
   - Push your code to GitHub

2. **Deploy to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
   - Navigate to **Workers & Pages**
   - Click **Create application** > **Pages** > **Import an existing Git repository**
   - Select your GitHub repository

3. **Configure Build Settings:**
   - **Production branch:** `main`
   - **Build command:** `mise install && pnpm install && pnpm build`
   - **Build output directory:** `dist`
   - **Framework preset:** None (or Vite if available)

4. **Environment Variables (optional):**
   - `VITE_API_URL`: The URL of your redstr-server API (e.g., `https://api.example.com`)
   - If not set, the frontend will default to `http://localhost:8080` (which won't work in production)

5. **Deploy:**
   - Click **Save and Deploy**
   - Your site will be available at `<YOUR_PROJECT_NAME>.pages.dev`

### Option 2: Deploy via Wrangler CLI

1. **Install Wrangler:**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Install tools and dependencies:**
   ```bash
   mise install
   pnpm install
   ```

4. **Build the project:**
   ```bash
   pnpm build
   ```

5. **Deploy:**
   ```bash
   wrangler pages deploy dist
   ```

### Option 3: Use GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install mise
        run: curl https://mise.run | sh
      - name: Install tools and dependencies
        run: |
          mise install
          pnpm install
      - name: Build
        run: pnpm build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: redstr-frontend
          directory: dist
```

## Configuration

### Environment Variables

Create a `.env` file for local development:

```env
VITE_API_URL=http://localhost:8080
```

For production, set `VITE_API_URL` in Cloudflare Pages environment variables to point to your deployed redstr-server instance.

### API Configuration

The frontend connects to the redstr-server API. You can configure the API URL:

- **Environment variable:** Set `VITE_API_URL` in your environment
- **Runtime:** Use the API URL input field in the UI to change the endpoint at runtime

## Project Structure

```
redstr-frontend/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles (Tailwind CSS)
├── public/
│   └── vite.svg         # Vite logo
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── mise.toml            # mise tool configuration
├── wrangler.toml        # Cloudflare Pages configuration
├── package.json         # Dependencies and scripts
├── pnpm-lock.yaml       # pnpm lock file
└── README.md            # This file
```

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **pnpm** - Fast, disk space efficient package manager
- **mise** - Development environment manager
- **ESLint** - Code linting

## Usage

### Basic Workflow

1. **Ensure redstr-server is running:**
   ```bash
   cd ../redstr-server
   cargo run --release
   ```
   The server should be accessible at `http://localhost:8080`

2. **Start the frontend (if not already running):**
   ```bash
   mise run dev
   ```

3. **Open the application:**
   - Navigate to `http://localhost:5173` in your browser
   - The frontend will automatically fetch available transformation functions from the API

4. **Transform text:**
   - Select a transformation function from the dropdown (e.g., `leetspeak`, `base64_encode`)
   - Enter text in the input field
   - Click "Transform" to see the result
   - Use "Copy" to copy the output to clipboard

### Changing API URL

You can change the API URL at runtime:
- Use the API URL input field at the top of the page
- Click "Refresh" to reload available functions from the new endpoint
- Or set `VITE_API_URL` environment variable for a permanent default

## Available Transformations

The frontend automatically fetches all available transformation functions from the redstr-server API. Common functions include:

- `leetspeak` - Convert to leetspeak
- `base64_encode` - Base64 encoding
- `url_encode` - URL encoding
- `homoglyph_substitution` - Homoglyph substitution
- `xss_tag_variations` - XSS tag variations
- `sql_comment_injection` - SQL comment injection
- And many more...

See the [redstr documentation](https://github.com/arvid-berndtsson/redstr) for a complete list.

## Troubleshooting

### API Connection Issues

- Ensure redstr-server is running
- Check the API URL in the configuration section
- Verify CORS is enabled on the server (redstr-server has CORS enabled by default)
- Check browser console for detailed error messages

### Build Issues

- Ensure mise is installed and tools are set up: `mise install`
- Clear `node_modules` and reinstall: `rm -rf node_modules pnpm-lock.yaml && mise run install`
- Verify Node.js version: `mise which node` (should be 22)
- Verify pnpm version: `mise which pnpm` (should be 9)
- Check that all dependencies are compatible

### Cloudflare Pages Deployment

- Verify build command includes mise: `mise install && pnpm install && pnpm build`
- Verify output directory is `dist`
- Check build logs in Cloudflare Dashboard for errors
- Ensure environment variables are set correctly (especially `VITE_API_URL`)
- If mise is not available in Cloudflare build environment, you may need to install it in the build command or use the GitHub Actions workflow

## License

MIT License - See LICENSE file in the repository root.

---

**Important:** This tool is designed for authorized security testing only. Users must obtain proper authorization before conducting any security assessments.

