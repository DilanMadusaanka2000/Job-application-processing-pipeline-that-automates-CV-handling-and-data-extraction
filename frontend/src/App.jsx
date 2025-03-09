import { useState } from 'react';
import axios from 'axios';
import { HeroSection, Footer}  from './components/HeroSection';

function JobApplicationForm() {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const getTimeZone = () => {
        return new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];
    };
    
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };


    //update the component state
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
     
    const handleUpload = async () => {
        if (!file || !formData.name || !formData.email || !formData.phone) {   //check filed is filled
            alert("Please fill all fields and upload a CV!");
            return;
        }
        const timeZone = getTimeZone();

        const form = new FormData();
        form.append('pdfFile', file);
        form.append('name', formData.name);
        form.append('email', formData.email);
        form.append('phone', formData.phone);
        form.append('timezone', timeZone); // Add timezone 

        try {
            const response = await axios.post('http://localhost:8800/api/applications/upload', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log("Server Response:", response.data);
        } catch (error) {
            console.error("Error uploading data:", error);
        }
    };

    return (
        <>

        <HeroSection />
        <div class="container mt-5">
        <h2 class="text-center mb-4">Job Application Form</h2>
        <form>
            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" name="name" class="form-control" id="name" placeholder="Name" onChange={handleInputChange} />
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" name="email" class="form-control" id="email" placeholder="Email" onChange={handleInputChange} />
            </div>
            <div class="mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <input type="tel" name="phone" class="form-control" id="phone" placeholder="Phone Number" onChange={handleInputChange} />
            </div>
            <div class="mb-3">
                <label for="resume" class="form-label">Resume (PDF or DOCX)</label>
                <input type="file" accept=".pdf,.docx" class="form-control" id="resume" onChange={handleFileChange} />
            </div>
            <button type="submit" class="btn btn-primary w-100" onClick={handleUpload}>Submit Application</button>
        </form>
    </div>

    <br />
    <r />

    <Footer />
    </>
    );
}

export default JobApplicationForm;
