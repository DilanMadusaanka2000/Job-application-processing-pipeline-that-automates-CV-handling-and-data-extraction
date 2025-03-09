const mongoose = require('mongoose');
const JobApplication = require('../models/userdetails'); 


async function saveApplicationToDatabase(response) {
    try {
       
        const application = new JobApplication({
            cv_data: {
                personal_info: {
                    name: response.cv_data.personal_info.name,
                    email: response.cv_data.personal_info.email,
                    phone: response.cv_data.personal_info.contact,
                    address: '',
                },
                education: response.cv_data.education.map(degree => ({
                    degree: degree.split(':')[0]?.trim() || '',
                    institution: degree.split(':')[1]?.trim() || '',
                    year: '', 
                })),
                qualifications: response.cv_data.qualifications.map(qualification => ({
                    title: qualification.split(':')[0]?.trim() || '',
                    issuer: qualification.split(':')[1]?.trim() || '',
                    year: '', 
                })),
                projects: response.cv_data.projects.map(project => ({
                    name: project.split(':')[0]?.trim() || '',
                    description: project.split(':')[1]?.trim() || '',
                    technologies: [], 
                    link: '', 
                })),
                cv_public_link: response.cv_data.cv_public_link,
            },
            metadata: {
                applicant_name: response.metadata.applicant_name,
                email: response.metadata.email,
                phone: response.metadata.phone,
                status: response.metadata.status,
                cv_processed: response.metadata.cv_processed,
                processed_timestamp: new Date(response.metadata.processed_timestamp),
            },
        });

        // Save the document to MongoDB
        await application.save();
        console.log('Job application saved successfully');
    } catch (error) {
        console.error('Error saving job application to database:', error);
    }
}

module.exports = { saveApplicationToDatabase };
