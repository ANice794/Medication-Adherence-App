import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Pressable } from "react-native";

type Props = {

}

export default function ShopCard() {
    return (
        <Pressable style={styles.shopCard}>
            <View style={styles.shopCardLeft}>
                <Text style={styles.text}>2X Points</Text>
            </View>
            <View style={styles.shopCardRight}><MaterialCommunityIcons name="cards-diamond" size={24} color="blue" />
                <Text style={styles.text}>100</Text>
            </View>
        </Pressable>

    );
}

const styles = StyleSheet.create({
    shopCard: {
        width: "90%",
        height: 70,
        backgroundColor: "lightgray",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        margin: "5%",
        borderRadius: 10,
    },
    shopCardLeft: {
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
    },
    shopCardRight: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 20,
        textAlign: "center",
    },
});