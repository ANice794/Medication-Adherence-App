import { StyleSheet, View, Text } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {

}

export default function PointsAndStreak() {

    return (
        <View style={styles.container}>
            <View style={styles.iconsAndText}>
                <MaterialCommunityIcons name="cards-diamond" size={24} color="blue" />
                <Text style={styles.text}>100</Text>
            </View>
            <View style={styles.iconsAndText}>
                <Ionicons name="flame" size={24} color="red" />
                <Text style={styles.text}>2</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    iconsAndText: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 20,
        textAlign: "center",
    },
    container: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    },
});