import TopBox from "@/components/TopBox";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import iconSet from "@expo/vector-icons/build/Fontisto";
import { Text, View, StyleSheet, Pressable } from "react-native";

export default function HealthScreen() {
    return (
        <View style={styles.container}>
            <TopBox />
            <View style={[styles.block, styles.health]}>
                <View style={styles.icon}>
                    <Ionicons color={"#fff"} name="bed" size={50} />
                    <Text style={styles.tinyText}>6 HRS 30 MINS</Text>
                </View>
            </View>
            <View style={[styles.block, styles.bloodPressure]}>
                <View style={styles.icon}>
                    <MaterialIcons color={"#fff"} name='monitor-heart' size={50} />
                    <Text style={styles.tinyText}>    80 BPM</Text>
                </View>
            </View>
            <View style={[styles.block, styles.activity]}>
                <View style={styles.icon}>
                    <Ionicons color={"#fff"} name="footsteps" size={50} />
                    <Text style={styles.tinyText}>6,000 STEPS</Text>
                </View>
            </View>
            <View style={[styles.block, styles.meditation]}>
                <View style={styles.icon}>
                    <MaterialCommunityIcons color={"#fff"} name="meditation" size={50} />
                    <Text style={styles.tinyText}>20 MINUTES</Text>
                </View>
            </View>
            <View style={[styles.block, styles.bpm]}>
                <View style={styles.icon}>
                    <Ionicons color={"#fff"} name="heart-sharp" size={50} />
                    <Text style={styles.tinyText}>126/69 MMHG</Text>
                </View>
            </View>
            <View style={[styles.block, styles.weight]}>
                <View style={styles.icon}>
                    <MaterialCommunityIcons color={"#fff"} name="weight" size={50} />
                    <Text style={styles.tinyText}>160 POUNDS</Text>
                </View>
            </View>
            <View>
                <Pressable style={styles.button}>
                    <Text style={styles.tinyText}>Send to Doctor</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    block: {
        width: "50%",
        justifyContent: "space-around",
        alignItems: "center",
        margin: "2%",
        paddingHorizontal: "5%",
        flexDirection: "row",
        borderRadius: 10,
    },
    health: {
        backgroundColor: "steelblue",
    },
    bloodPressure: {
        backgroundColor: "pink",
    },
    activity: {
        backgroundColor: "green",
    },
    bpm: {
        backgroundColor: "coral",
    },
    meditation: {
        backgroundColor: "teal",
    },
    weight: {
        backgroundColor: "purple",
    },
    text: {
        color: "#fff",
        textAlign: 'center',
        fontSize: 25,
        width: "50%",
    },
    button: {
        backgroundColor: "blue",
        padding: "2%",
        borderRadius: 15,
    },
    tinyText: {
        color: "#fff",
        fontSize: 20,
        margin: "1%",
        textAlign: 'center',
    },
    icon: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
});