import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Pressable } from "react-native";

type Props = {

}

export default function DoctorCard() {
    return (
        <Pressable style={styles.container}>
            <Ionicons name="person-circle-outline" size={100} color="black" />
            <View>
                <Text style={styles.name}>Dr. John Doe</Text>
                <Text style={styles.specialization}>Cardiologist</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "lightgray",
        width: "90%",
        margin: "5%",
        borderRadius: 10,
        alignSelf: "center",
        flexDirection: "row",
        padding: "5%",
    },
    name: {
        fontSize: 30,
        fontWeight: "bold",
    },
    specialization: {
        fontSize: 15,
        margin: "1%",
    },
    textContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});