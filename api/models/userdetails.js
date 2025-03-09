const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    cv_data: {
      personal_info: {
        name: String,
        email: String,
        phone: String,
        address: String
      },
      education: [
        {
          degree: String,
          institution: String,
          year: String
        }
      ],
      qualifications: [
        {
          title: String,
          issuer: String,
          year: String
        }
      ],
      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
          link: String
        }
      ],
      cv_public_link: String
    },
    metadata: {
      applicant_name: String,
      email: String,
      status: String,
      cv_processed: Boolean,
      processed_timestamp: Date
    }
  }
);

module.exports = mongoose.model('JobApplication', ApplicationSchema);

