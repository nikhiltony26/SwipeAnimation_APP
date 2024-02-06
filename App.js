import React, { useRef } from 'react';
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

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  // Initialize opacity values
  const leftIconOpacity = useRef(new Animated.Value(0)).current;
  const rightIconOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });

        // Adjusting icon opacities based on gesture movement
        if (gesture.dx > 50) {
          rightIconOpacity.setValue(1);
          leftIconOpacity.setValue(0);
        } else if (gesture.dx < -50) {
          rightIconOpacity.setValue(0);
          leftIconOpacity.setValue(1);
        } else {
          rightIconOpacity.setValue(0);
          leftIconOpacity.setValue(0);
        }
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > 120) {
          // Swipe animation to the right
          Animated.timing(position, {
            toValue: { x: SCREEN_WIDTH + CARD_WIDTH, y: 0 },
            duration: 150, // Shortened duration
            useNativeDriver: false,
          }).start(() => {
            onSwipe('right');
          });
        } else if (gesture.dx < -120) {
          // Swipe animation to the left
          Animated.timing(position, {
            toValue: { x: -SCREEN_WIDTH - CARD_WIDTH, y: 0 },
            duration: 150, // Shortened duration
            useNativeDriver: false,
          }).start(() => {
            onSwipe('left');
          });
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
        { transform: [{ translateY: index * 40 }, { translateX: position.x }, { scale: index === 0 ? scale : 1 }] },
      ]}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ rotate: rotate }], backgroundColor: backgroundColor },
        ]}
      >
        <Animated.View style={[styles.iconContainer, { opacity: leftIconOpacity }]}>
          <View style={[styles.iconBackground, { backgroundColor: 'red' }]}>
            <Icon name="times" size={40} color="white" />
          </View>
        </Animated.View>
        <Animated.View style={[styles.iconContainer, { opacity: rightIconOpacity, left: 120 }]}>
          <View style={[styles.iconBackground, { backgroundColor: 'green' }]}>
            <Icon name="check" size={40} color="white" />
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};


const SwipeAnimationApp = () => {
  const handleSwipe = (direction) => {
    console.log('Swiped:', direction);
  };

  return (
    <View style={{ flex: 1 }}>
      <Card backgroundColor="lightcoral" index={2} onSwipe={handleSwipe} />
      <Card backgroundColor="lightgreen" index={1} onSwipe={handleSwipe} />
      <Card backgroundColor="lightblue" index={0} onSwipe={handleSwipe} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - (CARD_HEIGHT + 40) / 2,
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
  iconContainer: {
    position: 'absolute',
    top: -150,
  },
  iconBackground: {
    borderRadius: 290, // Ensures circular shape
    padding: 20,
  },
});

export default SwipeAnimationApp;
