const resumeData = {
    skills: {
        "AI/ML Engineering": ["RAG", "LangChain", "Agentic AI", "NLP", "TensorFlow", "OpenCV", "Vertex AI", "Hugging Face"],
        "Full-Stack Development": ["JavaScript", "React.js", "Python", "Node.js", "HTML", "CSS", "REST APIs"],
        "Databases & Cloud": ["SQL", "PostgreSQL", "AlloyDB", "MongoDB", "GCP"],
        "Automation & Tools": ["n8n", "Make.com", "Git", "Android Studio"]
    },
    projects: [
        {
            title: "AI-Powered Patent Search Agent",
            year: "2024",
            description: "Developed a sophisticated search assistant leveraging a **Retrieval-Augmented Generation (RAG)** architecture with LangChain and Vertex AI to process over 1,000 complex queries. Engineered a backend using AlloyDB and the pgvector extension for high-precision semantic search, **reducing patent search time by 40%**. Deployed on Google Cloud Platform.",
            tags: ["RAG", "LangChain", "Vertex AI", "AlloyDB", "GCP", "Python", "SQL"]
        },
        {
            title: "RT-MVODNAS (Assistive Tech)",
            year: "2025",
            description: "Engineered a mobile application providing real-time object recognition and navigational audio guidance for visually impaired users. Integrated YOLOv5 for object detection and the A* search algorithm, achieving **30% faster processing speeds**.",
            tags: ["OpenCV", "Python", "Android Studio"]
        },
        {
            title: "Conversational Notes Sharing System",
            year: "2024",
            description: "Authored a full-stack web platform with secure user authentication, note categorization, and real-time collaboration features. Designed and implemented a responsive UI with PHP, MySQL, Bootstrap, and JavaScript.",
            tags: ["HTML", "CSS", "JavaScript", "SQL", "Full-Stack Development"]
        },
        {
            title: "ISLAT - Indian Sign Language Translator",
            year: "2024",
            description: "Created a real-time speech-to-Indian Sign Language (ISL) converter using NLP, achieving **95% speech-to-text accuracy**. Integrated Google Speech API and CMU Sphinx with Python and OpenCV.",
            tags: ["NLP", "Python", "OpenCV", "REST APIs"]
        }
    ],
    timeline: [
        { type: 'Education', title: 'B.E., Information Science & Engineering', org: 'Sri Siddhartha Institute of Technology', year: 'Expected 2026', description: 'Pursuing a comprehensive curriculum in computer science and engineering with a focus on modern software development and AI.', tags: [] },
        { type: 'Experience', title: 'AI Intern', org: 'Internship Studio', year: '2024', description: 'Engineered a facial recognition system using PCA and ANNs. Optimized feature extraction pipelines with Python, OpenCV, and NumPy, reducing processing time by 20%.', tags: ['Python', 'OpenCV', 'AI/ML Engineering'] },
        { type: 'Experience', title: 'Technical Workshop Lead', org: 'SSTT Student Chapter', year: '', description: 'Led technical workshops on MS Excel, Robotics, and PC Hardware for over 400 students, improving campus-wide technical literacy by an estimated 30%.', tags: ['Professional'] },
        { type: 'Experience', title: 'Student Chapter Coordinator', org: 'Varsity Circle-SSTI', year: '', description: 'Organized a national-level hackathon for 350+ participants, increasing engagement by 25%. Mentored 50+ students in robotics competitions.', tags: ['Professional', 'Project Management'] }
    ],
    certifications: [
        { name: "AI Agentic Applications", issuer: "Google Developer Groups", year: "2024" },
        { name: "AI/ML Geodata Analysis", issuer: "ISRO", year: "2024" },
        { name: "Front-End Engineering", issuer: "Skyscanner", year: "2024" },
        { name: "Prompt Engineering", issuer: "IBM", year: "2023" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const skillsChartCtx = document.getElementById('skillsChart').getContext('2d');
    const skillTagsContainer = document.getElementById('skill-tags-container');
    const projectsGrid = document.getElementById('projects-grid');
    const timelineContainer = document.getElementById('timeline-container');
    const certsGrid = document.getElementById('certs-grid');
    const aiModal = document.getElementById('ai-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const jobTitleInput = document.getElementById('job-title-input');
    const analyzeFitBtn = document.getElementById('analyze-fit-btn');
    const careerMatchResult = document.getElementById('career-match-result');

    let activeFilter = 'All';
    let isGenerating = false;

    async function callGemini(prompt) {
        if (isGenerating) return;
        isGenerating = true;

        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
                return result.candidates[0].content.parts[0].text;
            } else {
                return "Sorry, I couldn't generate a response. The AI model returned an unexpected result.";
            }
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "An error occurred while contacting the AI model. Please check the console for details.";
        } finally {
            isGenerating = false;
        }
    }

    async function handleProjectExplain(project, button) {
        button.disabled = true;
        button.innerHTML = '<span class="loader"></span>';
        modalContent.innerHTML = '<p>Generating insights...</p>';
        aiModal.showModal();

        const prompt = `You are an expert technical recruiter. Explain the following project in a conversational but professional way. Focus on the technologies used, the problem solved, and the business impact. Keep it concise (2-3 paragraphs). Project Title: "${project.title}". Description: "${project.description.replace(/\*\*/g, '')}"`;
        
        const explanation = await callGemini(prompt);
        modalContent.innerHTML = explanation.replace(/\n/g, '<br>');
        button.disabled = false;
        button.innerHTML = '✨ Tell Me More';
    }
    
    async function handleCareerMatch() {
        const jobTitle = jobTitleInput.value.trim();
        if (!jobTitle) {
            careerMatchResult.innerHTML = '<p class="text-red-500">Please enter a job title.</p>';
            return;
        }

        analyzeFitBtn.disabled = true;
        analyzeFitBtn.innerHTML = '<span class="loader"></span> Analyzing...';
        careerMatchResult.innerHTML = '<p class="text-slate-500">Analyzing resume against the role... This may take a moment.</p>';

        const resumeSummary = `
            Skills: ${Object.entries(resumeData.skills).map(([cat, skills]) => `${cat}: ${skills.join(', ')}`).join('; ')}.
            Projects: ${resumeData.projects.map(p => `${p.title} - ${p.description.replace(/\*\*/g, '')}`).join('; ')}.
            Experience: ${resumeData.timeline.filter(t => t.type === 'Experience').map(e => `${e.title} at ${e.org} - ${e.description}`).join('; ')}.
        `;
        const prompt = `You are an expert career coach writing a brief, compelling summary for a recruiter. Based on the following resume data, explain why this candidate (Hruthik M) is an excellent fit for the job title of "${jobTitle}". Be specific, connect their skills and projects to the role's likely requirements, and use a confident, professional tone. Structure your response in 2-3 short paragraphs. Resume Data: ${resumeSummary}`;

        const analysis = await callGemini(prompt);
        careerMatchResult.innerHTML = analysis.replace(/\n/g, '<br>');
        analyzeFitBtn.disabled = false;
        analyzeFitBtn.innerHTML = 'Analyze Fit';
    }

    modalCloseBtn.onclick = () => aiModal.close();
    aiModal.addEventListener('click', (e) => {
        if (e.target === aiModal) {
            aiModal.close();
        }
    });
    analyzeFitBtn.onclick = handleCareerMatch;

    const chartColors = { 'AI/ML Engineering': 'rgba(79, 70, 229, 0.7)', 'Full-Stack Development': 'rgba(29, 78, 216, 0.7)', 'Databases & Cloud': 'rgba(5, 150, 105, 0.7)', 'Automation & Tools': 'rgba(217, 119, 6, 0.7)' };
    const chartBorderColors = { 'AI/ML Engineering': 'rgba(79, 70, 229, 1)', 'Full-Stack Development': 'rgba(29, 78, 216, 1)', 'Databases & Cloud': 'rgba(5, 150, 105, 1)', 'Automation & Tools': 'rgba(217, 119, 6, 1)' };

    new Chart(skillsChartCtx, { type: 'polarArea', data: { labels: Object.keys(resumeData.skills), datasets: [{ data: Object.values(resumeData.skills).map(s => s.length), backgroundColor: Object.keys(resumeData.skills).map(k => chartColors[k]), borderColor: Object.keys(resumeData.skills).map(k => chartBorderColors[k]), borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { r: { pointLabels: { display: true, centerPointLabels: true, font: { size: 14 } }, ticks: { backdropColor: 'transparent' }, grid: { color: 'rgba(0, 0, 0, 0.05)' } } }, plugins: { legend: { position: 'top' } } } });

    function renderSkillTags() {
        skillTagsContainer.innerHTML = '';
        ['All', ...new Set(Object.values(resumeData.skills).flat())].forEach(tag => {
            const button = document.createElement('button');
            button.textContent = tag;
            button.dataset.skill = tag;
            button.className = `skill-tag px-3 py-1.5 text-sm font-medium rounded-full border ${activeFilter === tag ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100 hover:border-slate-400'}`;
            button.onclick = () => filterBySkill(tag);
            skillTagsContainer.appendChild(button);
        });
    }

    function renderProjects() {
        projectsGrid.innerHTML = '';
        const filtered = activeFilter === 'All' ? resumeData.projects : resumeData.projects.filter(p => p.tags.includes(activeFilter));
        (filtered.length ? filtered : resumeData.projects).forEach(p => createProjectCard(p));
        if (filtered.length === 0) projectsGrid.insertAdjacentHTML('afterbegin', `<p class="text-slate-500 md:col-span-2 text-center">No projects match "${activeFilter}". Showing all projects.</p>`);
    }

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card bg-white p-6 rounded-lg border border-slate-200 flex flex-col';
        card.innerHTML = `
            <div class="flex-grow">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="text-xl font-bold text-slate-800">${project.title}</h4>
                    <span class="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full flex-shrink-0">${project.year}</span>
                </div>
                <p class="text-slate-600 mb-4">${project.description.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-700">$1</strong>')}</p>
            </div>
            <div class="flex flex-wrap gap-2 mb-4">
                ${project.tags.map(tag => `<span class="text-xs font-medium text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">${tag}</span>`).join('')}
            </div>
            <button class="gemini-btn mt-auto self-start text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md font-medium hover:bg-slate-200 disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center gap-2">✨ Tell Me More</button>
        `;
        card.querySelector('button').onclick = (e) => handleProjectExplain(project, e.currentTarget);
        projectsGrid.appendChild(card);
    }

    function renderTimeline() {
        timelineContainer.innerHTML = '<div class="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-slate-200"></div>';
        const filtered = activeFilter === 'All' ? resumeData.timeline : resumeData.timeline.filter(i => i.tags.includes(activeFilter) || i.tags.includes('Professional'));
        (filtered.length ? filtered : resumeData.timeline).forEach((item, index) => createTimelineItem(item, index));
    }

    function createTimelineItem(item, index) {
        const isLeft = index % 2 === 0;
        const itemDiv = document.createElement('div');
        itemDiv.className = `timeline-item relative mb-8 flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`;
        itemDiv.innerHTML = `
            ${!isLeft ? `<div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${item.type === 'Experience' ? 'bg-emerald-500' : 'bg-sky-500'} border-4 border-white"></div>` : ''}
            <div class="w-5/12">
                <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm ${isLeft ? 'text-right' : 'text-left'}">
                    <span class="text-sm font-medium ${item.type === 'Experience' ? 'text-emerald-600' : 'text-sky-600'}">${item.type} ${item.year ? `(${item.year})` : ''}</span>
                    <h4 class="text-lg font-bold text-slate-800 mt-1">${item.title}</h4>
                    <p class="text-sm font-medium text-slate-500 mb-2">${item.org}</p>
                    <p class="text-slate-600 text-sm">${item.description}</p>
                </div>
            </div>
            ${isLeft ? `<div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${item.type === 'Experience' ? 'bg-emerald-500' : 'bg-sky-500'} border-4 border-white"></div>` : ''}
        `;
        timelineContainer.appendChild(itemDiv);
    }

    function renderCerts() {
        certsGrid.innerHTML = '';
        resumeData.certifications.forEach(cert => {
            const certDiv = document.createElement('div');
            certDiv.className = 'bg-white p-4 rounded-lg border border-slate-200';
            certDiv.innerHTML = `<p class="font-semibold text-slate-800">${cert.name}</p><p class="text-sm text-slate-500">${cert.issuer} (${cert.year})</p>`;
            certsGrid.appendChild(certDiv);
        });
    }

    function filterBySkill(skill) {
        activeFilter = skill;
        renderSkillTags();
        renderProjects();
        renderTimeline();
    }

    renderSkillTags();
    renderProjects();
    renderTimeline();
    renderCerts();
});
