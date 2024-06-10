class TemplateGenerator {
    constructor(data) {
        this.data = data;
    }
    getGeneratedContent() {
        return JSON.stringify(this.data);
    }
    updateStylesheet(filename) {
        var oldLink = document.querySelector("#main-stylesheet");
        oldLink.href = STATIC_URL + filename;
    }

    generateTemplateOne() {
        this.updateStylesheet('styles.css');
        document.getElementById('status').textContent = 'Generated.';
        document.getElementById('profile-section').style.display = 'block';
        document.getElementById('profile-image').src = URL.createObjectURL(document.getElementById('profileImage').files[0]);
        document.getElementById('name').innerText = `Hello, I am ${this.data.name || 'Not Provided'}`; 
        document.getElementById('introduction').innerText = this.data.description || 'Not Provided';
        const contactInfo = document.getElementById('contact');
        contactInfo.innerText = `${this.data.contactInfo || this.data.website ||  'Contact Not Provided'}`;

        const jobExperiences = document.getElementById('job-experiences');
        jobExperiences.innerHTML = '';
        if (this.data.jobNames && this.data.jobNames.length > 0) {
            this.data.jobNames.forEach((job, index) => {
                const jobDiv = this.createExperienceBlock(job, this.data.jobContent[index]);
                jobExperiences.appendChild(jobDiv);
            });
        } else {
            jobExperiences.innerHTML = '<p>Not Provided</p>';
        }

        const otherExperiences = document.getElementById('other-experiences');
        otherExperiences.innerHTML = '';
        if (this.data.otherExperience && this.data.otherExperience.length > 0) {
            this.data.otherExperience.forEach((exp, index) => {
                const expDiv = document.createElement('div');
                expDiv.classList.add('other-experience');
                let expContent = '';
                for (let key in exp) {
                    expContent += `<strong>${key}:</strong> ${exp[key]}<br>`;
                }
                expDiv.innerHTML = `<p>${expContent}</p>`;
                otherExperiences.appendChild(expDiv);
            });
        } else {
            otherExperiences.innerHTML = '<p>Not Provided</p>';
        }
    }

    generateTemplateTwo() {
        this.updateStylesheet('styles2.css');
        document.getElementById('status').textContent = 'Generated.';
        document.getElementById('profile-section').style.display = 'block';
        document.getElementById('profile-image').src = URL.createObjectURL(document.getElementById('profileImage').files[0]);
        document.getElementById('name').innerText = `Hello, I am ${this.data.name || 'Not Provided'}`; 
        document.getElementById('introduction').innerText = this.data.description || 'Not Provided';
        const contactInfo = document.getElementById('contact');
        contactInfo.innerText = `${this.data.contactInfo || this.data.website || 'Contact Not Provided'}`;
    
        const jobExperiences = document.getElementById('job-experiences');
        jobExperiences.innerHTML = '';
        if (this.data.jobNames && this.data.jobNames.length > 0) {
            const leftColumn = document.createElement('div');
            leftColumn.classList.add('column');
            const rightColumn = document.createElement('div');
            rightColumn.classList.add('column');
            const half = Math.ceil(this.data.jobNames.length / 2);
            this.data.jobNames.forEach((job, index) => {
                const jobDiv = this.createExperienceBlock(job, this.data.jobContent[index]);
                if (index < half) {
                    leftColumn.appendChild(jobDiv);
                } else {
                    rightColumn.appendChild(jobDiv);
                }
            });
            jobExperiences.appendChild(leftColumn);
            jobExperiences.appendChild(rightColumn);
        } else {
            jobExperiences.innerHTML = '<p>Not Provided</p>';
        }
    
        const otherExperiences = document.getElementById('other-experiences');
        otherExperiences.innerHTML = '';
        if (this.data.otherExperience && this.data.otherExperience.length > 0) {
            this.data.otherExperience.forEach((exp, index) => {
                const expDiv = document.createElement('div');
                expDiv.classList.add('other-experience');
                let expContent = '';
                for (let key in exp) {
                    expContent += `<strong>${key}:</strong> ${exp[key]}<br>`;
                }
                expDiv.innerHTML = `<p>${expContent}</p>`;
                otherExperiences.appendChild(expDiv);
            });
        } else {
            otherExperiences.innerHTML = '<p>Not Provided</p>';
        }
    }
    
    createExperienceBlock(job, content) {
        const jobDiv = document.createElement('div');
        jobDiv.classList.add('job-experience');
        jobDiv.innerHTML = `<h4>${job}</h4>`;
        const jobDetails = document.createElement('div');
        jobDetails.classList.add('job-details');
        jobDetails.style.display = 'none';
        if (content) {
            jobDetails.innerHTML = `<p>${content}</p>`;
        } else {
            jobDetails.innerHTML = '<p>Not Provided</p>';
        }
        jobDiv.appendChild(jobDetails);
        jobDiv.addEventListener('click', () => {
            if (jobDetails.style.display === 'none') {
                jobDetails.style.display = 'block';
            } else {
                jobDetails.style.display = 'none';
            }
        });
        return jobDiv;
    }
}    
export default TemplateGenerator;