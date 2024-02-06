import React from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SwipeAnimationApp = () => {
  const position = new Animated.ValueXY();
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > 120) {
        // Swipe right, animate off screen to the right
        Animated.timing(position, {
          toValue: { x: SCREEN_WIDTH, y: gesture.dy },
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else if (gesture.dx < -120) {
        // Swipe left, animate off screen to the left
        Animated.timing(position, {
          toValue: { x: -SCREEN_WIDTH, y: gesture.dy },
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        // Not a significant swipe, animate back to initial position
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 4,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          position.getLayout(),
          { transform: [{ rotate: rotate }] },
          styles.card,
        ]}
      >
        {/* Card content here */}
        <Icon name="times" size={30} color="red" style={styles.icon} />
        <Icon name="check" size={30} color="green" style={styles.icon} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

export default SwipeAnimationApp;
