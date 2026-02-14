import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { THEME } from '../theme/Theme';

interface TempleLoaderProps {
  message?: string;
}

export const Loader: React.FC<TempleLoaderProps> = ({ message = "Loading..." }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
        Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

        Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{
      flex: 1,
      backgroundColor: THEME.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }}>
      <Animated.View style={{
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: THEME.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...THEME.shadows.temple,
        transform: [
          { rotate: spin },
          { scale: scaleAnim },
        ],
      }}>
        <Text style={{
          fontSize: 48,
          color: THEME.colors.sacred.saffron,
        }}>
          ॐ
        </Text>
      </Animated.View>

      <Text style={{
        marginTop: 24,
        fontSize: 16,
        fontWeight: '700',
        color: THEME.colors.text.secondary,
      }}>
        {message}
      </Text>

      {/* Decorative dots */}
      <View style={{
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
      }}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: THEME.colors.sacred.saffron,
              opacity: scaleAnim,
            }}
          />
        ))}
      </View>
    </View>
  );
};