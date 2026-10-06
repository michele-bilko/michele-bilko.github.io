const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const commandHistory = [];
let historyIndex = -1;

//folder tree, top level folders are reachable from anywhere; subfolders (coursework, viz) only exist inside their parent.
const fsTree = {
    about: {},
    education: { coursework: {} },
    research: { viz: {} },
    experience: {},
    projects: {},
    skills: {},
    contact: {}
};
let cwd = []; // [] = ~, ['education'] = ~/education, ['education','coursework'] = ~/education/coursework

function pathString(p = cwd) {
    return p.length ? '~/' + p.join('/') : '~';
}

// zsh prompt path
function promptDir(p = cwd) {
    return p.length ? p[p.length - 1] : '~';
}

function getNode(p) {
    let node = fsTree;
    for (const part of p) {
        if (!node[part]) return null;
        node = node[part];
    }
    return node;
}

// resolve a cd target ("..", "~", "~/education/coursework", "viz", "../research") to a path array, or null.
function resolvePath(target) {
    let parts;
    let base;
    if (!target || target === '~' || target === '/') return [];
    if (target.startsWith('~/')) { base = []; parts = target.slice(2).split('/'); }
    else if (target.startsWith('/')) { base = []; parts = target.slice(1).split('/'); }
    else { base = [...cwd]; parts = target.split('/'); }

    for (const part of parts) {
        if (part === '' || part === '.') continue;
        if (part === '..') { base.pop(); continue; }
        base.push(part);
        if (!getNode(base)) return null;
    }
    return base;
}

// where does a folder live? for on-site error messages
function findFolder(name, node = fsTree, prefix = []) {
    for (const key of Object.keys(node)) {
        const p = [...prefix, key];
        if (key === name) return p;
        const found = findFolder(name, node[key], p);
        if (found) return found;
    }
    return null;
}

//UI helpers
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

function updatePromptAndSidebar() {
    const pathEl = document.querySelector('#current-line .path');
    if (pathEl) pathEl.textContent = promptDir();
    const titleEl = document.querySelector('.terminal-title');
    if (titleEl) titleEl.textContent = `michele@portfolio ${promptDir()} %`;

    // subfolders are only shown while you're inside their parent folder
    document.querySelectorAll('.file-sub').forEach(sub => {
        sub.classList.toggle('open', cwd[0] === sub.dataset.parent);
    });
    document.querySelectorAll('#sidebar .file-item[data-path]').forEach(item => {
        const here = pathString();
        item.classList.toggle('active', item.dataset.path === here);
        item.classList.toggle('opened', here === item.dataset.path || here.startsWith(item.dataset.path + '/'));
    });
}

function subfolderHint(p) {
    const node = getNode(p);
    const subs = node ? Object.keys(node) : [];
    if (!subs.length) return '';
    const links = subs.map(s =>
        `<span class="file-link" onclick="executeCommandFromClick('cd ${pathString([...p, s])}')">/${s}/</span>`
    ).join(' ');
    return `<div class="output"><p class="subfolder-hint">Subfolder: ${links} &mdash; type <span class="cmd-highlight">cd ${subs[0]}</span> or click it in the sidebar.</p></div>`;
}

//research visualization (lives in ~/research/viz)
const PAPER_BTT = 'https://doi.org/10.1007/978-3-031-60603-8_4';      // Batu, Trehan & Trehan, SIROCCO 2024
const PAPER_FV = 'https://doi.org/10.4230/LIPIcs.MFCS.2018.19';      // Fichtenberger & Vasudev, MFCS 2018

const bttGraph = `
<svg viewBox="0 0 320 150" width="320" height="150" role="img" aria-label="BTT random walk animation on a barbell-shaped graph">
    <!-- left clique (K4) -->
    <line class="g-edge live" x1="40" y1="55" x2="70" y2="30"></line>
    <line class="g-edge live" x1="70" y1="30" x2="100" y2="55"></line>
    <line class="g-edge live" x1="100" y1="55" x2="70" y2="90"></line>
    <line class="g-edge live" x1="70" y1="90" x2="40" y2="55"></line>
    <line class="g-edge" x1="40" y1="55" x2="100" y2="55"></line>
    <line class="g-edge" x1="70" y1="30" x2="70" y2="90"></line>
    <!-- bridge -->
    <line class="g-edge bridge" x1="100" y1="55" x2="220" y2="55"></line>
    <!-- right clique (K4) -->
    <line class="g-edge" x1="220" y1="55" x2="250" y2="30"></line>
    <line class="g-edge" x1="250" y1="30" x2="280" y2="55"></line>
    <line class="g-edge" x1="280" y1="55" x2="250" y2="90"></line>
    <line class="g-edge" x1="250" y1="90" x2="220" y2="55"></line>
    <line class="g-edge" x1="220" y1="55" x2="280" y2="55"></line>
    <line class="g-edge" x1="250" y1="30" x2="250" y2="90"></line>

    <circle class="g-node active" cx="70" cy="30" r="11"></circle>
    <circle class="g-node reject-flash" cx="40" cy="55" r="11"></circle>
    <circle class="g-node g-node-a1" cx="100" cy="55" r="11"></circle>
    <circle class="g-node g-node-a2" cx="70" cy="90" r="11"></circle>

    <circle class="g-node" cx="220" cy="55" r="11"></circle>
    <circle class="g-node" cx="250" cy="30" r="11"></circle>
    <circle class="g-node" cx="280" cy="55" r="11"></circle>
    <circle class="g-node" cx="250" cy="90" r="11"></circle>

    <text class="g-tau-label" x="16" y="110">source q, K walks</text>
    <text class="g-tau-label" x="150" y="120">walks rarely cross the bridge</text>
</svg>`;

// K3,3 (hexagon + 3 long diagonals). Solid "tree" edges = BFS spanning tree rooted at the top vertex,
// which F&V use for convergecast; dashed edges are the remaining graph edges.
const fvGraph = `
<svg viewBox="0 0 300 190" width="300" height="190" role="img" aria-label="Fichtenberger-Vasudev random walk animation on a well-connected graph with a BFS spanning tree">
    <line class="g-edge tree" x1="160" y1="30" x2="230" y2="60"></line>
    <line class="g-edge live" x1="230" y1="60" x2="230" y2="130"></line>
    <line class="g-edge tree" x1="230" y1="130" x2="160" y2="160"></line>
    <line class="g-edge live" x1="160" y1="160" x2="90" y2="130"></line>
    <line class="g-edge tree" x1="90" y1="130" x2="90" y2="60"></line>
    <line class="g-edge tree" x1="90" y1="60" x2="160" y2="30"></line>
    <line class="g-edge tree" x1="160" y1="30" x2="160" y2="160"></line>
    <line class="g-edge live" x1="230" y1="60" x2="90" y2="130"></line>
    <line class="g-edge live" x1="90" y1="60" x2="230" y2="130"></line>

    <circle class="g-node spread d1 source-ring" cx="160" cy="30" r="11"></circle>
    <circle class="g-node spread d2" cx="230" cy="60" r="11"></circle>
    <circle class="g-node spread d3" cx="230" cy="130" r="11"></circle>
    <circle class="g-node spread d4 source-ring" cx="160" cy="160" r="11"></circle>
    <circle class="g-node spread d5" cx="90" cy="130" r="11"></circle>
    <circle class="g-node spread d6" cx="90" cy="60" r="11"></circle>

    <text class="g-tau-label" x="70" y="185">walks from S spread ~evenly, matching &#960;</text>
</svg>`;

// TODO: the lead sentence says both testers are shown "on a graph with a bottleneck",
// but the F&V panel is a well-connected graph (K3,3) that accepts. Reword when redo the viz.
const algorithmViz = `
<div class="viz-panel">
    <p class="lead">A (not to scale) visualization of how each tester behaves on a graph with a bottleneck: BTT's walks from a source get stuck inside one clique and a local vertex count determines the graph has poor conductance, F&amp;V's walks are aggregated globally and, on a well-mixed graph, spread out to match the stationary distribution &#960; almost everywhere. The js for this visualization was generated with Claude code but the words are my own. </p>
    <div class="viz-dual">
        <div class="viz-col">
            <a class="btn-link btn-sm" href="${PAPER_BTT}" target="_blank" rel="noopener">Batu, Trehan &amp; Trehan &nearr;</a>
            ${bttGraph}
            <div class="viz-legend">
                <span><span class="dot dot-highlight"></span>source / walk endpoints</span>
                <span><span class="dot dot-error"></span>local reject (count &gt; &tau;<sub>v</sub>)</span>
            </div>
            <p class="viz-col-caption">Each vertex only ever looks at walk counts that ended at itself and if a bad conductor traps too many walks from one source nearby, that vertex rejects on its own, with no communication with the rest of the graph.</p>
        </div>
        <div class="viz-col">
            <a class="btn-link btn-sm" href="${PAPER_FV}" target="_blank" rel="noopener">Fichtenberger &amp; Vasudev &nearr;</a>
            ${fvGraph}
            <div class="viz-legend">
                <span><span class="dot dot-ring"></span>source (S)</span>
                <span><span class="dot dot-accent"></span>walk mass converging to &#960;</span>
                <span><span class="dot dot-tree"></span>BFS spanning tree</span>
            </div>
            <p class="viz-col-caption">Walk endpoints are convergecast up a spanning tree and compared to the stationary distribution &#960; every vertex reaches the same accept/reject decision together.</p>
        </div>
    </div>
    <div class="research-link-box">
        <p>Find the full write up on my implementation here about what I built and what I found when I actually ran both testers.</p>
        <a class="btn-link" href="conductance-research.html">&rarr; conductance-research</a>
    </div>
</div>`;

//folder contents, keys are paths (as produced by pathString()).
const sections = {
    '~/about': () => `
<div class="output">
    <p class="section-title">about me</p>

    <p>Welcome to my website :) My name is Michele Bilko.</p>
    <p>I'm passionate about theoretical computer science and algorithm design, and I'm interested in developing efficient algorithms and applying them to real world problems.</p>
    <p>I just finished my B.A. in Computer Science (with a minor in Philosophy) at Boston University, and am now pursuing my M.S. in Computer Science at Tufts University.</p>
    <p>I'm still trying to find my niche in Computer Science, but if you look through my website you can see some of my research in: <span class="info">graph algorithms &amp; conductance</span>, <span class="info">computer vision, deep learning</span>, and <span class="info">freelance web development</span>. </p>
    <p>I'm currently doing research at the Urban Attitudes Lab at Tufts investigating bike lane infrastructure by training a deep learning model on satellite imagery with the end goal of building an open source tool for urban bike route planning. I just started this project but you can read more on my <a href="blog.html">blog</a>.</p>
    <p><span class="success">Currently:</span> building a site for my friend's zine, getting into GIS, and looking for internships (among other things)!</p>
</div>`,

    '~/education': () => `
<div class="output">
    <p class="section-title">education</p>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Tufts University</div>
        </div>
        <div class="entry-content">

            <!-- TODO: edit the Tufts section, add classes and clubs. -->
            <div class="entry-meta">M.S. Computer Science - Medford, MA - Sep 2026 – May 2028 (expected)</div>
            <p>Graduate study in computer science and pursuing research at the Urban Attitudes Lab on campus.</p>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Boston University</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">B.A. Computer Science, Minor in Philosophy - 2024–2026</div>
            <p>Undergraduate education in computer science and philosophy finished one year ahead of schedule, qualified for the Dean's List.</p>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">University of California, Santa Cruz</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">B.S. coursework in Computer Science (transferred) - 2023–2024</div>
            <p>Bachelor of Science coursework in Computer Science, transferred to Boston University. Qualified for Dean's Honors List.</p>
        </div>
    </div>
</div>`,

    '~/education/coursework': () => `
<div class="output">
    <p class="section-title">coursework</p>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Tufts University</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">M.S. Computer Science — 2026–2028</div>

            <ul>
                <li>CS 112 - Networks</li>
                <li>CS 118 - Cloud Computing</li>
                <li>CS 123 - Software Performance Engineering</li>
                <li>CS 153 - Computational Complexity Theory</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Boston University</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">B.A. Computer Science, Minor in Philosophy — 2024–2026</div>
            <ul>
                <li>CS 599 — Fine-Grained Complexity</li>
                <li>CS 332 — Theory of Computation</li>
                <li>CS 585 — Image and Video Computing </li>
                <li>CS 460 — Database Systems</li>
                <li>CS 412 — Full-Stack Development</li>
                <li>CS 411 - Software Engineering</li>
                <li>CS 237 - Probability in Computing</li>
                <li>CS 132 - Geometric Algorithms</li>
                <li>CS 330 - Analysis of Algorithms</li>
                <li>CS 530 - Advanced Algorithms</li>
                <li>CS 320 - Concepts of Programming Languages</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">University of California, Santa Cruz</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">B.S. coursework in Computer Science (transferred) — 2023–2024</div>
            <ul>
                <li>CSE 12 - Computer Systems / Assembly Language</li>
                <li>CSE 13S - C Programming</li>
                <li>CSE 40 - Machine Learning Basics</li>
                <li>CSE 30 - Programming Abstractions in Python</li>
                <li>CSE 16- Applied Discrete Mathematics</li>
            </ul>
        </div>
    </div>
</div>`,

    '~/research': () => `
<div class="output">
    <p class="section-title">research</p>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Bike-Routing Infrastructure Research</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Tufts University - Urban Attitudes Lab - September 2026 – Present</div>

            <!-- TODO: add description bullets for the bike-lane infrastructure research. -->

            <ul>
                <li>Starting research at the Urban Attitudes Lab under Prof. Justin Hollander with the goal of training a deep-learning model to differentiate between "good" and "bad" bike-lane infrastructure in Boston.</li>
                <li>Conducting intitial literature review of existing methods for deep learning based GIS research and building the data set to train the model.</li>
                <li>End goal of the project is to create an open-source urban bike routing application using the model's predictions to fuel safer and more efficient bike routing in Boston. The research is still in its early stages and I am actively seeking feedback and collaboration to advance the project. Feel free to reach out with any suggestions or potential collaborations through my info under my <span class="cmd-highlight">contact</span> tab!</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Directed Study in Graph Algorithms</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Boston University - Advised by Prof. Dora Erdős - Jan 2026 – October 2026</div>
            <ul>
                <li>Investigating graph conductance and open problems in network connectivity, spanning theoretical foundations and algorithmic applications.</li>
                <li>Implemented published algorithm pseudocode and built a Python / NetworkX framework that benchmarks distributed conductance-testing algorithms (Batu–Trehan–Trehan (BTT) vs. Fichtenberger–Vasudev) across varied graph topologies.</li>
                <li>Type <span class="cmd-highlight">cd viz</span> to see the visualization (in development).</li>
            </ul>
            <div class="tags"><span class="tag">Python</span><span class="tag">NetworkX</span><span class="tag">spectral graph theory</span><span class="tag">benchmarking</span></div>
            <a class="btn-link" href="conductance-research.html">&rarr; conductance-research</a>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Satellite Image Restoration</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Boston University - Jan 2026 – May 2026</div>
            <ul>
                <li>Built a deep-learning pipeline that reconstructs the data gaps in Landsat 7 ETM+ imagery (roughly 22% of every scene) caused by the 2003 Scan Line Corrector (SLC) hardware failure, a defect that has degraded the satellite's imagery for over two decades.</li>
                <li>Extended LaMa (Large Mask Inpainting), a Fourier-convolution architecture suited to large missing regions, with multi-temporal reference guidance by conditioning each reconstruction on other timestamps of the same location.</li>
                <li>Added CBAM (Convolutional Block Attention Module) channel-and-spatial attention so the model preserves real terrain features like coastlines, field boundaries, river geometry rather than hallucinating pseudo-realistic texture across timestamps.</li>
                <li>Implemented and trained in PyTorch. Paper presented at end of semester research symposium: <a href="docs/landsat-slc-inpainting-paper.pdf" target="_blank" rel="noopener">read the paper here</a>.</li>
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
                <li>Wrote a directed-study summary, <a href="docs/conductance-directed-study-summary.pdf" target="_blank" rel="noopener">Distributed Conductance Testing with Random Walks</a>, comparing the Fichtenberger–Vasudev and Batu–Trehan–Trehan testers and what my implementation revealed.</li>
                <li>Authored the <a href="https://en.wikipedia.org/wiki/Fine_grained_complexity" target="_blank" rel="noopener">Wikipedia article on Fine-Grained Complexity</a>, summarizing core results for a broad technical audience.</li>
            </ul>
        </div>
    </div>
</div>`,

    '~/research/viz': () => `
<div class="output">
    <p class="section-title">research visualization (generated in part with Claude code)</p>
    ${algorithmViz}
</div>`,

    '~/experience': () => `
<div class="output">
    <p class="section-title">experience</p>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Developer @ JumboCode — Massachusetts Rivers Alliance Project</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Tufts JumboCode - React · Node.js · PostgreSQL - Sep 2026 – Present</div>

            <!-- TODO: placeholder description from resume — revise once the project starts. -->
            <ul>
                <li>Developer on a student-run JumboCode team building a full-stack web tool for the Massachusetts Rivers Alliance.</li>
                <li>Supports watershed and river-health tracking, volunteer coordination, and policy-advocacy work across the state's rivers.</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Freelance Web Developer</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Jun 2025 – Present</div>
            <ul>
                <li>Build full-stack web applications for clients (mainly my friends) alongside a graphic designer, primarily with Django, JS frameworks like Node.js and Next.js, and classic HTML/CSS/JS.</li>
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
                <li>Built bikes, performed on the spot labor, and learned repairs from zero experience before store's permanent closure (RIP Store 60).</li>
            </ul>
        </div>
    </div>
</div>`,

    '~/projects': () => `
<div class="output">
    <p class="section-title">projects</p>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">gruel Zine Site</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Node.js · HTML/CSS · React | <a href="https://www.gruel.blog" target="_blank" rel="noopener">gruel.blog</a> | <a href="https://github.com/michele-bilko/gruel.blog" target="_blank" rel="noopener">GitHub</a></div>
            <!-- TODO: add stack/dates to the meta line and description bullets for gruel. -->
            <ul>
                <li>Working with members of the Boston and New York house show scene to develop a zine with their design and content.</li>
                <li>Prototype currently deployed and under active development.</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Distributed Conductance Testing Implementation</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Python · NetworkX | <a href="https://michele-bilko.github.io/conductance-research.html" target="_blank" rel="noopener">Webpage</a> | <a href="https://github.com/michele-bilko/conductance-implementation" target="_blank" rel="noopener">GitHub</a></div>
            
            <!-- TODO: add description bullets + link to the conductance-implementation page/repo. -->

            <ul>
                <li>Implemented two algorithms for testing conductance in graph networks using Python and NetworkX.</li>
                <li>For more information run <span class="cmd-highlight">cd research</span>.</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Central Rock Gym Route Tracking System</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Django · React · PostgreSQL | <a href="https://github.com/michele-bilko/central-rock-tracker" target="_blank" rel="noopener">GitHub</a></div>
            <ul>
                <li>Full-stack climbing route tracking system with React frontend and Django REST backend</li>
                <li>Dual interface: climber portal + admin dashboard with D3.js analytics</li>
                <li>OAuth 2.0 + JWT authentication with role-based access control</li>
                <li>Currently a little defunct, dealing with that....</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Columbia MCAH Finding Aid Tool</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Java · Python · pandas</div>
            <ul>
                <li>Automated data processing pipeline transforming 20k+ lines of metadata</li>
                <li>Dynamic programming optimization (recursion + memoization)</li>
                <li>Scalable categorization system with advanced error handling</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">Theater Inventory Management System</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Node.js · Google Sheets API · OAuth | 2022 – 2023 | <a href="https://github.com/michele-bilko/theater-organizer" target="_blank" rel="noopener">GitHub</a></div>
            <ul>
                <li>Collaborative inventory tracking with Google Sheets as backend</li>
                <li>OAuth 2.0 authentication and test-driven development</li>
                <li>Agile methodology with comprehensive unit test coverage</li>
            </ul>
        </div>
    </div>
    <div class="entry">
        <div class="entry-header">
            <div class="entry-dots"><div class="entry-dot red"></div><div class="entry-dot yellow"></div><div class="entry-dot green"></div></div>
            <div class="entry-title">My Personal Site</div>
        </div>
        <div class="entry-content">
            <div class="entry-meta">Hand-written HTML · CSS · vanilla JavaScript</div>
            <!-- TODO: change the description for this portfolio. -->
            <ul>
                <li>built from scratch with no framework</li>
                <li>also working on a blog (currently under construction)</li>
            </ul>
        </div>
    </div>
</div>`,

    '~/skills': () => `
<div class="output">
    <p class="section-title">Technical Skills</p>
    <!-- TODO: update skills to match the new resume. -->
    <p><span class="info">Languages:</span> Python, Java, C/C++, C#, SQL, JavaScript/TypeScript, HTML/CSS</p>
    <p></p>
    <p><span class="info">ML &amp; Research:</span> PyTorch, TensorFlow, scikit-learn, NumPy, pandas, NetworkX, LaTeX, Git, Linux/Unix</p>
    <p></p>
    <p><span class="info">Web &amp; Backend:</span> React, Node.js, Express, Django, Flask, RESTful APIs, PostgreSQL, D3.js</p>
    <p></p>
    <p><span class="info">Research areas:</span> Computer Vision, Deep Learning, Graph Algorithms, Algorithmic Optimization, Computational Complexity</p>
</div>`,

    '~/contact': () => `
<div class="output">
    <p class="section-title">Contact</p>
    <p>~ <span class="success">Email:</span> <a href="mailto:michele.bilko@tufts.edu">michele.bilko@tufts.edu</a> - <a href="mailto:michelebilko@gmail.com">michelebilko@gmail.com</a></p>
    <p>~ <span class="success">LinkedIn:</span> <a href="https://linkedin.com/in/michele-bilko" target="_blank" rel="noopener">linkedin.com/in/michele-bilko</a></p>
    <p>~ <span class="success">GitHub:</span> <a href="https://github.com/michele-bilko" target="_blank" rel="noopener">github.com/michele-bilko</a></p>
</div>`
};

/* ------------------------------------------------------------------
   Commands
   ------------------------------------------------------------------ */
const helpText = `
<div class="output">
    <p class="section-title">available commands:</p>
    <p><span class="cmd-highlight">help</span> -  this help message</p>
    <p><span class="cmd-highlight">cd &lt;folder&gt;</span> - open a folder from the left, or <span class="cmd-highlight">ls</span> to see the full list</p>
    <p><span class="cmd-highlight">clear</span> - clear the terminal</p>
</div>`;

const welcomeHTML = `
<div class="ascii-art">
 __  __ _      _          _        ____  _ _ _
|  \\/  (_) ___| |__   ___| | ___  | __ )(_) | | _____
| |\\/| | |/ __| '_ \\ / _ \\ |/ _ \\ |  _ \\| | | |/ / _ \\
| |  | | | (__| | | |  __/ |  __/ | |_) | | |   < (_) |
|_|  |_|_|\\___|_| |_|\\___|_|\\___| |____/|_|_|_|\\_\\___/
</div>
<div class="output">
    <p>CS @ Boston University --> M.S. CS @ Tufts</p>
    <p>click a folder on the left or check out some commands</p>
</div>`;

// Change directory. Returns { html, scrollToTop }.
function changeDir(target) {
    const dest = resolvePath(target);
    if (dest === null) {
        const name = target.replace(/\/+$/, '').split('/').pop();
        const where = findFolder(name);
        const hint = where
            ? `<p><span class="info">${name}</span> lives in <span class="info">${pathString(where.slice(0, -1))}</span> &mdash; try <span class="cmd-highlight">cd ${pathString(where)}</span>.</p>`
            : `<p>Type <span class="cmd-highlight">ls</span> to see folders here.</p>`;
        return { html: `<div class="output"><p class="error">cd: no such folder: ${target}</p>${hint}</div>`, scrollToTop: false };
    }
    cwd = dest;
    updatePromptAndSidebar();
    const render = sections[pathString()];
    if (!render) return { html: null, scrollToTop: false }; // e.g. cd .. back to ~
    return { html: render() + subfolderHint(cwd), scrollToTop: true };
}

function listDir() {
    const node = getNode(cwd) || {};
    const items = Object.keys(node).map(name =>
        `<div class="file-item" onclick="executeCommandFromClick('cd ${pathString([...cwd, name])}')">${name}</div>`
    );
    if (cwd.length === 0) {
        items.push(`<div class="file-item" onclick="executeCommandFromClick('resume')">resume</div>`);
    }
    if (!items.length) {
        return `<div class="output"><p class="lead">(no subfolders here - <span class="cmd-highlight">cd ..</span> to go up)</p></div>`;
    }
    return `<div class="output"><div class="file-list">${items.join('')}</div></div>`;
}

function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(' ');

    switch (name) {
        case 'help': return { html: helpText };
        case 'ls': return { html: listDir() };
        case 'pwd': return { html: `<div class="output"><p>${pathString()}</p></div>` };
        case 'cd': return changeDir(arg || '~');
        case 'clear':
            terminalOutput.innerHTML = welcomeHTML;
            return { html: null };
        case 'resume':
            window.open('docs/resume.pdf', '_blank');
            return { html: `<div class="output"><p class="success">Opening resume in a new tab... </p></div>` };
    }

    // Typing a folder name opens it: top-level folders work from anywhere,
    // subfolders (coursework, viz) work from inside their parent.
    if (!arg) {
        if (fsTree[name]) return changeDir('~/' + name);
        if (getNode([...cwd, name])) return changeDir(name);
        if (cwd.length && getNode([cwd[0], name])) return changeDir(`~/${cwd[0]}/${name}`);
        const where = findFolder(name);
        if (where) {
            return { html: `<div class="output"><p class="error">${name}: not in this folder</p><p><span class="info">${name}</span> lives in <span class="info">${pathString(where.slice(0, -1))}</span> &mdash; type <span class="cmd-highlight">cd ${where[0]}</span> first, or <span class="cmd-highlight">cd ${pathString(where)}</span>.</p></div>` };
        }
    }

    return { html: `<div class="output"><p class="error">Command not found: ${raw}</p><p>Type <span class="cmd-highlight">help</span> to see available commands.</p></div>` };
}

function executeCommand(input) {
    if (input.trim() === '') return;

    commandHistory.unshift(input);
    historyIndex = -1;

    // Echo the command with the path it was typed in.
    const commandLine = document.createElement('div');
    commandLine.className = 'command-line';
    commandLine.innerHTML = `<span class="prompt">michele@portfolio</span> <span class="path">${promptDir()}</span> % <span class="command"></span>`;
    commandLine.querySelector('.command').textContent = input;
    terminalOutput.appendChild(commandLine);

    const result = runCommand(input);
    if (result.html) {
        const outputDiv = document.createElement('div');
        outputDiv.innerHTML = result.html;
        terminalOutput.appendChild(outputDiv);
    }

    requestAnimationFrame(() => {
        if (result.scrollToTop && commandLine.isConnected) {
            // Scroll only the terminal pane (scrollIntoView would also scroll the whole page).
            const top = commandLine.getBoundingClientRect().top - terminalOutput.getBoundingClientRect().top + terminalOutput.scrollTop;
            terminalOutput.scrollTo({ top, behavior: 'smooth' });
        } else {
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
}

/* ------------------------------------------------------------------
   Input handling
   ------------------------------------------------------------------ */
const baseCommands = ['help', 'ls', 'pwd', 'cd', 'clear', 'resume', ...Object.keys(fsTree)];

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
        const value = terminalInput.value.toLowerCase();
        const here = Object.keys(getNode(cwd) || {});
        if (value.startsWith('cd ')) {
            const partial = value.slice(3);
            const options = [...here, ...Object.keys(fsTree), '..'];
            const matches = [...new Set(options)].filter(d => d.startsWith(partial));
            if (matches.length === 1) terminalInput.value = 'cd ' + matches[0];
        } else {
            const matches = [...new Set([...baseCommands, ...here])].filter(c => c.startsWith(value));
            if (matches.length === 1) terminalInput.value = matches[0];
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
    updatePromptAndSidebar();
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