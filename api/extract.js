const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const { uploadFile } = require('./controllers/cloudstoreCv'); 
const { writeToSheet } = require('./controllers/googlesheet');
const { sendToWebhook } = require('./controllers/webhook'); 
const { sendFollowUpEmail } = require('./controllers/emailService'); 
const { saveApplicationToDatabase } = require('./controllers/dataStoreDB')
const cron = require('node-cron');
const moment = require('moment-timezone');


// After creating the response object
//await sendToWebhook(response);


// Send the response back to the client
// res.json(response);
// console.log(response);

require('dotenv').config();

const router = express.Router();


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

// Normalize text
function normalizeText(text) {
    return text.replace(/\r\n|\r|\n/g, '\n').trim();
}

// Clean unwanted sections
function cleanUnwantedSections(text) {
    return text.replace(/(RESEARCH|CERTIFICATIONS|REFERENCE)[\s\S]*/i, '');
}

// Match text with pattern
function matchText(text, pattern) {
    const match = text.match(pattern);
    return match ? match[0].trim() : null;
}

// Handle file upload and process the CV
router.post('/upload', upload.single('pdfFile'), async (req, res) => {
    try {
        const { name, email, phone, timezone } = req.body;

        if (!req.file || !name || !email || !phone || !timezone) {
            return res.status(400).json({ error: 'All fields and file are required' });
        }



        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);

        // Define improved patterns for section extraction
        // const patterns = {
        //     personalInfo: /(?:Name|PERSONAL\s?INFO|Contact|Email|PROFILE|DETAILS)[\s\S]*?(?=(EDUCATION|QUALIFICATIONS|PROJECTS|WORK|$))/i,
        //     education: /(?:EDUCATION|ACADEMIC\s?BACKGROUND|STUDIES)[\s\S]*?(?=(PROJECTS|WORK|$))/i,
        //     projects: /(?:PROJECTS|WORK\s?EXPERIENCE|PORTFOLIO)[\s\S]*?(?=(CERTIFICATIONS|REFERENCE|$))/i
        // };

        // const patterns = {
        //     personalInfo: /(?:Personal\s?Info|Name|Contact\s?Details|Email|Profile|Details)[\s\S]*?(?=(Education|Qualifications|Projects|$))/i,
        //     education: /(?:Education|Academic\s?Background|Studies)[\s\S]*?(?=($))/i,
        //     qualifications: /(?:Qualifications|Skills|Certifications)[\s\S]*?(?=($))/i,
        //     project: /(?:Projects|Work\s?Experience|Portfolio)[\s\S]*?(?=($))/i
        // };


        const patterns = {
            personalInfo: /(?:Name\s*:\s*.*\s*Contact\s*:\s*.*\s*Email\s*:\s*.*)/i,  // Adjusted to capture Name, Contact, and Email
            education: /(?:Education\s*:\s*.*(?:,.*)?)/i, // Capture Education info
            qualifications: /(?:Qualification\s*:\s*.*(?:,.*)?)/i, // Capture Qualification info
            projects: /(?:Project\s*:\s*.*(?:,.*)?)/i  // Capture Project info
        };
        


        // Process and clean the text
        const processedText = cleanUnwantedSections(normalizeText(data.text));

        // Extract sections
        // const extractedInfo = {
        //     personalInfo: matchText(processedText, patterns.personalInfo) || 'No personal info found',
        //     education: matchText(processedText, patterns.education)?.split('\n') || [],
        //     qualifications: matchText(processedText, patterns.qualifications)?.split('\n') || [],
        //     projects: matchText(processedText, patterns.projects)?.split('\n') || []
        // };


        const extractedInfo = {
            personalInfo: processedText.match(patterns.personalInfo)?.[0] || '',
            education: (processedText.match(patterns.education)?.[0]?.split(',') || []), // Ensures an array even if no match is found
            qualifications: (processedText.match(patterns.qualifications)?.[0]?.split(',') || []), // Ensures an array
            projects: (processedText.match(patterns.projects)?.[0]?.split(',') || []) // Ensures an array
        };
        




        // Upload file to Google Cloud Storage
        const bucketName = process.env.BUCKET_NAME;
        const fileOutputName = `uploads/${req.file.filename}`; // Define the path in the bucket
        const uploadedFile = await uploadFile(bucketName, filePath, fileOutputName);

        // Get the public URL of the uploaded file
        const cvPublicLink = `https://storage.cloud.google.com/${bucketName}/${fileOutputName}`;

        // Clean up the local uploaded file
        fs.unlinkSync(filePath);

        // Handle empty project section
        // if (extractedInfo.projects.length === 1 && extractedInfo.projects[0].trim() === 'No project information found') {
        //     extractedInfo.projects = ['test 1', 'test 2', 'test3'];  // Fallback project content
        // }


        // Prepare data for Google Sheets
        const sheetData = [
            ['Name', 'Email', 'Phone', 'Education', 'Qualification', 'Projects', 'CV Link'],
            [name, email, phone, extractedInfo.education.join(', '), extractedInfo.qualifications.join(', '), extractedInfo.projects.join(', '), cvPublicLink]
        ];


        // Write to Google Sheet
        await writeToSheet(sheetData);





        // Create the structured JSON response
        // const response = {
        //     cv_data: {
        //         personal_info: extractedInfo.personalInfo,
        
        //         education: extractedInfo.education,
        //         projects: extractedInfo.projects,
        //         cv_public_link: cvPublicLink

        //     },
        //     metadata: {
        //         applicant_name: name,
        //         email: email,
        //         phone: phone,
        //         status: "testing",
        //         cv_processed: true,
        //         processed_timestamp: new Date().toISOString()
        //     }
        // };


        const response = {
            cv_data: {
                personal_info: {
                    name: extractedInfo.personalInfo.split("\n")[0]?.replace("Name : ", "") || "",
                    contact: extractedInfo.personalInfo.split("\n")[1]?.replace("Contact : ", "") || "", 
                    email: extractedInfo.personalInfo.split("\n")[2]?.replace("Email: ", "") || "", 
                },
                education: extractedInfo.education,
                qualifications: extractedInfo.qualifications, 
                projects: extractedInfo.projects,
                cv_public_link: cvPublicLink
            },
            metadata: {
                applicant_name: name,
                email: email,
                phone: phone,
                status: "testing",
                cv_processed: true,
                processed_timestamp: new Date().toISOString()
            }
        };


        

        console.log(response);

        (async () => {
            await sendToWebhook(response);
        })();

      //set the email send 

        // const now = moment().tz(timezone);
        // const nextDay = now.add(1, 'day').startOf('day').format('HH:mm');

        // console.log(`Scheduling email for ${nextDay} in ${timezone}`);

        // cron.schedule(`${now.minutes()} ${now.hours()} * * *`, () => {
        //     sendFollowUpEmail(email, name);
        // }, {
        //     timezone: timezone,
        // });



        
        //send email within 20s
        setTimeout(() => {
            sendFollowUpEmail(email, name);
        }, 20000);
        
        
         // Save the response data to MongoDB
         await saveApplicationToDatabase(response);

        // Send the response
        res.json(response);
        console.log(response);

    } catch (err) {
        console.error("Error processing PDF:", err);
        res.status(500).json({ error: 'Error processing PDF' });
    }
});

module.exports = router;
