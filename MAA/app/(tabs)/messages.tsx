import DoctorCard from "@/components/DoctorCard";
import TopBox from "@/components/TopBox";
import { Text, View, StyleSheet } from "react-native";

export default function MessagesScreen() {
    return (
        <View>
            <TopBox />
            <View>
                <DoctorCard />
                <DoctorCard />
                <DoctorCard />
            </View>
        </View>
    );
}