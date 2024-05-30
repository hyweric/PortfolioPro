document.getElementById('parameter-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        document.getElementById('profile-section').style.display = 'none';

        fetch('/calculate', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('profile-section').style.display = 'block';
                document.getElementById('profile-image').src = URL.createObjectURL(document.getElementById('profileImage').files[0]);
                // probably change to a better introduction 
                document.getElementById('name').innerText = `Hello, I am ${data.name || 'Not Provided'}`; 
                document.getElementById('introduction').innerText = data.description || 'Not Provided';
                // need to fix link 
                const websiteLink = document.getElementById('website');
                websiteLink.innerText = `Other Links: ${data.website || 'Not Provided'}`;
                websiteLink.href = data.website || '#';

                const jobExperiences = document.getElementById('job-experiences');
                jobExperiences.innerHTML = '';
                if (data.jobNames && data.jobNames.length > 0) {
                    data.jobNames.forEach((job, index) => {
                        const jobDiv = document.createElement('div');
                        jobDiv.classList.add('job-experience');
                        jobDiv.innerHTML = `<h4>${job}</h4>`;
                        const jobDetails = document.createElement('div');
                        jobDetails.classList.add('job-details');
                        jobDetails.style.display = 'none'; //prevents 2 clikcs problem 
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
                        expDiv.innerHTML = `<p> <br>${expContent}</p>`;
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
        alert('im working on this still just save for now')
        // i gotta rework this 
    });