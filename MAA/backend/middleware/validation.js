const validateMedication = (req, res, next) => {
  const { name, dosage, frequency, route, startDate, patientId } = req.body;

  // Check required fields
  if (!name || !dosage || !frequency || !route || !startDate || !patientId) {
    return res.status(400).json({
      error: 'Missing required fields',
      details: 'name, dosage, frequency, route, startDate, and patientId are required'
    });
  }

  // Validate data types
  if (typeof name !== 'string' || typeof dosage !== 'string' || 
      typeof frequency !== 'string' || typeof route !== 'string') {
    return res.status(400).json({
      error: 'Invalid data types',
      details: 'name, dosage, frequency, and route must be strings'
    });
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate)) {
    return res.status(400).json({
      error: 'Invalid date format',
      details: 'startDate must be in YYYY-MM-DD format'
    });
  }

  // Validate patientId is a number
  if (typeof patientId !== 'number') {
    return res.status(400).json({
      error: 'Invalid patientId',
      details: 'patientId must be a number'
    });
  }

  next();
};

module.exports = {
  validateMedication
}; 