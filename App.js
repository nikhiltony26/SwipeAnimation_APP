import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';

const SwipeCards = () => {
  const [pan] = useState(new Animated.ValueXY());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState([
    { id: 1, text: 'Card 1', swiped: false },
    { id: 2, text: 'Card 2', swiped: false },
    { id: 3, text: 'Card 3', swiped: false },
    { id: 4, text: 'Card 4', swiped: false },
    { id: 5, text: 'Card 5', swiped: false },
  ]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      { dx: pan.x, dy: pan.y }
    ], { useNativeDriver: false }),
    onPanResponderRelease: (e, gesture) => {
      if (gesture.dx > 120) {
        // Right swipe
        animateSwipe(true);
      } else if (gesture.dx < -120) {
        // Left swipe
        animateSwipe(false);
      } else {
        // Return to initial position
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 4, useNativeDriver: false }).start();
      }
    }
  });

  const animateSwipe = (rightSwipe) => {
    Animated.timing(pan, {
      toValue: { x: rightSwipe ? 500 : -500, y: 0 },
      duration: 300,
      useNativeDriver: false
    }).start(() => {
      const updatedCards = [...cards];
      updatedCards[currentIndex].swiped = true;
      setCards(updatedCards);
      setCurrentIndex(currentIndex + 1);
      Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 4, useNativeDriver: false }).start();
    });
  };

  const renderCards = () => {
    return cards.map((card, index) => {
      if (card.swiped) return null;
      return (
        <Animated.View
          key={card.id}
          {...panResponder.panHandlers}
          style={[getCardStyle(index), styles.card]}
        >
          <Text style={styles.cardText}>{card.text}</Text>
        </Animated.View>
      );
    }).reverse();
  };

  const getCardStyle = (index) => {
    return {
      transform: [{ translateX: pan.x }, { translateY: pan.y }],
      zIndex: index === currentIndex ? 1 : 0
    };
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
