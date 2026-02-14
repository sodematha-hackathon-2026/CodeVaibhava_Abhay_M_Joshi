import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, ViewStyle, TextStyle } from 'react-native';
import { THEME } from '../theme/Theme';

interface TempleCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevated?: boolean;
  withBorder?: boolean;
}

export const Card: React.FC<TempleCardProps> = ({
  children,
  onPress,
  style,
  elevated = true,
  withBorder = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };
  
  const cardStyle: ViewStyle = {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    ...(elevated ? THEME.shadows.md : {}),
    ...(withBorder ? {
      borderWidth: 1,
      borderColor: THEME.colors.border.light,
      borderTopWidth: 3,
      borderTopColor: THEME.colors.sacred.saffron,
    } : {}),
    ...style,
  };
  
  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={cardStyle}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }
  
  return <View style={cardStyle}>{children}</View>;
};

interface TempleDividerProps {
  style?: ViewStyle;
  ornamental?: boolean;
}

export const TempleDivider: React.FC<TempleDividerProps> = ({ style, ornamental = false }) => {
  if (ornamental) {
    return (
      <View style={{ alignItems: 'center', marginVertical: THEME.spacing.md, ...style }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
          <View style={{ flex: 1, height: 1, backgroundColor: THEME.colors.border.medium }} />
          <Text style={{ 
            marginHorizontal: THEME.spacing.md,
            fontSize: 20,
            color: THEME.colors.sacred.saffron,
          }}>
            
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: THEME.colors.border.medium }} />
        </View>
      </View>
    );
  }
  
  return (
    <View style={{
      height: 1,
      backgroundColor: THEME.colors.border.medium,
      marginVertical: THEME.spacing.md,
      ...style,
    }} />
  );
};