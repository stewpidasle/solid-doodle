# Quick Start Guide

## For Next.js Projects

### 1. Copy Files

\`\`\`bash
# Copy the component
cp logo-particles-export/particle-logo.tsx components/

# Copy your logo
cp logo-particles-export/example-logo.svg public/your-logo.svg
\`\`\`

### 2. Use in a Page

**App Router (app/page.tsx):**

\`\`\`tsx
import ParticleLogo from '@/components/particle-logo'

export default function Home() {
  return (
    <ParticleLogo 
      text="Your Brand"
      logoPath="/your-logo.svg"
      textScatterColor="#00DCFF"
      logoScatterColor="#FFD700"
    >
      <p className="text-gray-400">Your tagline here</p>
    </ParticleLogo>
  )
}
\`\`\`

**Pages Router (pages/index.tsx):**

\`\`\`tsx
import ParticleLogo from '@/components/particle-logo'

export default function Home() {
  return (
    <ParticleLogo 
      text="Your Brand"
      logoPath="/your-logo.svg"
    />
  )
}
\`\`\`

## For React Projects (Vite, CRA, etc.)

### 1. Copy Files

\`\`\`bash
# Copy the component
cp logo-particles-export/particle-logo.tsx src/components/

# Copy your logo
cp logo-particles-export/example-logo.svg public/your-logo.svg
\`\`\`

### 2. Update Imports

If you're not using Next.js, you may need to adjust the import path:

\`\`\`tsx
// Change from:
import ParticleLogo from '@/components/particle-logo'

// To:
import ParticleLogo from './components/particle-logo'
\`\`\`

### 3. Use in Your App

\`\`\`tsx
import ParticleLogo from './components/particle-logo'

function App() {
  return (
    <ParticleLogo 
      text="Your Brand"
      logoPath="/your-logo.svg"
    />
  )
}

export default App
\`\`\`

## Styling Notes

The component uses Tailwind CSS classes by default. If you're not using Tailwind:

### Option 1: Install Tailwind

\`\`\`bash
npm install -D tailwindcss
npx tailwindcss init
\`\`\`

### Option 2: Replace Classes with Inline Styles

Edit `particle-logo.tsx` and replace className props with style props:

\`\`\`tsx
// Before:
<div className="relative w-full h-dvh flex flex-col items-center justify-center">

// After:
<div style={{ 
  position: 'relative', 
  width: '100%', 
  height: '100dvh', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center' 
}}>
\`\`\`

## Common Issues

### Logo Not Loading

Make sure your logo is in the `public` directory and the path is correct:

\`\`\`tsx
// ✅ Correct
logoPath="/my-logo.svg"

// ❌ Wrong
logoPath="./public/my-logo.svg"
logoPath="public/my-logo.svg"
\`\`\`

### CORS Error with Logo

If you see a CORS error, ensure your SVG has proper CORS headers or is served from the same domain. The component sets `crossOrigin="anonymous"` by default.

### Performance Issues

If the animation is slow:

1. Reduce particle count (line 145)
2. Increase animation speed multiplier (line 191)
3. Use a smaller logo/text

## Next Steps

- Read the full [README.md](./README.md) for detailed customization options
- Experiment with different colors and text
- Adjust particle count and animation parameters
- Add your own content below the particles
