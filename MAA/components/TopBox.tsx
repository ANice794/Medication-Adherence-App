import { StyleSheet, View, Text } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {

}

export default function TopBox() {
    return (
        <View style={styles.topBox}>
            <Text>APP NAME & ICON</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    topBox: {
        width: "100%",
        height: 70,
        backgroundColor: "#4A90E2",
        justifyContent: "center",
        alignItems: "center",
    },
});