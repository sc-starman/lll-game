import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				reel: {
					DEFAULT: 'hsl(var(--reel-bg))',
					border: 'hsl(var(--reel-border))'
				},
				winning: {
					glow: 'hsl(var(--winning-glow))',
					symbol: 'hsl(var(--symbol-winning))'
				},
				jackpot: {
					glow: 'hsl(var(--jackpot-glow))'
				},
				neon: {
					cyan: 'hsl(var(--neon-cyan))',
					pink: 'hsl(var(--neon-pink))',
					green: 'hsl(var(--neon-green))',
					purple: 'hsl(var(--neon-purple))',
					orange: 'hsl(var(--neon-orange))',
					yellow: 'hsl(var(--neon-yellow))'
				},
				bitcoin: 'hsl(var(--bitcoin-orange))'
			},
			backgroundImage: {
				'gradient-cyber': 'var(--gradient-cyber)',
				'gradient-neon': 'var(--gradient-neon)',
				'gradient-machine': 'var(--gradient-machine)',
				'gradient-reel': 'var(--gradient-reel)',
				'gradient-handle': 'var(--gradient-handle)',
				'gradient-border': 'var(--gradient-border)'
			},
			fontFamily: {
				'orbitron': ['Orbitron', 'monospace'],
				'mono': ['Orbitron', 'ui-monospace', 'SFMono-Regular', 'monospace'],
			},
			boxShadow: {
				'glow-cyan': 'var(--glow-cyan)',
				'glow-pink': 'var(--glow-pink)',
				'glow-green': 'var(--glow-green)',
				'glow-yellow': 'var(--glow-yellow)',
				'glow-orange': 'var(--glow-orange)',
				'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
				'neon-lg': 'var(--glow-pink)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'spin-reel': {
					'0%': { transform: 'rotateX(0deg)', filter: 'blur(0px)' },
					'50%': { transform: 'rotateX(180deg)', filter: 'blur(3px)' },
					'100%': { transform: 'rotateX(360deg)', filter: 'blur(0px)' }
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'pulse-win': {
					'0%, 100%': { 
						boxShadow: '0 0 20px hsl(var(--winning-glow))',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 40px hsl(var(--winning-glow))',
						transform: 'scale(1.02)'
					}
				},
				'jackpot-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 30px hsl(var(--jackpot-glow))',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 60px hsl(var(--jackpot-glow))',
						transform: 'scale(1.05)'
					}
				},
				'confetti': {
					'0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' }
				},
				'handle-pull': {
					'0%': { transform: 'rotate(0deg) translateY(0px)' },
					'50%': { transform: 'rotate(15deg) translateY(10px)' },
					'100%': { transform: 'rotate(0deg) translateY(0px)' }
				},
				'neon-pulse': {
					'0%, 100%': { 
						textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
						transform: 'scale(1)'
					},
					'50%': { 
						textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
						transform: 'scale(1.02)'
					}
				},
				'cyber-border': {
					'0%': { borderColor: 'hsl(var(--neon-cyan))' },
					'25%': { borderColor: 'hsl(var(--neon-green))' },
					'50%': { borderColor: 'hsl(var(--neon-pink))' },
					'75%': { borderColor: 'hsl(var(--neon-purple))' },
					'100%': { borderColor: 'hsl(var(--neon-cyan))' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'spin-reel': 'spin-reel var(--spin-duration) ease-in-out',
				'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'pulse-win': 'pulse-win 1s ease-in-out infinite',
				'jackpot-glow': 'jackpot-glow 0.8s ease-in-out infinite',
				'confetti': 'confetti 3s linear infinite',
				'handle-pull': 'handle-pull 0.3s ease-out',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
				'cyber-border': 'cyber-border 3s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
