# Job Application Processing Pipeline

This repository contains a solution for automating CV handling and data extraction. The goal is to automate the entire job application process, including storing CVs in the cloud, extracting relevant information from them, sending webhooks, storing data in a MongoDB cloud database, and sending follow-up emails.

## Objective

The objective of this task is to develop a job application processing pipeline that automates CV handling, data extraction, and various notifications. The task involves:

1. Creating a simple job application form.
2. Storing the CV in a cloud storage container.
3. Extracting key information from the CV and saving it to a Google Sheet.
4. Sending an HTTP request (webhook) after processing the CV.
5. Storing the extracted CV details and user details inside the MongoDB cloud database.
6. Sending a follow-up email to the applicant.

## Tech Stack

- **Frontend**: React.js, Bootstrap Framework
- **Backend**: Node.js with Express.js
- **Cloud Storage**: Google Cloud Storage
- **Data Extraction**: PDF and DOCX parsing libraries (e.g., `pdf-parse`)
- **Google Sheets API**: For storing the extracted data
- **Data Store**: MongoDB Cloud Database
- **Webhook**: HTTP request with JSON payload
- **Email Service**: Nodemailer for sending follow-up emails

## Steps Implemented

### 1. Create a Simple Job Application Form

A simple web form that collects:

- Name
- Email
- Phone Number
- CV Document Upload (PDF or DOCX format)

The form is designed with a clean and modern UI. It allows users to upload their CV and submit their details.

### 2. Store the CV in a Cloud Storage Container

Once a user submits their CV, it is uploaded to a cloud storage service (Google Cloud Storage). The CV is assigned a publicly accessible URL, which is stored in the system for later retrieval.

### 3. Extract Information from the CV

After the CV is uploaded, the content is extracted using parsing libraries. The following sections are extracted:

- Personal Info (Name, Email, Phone Number)
- Education
- Qualifications
- Projects

This extracted data is stored in a Google Sheet along with the publicly accessible link to the CV.

### 4. Send an HTTP Request (Webhook)

Once the CV has been processed, a webhook is triggered, and the following data is sent to the provided endpoint:

- **URL**: `https://rnd-assignment.automations-3d6.workers.dev/`
- **Headers**: Custom header `X-Candidate-Email` containing the applicant's email address.
- **Payload**: The processed CV data and metadata (e.g., applicant name, email, submission status, processing status, timestamp).

### 5. Send a Follow-Up Email

The applicant receives an email the following day, informing them that their CV is under review. The email is sent at a time that matches the applicant's time zone.

## Setup and Running the Application

### Prerequisites

- Node.js and npm installed on your local machine
- An account for the chosen cloud storage service (Google Cloud)
- Google Sheets API credentials (for storing extracted data)
- Nodemailer setup for sending emails


 Clone the repository:

   ```bash
   git clone https://github.com/your-username/job-application-processing-pipeline.git
   cd job-application-processing-pipeline
