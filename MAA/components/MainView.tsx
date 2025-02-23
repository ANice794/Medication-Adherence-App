import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Pressable } from "react-native";

type Props = {

}

export default function MainView() {
    //leaderboard screen and tracker screen
    //tracker screen shows what medicine you have taken and what you have not
    //leaderboard screen shows the top 10 people with the most points
    //controlled by the circles at the bottom, might change
    return (
        <View style={styles.bigView}>
            <View style={styles.container}>
                <Text>Leaderboard & Medicine List</Text>
            </View>
            <View style={styles.circleButtons}>
                <Pressable style={styles.circleButton}>
                    <MaterialCommunityIcons name="checkbox-blank-circle" size={15} color="gray" />
                </Pressable>
                <Pressable style={styles.circleButton}>
                    <MaterialCommunityIcons name="checkbox-blank-circle" size={15} color="gray" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bigView: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "80%",
        padding: "1%",
        height: "auto",
        margin: "1%",
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "gray",
        height: "auto",
        width: "90%",
        padding: "20%",
        paddingTop: "50%",
        margin: "5%",
        marginTop: "20%",
    },
    circleButtons: {
        flexDirection: "row",
        margin: "2%",
        justifyContent: "center",
    },
    circleButton: {
        marginHorizontal: "10%",
    }
});