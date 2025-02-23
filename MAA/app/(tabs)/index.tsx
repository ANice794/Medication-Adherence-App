import MainView from "@/components/MainView";
import PointsAndStreak from "@/components/PointsAndStreak";
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer, NavigationIndependentTree, useRoute } from "@react-navigation/native";
import StackNavigator from "./_layout";
import TopBox from "@/components/TopBox";

export default function Index() {
	const route = useRoute();
	console.log(route.name);
	return (
		<View style={styles.container}>
			<TopBox />
			<View style={styles.part}>
				<PointsAndStreak />
			</View>
			<View style={styles.mainView}>
				<MainView />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
	},
	part: {
		flex: 1,
		width: "100%",
	},
	topBox: {
        width: "100%",
        height: 70,
        backgroundColor: "#4A90E2",
        justifyContent: "center",
        alignItems: "center",
    },
	mainView: {
        width: "100%",
		alignItems: "center",
		justifyContent: "flex-start",
    },
});