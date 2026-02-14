export const  THEME = {
  colors: {
        primary: '#FF6B35',
    primaryDark: '#D4522A',
    primaryLight: '#FFB088',
    
        sacred: {
      saffron: '#FF9933',
      turmeric: '#FFC300',
      sandalwood: '#C19A6B',
      vermillion: '#E34234',
      gold: '#FFD700',
      lotus: '#F4C2C2',
    },
    
        stone: '#8B7355',
    marble: '#F5F5DC',
    granite: '#4A4A4A',
    
        background: '#FFF8F0',
    surface: '#FFFFFF',
    overlay: 'rgba(255, 107, 53, 0.1)',
    
        success: '#10B981',
    error: '#DC2626',
    warning: '#F59E0B',
    info: '#3B82F6',
    
        text: {
      primary: '#2C1810',
      secondary: '#6B5545',
      tertiary: '#8B7355',
      inverse: '#FFFFFF',
    },
    
        border: {
      light: '#E8DED0',
      medium: '#D4C5B5',
      dark: '#8B7355',
    }
  },
  
  fonts: {
        display: 'Cinzel',     body: 'Lora',     script: 'Cormorant Garamond',     mono: 'Courier New',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    temple: {
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
    }
  },
  
  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
  }
};

export type TempleTheme = typeof THEME;