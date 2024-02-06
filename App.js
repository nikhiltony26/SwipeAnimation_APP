import React, { useRef, useState } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_WIDTH = 300;
const CARD_HEIGHT = 400;
const BEHIND_CARD_SCALE = 1.1; // Increase the scale of the behind card

const Card = ({ backgroundColor, index, onSwipe }) => {
  const position = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current; // Scale value for the card
  const [iconPositions, setIconPositions] = useState({}); // State to store icon positions

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > 120 || gesture.dx < -120) {
          // Swipe animation
          Animated.parallel([
            Animated.timing(position, {
              toValue: { x: gesture.dx > 0 ? SCREEN_WIDTH + CARD_WIDTH : -SCREEN_WIDTH - CARD_WIDTH, y: 0 },
              duration: 300,
              useNativeDriver: false, // Ensure useNativeDriver is set to false for the position animation
            }),
            Animated.timing(scale, {
              toValue: BEHIND_CARD_SCALE, // Increase the scale of the behind card
              duration: 300,
              useNativeDriver: false, // Ensure useNativeDriver is set to false for the scale animation
            }),
          ]).start(() => {
            // Call onSwipe function when animation ends
            onSwipe();
          });

          // Check swipe direction and set icon positions accordingly
          if (gesture.dx > 0) {
            // Swipe right
            setIconPositions({ left: 20, top: 20 }); // Right icon on top left
          } else {
            // Swipe left
            setIconPositions({ right: 20, top: 20 }); // Cross icon on top right
          }
        } else {
          // Not a significant swipe, animate back to initial position
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.cardContainer,
        { transform: [{ translateY: index * 40 }, { translateX: position.x }, { scale: index === 0 ? scale : 1 }] }, // Scale only the behind card
      ]}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ rotate: rotate }], backgroundColor: backgroundColor },
        ]}
      >
        {/* Card content here */}
        <Icon name="times" size={30} color="red" style={[styles.icon, iconPositions]} />
        <Icon name="check" size={30} color="green" style={[styles.icon, iconPositions]} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - (CARD_HEIGHT + 40) / 2, // Adjusted to accommodate extra height
    left: SCREEN_WIDTH / 2 - CARD_WIDTH / 2,
    zIndex: 2,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  icon: {
    position: 'absolute',
  },
});

export default SwipeAnimationApp;
