import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockRewards = [
  { 
    id: '1', 
    name: 'Gift Card', 
    points: 500, 
    image: 'https://via.placeholder.com/100',
    description: 'Redeem for a $10 gift card to your favorite store'
  },
  { 
    id: '2', 
    name: 'Movie Ticket', 
    points: 1000, 
    image: 'https://via.placeholder.com/100',
    description: 'Get a free movie ticket to any participating theater'
  },
  { 
    id: '3', 
    name: 'Fitness Tracker', 
    points: 2000, 
    image: 'https://via.placeholder.com/100',
    description: 'Redeem for a basic fitness tracker to help monitor your health'
  },
  { 
    id: '4', 
    name: 'Health App Subscription', 
    points: 1500, 
    image: 'https://via.placeholder.com/100',
    description: '3-month subscription to premium health tracking app'
  },
  { 
    id: '5', 
    name: 'Wellness Package', 
    points: 3000, 
    image: 'https://via.placeholder.com/100',
    description: 'Bundle of wellness products including vitamins and supplements'
  },
];

const Shop = ({ userPoints, setUserPoints }) => {
  const handleRedeem = (points) => {
    if (userPoints >= points) {
      setUserPoints(userPoints - points);
      // In a real app, this would trigger a redemption process
      alert('Reward redeemed successfully!');
    } else {
      alert('Not enough points to redeem this reward.');
    }
  };

  const renderRewardItem = ({ item }) => (
    <View style={styles.rewardItem}>
      <Image source={{ uri: item.image }} style={styles.rewardImage} />
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardName}>{item.name}</Text>
        <Text style={styles.rewardDescription}>{item.description}</Text>
        <View style={styles.pointsContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.pointsText}>{item.points} points</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={[
          styles.redeemButton,
          userPoints < item.points && styles.redeemButtonDisabled
        ]}
        onPress={() => handleRedeem(item.points)}
        disabled={userPoints < item.points}
      >
        <Text style={styles.redeemButtonText}>Redeem</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Rewards Shop</Text>
        <View style={styles.pointsContainer}>
          <Ionicons name="star" size={24} color="#FFD700" />
          <Text style={styles.userPointsText}>{userPoints} points</Text>
        </View>
      </View>
      
      <FlatList
        data={mockRewards}
        renderItem={renderRewardItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.rewardsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  rewardsList: {
    padding: 15,
  },
  rewardItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  rewardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  rewardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  rewardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  pointsText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  redeemButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    backgroundColor: '#ccc',
  },
  redeemButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Shop; 