/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dt-bg-primary': '#070b14',
        'dt-bg-secondary': '#0d1526',
        'dt-accent-cyan': '#00d4ff',
        'dt-accent-green': '#00ff88',
        'dt-text-primary': '#e8edf5',
        'dt-text-muted': '#5a6a85',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out both',
        'pulse-ring': 'pulseRing 1.2s ease-out infinite',
        'skeleton-pulse': 'skeletonPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        skeletonPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
