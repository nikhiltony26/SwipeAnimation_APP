import React from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_WIDTH = 300;
const CARD_HEIGHT = 400;

const Card = ({ backgroundColor, index }) => {
  const position = new Animated.ValueXY();
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > 120) {
        // Swipe right, animate off screen to the right
        Animated.timing(position, {
          toValue: { x: SCREEN_WIDTH + CARD_WIDTH, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else if (gesture.dx < -120) {
        // Swipe left, animate off screen to the left
        Animated.timing(position, {
          toValue: { x: -SCREEN_WIDTH - CARD_WIDTH, y: 0 },
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
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.cardContainer,
        { transform: [{ translateY: index * 40 }] },
      ]}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ rotate: rotate }], backgroundColor: backgroundColor },
        ]}
      >
        {/* Card content here */}
        <Icon name="times" size={30} color="red" style={styles.icon} />
        <Icon name="check" size={30} color="green" style={styles.icon} />
      </Animated.View>
    </Animated.View>
  );
};

const SwipeAnimationApp = () => {
  return (
    <View style={{ flex: 1 }}>
      <Card backgroundColor="lightcoral" index={2} />
      <Card backgroundColor="lightgreen" index={1} />
      <Card backgroundColor="lightblue" index={0} />
      {/* Add more cards with different colors as needed */}
    </View>
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
    top: 20,
    left: 20,
  },
});

export default SwipeAnimationApp;
