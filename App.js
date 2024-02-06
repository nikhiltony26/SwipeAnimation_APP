import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';

const SwipeCards = () => {
  const [pan] = useState(new Animated.ValueXY());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState([
    { id: 1, text: 'Card 1' },
    { id: 2, text: 'Card 2' },
    { id: 3, text: 'Card 3' },
    { id: 4, text: 'Card 4' },
    { id: 5, text: 'Card 5' },
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
    const toValue = rightSwipe ? { x: 500, y: 0 } : { x: -500, y: 0 };

    Animated.timing(pan, {
      toValue,
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
      if (index < currentIndex) {
        return null;
      } else if (index === currentIndex) {
        return (
          <Animated.View
            key={card.id}
            {...panResponder.panHandlers}
            style={[getCardStyle(), styles.card]}
          >
            <Text style={styles.cardText}>{card.text}</Text>
          </Animated.View>
        );
      } else {
        return (
          <View key={card.id} style={styles.card}>
            <Text style={styles.cardText}>{card.text}</Text>
          </View>
        );
      }
    }).reverse();
  };

  const getCardStyle = () => {
    return {
      transform: [{ translateX: pan.x }, { translateY: pan.y }],
      zIndex: 1 // Ensure the current card is always on top
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
