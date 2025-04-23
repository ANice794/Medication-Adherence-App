import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';

interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    icon: string;
    iconType: 'Ionicons' | 'MaterialCommunityIcons';
    category: 'boosters' | 'customization' | 'powerups';
    color: string;
    duration?: number; // Duration in milliseconds
}

const shopItems: ShopItem[] = [
    // Boosters
    {
        id: '1',
        name: 'Streak Shield',
        description: 'Protects your streak for 24 hours if you miss a dose',
        price: 500,
        icon: 'shield-checkmark',
        iconType: 'Ionicons',
        category: 'boosters',
        color: '#4CAF50',
        duration: 24 * 60 * 60 * 1000, // 24 hours
    },
    {
        id: '2',
        name: '2x Points (24h)',
        description: 'Double all points earned for 24 hours',
        price: 750,
        icon: 'star',
        iconType: 'Ionicons',
        category: 'boosters',
        color: '#FFC107',
        duration: 24 * 60 * 60 * 1000, // 24 hours
    },
    {
        id: '3',
        name: 'Perfect Week Boost',
        description: 'Triple points for maintaining a perfect week',
        price: 1000,
        icon: 'trending-up',
        iconType: 'Ionicons',
        category: 'boosters',
        color: '#2196F3',
        duration: 7 * 24 * 60 * 60 * 1000, // 7 days
    },

    // Customization
    {
        id: '4',
        name: 'Night Theme',
        description: 'Dark mode color scheme for the app',
        price: 2000,
        icon: 'moon',
        iconType: 'Ionicons',
        category: 'customization',
        color: '#9C27B0',
    },
    {
        id: '5',
        name: 'Ocean Theme',
        description: 'Calming blue color scheme',
        price: 2000,
        icon: 'water',
        iconType: 'Ionicons',
        category: 'customization',
        color: '#03A9F4',
    },
    {
        id: '6',
        name: 'Forest Theme',
        description: 'Natural green color scheme',
        price: 2000,
        icon: 'leaf',
        iconType: 'Ionicons',
        category: 'customization',
        color: '#4CAF50',
    },

    // Power-ups
    {
        id: '7',
        name: 'Extra Reminder',
        description: 'Add one more reminder slot for medications',
        price: 1500,
        icon: 'alarm-plus',
        iconType: 'MaterialCommunityIcons',
        category: 'powerups',
        color: '#FF5722',
    },
    {
        id: '8',
        name: 'Streak Multiplier',
        description: 'Earn more points for longer streaks',
        price: 3000,
        icon: 'fire',
        iconType: 'MaterialCommunityIcons',
        category: 'powerups',
        color: '#FF9800',
    },
    {
        id: '9',
        name: 'Progress Insights',
        description: 'Unlock detailed adherence analytics',
        price: 5000,
        icon: 'chart-line',
        iconType: 'MaterialCommunityIcons',
        category: 'powerups',
        color: '#3F51B5',
    },
];

const Shop = () => {
    const { points, deductPoints, activeItems, addActiveItem, hasActiveItem, currentTheme } = useUser();
    const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

    useEffect(() => {
        // Update purchased items based on active items
        setPurchasedItems(activeItems.map(item => item.id));
    }, [activeItems]);

    const renderIcon = (item: ShopItem) => {
        if (item.iconType === 'Ionicons') {
            return <Ionicons name={item.icon as any} size={24} color={item.color} />;
        }
        return <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />;
    };

    const handlePurchase = (item: ShopItem) => {
        if (hasActiveItem(item.id)) {
            Alert.alert('Already Active', 'This item is already active!');
            return;
        }

        if (points < item.price) {
            Alert.alert('Insufficient Points', 'You don\'t have enough points to purchase this item.');
            return;
        }

        Alert.alert(
            'Confirm Purchase',
            `Would you like to purchase ${item.name} for ${item.price} points?${
                item.duration ? `\nThis item will be active for ${item.duration / (60 * 60 * 1000)} hours.` : ''
            }`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Purchase',
                    onPress: () => {
                        deductPoints(item.price);
                        addActiveItem(item.id, item.duration);

                        // Show appropriate success message
                        let message = '';
                        switch (item.id) {
                            case '4': // Night Theme
                            case '5': // Ocean Theme
                            case '6': // Forest Theme
                                message = `${item.name} has been applied to the app.`;
                                break;
                            case '1': // Streak Shield
                                message = `Your streak is now protected for ${item.duration! / (60 * 60 * 1000)} hours!`;
                                break;
                            case '2': // 2x Points
                                message = `You will earn double points for ${item.duration! / (60 * 60 * 1000)} hours!`;
                                break;
                            case '3': // Perfect Week Boost
                                message = `Triple points boost active for the next week!`;
                                break;
                            case '7': // Extra Reminder
                                message = 'Extra reminder slot unlocked!';
                                break;
                            case '8': // Streak Multiplier
                                message = 'Streak multiplier activated!';
                                break;
                            case '9': // Progress Insights
                                message = 'Detailed analytics unlocked!';
                                break;
                            default:
                                message = `You have purchased ${item.name}!`;
                        }
                        Alert.alert('Success', message);
                    },
                },
            ]
        );
    };

    const getItemStatus = (item: ShopItem) => {
        if (hasActiveItem(item.id)) {
            const activeItem = activeItems.find(ai => ai.id === item.id);
            if (activeItem?.expiresAt) {
                const hoursLeft = Math.ceil((activeItem.expiresAt - Date.now()) / (60 * 60 * 1000));
                return `${hoursLeft}h left`;
            }
            return 'Active';
        }
        return undefined;
    };

    const renderShopCategory = (title: string, items: ShopItem[]) => (
        <View style={styles.categoryContainer}>
            <Text style={[styles.categoryTitle, { color: currentTheme.text }]}>{title}</Text>
            <View style={styles.itemsGrid}>
                {items.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.itemCard, { backgroundColor: currentTheme.background }]}
                        onPress={() => handlePurchase(item)}
                    >
                        <View style={styles.itemIconContainer}>
                            {renderIcon(item)}
                        </View>
                        <Text style={[styles.itemName, { color: currentTheme.text }]}>{item.name}</Text>
                        <Text style={[styles.itemDescription, { color: currentTheme.secondary }]} numberOfLines={2}>
                            {item.description}
                        </Text>
                        <View style={styles.itemFooter}>
                            <View style={styles.priceContainer}>
                                <MaterialCommunityIcons name="star" size={16} color="#FFC107" />
                                <Text style={[styles.itemPrice, { color: currentTheme.text }]}>{item.price}</Text>
                            </View>
                            {getItemStatus(item) && (
                                <Text style={styles.itemStatus}>{getItemStatus(item)}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={[styles.header, { backgroundColor: currentTheme.primary }]}>
                <Text style={[styles.title, { color: '#fff' }]}>Shop</Text>
                <View style={styles.pointsContainer}>
                    <MaterialCommunityIcons name="star" size={24} color="#FFC107" />
                    <Text style={[styles.pointsText, { color: '#fff' }]}>{points}</Text>
                </View>
            </View>

            {renderShopCategory('Boosters', shopItems.filter(item => item.category === 'boosters'))}
            {renderShopCategory('Customization', shopItems.filter(item => item.category === 'customization'))}
            {renderShopCategory('Power-ups', shopItems.filter(item => item.category === 'powerups'))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: 8,
        borderRadius: 12,
    },
    pointsText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    categoryContainer: {
        padding: 16,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    itemCard: {
        width: '48%',
        padding: 12,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    itemIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 12,
        marginBottom: 8,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    itemStatus: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '600',
    },
});

export default Shop;