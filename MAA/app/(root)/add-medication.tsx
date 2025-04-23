import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FrequencyOption {
    value: string;
    label: string;
    times: number;
    intervalHours: number;
}

// Frequency types and their display values
const FREQUENCY_OPTIONS: FrequencyOption[] = [
    { value: 'ONCE_DAILY', label: 'Once Daily', times: 1, intervalHours: 24 },
    { value: 'TWICE_DAILY', label: 'Twice Daily', times: 2, intervalHours: 12 },
    { value: 'THREE_DAILY', label: 'Three Times Daily', times: 3, intervalHours: 8 },
    { value: 'FOUR_DAILY', label: 'Four Times Daily', times: 4, intervalHours: 6 },
    { value: 'ONCE_WEEKLY', label: 'Once Weekly', times: 1, intervalHours: 168 },
    { value: 'EVERY_OTHER_DAY', label: 'Every Other Day', times: 1, intervalHours: 48 },
    { value: 'AS_NEEDED', label: 'As Needed', times: 1, intervalHours: 24 }
];

interface TimeFormat {
    hour: string;
    minute: string;
    period: 'AM' | 'PM';
}

const HOURS = Array.from({ length: 12 }, (_, i) => {
    const hour = (i + 1).toString();
    return { label: hour, value: hour };
});

const MINUTES = Array.from({ length: 60 }, (_, i) => {
    const minute = i.toString().padStart(2, '0');
    return { label: minute, value: minute };
});

const PERIODS = [
    { label: 'AM', value: 'AM' as const },
    { label: 'PM', value: 'PM' as const }
];

interface MedicationForm {
    name: string;
    dosage: string;
    frequency: string;
    schedule_times: TimeFormat[];
    route: string;
    start_date: string;
}

// Add time options generation
const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            const timeString = `${formattedHour}:${formattedMinute}`;
            times.push({ label: timeString, value: timeString });
        }
    }
    return times;
};

const TIME_OPTIONS = generateTimeOptions();

export default function AddMedication() {
    const router = useRouter();
    const { id } = useUser();
    console.log('User ID:', id);

    const [medication, setMedication] = useState<MedicationForm>({
        name: '',
        dosage: '',
        frequency: FREQUENCY_OPTIONS[0].value,
        schedule_times: [{
            hour: '9',
            minute: '00',
            period: 'AM'
        }],
        route: '',
        start_date: new Date().toISOString().split('T')[0]
    });

    const getFrequencyDetails = (frequencyValue: string): FrequencyOption => {
        return FREQUENCY_OPTIONS.find(option => option.value === frequencyValue) || FREQUENCY_OPTIONS[0];
    };

    // Update schedule_times array when frequency changes
    useEffect(() => {
        const frequencyDetails = getFrequencyDetails(medication.frequency);
        const defaultTime: TimeFormat = { hour: '9', minute: '00', period: 'AM' };
        const newScheduleTimes: TimeFormat[] = Array(frequencyDetails.times)
            .fill(null)
            .map(() => ({...defaultTime}));
        setMedication(prev => ({
            ...prev,
            schedule_times: newScheduleTimes
        }));
    }, [medication.frequency]);

    const handleTimeChange = (index: number, field: keyof TimeFormat, value: string) => {
        const newTimes = [...medication.schedule_times];
        newTimes[index] = {
            ...newTimes[index],
            [field]: value
        };
        setMedication(prev => ({
            ...prev,
            schedule_times: newTimes
        }));
    };

    const convertTo24Hour = (time: TimeFormat): string => {
        let hour = parseInt(time.hour);
        if (time.period === 'PM' && hour !== 12) {
            hour += 12;
        } else if (time.period === 'AM' && hour === 12) {
            hour = 0;
        }
        return `${hour.toString().padStart(2, '0')}:${time.minute}`;
    };

    const validateTimes = (times: string[]): boolean => {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return times.every(time => timeRegex.test(time));
    };

    const createReminder = async (medicationData: any) => {
        try {
            const frequencyDetails = getFrequencyDetails(medication.frequency);
            const reminderTimes = medication.schedule_times.map(time => {
                const time24 = convertTo24Hour(time);
                const [hours, minutes] = time24.split(':').map(Number);
                const reminderDate = new Date(medication.start_date);
                reminderDate.setHours(hours, minutes, 0, 0);
                return reminderDate.toISOString();
            });

            const reminderData = {
                user_id: medicationData.user_id,
                medication_name: medicationData.name,
                dosage: medicationData.dosage,
                schedule_times: reminderTimes,
                frequency: {
                    type: medication.frequency,
                    times: frequencyDetails.times,
                    intervalHours: frequencyDetails.intervalHours
                },
                start_date: medicationData.start_date,
                end_date: null
            };

            const response = await axios.post(`http://localhost:3000/patients/${id}/reminders`, reminderData);
            console.log('Reminder created:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating reminder:', error);
            return null;
        }
    };

    const handleSubmit = async () => {
        console.log('Starting medication submission...'); // Log submission start
        try {
            // Validate required fields
            console.log('Validating fields:', medication); // Log current medication data
            if (!medication.name || !medication.dosage || !medication.frequency || !medication.route || !medication.start_date) {
                console.log('Missing required fields:', {
                    name: !!medication.name,
                    dosage: !!medication.dosage,
                    frequency: !!medication.frequency,
                    route: !!medication.route,
                    start_date: !!medication.start_date
                });
                Alert.alert('Error', 'Please fill in all required fields');
                return;
            }

            // Validate all time inputs
            if (!validateTimes(medication.schedule_times.map(time => `${time.hour}:${time.minute} ${time.period}`))) {
                console.log('Invalid time format');
                Alert.alert('Error', 'Please enter valid times in HH:MM format');
                return;
            }

            // Validate date format
            console.log('Validating date format:', medication.start_date);
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(medication.start_date)) {
                console.log('Invalid date format');
                Alert.alert('Error', 'Please enter a valid date in YYYY-MM-DD format');
                return;
            }

            const medicationData = {
                user_id: id,
                name: medication.name,
                dosage: medication.dosage,
                route: medication.route,
                frequency: medication.frequency,
                start_date: new Date(medication.start_date).toISOString(),
                source: "manual"
            };
            console.log('Prepared medication data:', medicationData);

            const API_URL = 'http://localhost:3000';
            console.log('Sending POST request to:', `${API_URL}/medications`);
            
            try {
                console.log('Making API request...');
                const response = await axios.post(`${API_URL}/medications`, medicationData);
                console.log('API Response:', response.status, response.data);
                
                if (response.status === 201) {
                    console.log('Medication added successfully');
                    
                    // Create reminder for the medication
                    await createReminder(medicationData);
                    
                    Alert.alert('Success', 'Medication and reminder added successfully');
                    router.back();
                } else {
                    console.log('Unexpected response status:', response.status);
                    throw new Error('Failed to add medication');
                }
            } catch (apiError) {
                console.error('API call failed:', {
                    error: apiError,
                    request: apiError?.request,
                    response: apiError?.response,
                    config: apiError?.config
                });
                throw apiError; // Re-throw to be caught by outer catch block
            }
        } catch (error: unknown) {
            console.error('Error in handleSubmit:', {
                error,
                errorType: typeof error,
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
                errorStack: error instanceof Error ? error.stack : undefined
            });
            
            const errorMessage = error && typeof error === 'object' && 'response' in error
                ? (error.response as any)?.data?.error || 'Failed to add medication. Please try again.'
                : 'Failed to add medication. Please try again.';
            Alert.alert('Error', errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Add Medication</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Medication Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={medication.name}
                            onChangeText={(text) => setMedication({ ...medication, name: text })}
                            placeholder="Enter medication name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Dosage *</Text>
                        <TextInput
                            style={styles.input}
                            value={medication.dosage}
                            onChangeText={(text) => setMedication({ ...medication, dosage: text })}
                            placeholder="e.g., 500mg"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Route *</Text>
                        <TextInput
                            style={styles.input}
                            value={medication.route}
                            onChangeText={(text) => setMedication({ ...medication, route: text })}
                            placeholder="e.g., oral"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Frequency *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={medication.frequency}
                                onValueChange={(value: string) => setMedication({ ...medication, frequency: value })}
                                style={styles.picker}
                            >
                                {FREQUENCY_OPTIONS.map((option) => (
                                    <Picker.Item 
                                        key={option.value} 
                                        label={option.label} 
                                        value={option.value}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {medication.schedule_times.map((time, index) => (
                        <View key={index} style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Schedule Time {medication.schedule_times.length > 1 ? `#${index + 1} ` : ''}*
                            </Text>
                            <View style={styles.timePickerContainer}>
                                <View style={[styles.pickerContainer, styles.hourPicker]}>
                                    <Picker
                                        selectedValue={time.hour}
                                        onValueChange={(value: string) => handleTimeChange(index, 'hour', value)}
                                        style={styles.picker}
                                    >
                                        {HOURS.map((hour) => (
                                            <Picker.Item
                                                key={hour.value}
                                                label={hour.label}
                                                value={hour.value}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                                <Text style={styles.timeSeparator}>:</Text>
                                <View style={[styles.pickerContainer, styles.minutePicker]}>
                                    <Picker
                                        selectedValue={time.minute}
                                        onValueChange={(value: string) => handleTimeChange(index, 'minute', value)}
                                        style={styles.picker}
                                    >
                                        {MINUTES.map((minute) => (
                                            <Picker.Item
                                                key={minute.value}
                                                label={minute.label}
                                                value={minute.value}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                                <View style={[styles.pickerContainer, styles.periodPicker]}>
                                    <Picker
                                        selectedValue={time.period}
                                        onValueChange={(value: 'AM' | 'PM') => handleTimeChange(index, 'period', value)}
                                        style={styles.picker}
                                    >
                                        {PERIODS.map((period) => (
                                            <Picker.Item
                                                key={period.value}
                                                label={period.label}
                                                value={period.value}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    ))}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Start Date *</Text>
                        <TextInput
                            style={styles.input}
                            value={medication.start_date}
                            onChangeText={(text) => setMedication({ ...medication, start_date: text })}
                            placeholder="YYYY-MM-DD"
                            keyboardType="numbers-and-punctuation"
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Add Medication</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#4A90E2',
        padding: 20,
        paddingTop: 60,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
    },
    headerText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#4A90E2',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
        marginBottom: 10
    },
    picker: {
        height: 50,
        width: '100%'
    },
    timePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    hourPicker: {
        flex: 2
    },
    minutePicker: {
        flex: 2
    },
    periodPicker: {
        flex: 1.5
    },
    timeSeparator: {
        fontSize: 24,
        marginHorizontal: 5,
        color: '#333'
    },
}); 