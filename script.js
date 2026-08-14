const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const commandHistory = [];
let historyIndex = -1;

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

function executeCommandFromClick(cmd) {
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
    terminalInput.value = cmd;
    executeCommand(cmd);
    terminalInput.value = '';
    terminalInput.focus();
}

const teaserGraph = `
<div class="viz-stage">
    <span class="viz-badge">interactive demo · in development</span>
    <svg viewBox="0 0 360 180" width="360" height="180" role="img" aria-label="Animated graph teaser">
        <line class="g-edge live" x1="60" y1="40"  x2="160" y2="30"></line>
        <line class="g-edge live" x1="160" y1="30" x2="270" y2="55"></line>
        <line class="g-edge" x1="60" y1="40"  x2="90" y2="130"></line>
        <line class="g-edge live" x1="90" y1="130" x2="200" y2="150"></line>
        <line class="g-edge" x1="200" y1="150" x2="270" y2="55"></line>
        <line class="g-edge" x1="160" y1="30" x2="200" y2="150"></line>
        <circle class="g-node g-node-a1" cx="60"  cy="40"  r="12"></circle>
        <circle class="g-node active"    cx="160" cy="30"  r="12"></circle>
        <circle class="g-node g-node-a2" cx="270" cy="55"  r="12"></circle>
        <circle class="g-node g-node-a3" cx="90"  cy="130" r="12"></circle>
        <circle class="g-node"           cx="200" cy="150" r="12"></circle>
    </svg>
    <p class="viz-caption">This panel will host an animated walkthrough of the BTT and Fichtenberger&ndash;Vasudev<br>algorithms exploring a graph and estimating the conductance of a cut.</p>
</div>`;

function executeCommand(input) {
    const cmd = input.trim().toLowerCase();
    if (cmd === '') return;

    commandHistory.unshift(input);
    historyIndex = -1;

    const commandLine = document.createElement('div');
    commandLine.className = 'command-line';
    commandLine.innerHTML = `<span class="prompt">michele@portfolio</span>:<span class="path">~</span>$ <span class="command">${input}</span>`;
    terminalOutput.appendChild(commandLine);

    if (commands[cmd]) {
        const result = commands[cmd].execute();
        if (result !== null) {
            const outputDiv = document.createElement('div');
            outputDiv.innerHTML = result;
            terminalOutput.appendChild(outputDiv);
        }
    } else {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'output';
        errorDiv.innerHTML = `<p class="error">Command not found: ${input}</p><p>Type <span class="cmd-highlight">help</span> to see available commands.</p>`;
        terminalOutput.appendChild(errorDiv);
    }

    requestAnimationFrame(() => {
        const contentCommands = ['about', 'education', 'research', 'viz', 'experience', 'projects', 'skills', 'contact'];
        if (contentCommands.includes(cmd)) {
            const commandLines = terminalOutput.querySelectorAll('.command-line');
            const lastCommandLine = commandLines[commandLines.length - 1];
            if (lastCommandLine) {
                lastCommandLine.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
}

const commands = {
    help: {
        description: 'Display available commands',
        execute: () => `
<div class="output">
    <p class="section-title">Available Commands:</p>
    <p><span class="cmd-highlight">help</span> - Display this help message</p>
    <p><span class="cmd-highlight">about</span> - Learn about me</p>
    <p><span class="cmd-highlight">education</span> - View my education</p>
    <p><span class="cmd-highlight">research</span> - View my research experience</p>
    <p><span class="cmd-highlight">viz</span> - Interactive research visualization</p>
    <p><span class="cmd-highlight">experience</span> - View my work experience</p>
    <p><span class="cmd-highlight">projects</span> - View my projects</p>
    <p><span class="cmd-highlight">skills</span> - View my technical skills</p>
    <p><span class="cmd-highlight">contact</span> - Get my contact information</p>
    <p><span class="cmd-highlight">resume</span> - Download my resume</p>
    <p><span class="cmd-highlight">ls</span> - List all sections</p>
    <p><span class="cmd-highlight">clear</span> - Clear the terminal</p>
</div>`
    },

    about: {
        description: 'Learn about me',
        execute: () => `
<div class="output">
    <p class="section-title">About Me</p>
    <p>My name is Michele Bilko, I'm a grad student at Tufts University focusing on algorithmic analysis.</p>
    <p>Working at the intersection of theory and practice, I'm interested in developing efficient algorithms and applying them to real world problems.</p>
    <p></p>
    <p>I just finished my B.A. in Computer Science (with a minor in Philosophy) at Boston University, and</p>
    <p>I'm still discovering my interests and passions in Computer Science, but if you look through my website</p>
    <p>you can see some of my research in: <span class="info">graph algorithms &amp; conductance</span>, <span class="info">computer vision deep learning</span>,</p>
    <p>and <span class="info">freelance web development</span>. I'm currently doing research on graph conductance and on</p>
    <p>deep-learning image restoration for satellite imagery.</p>
    <p></p>
    <p><span class="success">Currently:</span> continuing graph algorithms research, building production web apps, and</p>
    <p>looking for research roles and internships.</p>
</div>`
    },

    education: {
        description: 'View education',
        execute: () => `
<div class="output">
    <p class="section-title">Education</p>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Tufts University</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">M.S. Computer Science - Medford, MA - Incoming Fall 2026 (expected May 2027)</div>
            <p>Graduate study in computer science, building on a background in algorithms, complexity, and machine learning.</p>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Boston University</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">B.A. Computer Science, Minor in Philosophy - 2024–2026 - Dean's List</div>
            <p>Coursework: Image &amp; Video Computing (Computer Vision), Advanced Algorithms, Fine-Grained Complexity, Theory of Computation, Probability in Computing, Database Systems, Geometric Algorithms, Software Engineering, Full-Stack Development.</p>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">University of California, Santa Cruz</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">B.S. coursework in Computer Science (transferred) - 2023–2024 - Dean's Honors List</div>
            <p>Coursework: Machine Learning, Data Structures &amp; Algorithms, Computer Systems &amp; C Programming, Applied Discrete Mathematics.</p>
        </div>
    </div>
</div>`
    },

    research: {
        description: 'View research experience',
        execute: () => `
<div class="output">
    <p class="section-title">Research</p>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Directed Study in Graph Algorithms</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Boston University - Advised by Prof. Dora Erdős - Jan 2026 – Present</div>
            <ul>
                <li>Investigating graph conductance and open problems in network connectivity, spanning theoretical foundations and algorithmic applications.</li>
                <li>Implemented published algorithm pseudocode and built a Python / NetworkX framework that benchmarks distributed conductance-testing algorithms (Batu–Trehan–Trehan (BTT) vs. Fichtenberger–Vasudev) across varied graph topologies.</li>
                <li>Manuscript in preparation. Check out <span class="cmd-highlight">viz</span> to see the visualization (in development).</li>
            </ul>
            <div class="tags"><span class="tag">Python</span><span class="tag">NetworkX</span><span class="tag">spectral graph theory</span><span class="tag">benchmarking</span></div>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Satellite Image Restoration — Computer Vision / Deep Learning</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Boston University - Jan 2026 – May 2026</div>
            <ul>
                <li>Built a deep-learning pipeline that reconstructs the wedge-shaped data gaps in Landsat 7 ETM+ imagery — roughly <span class="info">22% of every scene</span> — caused by the 2003 Scan Line Corrector (SLC) hardware failure, a defect that has degraded the satellite's imagery for over two decades.</li>
                <li>Extended <span class="info">LaMa</span> (Large Mask Inpainting), a Fourier-convolution architecture suited to large missing regions, with <span class="info">multi-temporal reference guidance</span> — conditioning each reconstruction on other timestamps of the same location.</li>
                <li>Added <span class="info">CBAM</span> (Convolutional Block Attention Module) channel-and-spatial attention so the model preserves real terrain features — coastlines, field boundaries, river geometry — instead of hallucinating plausible-but-wrong texture across timestamps.</li>
                <li>Implemented and trained in PyTorch. Paper presented at end of semester research symposium.</li>
            </ul>
            <div class="tags"><span class="tag">PyTorch</span><span class="tag">LaMa</span><span class="tag">CBAM attention</span><span class="tag">remote sensing</span><span class="tag">image inpainting</span></div>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Writing</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Selected research writing</div>
            <ul>
                <li>Authored the Wikipedia article on Fine-Grained Complexity, synthesizing core results for a broad technical audience.</li>
                <li>Wrote a graduate-level survey paper on fine-grained complexity (CS 530).</li>
            </ul>
        </div>
    </div>
</div>`
    },

    viz: {
        description: 'Interactive research visualization',
        execute: () => `
<div class="output">
    <p class="section-title">Research Visualization — Graph Conductance</p>
    <div class="viz-panel">
        <p class="lead">An interactive companion to my directed study: a side-by-side animation of how the BTT and Fichtenberger–Vasudev algorithms walk through a graph and estimate the conductance of a cut, run over different topologies (expanders, planted partitions, real-world networks).</p>
        ${teaserGraph}
    </div>
</div>`
    },

    experience: {
        description: 'View work experience',
        execute: () => `
<div class="output">
    <p class="section-title">Experience</p>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Freelance Web Developer</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Jun 2025 – Present</div>
            <ul>
                <li>Build full-stack web applications for clients alongside a graphic designer, primarily with Django and Python.</li>
                <li>Translate design specs into deployed, maintainable code under real deadlines.</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Research Intern @ Columbia University</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Media Center for Art History - Sep 2022 – Jun 2023</div>
            <ul>
                <li>Engineered an automated data-processing pipeline (Java, Python, pandas) transforming 20,000+ lines of imaging metadata into a normalized, searchable schema still used by the Center's research infrastructure.</li>
                <li>Applied photogrammetry and Structure-from-Motion (SfM) pipelines to build 3D virtual tours, and supported digitization of the Center's 35mm slide and photography collection.</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Student Technician @ Boston University IT</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">BU IT Help Center - Aug 2024 – Present</div>
            <ul>
                <li>Troubleshoot hardware, software, and network issues across operating systems for students, faculty, and staff.</li>
                <li>Image machines and document solutions for the support knowledge base.</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Bike and Ski Technician @ REI</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">REI - May 2026 – Aug 2026</div>
            <ul>
                <li>Worked as a bike mechanic in one of the highest volume REI bike shops. Diagnosed issues and gave quotes for repairs.</li>
                <li>Built bikes, performed on the spot labor, and learned repairs from zero experience before store's permanent closure.</li>
            </ul>
        </div>
    </div>
</div>`
    },

    projects: {
        description: 'View projects',
        execute: () => `
<div class="output">
    <p class="section-title">Projects</p>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Central Rock Gym — Route Tracking System</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">React · TypeScript · Django REST · PostgreSQL · D3.js · Aug 2025 – Present</div>
            <ul>
                <li>Full-stack web app for a Boston climbing gym: a responsive React/TypeScript frontend over a Django REST backend.</li>
                <li>Climbers log completed routes and track progress; routesetters manage live route data and view completion statistics on a D3.js analytics dashboard.</li>
            </ul>
            <div class="tags"><span class="tag">full-stack</span><span class="tag">REST</span><span class="tag">data viz</span></div>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Tattoo Booking &amp; Artist Management Platform <span class="warning">[in development]</span></div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">In progress</div>
            <ul>
                <li>A booking platform for tattoo artists who currently manage appointments through Instagram DMs.</li>
                <li>Lets artists link a Google Calendar, open and close availability, and separate booking requests from everything else — replacing manual DM triage with structured scheduling.</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">This Portfolio</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Hand-written HTML · CSS · vanilla JavaScript</div>
            <ul>
                <li>Built from scratch with no framework — responsive, accessible, light/dark themes, and a command interface.</li>
            </ul>
        </div>
    </div>
</div>`
    },

    skills: {
        description: 'View technical skills',
        execute: () => `
<div class="output">
    <p class="section-title">Technical Skills</p>
    <p><span class="info">Languages:</span> Python, Java, C/C++, C#, SQL, JavaScript/TypeScript, HTML/CSS</p>
    <p></p>
    <p><span class="info">ML &amp; Research:</span> PyTorch, TensorFlow, scikit-learn, NumPy, pandas, NetworkX, LaTeX, Git, Linux/Unix</p>
    <p></p>
    <p><span class="info">Web &amp; Backend:</span> React, Node.js, Express, Django, Flask, RESTful APIs, PostgreSQL, D3.js</p>
    <p></p>
    <p><span class="info">Research areas:</span> Computer Vision, Deep Learning, Graph Algorithms, Algorithmic Optimization, Computational Complexity</p>
</div>`
    },

    contact: {
        description: 'Get contact information',
        execute: () => `
<div class="output">
    <p class="section-title">Contact</p>
    <p>~ <span class="success">Email:</span> <a href="mailto:mbilko@bu.edu">mbilko@bu.edu</a> · <a href="mailto:michelebilko@gmail.com">michelebilko@gmail.com</a></p>
    <p>~ <span class="success">LinkedIn:</span> <a href="https://linkedin.com/in/michele-bilko" target="_blank" rel="noopener">linkedin.com/in/michele-bilko</a></p>
    <p>~ <span class="success">GitHub:</span> <a href="https://github.com/michele-bilko" target="_blank" rel="noopener">github.com/michele-bilko</a></p>
</div>`
    },

    resume: {
        description: 'Download resume',
        execute: () => {
            window.open('./resume.pdf', '_blank');
            return `<div class="output"><p class="success">Opening resume in a new tab... (place your PDF in this folder as resume.pdf)</p></div>`;
        }
    },

    ls: {
        description: 'List all sections',
        execute: () => `
<div class="output">
    <div class="file-list">
        <div class="file-item" onclick="executeCommandFromClick('about')">about</div>
        <div class="file-item" onclick="executeCommandFromClick('education')">education</div>
        <div class="file-item" onclick="executeCommandFromClick('research')">research</div>
        <div class="file-item" onclick="executeCommandFromClick('viz')">viz</div>
        <div class="file-item" onclick="executeCommandFromClick('experience')">experience</div>
        <div class="file-item" onclick="executeCommandFromClick('projects')">projects</div>
        <div class="file-item" onclick="executeCommandFromClick('skills')">skills</div>
        <div class="file-item" onclick="executeCommandFromClick('contact')">contact</div>
        <div class="file-item" onclick="executeCommandFromClick('resume')">resume</div>
    </div>
</div>`
    },

    clear: {
        description: 'Clear terminal',
        execute: () => {
            terminalOutput.innerHTML = `
        <div class="ascii-art">
 __  __ _      _          _        ____  _ _ _          
|  \\/  (_) ___| |__   ___| | ___  | __ )(_) | | _____  
| |\\/| | |/ __| '_ \\ / _ \\ |/ _ \\ |  _ \\| | | |/ / _ \\ 
| |  | | | (__| | | |  __/ |  __/ | |_) | | |   < (_) |
|_|  |_|_|\\___|_| |_|\\___|_|\\___| |____/|_|_|_|\\_\\___/ 
        </div>
        <div class="output">
            <p>CS @ Boston University → M.S. CS @ Tufts (Fall 2026). Algorithms, computer vision, and full-stack systems.</p>
            <p>Click a folder on the left or type a command to explore.</p>
        </div>`;
            return null;
        }
    }
};

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = terminalInput.value;
        executeCommand(input);
        terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
        } else if (historyIndex === 0) {
            historyIndex = -1;
            terminalInput.value = '';
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const input = terminalInput.value.toLowerCase();
        const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            terminalInput.value = matches[0];
        }
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.folder-toggle') && !e.target.closest('a')) {
        terminalInput.focus();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
});

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const folderToggle = document.querySelector('.folder-toggle');
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== folderToggle) {
            sidebar.classList.remove('open');
        }
    }
});
