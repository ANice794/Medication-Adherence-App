import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TopBox from "@/components/TopBox";

export default function ProfileScreen() {

    return (
        <View>
            <TopBox />
            <View style={styles.bigView}>
                <View style={styles.container}>
                    <Ionicons name="person-circle-outline" size={200} color="black" />
                    <Text style={styles.textName}>John Doe</Text>
                    <Text style={styles.text}>September 5, 2000</Text>
                    <Text style={styles.text}>johndoe@gmail.com</Text>
                    <Text style={styles.text}>User for 10 Days</Text>
                    <View style={styles.buttons}>
                        <Pressable style={[styles.button, styles.editButton]}>Edit Profile</Pressable>
                        <Pressable style={[styles.button, styles.deleteButton]}>Delete Profile</Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bigView: {
        width: "80%",
        alignItems: "center",
        alignSelf: "center",
        padding: "1%",
    },
    container: {
        width: "70%",
        height: "auto",
        alignItems: "center",
        padding: "15%",
    },
    textName: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 25,
    },
    text: {
        fontSize: 15,
        margin: "1%",
        textAlign: "center",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "20%",
        margin: "2%",
    },
    button: {
        padding: "15%",
        borderRadius: 10,
        fontSize: 17,
        margin: "3%",
        color: "#fff",
    },
    editButton:{
        backgroundColor: "green",
    },
    deleteButton:{
        backgroundColor: "red",
    }
});