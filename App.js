import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SwipeCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: position.x, dy: position.y }
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > 120) {
          forceSwipe('right');
        } else if (gesture.dx < -120) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH * 2 : -SCREEN_WIDTH * 2;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    const newIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    resetPosition();
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  };

  const renderCards = () => {
    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[getCardStyle(), styles.card]}
      >
        <Text style={styles.cardText}>{currentIndex}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {renderCards()}
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
    position: 'absolute',
    width: 300,
    height: 400,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cardText: {
    fontSize: 24,
  },
});

export default SwipeCards;
