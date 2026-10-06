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

function goHome() {
    window.location.href = 'index.html';
}

function printCommandLine(input) {
    const commandLine = document.createElement('div');
    commandLine.className = 'command-line';
    commandLine.innerHTML = `<span class="prompt">michele@portfolio</span> <span class="path">conductance-research</span> % <span class="command">${input}</span>`;
    terminalOutput.appendChild(commandLine);
}

function printOutput(html) {
    const outputDiv = document.createElement('div');
    outputDiv.className = 'output';
    outputDiv.innerHTML = html;
    terminalOutput.appendChild(outputDiv);
}

function executeCommand(input) {
    const raw = input.trim();
    const cmd = raw.toLowerCase();
    if (cmd === '') return;

    commandHistory.unshift(input);
    historyIndex = -1;
    printCommandLine(raw);

    if (cmd === 'cd ..' || cmd === 'cd../' || cmd === 'cd../..' || cmd === 'home' || cmd === 'back' || cmd === 'exit') {
        printOutput(`<p class="success">Returning to ~ ...</p>`);
        setTimeout(goHome, 250);
        return;
    }

    if (cmd === 'help') {
        printOutput(`
<p class="section-title">Available Commands</p>
<p><span class="cmd-highlight">cd ..</span> - Return to the homepage</p>
<p><span class="cmd-highlight">clear</span> - Clear this terminal</p>
<p><span class="cmd-highlight">help</span> - Display this help message</p>`);
        return;
    }

    if (cmd === 'clear') {
        terminalOutput.innerHTML = '';
        return;
    }

    if (cmd === 'ls') {
        printOutput(`<p>conductance-research.md &middot; conductance-directed-study-summary.pdf &middot; conductance-implementation-analysis.pdf</p>`);
        return;
    }

    printOutput(`<p class="error">Command not found: ${raw}</p><p>Type <span class="cmd-highlight">cd ..</span> to go home, or <span class="cmd-highlight">help</span> for available commands.</p>`);
}

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = terminalInput.value;
        executeCommand(input);
        terminalInput.value = '';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
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
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('a')) {
        terminalInput.focus();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
});