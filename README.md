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

- [mise](https://mise.jdx.dev) - Development environment manager
- A running instance of [redstr-server](https://github.com/arvid-berndtsson/redstr-server) (default: `http://localhost:8080`)

## Local Development

### Installation

mise will automatically install Node.js and pnpm when you run:

```bash
mise install
```

Then install project dependencies:

```bash
pnpm install
```

Or use the mise task:

```bash
mise run install
```

### Development Server

```bash
mise run dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173` (or the next available port).

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
│   ├── App.css          # Application styles
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## Usage

1. **Start the redstr-server:**
   ```bash
   cd ../redstr-server
   cargo run --release
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Use the interface:**
   - Select a transformation function from the dropdown
   - Enter text in the input field
   - Click "Transform" to see the result
   - Use "Copy" to copy the output to clipboard

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

- Ensure Node.js 18+ is installed
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check that all dependencies are compatible

### Cloudflare Pages Deployment

- Verify build command is `npm run build`
- Verify output directory is `dist`
- Check build logs in Cloudflare Dashboard for errors
- Ensure environment variables are set correctly

## License

MIT License - See LICENSE file in the repository root.

---

**Important:** This tool is designed for authorized security testing only. Users must obtain proper authorization before conducting any security assessments.

