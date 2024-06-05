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
        let templateSelect = document.getElementById('templateSelect').value;
        let tg = new TemplateGenerator(data);

        if (templateSelect === 'templateOne') {
            tg.generateTemplateOne();
        } else if (templateSelect === 'templateTwo') {
            tg.generateTemplateTwo();
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
    const zip = new JSZip();
    const htmlContent = document.documentElement.outerHTML;
    const cssLink = document.getElementById('main-stylesheet').getAttribute('href');
    const selectedTemplate = document.getElementById('templateSelect').value;

    zip.file("index.html", htmlContent);

    fetch(cssLink)
    .then(response => response.text())
    .then(cssContent => {
        if (selectedTemplate === 'templateOne') {
            zip.file("styles.css", cssContent);
        } 
        if (selectedTemplate === 'templateTwo'){
            zip.file("styles2.css", cssContent);
        }

        zip.generateAsync({ type: "blob" })
        .then(content => {
            saveAs(content, "website.zip");
        });
    })
    .catch(error => {
        console.error('Error fetching CSS:', error);
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
