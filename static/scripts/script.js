import FileSaver from 'https://cdn.skypack.dev/file-saver';
import JSZip from 'https://cdn.skypack.dev/jszip';
import TemplateGenerator from '../templates.js';

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
        document.getElementById('questions').style.display = 'none';
        document.querySelector('.btn-group.btn-fixed').style.display = 'block';
        let templateSelect = document.getElementById('templateSelect').value;
        let tg = new TemplateGenerator(data);

        if (templateSelect === 'templateOne') {
            tg.generateTemplateOne();
        } else if (templateSelect === 'templateTwo') {
            tg.generateTemplateTwo();
        }
        document.getElementById('generatedContent').innerHTML = tg.getGeneratedContent();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('export-to-website').addEventListener('click', function () {
    const websiteData = gatherWebsiteData();
    exportToWebsite(websiteData);
});

function gatherWebsiteData() {
    console.log('Gathering website data');
    const formData = new FormData(document.getElementById('parameter-form'));
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    const templateSelect = document.getElementById('templateSelect').value;
    data['templateSelect'] = templateSelect;

    const content = document.getElementById('generatedContent').innerHTML;
    data['content'] = content;
    
    console.log(data);
    return data;
}

function exportToWebsite(data) {
    console.log('Exporting to website');
    fetch('/export_to_website', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({data})
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/dashboard';
        }
    })
    .catch(error => console.error('Error:', error));
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
