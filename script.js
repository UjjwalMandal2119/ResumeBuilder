// ===== Resume Builder JavaScript =====

// Global variables
let experienceCount = 0;
let educationCount = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSavedData();
    setupEventListeners();
    addInitialExperience();
    addInitialEducation();
});

// ===== Initialization =====
function initializeApp() {
    console.log('Resume Builder Initialized');
}

// ===== Event Listeners Setup =====
function setupEventListeners() {
    // Form inputs - real-time preview update
    const formInputs = document.querySelectorAll('#resumeForm input, #resumeForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', saveData);
    });

    // Add experience button
    document.getElementById('addExperience').addEventListener('click', addExperience);

    // Add education button
    document.getElementById('addEducation').addEventListener('click', addEducation);

    // Clear all button
    document.getElementById('clearBtn').addEventListener('click', clearAll);

    // Download PDF button
    document.getElementById('downloadBtn').addEventListener('click', downloadPDF);

    // Template selector
    document.getElementById('templateSelect').addEventListener('change', changeTemplate);
}

// ===== Experience Management =====
function addInitialExperience() {
    addExperience();
}

function addExperience() {
    experienceCount++;
    const template = document.getElementById('experienceTemplate');
    const clone = template.content.cloneNode(true);
    
    // Set item number
    clone.querySelector('.item-number').textContent = experienceCount;
    
    // Get the experience item
    const experienceItem = clone.querySelector('.experience-item');
    experienceItem.dataset.id = experienceCount;
    
    // Add event listeners to inputs
    const inputs = clone.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', saveData);
    });
    
    // Handle "Currently Working" checkbox
    const currentCheckbox = clone.querySelector('.exp-current');
    const endDateInput = clone.querySelector('.exp-end');
    currentCheckbox.addEventListener('change', function() {
        if (this.checked) {
            endDateInput.value = '';
            endDateInput.disabled = true;
        } else {
            endDateInput.disabled = false;
        }
        updatePreview();
        saveData();
    });
    
    // Remove button
    const removeBtn = clone.querySelector('.btn-remove');
    removeBtn.addEventListener('click', function() {
        const item = this.closest('.experience-item');
        item.remove();
        updatePreview();
        saveData();
    });
    
    document.getElementById('experienceContainer').appendChild(clone);
    updatePreview();
}

// ===== Education Management =====
function addInitialEducation() {
    addEducation();
}

function addEducation() {
    educationCount++;
    const template = document.getElementById('educationTemplate');
    const clone = template.content.cloneNode(true);
    
    // Set item number
    clone.querySelector('.item-number').textContent = educationCount;
    
    // Get the education item
    const educationItem = clone.querySelector('.education-item');
    educationItem.dataset.id = educationCount;
    
    // Add event listeners to inputs
    const inputs = clone.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', saveData);
    });
    
    // Remove button
    const removeBtn = clone.querySelector('.btn-remove');
    removeBtn.addEventListener('click', function() {
        const item = this.closest('.education-item');
        item.remove();
        updatePreview();
        saveData();
    });
    
    document.getElementById('educationContainer').appendChild(clone);
    updatePreview();
}

// ===== Preview Update =====
function updatePreview() {
    // Personal Information
    const fullName = document.getElementById('fullName').value || 'Your Name';
    const jobTitle = document.getElementById('jobTitle').value || 'Your Job Title';
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const website = document.getElementById('website').value;
    
    document.getElementById('preview-name').textContent = fullName;
    document.getElementById('preview-title').textContent = jobTitle;
    document.getElementById('preview-email').textContent = email;
    document.getElementById('preview-phone').textContent = phone;
    document.getElementById('preview-location').textContent = location;
    document.getElementById('preview-website').textContent = website;
    
    // Professional Summary
    const summary = document.getElementById('summary').value;
    const summarySection = document.getElementById('preview-summary-section');
    if (summary.trim()) {
        document.getElementById('preview-summary').textContent = summary;
        summarySection.style.display = 'block';
    } else {
        summarySection.style.display = 'none';
    }
    
    // Work Experience
    updateExperiencePreview();
    
    // Education
    updateEducationPreview();
    
    // Skills
    updateSkillsPreview();
}

function updateExperiencePreview() {
    const experienceContainer = document.getElementById('preview-experience');
    const experienceSection = document.getElementById('preview-experience-section');
    const experiences = document.querySelectorAll('.experience-item');
    
    if (experiences.length === 0) {
        experienceSection.style.display = 'none';
        return;
    }
    
    experienceContainer.innerHTML = '';
    let hasContent = false;
    
    experiences.forEach(exp => {
        const title = exp.querySelector('.exp-title').value;
        const company = exp.querySelector('.exp-company').value;
        const startDate = exp.querySelector('.exp-start').value;
        const endDate = exp.querySelector('.exp-end').value;
        const isCurrent = exp.querySelector('.exp-current').checked;
        const description = exp.querySelector('.exp-description').value;
        
        if (title || company) {
            hasContent = true;
            const entry = document.createElement('div');
            entry.className = 'experience-entry';
            
            const dateStr = formatDateRange(startDate, endDate, isCurrent);
            
            entry.innerHTML = `
                <div class="entry-header">
                    <div class="entry-title">
                        <h4>${title || 'Job Title'}</h4>
                        <span class="company">${company || 'Company Name'}</span>
                    </div>
                    ${dateStr ? `<div class="entry-date">${dateStr}</div>` : ''}
                </div>
                ${description ? `<div class="entry-description">${description}</div>` : ''}
            `;
            
            experienceContainer.appendChild(entry);
        }
    });
    
    experienceSection.style.display = hasContent ? 'block' : 'none';
}

function updateEducationPreview() {
    const educationContainer = document.getElementById('preview-education');
    const educationSection = document.getElementById('preview-education-section');
    const educations = document.querySelectorAll('.education-item');
    
    if (educations.length === 0) {
        educationSection.style.display = 'none';
        return;
    }
    
    educationContainer.innerHTML = '';
    let hasContent = false;
    
    educations.forEach(edu => {
        const degree = edu.querySelector('.edu-degree').value;
        const school = edu.querySelector('.edu-school').value;
        const startDate = edu.querySelector('.edu-start').value;
        const endDate = edu.querySelector('.edu-end').value;
        const gpa = edu.querySelector('.edu-gpa').value;
        const description = edu.querySelector('.edu-description').value;
        
        if (degree || school) {
            hasContent = true;
            const entry = document.createElement('div');
            entry.className = 'education-entry';
            
            const dateStr = formatDateRange(startDate, endDate, false);
            
            entry.innerHTML = `
                <div class="entry-header">
                    <div class="entry-title">
                        <h4>${degree || 'Degree'}</h4>
                        <span class="company">${school || 'Institution'}</span>
                        ${gpa ? ` - GPA: ${gpa}` : ''}
                    </div>
                    ${dateStr ? `<div class="entry-date">${dateStr}</div>` : ''}
                </div>
                ${description ? `<div class="entry-description">${description}</div>` : ''}
            `;
            
            educationContainer.appendChild(entry);
        }
    });
    
    educationSection.style.display = hasContent ? 'block' : 'none';
}

function updateSkillsPreview() {
    const skillsInput = document.getElementById('skills').value;
    const skillsContainer = document.getElementById('preview-skills');
    const skillsSection = document.getElementById('preview-skills-section');
    
    if (!skillsInput.trim()) {
        skillsSection.style.display = 'none';
        return;
    }
    
    const skills = skillsInput.split(',').map(s => s.trim()).filter(s => s);
    
    if (skills.length === 0) {
        skillsSection.style.display = 'none';
        return;
    }
    
    skillsContainer.innerHTML = '';
    skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        skillsContainer.appendChild(tag);
    });
    
    skillsSection.style.display = 'block';
}

// ===== Utility Functions =====
function formatDateRange(startDate, endDate, isCurrent) {
    if (!startDate) return '';
    
    const start = formatDate(startDate);
    const end = isCurrent ? 'Present' : (endDate ? formatDate(endDate) : '');
    
    if (end) {
        return `${start} - ${end}`;
    }
    return start;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
}

// ===== Template Change =====
function changeTemplate() {
    const template = document.getElementById('templateSelect').value;
    const resumeContent = document.querySelector('.resume-content');
    
    // Remove all template classes
    resumeContent.classList.remove('professional-template', 'modern-template', 'creative-template');
    
    // Add selected template class
    resumeContent.classList.add(`${template}-template`);
    
    saveData();
}

// ===== Local Storage =====
function saveData() {
    const data = {
        // Personal Info
        fullName: document.getElementById('fullName').value,
        jobTitle: document.getElementById('jobTitle').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        website: document.getElementById('website').value,
        summary: document.getElementById('summary').value,
        skills: document.getElementById('skills').value,
        template: document.getElementById('templateSelect').value,
        
        // Experience
        experiences: [],
        
        // Education
        educations: []
    };
    
    // Save experiences
    document.querySelectorAll('.experience-item').forEach(exp => {
        data.experiences.push({
            title: exp.querySelector('.exp-title').value,
            company: exp.querySelector('.exp-company').value,
            startDate: exp.querySelector('.exp-start').value,
            endDate: exp.querySelector('.exp-end').value,
            isCurrent: exp.querySelector('.exp-current').checked,
            description: exp.querySelector('.exp-description').value
        });
    });
    
    // Save education
    document.querySelectorAll('.education-item').forEach(edu => {
        data.educations.push({
            degree: edu.querySelector('.edu-degree').value,
            school: edu.querySelector('.edu-school').value,
            startDate: edu.querySelector('.edu-start').value,
            endDate: edu.querySelector('.edu-end').value,
            gpa: edu.querySelector('.edu-gpa').value,
            description: edu.querySelector('.edu-description').value
        });
    });
    
    localStorage.setItem('resumeData', JSON.stringify(data));
    console.log('Data saved to localStorage');
}

function loadSavedData() {
    const savedData = localStorage.getItem('resumeData');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        
        // Load personal info
        document.getElementById('fullName').value = data.fullName || '';
        document.getElementById('jobTitle').value = data.jobTitle || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('location').value = data.location || '';
        document.getElementById('website').value = data.website || '';
        document.getElementById('summary').value = data.summary || '';
        document.getElementById('skills').value = data.skills || '';
        
        // Load template
        if (data.template) {
            document.getElementById('templateSelect').value = data.template;
            changeTemplate();
        }
        
        // Clear default experience/education
        document.getElementById('experienceContainer').innerHTML = '';
        document.getElementById('educationContainer').innerHTML = '';
        experienceCount = 0;
        educationCount = 0;
        
        // Load experiences
        if (data.experiences && data.experiences.length > 0) {
            data.experiences.forEach(exp => {
                addExperience();
                const lastExp = document.querySelector('.experience-item:last-child');
                lastExp.querySelector('.exp-title').value = exp.title || '';
                lastExp.querySelector('.exp-company').value = exp.company || '';
                lastExp.querySelector('.exp-start').value = exp.startDate || '';
                lastExp.querySelector('.exp-end').value = exp.endDate || '';
                lastExp.querySelector('.exp-current').checked = exp.isCurrent || false;
                lastExp.querySelector('.exp-description').value = exp.description || '';
                
                if (exp.isCurrent) {
                    lastExp.querySelector('.exp-end').disabled = true;
                }
            });
        } else {
            addInitialExperience();
        }
        
        // Load education
        if (data.educations && data.educations.length > 0) {
            data.educations.forEach(edu => {
                addEducation();
                const lastEdu = document.querySelector('.education-item:last-child');
                lastEdu.querySelector('.edu-degree').value = edu.degree || '';
                lastEdu.querySelector('.edu-school').value = edu.school || '';
                lastEdu.querySelector('.edu-start').value = edu.startDate || '';
                lastEdu.querySelector('.edu-end').value = edu.endDate || '';
                lastEdu.querySelector('.edu-gpa').value = edu.gpa || '';
                lastEdu.querySelector('.edu-description').value = edu.description || '';
            });
        } else {
            addInitialEducation();
        }
        
        updatePreview();
        console.log('Data loaded from localStorage');
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

function clearAll() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        // Clear form
        document.getElementById('resumeForm').reset();
        
        // Clear containers
        document.getElementById('experienceContainer').innerHTML = '';
        document.getElementById('educationContainer').innerHTML = '';
        
        // Reset counters
        experienceCount = 0;
        educationCount = 0;
        
        // Add initial items
        addInitialExperience();
        addInitialEducation();
        
        // Clear localStorage
        localStorage.removeItem('resumeData');
        
        // Update preview
        updatePreview();
        
        console.log('All data cleared');
    }
}

// ===== PDF Download =====
function downloadPDF() {
    const resumeContent = document.querySelector('.resume-content');
    const fullName = document.getElementById('fullName').value || 'resume';
    const fileName = `${fullName.replace(/\s+/g, '_')}_resume.pdf`;
    
    // Show loading state
    const downloadBtn = document.getElementById('downloadBtn');
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = 'Generating PDF...';
    downloadBtn.disabled = true;
    
    // Use window.print() for PDF generation (simpler approach)
    // For more advanced PDF generation, you would need to include a library like jsPDF or html2pdf.js
    
    // Create a print-friendly version
    const printWindow = window.open('', '', 'width=800,height=600');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${fileName}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; }
                .resume-content { max-width: 800px; margin: 0 auto; }
                .resume-header { text-align: center; padding-bottom: 15px; border-bottom: 3px solid #2563eb; margin-bottom: 15px; }
                .resume-header h1 { font-size: 28px; color: #1e293b; margin-bottom: 5px; }
                .resume-header h2 { font-size: 18px; color: #2563eb; margin-bottom: 10px; }
                .contact-info { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; font-size: 14px; color: #64748b; }
                .contact-info span:not(:empty)::before { content: "•"; margin-right: 10px; }
                .contact-info span:first-child::before { content: ""; margin-right: 0; }
                .resume-section { margin-bottom: 20px; }
                .resume-section h3 { color: #1e293b; font-size: 18px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #2563eb; }
                .resume-section p { color: #555; line-height: 1.6; }
                .experience-entry, .education-entry { margin-bottom: 15px; }
                .entry-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
                .entry-title h4 { color: #1e293b; font-size: 16px; margin-bottom: 2px; }
                .entry-title .company { color: #2563eb; font-weight: 500; }
                .entry-date { color: #64748b; font-size: 14px; }
                .entry-description { color: #555; line-height: 1.6; margin-top: 5px; }
                .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
                .skill-tag { background: #2563eb; color: white; padding: 5px 15px; border-radius: 15px; font-size: 14px; }
            </style>
        </head>
        <body>
            ${resumeContent.outerHTML}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
        
        // Reset button
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
    }, 500);
}

// Alternative PDF download using html2pdf (requires including the library)
// Uncomment and use this if you include html2pdf.js library
/*
function downloadPDFAdvanced() {
    const element = document.querySelector('.resume-content');
    const fullName = document.getElementById('fullName').value || 'resume';
    const fileName = `${fullName.replace(/\s+/g, '_')}_resume.pdf`;
    
    const opt = {
        margin: 10,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
}
*/

console.log('Resume Builder loaded successfully!');
