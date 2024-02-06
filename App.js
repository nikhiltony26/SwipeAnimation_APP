import React from 'react';
import { View, StyleSheet, Animated, PanResponder } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SwipeAnimationApp = () => {
  const position = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (event, gesture) => {
      // Add logic to handle swipe release
      // For example, animate card off the screen based on swipe direction
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[position.getLayout(), styles.card]}
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
