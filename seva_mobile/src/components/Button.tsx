import React, { useRef } from 'react';
import { Pressable, Text, Animated, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { THEME } from '../theme/Theme';

interface TempleButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<TempleButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    if (variant === 'primary') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [variant]);
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: THEME.spacing.md,
      paddingHorizontal: THEME.spacing.xl,
      borderRadius: THEME.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: THEME.spacing.sm,
      ...THEME.shadows.md,
    };
    
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: THEME.colors.primary,
          borderWidth: 2,
          borderColor: THEME.colors.sacred.gold,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: THEME.colors.surface,
          borderWidth: 2,
          borderColor: THEME.colors.primary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: THEME.colors.border.dark,
          ...{},         };
      default:
        return baseStyle;
    }
  };
  
  const getTextStyle = (): TextStyle => {
    return {
      fontSize: 16,
      fontWeight: '700',
      color: variant === 'primary' 
        ? THEME.colors.text.inverse 
        : THEME.colors.primary,
    };
  };
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          getButtonStyle(),
          (disabled || loading) && { opacity: 0.6 },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? 'white' : THEME.colors.primary} />
        ) : (
          <>
            {icon}
            <Text style={getTextStyle()}>{title}</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};