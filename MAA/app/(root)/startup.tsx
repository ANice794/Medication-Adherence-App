import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, Redirect } from 'expo-router'

const StartPage = () => {

    

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Image /*source={}*/></Image>

                <View>
                    <Text>Welcome to the Medical Adherence App {"\n"}Name is a work in Progress</Text>


                    <Text>Let's Get Started</Text>
                    <View>
                        <Link href="/login">Login</Link>
                        <Link href="/sign-up">Sign Up</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default StartPage;