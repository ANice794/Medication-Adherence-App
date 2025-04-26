import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_URL } from '../../config';

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
    scheduleTimes: TimeFormat[];
    route: string;
    startDate: string;
}

interface MedicationResponse {
    id: string;
    name: string;
    dosage: string;
    route: string;
    frequency: string;
    startDate: string;
}

interface ReminderResponse {
    id: string;
    user_id: string;
    medication_id: string;
    dosage: string;
    schedule_time: string;
    frequency: string;
    start_date: string;
    end_date: string;
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

interface ApiError {
    response?: {
        data: any;
        status: number;
    };
    message: string;
}

export default function AddMedication() {
    const router = useRouter();
    const { id } = useUser();
    const [loading, setLoading] = useState(false);
    const [medicationResponse, setMedicationResponse] = useState<MedicationResponse | null>(null);
    const [shouldCreateReminder, setShouldCreateReminder] = useState(false);
    const [medication, setMedication] = useState<MedicationForm>({
        name: '',
        dosage: '',
        frequency: FREQUENCY_OPTIONS[0].value,
        scheduleTimes: [{
            hour: '9',
            minute: '00',
            period: 'AM'
        }],
        route: '',
        startDate: new Date().toISOString().split('T')[0]
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
        const newTimes = [...medication.scheduleTimes];
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

    const createTimestamp = (date: string, time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const timestamp = new Date(date);
        timestamp.setHours(hours, minutes, 0, 0);
        return timestamp.toISOString();
    };

    const validateTimes = (times: TimeFormat[]): boolean => {
        return times.every(time => {
            const hour = parseInt(time.hour);
            const minute = parseInt(time.minute);
            
            // Check if hour is between 1 and 12
            if (hour < 1 || hour > 12) return false;
            
            // Check if minute is between 0 and 59
            if (minute < 0 || minute > 59) return false;
            
            // Check if period is valid
            if (time.period !== 'AM' && time.period !== 'PM') return false;
            
            return true;
        });
    };

    const validateForm = () => {
        // Validate required fields
        console.log('Validating fields:', medication);
        if (!medication.name || !medication.dosage || !medication.frequency || !medication.route || !medication.startDate) {
            console.log('Missing required fields:', {
                name: !!medication.name,
                dosage: !!medication.dosage,
                frequency: !!medication.frequency,
                route: !!medication.route,
                startDate: !!medication.startDate
            });
            Alert.alert('Error', 'Please fill in all required fields');
            return false;
        }

        // Validate date format
        const dateRegex = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
        if (!dateRegex.test(medication.startDate)) {
            console.log('Invalid date format:', medication.startDate);
            Alert.alert('Error', 'Please enter a valid date in YYYY-MM-DD format (e.g., 2024-03-25)');
            return false;
        }

        // Additional date validation
        const [year, month, day] = medication.startDate.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day ||
            date < new Date(new Date().setHours(0, 0, 0, 0))
        ) {
            console.log('Invalid date:', medication.startDate);
            Alert.alert('Error', 'Please enter a valid date that is not in the past');
            return false;
        }

        return true;
    };

    // Effect to handle reminder creation after medication response is set
    useEffect(() => {
        const handleReminderCreation = async () => {
            if (medicationResponse && shouldCreateReminder) {
                console.log('Medication response available, creating reminder...');
                try {
                    await createReminder(medicationResponse);
                    Alert.alert('Success', 'Medication, reminders, and adherence records added successfully');
                    router.back();
                } catch (error) {
                    console.error('Error creating reminder and adherence:', error);
                    Alert.alert(
                        'Partial Success',
                        'Medication was added but there was an error creating the reminders and adherence records. Please try adding the reminders manually.'
                    );
                    router.back();
                } finally {
                    setShouldCreateReminder(false);
                }
            }
        };

        handleReminderCreation();
    }, [medicationResponse, shouldCreateReminder]);

    const verifyMedication = async (medicationId: string) => {
        let attempts = 0;
        const maxAttempts = 5;
        
        while (attempts < maxAttempts) {
            try {
                console.log(`Verifying medication (attempt ${attempts + 1})...`);
                const response = await axios.get<MedicationResponse>(`${API_URL}/medications/${medicationId}`);
                if (response.data && response.data.id) {
                    console.log('Medication verified:', response.data);
                    return response.data;
                }
            } catch (error) {
                console.log(`Verification attempt ${attempts + 1} failed, retrying...`);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }
        throw new Error('Could not verify medication after multiple attempts');
    };

    const createReminder = async (newMedication: MedicationResponse) => {
        console.log('Creating reminder...');
        console.log('New Medication Data:', newMedication);

        if (!newMedication || !newMedication.id) {
            console.error('Invalid medication data:', newMedication);
            return false;
        }

        try {
            console.log('=== Starting Reminder Creation Process ===');
            console.log('Using Medication:', {
                id: newMedication.id,
                name: newMedication.name,
                dosage: newMedication.dosage
            });

            const frequencyDetails = getFrequencyDetails(medication.frequency);
            console.log('Frequency Details:', {
                value: frequencyDetails.value,
                label: frequencyDetails.label,
                times: frequencyDetails.times,
                intervalHours: frequencyDetails.intervalHours
            });

            console.log('Original Schedule Times:', medication.scheduleTimes);

            const reminderTimes = medication.scheduleTimes.map(time => {
                const time24 = convertTo24Hour(time);
                console.log('Converting time:', {
                    original: time,
                    converted: time24
                });
                return time24;
            });

            console.log('Converted Reminder Times:', reminderTimes);

            // Calculate end date as 30 days from start date
            const endDate = new Date(medication.startDate);
            endDate.setDate(endDate.getDate() + 30);
            const endDateStr = endDate.toISOString().split('T')[0];
            
            console.log('Date Range:', {
                startDate: medication.startDate,
                endDate: endDateStr,
                totalDays: 30
            });

            // Create a reminder for each schedule time
            for (const scheduleTime of reminderTimes) {
                console.log('\n=== Creating Reminder for Schedule Time:', scheduleTime, '===');
                
                // Create reminder data object with all required fields
                const reminderData = {
                    user_id: id.toString(),
                    medication_id: parseInt(newMedication.id),
                    dosage: medication.dosage,
                    schedule_time: scheduleTime,  // Keep as HH:mm for reminders
                    frequency: medication.frequency,
                    start_date: medication.startDate,
                    end_date: endDateStr,
                    status: "PENDING",
                    type: "MEDICATION"
                };

                console.log('Creating reminder with data:', reminderData);

                // Create the reminder
                console.log('Making API request to create reminder...');
                const reminderResponse = await axios.post<ReminderResponse>(
                    `${API_URL}/patients/${id}/reminders`,
                    reminderData
                );

                console.log('Reminder Creation Response:', {
                    status: reminderResponse.status,
                    data: reminderResponse.data
                });

                if (reminderResponse.data && reminderResponse.data.id) {
                    // Create adherence record for this reminder
                    const reminderId = reminderResponse.data.id;
                    console.log('Creating adherence record for reminder ID:', reminderId);

                    // Create a proper timestamp for the adherence record
                    const scheduleForTimestamp = createTimestamp(medication.startDate, scheduleTime);

                    const adherenceData = {
                        reminder_id: reminderId,
                        user_id: id.toString(),
                        schedule_for: scheduleForTimestamp,  // Use full timestamp for adherence
                        points_awarded: 10,
                        taken: false,
                        status: "PENDING"
                    };
                    
                    console.log('Adherence Data to be sent:', adherenceData);
                    
                    console.log('Making API request to create adherence record...');
                    const adherenceResponse = await axios.post(
                        `${API_URL}/patients/${id}/reminders/${reminderId}/adherence`,
                        adherenceData
                    );

                    console.log('Adherence Creation Response:', {
                        status: adherenceResponse.status,
                        data: adherenceResponse.data
                    });
                } else {
                    throw new Error('No reminder ID in response');
                }
            }

            console.log('\n=== Reminder Creation Process Completed Successfully ===');
            return true;
        } catch (error) {
            console.error('=== Error in Reminder Creation Process ===');
            const apiError = error as ApiError;
            console.error('Error details:', apiError.message);
            if (apiError.response) {
                console.error('Response data:', apiError.response.data);
                console.error('Response status:', apiError.response.status);
            }
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        if (!validateTimes(medication.scheduleTimes)) {
            Alert.alert('Invalid Time', 'Please enter valid times in 12-hour format (e.g., 9:00 AM)');
            return;
        }

        try {
            setLoading(true);

            const medicationData = {
                patientId: id,
                name: medication.name,
                dosage: medication.dosage,
                route: medication.route,
                frequency: medication.frequency,
                startDate: medication.startDate,
                source: "manual"
            };

            console.log('Prepared medication data:', medicationData);

            // Create medication
            const response = await axios.post<{ message: string; data: MedicationResponse }>(
                `${API_URL}/medications/patients/${id}`,
                medicationData
            );
            
            console.log('Medication API Response:', response.status, response.data);
            
            if (response.status === 201 && response.data.data) {
                console.log('Medication added successfully');
                console.log('New medication created:', response.data.data);

                // Add a delay before creating reminders
                await new Promise(resolve => setTimeout(resolve, 2000));

                const newMedicationId = parseInt(response.data.data.id);
                if (isNaN(newMedicationId)) {
                    throw new Error('Invalid medication ID in response');
                }

                // Get the latest medication data
                try {
                    const getMedicationResponse = await axios.get<MedicationResponse>(
                        `${API_URL}/medications/${newMedicationId}`
                    );
                    
                    console.log('Retrieved medication data:', getMedicationResponse.data);

                    if (getMedicationResponse.data && getMedicationResponse.data.id) {
                        // Create reminders with the fetched medication data
                        const reminderCreated = await createReminder(getMedicationResponse.data);
                        
                        if (reminderCreated) {
                            Alert.alert('Success', 'Medication, reminders, and adherence records added successfully');
                            router.back();
                        } else {
                            Alert.alert(
                                'Partial Success',
                                'Medication was added but there was an error creating the reminders and adherence records. Please try adding the reminders manually.'
                            );
                            router.back();
                        }
                    } else {
                        throw new Error('Could not retrieve medication data');
                    }
                } catch (error) {
                    console.error('Error creating reminder and adherence:', error);
                    Alert.alert(
                        'Partial Success',
                        'Medication was added but there was an error creating the reminders and adherence records. Please try adding the reminders manually.'
                    );
                    router.back();
                }
            } else {
                console.log('Unexpected response status or missing data:', response.status, response.data);
                throw new Error('Failed to add medication');
            }
        } catch (error) {
            console.error('Error in medication creation:', error);
            Alert.alert('Error', 'Failed to add medication. Please try again.');
        } finally {
            setLoading(false);
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

                    {medication.scheduleTimes.map((time, index) => (
                        <View key={index} style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Schedule Time {medication.scheduleTimes.length > 1 ? `#${index + 1} ` : ''}*
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
                        <Text style={styles.label}>Start Date * (YYYY-MM-DD)</Text>
                        <TextInput
                            style={styles.input}
                            value={medication.startDate}
                            onChangeText={(text) => setMedication({ ...medication, startDate: text })}
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