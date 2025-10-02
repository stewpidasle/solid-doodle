# Particle Logo Component

An interactive particle effect component that displays text and a logo with mouse/touch interaction. Particles scatter away from the cursor and return to their original positions.

## Features

- 🎨 Fully customizable colors for text, logo, and background
- 📱 Responsive design with mobile optimization
- 👆 Interactive mouse and touch support
- ⚡ Smooth particle animations with 7000+ particles
- 🎯 TypeScript support with full type definitions
- 🖼️ Support for custom SVG logos

## Installation

### 1. Copy the Component

Copy `particle-logo.tsx` to your project's components directory:

\`\`\`
your-project/
├── components/
│   └── particle-logo.tsx
└── public/
    └── your-logo.svg
\`\`\`

### 2. Add Your Logo

Place your SVG logo in the `public` directory. The component expects a square SVG (150x150 or similar aspect ratio works best).

### 3. Dependencies

This component requires React 18+ and works with Next.js 13+ (App Router or Pages Router).

No additional dependencies needed - it uses native Canvas API and React hooks.

## Usage

### Basic Usage

\`\`\`tsx
import ParticleLogo from '@/components/particle-logo'

export default function Page() {
  return <ParticleLogo />
}
\`\`\`

### Custom Text and Logo

\`\`\`tsx
<ParticleLogo 
  text="Your Brand"
  logoPath="/your-logo.svg"
/>
\`\`\`

### Custom Colors

\`\`\`tsx
<ParticleLogo 
  text="Your Brand"
  logoPath="/your-logo.svg"
  textScatterColor="#FF6B6B"
  logoScatterColor="#4ECDC4"
  baseColor="white"
  backgroundColor="black"
/>
\`\`\`

### With Additional Content

\`\`\`tsx
<ParticleLogo 
  text="Your Brand"
  logoPath="/your-logo.svg"
>
  <p className="text-gray-400 text-sm">
    Your tagline or additional content here
  </p>
</ParticleLogo>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `"StewPid"` | Text to display on the left side |
| `logoPath` | `string` | `"/dodo-logo.svg"` | Path to the logo SVG file |
| `textScatterColor` | `string` | `"#00DCFF"` | Color for text particles when scattered |
| `logoScatterColor` | `string` | `"#FFD700"` | Color for logo particles when scattered |
| `baseColor` | `string` | `"white"` | Base particle color when not scattered |
| `backgroundColor` | `string` | `"black"` | Background color |
| `children` | `React.ReactNode` | `undefined` | Optional content to display below particles |

## Customization Tips

### Adjusting Particle Count

Edit line 145 in `particle-logo.tsx`:

\`\`\`tsx
const baseParticleCount = 7000 // Increase for more particles, decrease for better performance
\`\`\`

### Changing Interaction Distance

Edit line 177 in `particle-logo.tsx`:

\`\`\`tsx
const maxDistance = 240 // Increase for larger interaction radius
\`\`\`

### Modifying Animation Speed

Edit line 191 in `particle-logo.tsx`:

\`\`\`tsx
p.x += (p.baseX - p.x) * 0.1 // Increase multiplier for faster return speed
\`\`\`

### Adjusting Logo Size

The logo size is automatically calculated based on screen size:
- Desktop: 120px height
- Mobile: 60px height

To customize, edit lines 68-69 in `particle-logo.tsx`.

## Performance Notes

- The component uses ~7000 particles by default, scaled based on screen size
- Particle count automatically adjusts for different screen resolutions
- Canvas rendering is optimized with requestAnimationFrame
- Mobile devices use fewer particles for better performance

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support with touch interaction

## License

Free to use in your projects. Attribution appreciated but not required.

## Credits

Original design by StewPid for Skal Ventures.
