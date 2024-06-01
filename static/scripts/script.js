document.getElementById('parameter-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('status').textContent = 'Generating...   May take up to 30 seconds';
    fetch('/calculate', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('status').textContent = 'Generated.';
        document.getElementById('profile-section').style.display = 'block';
        document.getElementById('profile-image').src = URL.createObjectURL(document.getElementById('profileImage').files[0]);
        // probably change to a better introduction 
        document.getElementById('name').innerText = `Hello, I am ${data.name || 'Not Provided'}`; 
        document.getElementById('introduction').innerText = data.description || 'Not Provided';
        // need to fix link 
        const contactInfo = document.getElementById('contact');
        contactInfo.innerText = `${data.contactInfo || data.website ||  'Contact Not Provided'}`;

        const jobExperiences = document.getElementById('job-experiences');
        jobExperiences.innerHTML = '';
        if (data.jobNames && data.jobNames.length > 0) {
            data.jobNames.forEach((job, index) => {
                const jobDiv = document.createElement('div');
                jobDiv.classList.add('job-experience');
                jobDiv.innerHTML = `<h4>${job}</h4>`;
                const jobDetails = document.createElement('div');
                jobDetails.classList.add('job-details');
                jobDetails.style.display = 'none'; //prevents 2 clicks problem 
                if (data.jobContent && data.jobContent[index]) {
                    jobDetails.innerHTML = `<p>${data.jobContent[index]}</p>`;
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
                jobExperiences.appendChild(jobDiv);
            });
        } else {
            jobExperiences.innerHTML = '<p>Not Provided</p>';
        }

        const otherExperiences = document.getElementById('other-experiences');
        otherExperiences.innerHTML = '';
        if (data.otherExperience && data.otherExperience.length > 0) {
            data.otherExperience.forEach((exp, index) => {
                const expDiv = document.createElement('div');
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
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

    // document.getElementById('rate-job').addEventListener('click', function () {
    //     // smth about sending another call back to gemini somehow idk maybe later 
    // });

document.getElementById('export-html').addEventListener('click', function () {
    exportToHTML();
});

function exportToHTML() {
    const formData = new FormData();
    formData.append('resume', document.getElementById('resume').files[0]);

    fetch('/calculate', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Profile AI</title>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Montserrat', sans-serif; }
                    .container { padding-top: 20px; }
                    .divider { border-top: 1px solid #ddd; margin: 20px 0; }
                    .job-details { display: block; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2 id="name">Hello, I am ${data.name || 'Not Provided'}</h2>
                    <p id="introduction">${data.description || 'Not Provided'}</p>
                    <p><a id="website" href="${data.website || '#'}">Other Links: ${data.website || 'Not Provided'}</a></p>
                    <div class="divider"></div>
                    <h3>Experiences</h3>
                    <div id="job-experiences">
                        ${generateJobExperiences(data.jobNames, data.jobContent)}
                    </div>
                    <h3>Other Experiences and Interests</h3>
                    <div id="other-experiences">
                        ${generateOtherExperiences(data.otherExperience)}
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        saveAs(blob, 'profile.html');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function generateJobExperiences(jobNames, jobContent) {
    if (!jobNames || jobNames.length === 0) {
        return '<p>Not Provided</p>';
    }
    
    let html = '';
    jobNames.forEach((job, index) => {
        html += `
            <div class="job-experience">
                <h4>${job}</h4>
                <div class="job-details">
                    <p>${jobContent[index] || 'Not Provided'}</p>
                </div>
            </div>
        `;
    });
    return html;
}

function generateOtherExperiences(otherExperience) {
    if (!otherExperience || otherExperience.length === 0) {
        return '<p>Not Provided</p>';
    }
    
    let html = '';
    otherExperience.forEach(exp => {
        let expContent = '';
        for (let key in exp) {
            expContent += `<strong>${key}:</strong> ${exp[key]}<br>`;
        }
        html += `<p>${expContent}</p>`;
    });
    return html;
}
