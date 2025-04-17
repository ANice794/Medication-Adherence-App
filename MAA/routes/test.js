// Example test requests for each route:

// POST /patients
// Request body: { "first_name": "John", "last_name": "Doe", "email": "john.doe@example.com", "password": "password123", "dob": "1990-01-01" }

// GET /patients
// No request body required

// GET /patients/:patientId
// Replace :patientId with a valid patient ID in the URL

// PUT /patients/:patientId
// Replace :patientId with a valid patient ID in the URL
// Request body: { "first_name": "UpdatedName", "last_name": "UpdatedLastName" }

// DELETE /patients/:patientId
// Replace :patientId with a valid patient ID in the URL

// GET /patients/:patientId/chats
// Replace :patientId with a valid patient ID in the URL

// GET /patients/:patientId/messages
// Replace :patientId with a valid patient ID in the URL

// GET /patients/:patientId/chats/:chatId/messages
// Replace :patientId and :chatId with valid IDs in the URL

// POST /patients/:patientId/chats/:doctorId
// Replace :patientId and :doctorId with valid IDs in the URL

// GET /patients/:patientId/doctors
// Replace :patientId with a valid patient ID in the URL

// POST /patients/:patientId/rewards/:rewardId
// Replace :patientId and :rewardId with valid IDs in the URL

// DELETE /patients/:patientId/rewards/:rewardId
// Replace :patientId and :rewardId with valid IDs in the URL

// GET /patients/:patientId/rewards
// Replace :patientId with a valid patient ID in the URL

// GET /patients/:patientId/points/current
// Replace :patientId with a valid patient ID in the URL

// GET /patients/:patientId/points/all
// Replace :patientId with a valid patient ID in the URL

// POST /patients/:patientId/points
// Replace :patientId with a valid patient ID in the URL

// POST /patients/:patientId/reminders
// Replace :patientId with a valid patient ID in the URL
// Request body: { "medication_name": "MedName", "dosage": "10mg", "schedule_time": "08:00", "frequency": "daily", "start_date": "2023-01-01", "end_date": "2023-12-31" }

// GET /patients/:patientId/reminders
// Replace :patientId with a valid patient ID in the URL

// PUT /patients/:patientId/reminders/:reminderId
// Replace :patientId and :reminderId with valid IDs in the URL
// Request body: { "medication_name": "UpdatedMedName" }

// DELETE /patients/:patientId/reminders/:reminderId
// Replace :patientId and :reminderId with valid IDs in the URL

// GET /patients/:patientId/reminders/:reminderId
// Replace :patientId and :reminderId with valid IDs in the URL

// GET /patients/:patientId/adherence
// Replace :patientId with a valid patient ID in the URL

// POST /patients/:patientId/adherence/:reminderId
// Replace :patientId and :reminderId with valid IDs in the URL
// Request body: { "schedule_for": "2023-01-01T08:00:00Z", "points_awarded": 10 }

// PUT /patients/:patientId/adherence/:adherenceId
// Replace :patientId and :adherenceId with valid IDs in the URL
// Request body: { "schedule_for": "2023-01-02T08:00:00Z" }

// DELETE /patients/:patientId/adherence/:adherenceId
// Replace :patientId and :adherenceId with valid IDs in the URL

// GET /patients/:patientId/adherence/:adherenceId
// Replace :patientId and :adherenceId with valid IDs in the URL

// GET /patients/:patientId/reminders/:reminderId/adherence
// Replace :patientId and :reminderId with valid IDs in the URL