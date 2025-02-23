import PointsAndStreak from "@/components/PointsAndStreak";
import ShopCard from "@/components/ShopCard";
import TopBox from "@/components/TopBox";
import { Text, View, StyleSheet } from "react-native";

export default function ShopScreen() {
    return (
        <View>
            <TopBox />
            <PointsAndStreak />
            <View>
                <ShopCard />
                <ShopCard />    
                <ShopCard />
                <ShopCard />
            </View>
        </View>
    );
}