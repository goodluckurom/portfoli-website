export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ThemeColors {
  primary: ColorScale;
  accent: ColorScale;
  background: {
    main: string;
    alt: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  settings: {
    typography: {
      fonts: {
        sans: string;
        mono: string;
      };
    };
    spacing: {
      content: string;
    };
  };
}

export const themePresets: Record<string, Theme> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and professional design with subtle blue accents',
    colors: {
      light: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        background: {
          main: '#ffffff',
          alt: '#f8fafc',
        },
        text: {
          primary: '#0f172a',
          secondary: '#475569',
        },
      },
      dark: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        background: {
          main: '#0f172a',
          alt: '#1e293b',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
        },
      },
    },
    settings: {
      typography: {
        fonts: {
          sans: 'var(--font-inter)',
          mono: 'var(--font-jetbrains-mono)',
        },
      },
      spacing: {
        content: '4rem',
      },
    },
  },
  sage: {
    id: 'sage',
    name: 'Sage Garden',
    description: 'Calming sage green with warm terra cotta accents',
    colors: {
      light: {
        primary: {
          50: '#f8faf8',
          100: '#edf3ed',
          200: '#dce7dc',
          300: '#c2d6c2',
          400: '#a3bfa3',
          500: '#85a585',
          600: '#698469',
          700: '#526952',
          800: '#3b4d3b',
          900: '#243024',
        },
        accent: {
          50: '#fdf8f6',
          100: '#f9ebe6',
          200: '#f4d5cc',
          300: '#e9b4a4',
          400: '#dd917a',
          500: '#d06d51',
          600: '#bc4f31',
          700: '#a13f27',
          800: '#833225',
          900: '#6a2820',
        },
        background: {
          main: '#ffffff',
          alt: '#f8faf8',
        },
        text: {
          primary: '#243024',
          secondary: '#526952',
        },
      },
      dark: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        background: {
          main: '#0f172a',
          alt: '#1e293b',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
        },
      },
    },
    settings: {
      typography: {
        fonts: {
          sans: 'var(--font-inter)',
          mono: 'var(--font-jetbrains-mono)',
        },
      },
      spacing: {
        content: '4rem',
      },
    },
  },
  dusk: {
    id: 'dusk',
    name: 'Twilight Dusk',
    description: 'Soft purples and blues inspired by twilight hours',
    colors: {
      light: {
        primary: {
          50: '#faf8ff',
          100: '#f3f0ff',
          200: '#e9e3ff',
          300: '#d4c8ff',
          400: '#b39dff',
          500: '#9374ff',
          600: '#7b4fff',
          700: '#6833ff',
          800: '#5822ff',
          900: '#4400ff',
        },
        accent: {
          50: '#f5f8ff',
          100: '#e8f1ff',
          200: '#d1e3ff',
          300: '#a6c8ff',
          400: '#7aadff',
          500: '#4d92ff',
          600: '#2678ff',
          700: '#0063ff',
          800: '#0052d6',
          900: '#0041a8',
        },
        background: {
          main: '#ffffff',
          alt: '#faf8ff',
        },
        text: {
          primary: '#2a1a66',
          secondary: '#4a3c7d',
        },
      },
      dark: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        background: {
          main: '#0f172a',
          alt: '#1e293b',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
        },
      },
    },
    settings: {
      typography: {
        fonts: {
          sans: 'var(--font-inter)',
          mono: 'var(--font-jetbrains-mono)',
        },
      },
      spacing: {
        content: '4rem',
      },
    },
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn Warmth',
    description: 'Warm and cozy colors inspired by fall foliage',
    colors: {
      light: {
        primary: {
          50: '#fdfaf6',
          100: '#faf0e6',
          200: '#f5e0cc',
          300: '#ebc7a4',
          400: '#dca776',
          500: '#cc8749',
          600: '#b66a2c',
          700: '#995421',
          800: '#7d421b',
          900: '#663317',
        },
        accent: {
          50: '#fdf8f6',
          100: '#faeae6',
          200: '#f5d5cc',
          300: '#ebb3a4',
          400: '#dc8a76',
          500: '#cc6149',
          600: '#b63e2c',
          700: '#992f21',
          800: '#7d251b',
          900: '#661d17',
        },
        background: {
          main: '#ffffff',
          alt: '#fdfaf6',
        },
        text: {
          primary: '#663317',
          secondary: '#995421',
        },
      },
      dark: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        background: {
          main: '#0f172a',
          alt: '#1e293b',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
        },
      },
    },
    settings: {
      typography: {
        fonts: {
          sans: 'var(--font-inter)',
          mono: 'var(--font-jetbrains-mono)',
        },
      },
      spacing: {
        content: '4rem',
      },
    },
  },
  marine: {
    id: 'marine',
    name: 'Marine Depths',
    description: 'Serene blues and teals inspired by ocean depths',
    colors: {
      light: {
        primary: {
          50: '#f6fafc',
          100: '#e6f4f9',
          200: '#cce9f3',
          300: '#a4d8e9',
          400: '#76c1db',
          500: '#49a7cc',
          600: '#2c89b6',
          700: '#216e99',
          800: '#1b577d',
          900: '#174566',
        },
        accent: {
          50: '#f6fcfa',
          100: '#e6f9f4',
          200: '#ccf3e9',
          300: '#a4e9d8',
          400: '#76dbc1',
          500: '#49cca7',
          600: '#2cb68a',
          700: '#21996f',
          800: '#1b7d59',
          900: '#176647',
        },
        background: {
          main: '#ffffff',
          alt: '#f6fafc',
        },
        text: {
          primary: '#174566',
          secondary: '#216e99',
        },
      },
      dark: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        background: {
          main: '#0f172a',
          alt: '#1e293b',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
        },
      },
    },
    settings: {
      typography: {
        fonts: {
          sans: 'var(--font-inter)',
          mono: 'var(--font-jetbrains-mono)',
        },
      },
      spacing: {
        content: '4rem',
      },
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      light: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        background: {
          main: '#ffffff',
          alt: '#f0f9ff',
        },
        text: {
          primary: '#0f172a',
          secondary: '#334155',
        },
      },
      dark: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        background: {
          main: '#0f172a',
          alt: '#1e293b',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
        },
      },
    },
    settings: {
      typography: {
        fonts: {
          sans: 'var(--font-inter)',
          mono: 'var(--font-jetbrains-mono)',
        },
      },
      spacing: {
        content: '4rem',
      },
    },
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    colors: {
      light: {
        primary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        accent: {
          50: '#f0fdff',
          100: '#ccfbff',
          200: '#99f6ff',
          300: '#5eecff',
          400: '#2dd9ff',
          500: '#00bfff',
          600: '#0099df',
          700: '#0077b3',
          800: '#005c8f',
          900: '#004d77',
        },
        background: {
          main: '#ffffff',
          alt: '#fdf4ff',
        },
        text: {
          primary: '#0f172a',
          secondary: '#334155',
        },
      },
       dark: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        background: {
          main: '#0f172a',
          alt: '#1e293b',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
        },
      },
    },
     settings: {
      typography: {
        fonts: {
          sans: 'var(--font-inter)',
          mono: 'var(--font-jetbrains-mono)',
        },
      },
      spacing: {
        content: '4rem',
      },
    },
  },
  ember: {
    id: 'ember',
    name: 'Ember',
    colors: {
      light: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        background: {
          main: '#ffffff',
          alt: '#fff7ed',
        },
        text: {
          primary: '#0f172a',
          secondary: '#334155',
        },
      },
       dark: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        background: {
          main: '#0f172a',
          alt: '#1e293b',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
        },
      },
    },
    settings: {
      typography: {
        fonts: {
          sans: 'var(--font-inter)',
          mono: 'var(--font-jetbrains-mono)',
        },
      },
      spacing: {
        content: '4rem',
      },
    },
  }
};