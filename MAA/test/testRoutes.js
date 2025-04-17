const axios = require('axios');
const { profile } = require('console');

const BASE_URL = 'http://localhost:3000'; // Replace with your API base URL

async function testRoutes() {
    let patientId, doctorId = '11', chatId = '1', rewardId = '54321', reminderId, adherenceId, patientId2 = '41';

    try {
        // Patients Routes
        console.log('Testing Patients Routes...');
        try {
            const newPatient = await axios.post(`${BASE_URL}/patients`, {
                first_name: 'John',
                last_name: 'Doe',
                email: 'johnnydoe33@gmail.com',
                password: 'password123',
                dob: '1990-01-01',
            });
            console.log('POST /patients:', newPatient.data);
            patientId = 1;
        } catch (error) {
            console.error('Error in POST /patients:', error.response ? error.response.data : error.message);
        }

        try {
            const patients = await axios.get(`${BASE_URL}/patients`);
            console.log('GET /patients:', patients.data);
            patientId = patients.data[0].id; // Assuming the first patient is the one we want to test with
        } catch (error) {
            console.error('Error in GET /patients:', error.response ? error.response.data : error.message);
        }

        try {
            const patient = await axios.get(`${BASE_URL}/patients/${patientId}`);
            console.log(`GET /patients/${patientId}:`, patient.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId}:`, error.response ? error.response.data : error.message);
        }

        try {
            await axios.put(`${BASE_URL}/patients/${patientId}`, {
                first_name: 'UpdatedName',
                last_name: 'UpdatedLastName',
            });
            console.log(`PUT /patients/${patientId}: Success`);
        } catch (error) {
            console.error(`Error in PUT /patients/${patientId}:`, error.response ? error.response.data : error.message);
        }

        try {
            await axios.delete(`${BASE_URL}/patients/${patientId}`);
            console.log(`DELETE /patients/${patientId}: Success`);
        } catch (error) {
            console.error(`Error in DELETE /patients/${patientId}:`, error.response ? error.response.data : error.message);
        }

        // Chats Routes
        console.log('Testing Chats Routes...');
        try {
            const chats = await axios.get(`${BASE_URL}/patients/${patientId2}/chats`);
            console.log(`GET /patients/${patientId2}/chats:`, chats.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/chats:`, error.response ? error.response.data : error.message);
        }

        try {
            const newChat = await axios.post(`${BASE_URL}/patients/${patientId}/chats/${doctorId}`, {});
            console.log(`POST /patients/${patientId2}/chats/${doctorId2}:`, newChat.data);
        } catch (error) {
            console.error(`Error in POST /patients/${patientId2}/chats/${doctorId}:`, error.response ? error.response.data : error.message);
        }

        try {
            const chatMessages = await axios.get(`${BASE_URL}/patients/${patientId2}/chats/${chatId}/messages`);
            console.log(`GET /patients/${patientId2}/chats/${chatId}/messages:`, chatMessages.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/chats/${chatId}/messages:`, error.response ? error.response.data : error.message);
        }

        // Messages Routes
        console.log('Testing Messages Routes...');
        try {
            const messages = await axios.get(`${BASE_URL}/patients/${patientId2}/messages`);
            console.log(`GET /patients/${patientId2}/messages:`, messages.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/messages:`, error.response ? error.response.data : error.message);
        }

        // Doctors Routes
        console.log('Testing Doctors Routes...');
        try {
            const doctors = await axios.get(`${BASE_URL}/patients/${patientId2}/doctors`);
            console.log(`GET /patients/${patientId2}/doctors:`, doctors.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/doctors:`, error.response ? error.response.data : error.message);
        }

        // Rewards Routes
        console.log('Testing Rewards Routes...');
        try {
            const rewards = await axios.get(`${BASE_URL}/patients/${patientId2}/rewards`);
            console.log(`GET /patients/${patientId2}/rewards:`, rewards.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/rewards:`, error.response ? error.response.data : error.message);
        }

        try {
            const newReward = await axios.post(`${BASE_URL}/patients/${patientId}/rewards/${rewardId}`, {});
            console.log(`POST /patients/${patientId2}/rewards/${rewardId}:`, newReward.data);
        } catch (error) {
            console.error(`Error in POST /patients/${patientId2}/rewards/${rewardId}:`, error.response ? error.response.data : error.message);
        }

        try {
            await axios.delete(`${BASE_URL}/patients/${patientId2}/rewards/${rewardId}`);
            console.log(`DELETE /patients/${patientId2}/rewards/${rewardId}: Success`);
        } catch (error) {
            console.error(`Error in DELETE /patients/${patientId2}/rewards/${rewardId}:`, error.response ? error.response.data : error.message);
        }

        // Points Routes
        console.log('Testing Points Routes...');
        try {
            const currentPoints = await axios.get(`${BASE_URL}/patients/${patientId}/points/current`);
            console.log(`GET /patients/${patientId2}/points/current:`, currentPoints.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/points/current:`, error.response ? error.response.data : error.message);
        }

        try {
            const allPoints = await axios.get(`${BASE_URL}/patients/${patientId2}/points/all`);
            console.log(`GET /patients/${patientId2}/points/all:`, allPoints.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/points/all:`, error.response ? error.response.data : error.message);
        }

        try {
            const newPoints = await axios.post(`${BASE_URL}/patients/${patientId2}/points`, { points: 50 });
            console.log(`POST /patients/${patientId2}/points:`, newPoints.data);
        } catch (error) {
            console.error(`Error in POST /patients/${patientId2}/points:`, error.response ? error.response.data : error.message);
        }

        // Reminders Routes
        console.log('Testing Reminders Routes...');
        try {
            const newReminder = await axios.post(`${BASE_URL}/patients/${patientId2}/reminders`, {
                medication_name: 'MedName',
                dosage: '10mg',
                schedule_time: '08:00',
                frequency: 'daily',
                start_date: '2023-01-01',
                end_date: '2023-12-31',
            });
            console.log('POST /patients/:patientId/reminders:', newReminder.data);
            reminderId = newReminder.data.id;
        } catch (error) {
            console.error('Error in POST /patients/:patientId/reminders:', error.response ? error.response.data : error.message);
        }

        try {
            const reminders = await axios.get(`${BASE_URL}/patients/${patientId}/reminders`);
            console.log(`GET /patients/${patientId2}/reminders:`, reminders.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/reminders:`, error.response ? error.response.data : error.message);
        }

        try {
            await axios.put(`${BASE_URL}/patients/${patientId2}/reminders/${reminderId}`, {
                medication_name: 'UpdatedMedName',
            });
            console.log(`PUT /patients/${patientId}/reminders/${reminderId}: Success`);
        } catch (error) {
            console.error(`Error in PUT /patients/${patientId2}/reminders/${reminderId}:`, error.response ? error.response.data : error.message);
        }

        try {
            await axios.delete(`${BASE_URL}/patients/${patientId2}/reminders/${reminderId}`);
            console.log(`DELETE /patients/${patientId2}/reminders/${reminderId}: Success`);
        } catch (error) {
            console.error(`Error in DELETE /patients/${patientId2}/reminders/${reminderId}:`, error.response ? error.response.data : error.message);
        }

        try {
            const reminderDetails = await axios.get(`${BASE_URL}/patients/${patientId2}/reminders/${reminderId}`);
            console.log(`GET /patients/${patientId2}/reminders/${reminderId}:`, reminderDetails.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/reminders/${reminderId}:`, error.response ? error.response.data : error.message);
        }

        // Adherence Routes
        console.log('Testing Adherence Routes...');
        try {
            const adherence = await axios.get(`${BASE_URL}/patients/${patientId2}/adherence`);
            console.log(`GET /patients/${patientId2}/adherence:`, adherence.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/adherence:`, error.response ? error.response.data : error.message);
        }

        try {
            const newAdherence = await axios.post(`${BASE_URL}/patients/${patientId2}/adherence/${reminderId}`, {
                schedule_for: '2023-01-01T08:00:00Z',
                points_awarded: 10,
            });
            console.log(`POST /patients/${patientId2}/adherence/${reminderId}:`, newAdherence.data);
            adherenceId = newAdherence.data.id;
        } catch (error) {
            console.error(`Error in POST /patients/${patientId2}/adherence/${reminderId}:`, error.response ? error.response.data : error.message);
        }

        try {
            await axios.put(`${BASE_URL}/patients/${patientId2}/adherence/${adherenceId}`, {
                schedule_for: '2023-01-02T08:00:00Z',
            });
            console.log(`PUT /patients/${patientId2}/adherence/${adherenceId}: Success`);
        } catch (error) {
            console.error(`Error in PUT /patients/${patientId2}/adherence/${adherenceId}:`, error.response ? error.response.data : error.message);
        }

        try {
            await axios.delete(`${BASE_URL}/patients/${patientId2}/adherence/${adherenceId}`);
            console.log(`DELETE /patients/${patientId2}/adherence/${adherenceId}: Success`);
        } catch (error) {
            console.error(`Error in DELETE /patients/${patientId2}/adherence/${adherenceId}:`, error.response ? error.response.data : error.message);
        }

        try {
            const adherenceDetails = await axios.get(`${BASE_URL}/patients/${patientId2}/adherence/${adherenceId}`);
            console.log(`GET /patients/${patientId2}/adherence/${adherenceId}:`, adherenceDetails.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/adherence/${adherenceId}:`, error.response ? error.response.data : error.message);
        }

        try {
            const reminderAdherence = await axios.get(`${BASE_URL}/patients/${patientId2}/reminders/${reminderId}/adherence`);
            console.log(`GET /patients/${patientId2}/reminders/${reminderId}/adherence:`, reminderAdherence.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/reminders/${reminderId}/adherence:`, error.response ? error.response.data : error.message);
        }

        // New Routes
        console.log('Testing New Routes...');
        try {
            const newAdherenceDetails = await axios.get(`${BASE_URL}/patients/${patientId2}/adherence/${adherenceId}`);
            console.log(`GET /patients/${patientId2}/adherence/${adherenceId}:`, newAdherenceDetails.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/adherence/${adherenceId}:`, error.response ? error.response.data : error.message);
        }

        try {
            const newReminderAdherence = await axios.get(`${BASE_URL}/patients/${patientId2}/reminders/${reminderId}/adherence`);
            console.log(`GET /patients/${patientId2}/reminders/${reminderId}/adherence:`, newReminderAdherence.data);
        } catch (error) {
            console.error(`Error in GET /patients/${patientId2}/reminders/${reminderId}/adherence:`, error.response ? error.response.data : error.message);
        }

    } catch (error) {
        console.error('Unexpected error:', error.response ? error.response.data : error.message);
    }
}

testRoutes();
