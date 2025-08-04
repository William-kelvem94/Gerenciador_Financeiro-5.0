// Will Finance 5.0 Project Manager JavaScript

let currentData = {};
let charts = {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🚀 Will Finance 5.0 Project Manager iniciado');
    refreshData();
    setupWebSocket();
}

function showSection(sectionId) {
    // Esconde todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('d-none');
    });

    // Remove active de todos os links
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('active');
    });

    // Mostra seção selecionada
    document.getElementById(sectionId + '-section').classList.remove('d-none');
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');

    // Carrega dados específicos da seção
    loadSectionData(sectionId);
}

function refreshData() {
    showLoading();

    // Simula carregamento de dados (em produção, faria chamadas para API)
    setTimeout(() => {
        loadMockData();
        updateDashboard();
        hideLoading();
    }, 1000);
}

function loadMockData() {
    currentData = {
        overall_score: 78.5,
        health_status: 'good',
        categories: {
            structure: { score: 85, status: 'OK' },
            dependencies: { score: 72, status: 'NEEDS_FIX' },
            configurations: { score: 80, status: 'OK' },
            code_quality: { score: 75, status: 'OK' },
            security: { score: 68, status: 'NEEDS_FIX' },
            documentation: { score: 90, status: 'OK' },
            docker: { score: 65, status: 'NEEDS_FIX' },
            ci_cd: { score: 70, status: 'NEEDS_FIX' },
            database: { score: 85, status: 'OK' },
            ai_system: { score: 80, status: 'OK' }
        },
        priority_issues: [
            { category: 'Security', issue: 'Dependabot não configurado', priority: 'high' },
            { category: 'Docker', issue: 'Docker Compose incompleto', priority: 'medium' },
            { category: 'CI/CD', issue: 'Workflow de segurança ausente', priority: 'medium' }
        ],
        stats: {
            files_count: 247,
            commits_count: 156,
            issues_count: 8
        }
    };
}

function updateDashboard() {
    // Atualiza score geral
    const scoreElement = document.getElementById('score-value');
    const scoreCircle = document.getElementById('overall-score');
    const scoreDesc = document.getElementById('score-description');

    scoreElement.textContent = Math.round(currentData.overall_score);

    // Define cor baseada no score
    if (currentData.overall_score >= 85) {
        scoreCircle.className = 'score-circle excellent';
        scoreDesc.textContent = 'Excelente! Projeto bem estruturado.';
    } else if (currentData.overall_score >= 70) {
        scoreCircle.className = 'score-circle good';
        scoreDesc.textContent = 'Bom projeto, algumas melhorias possíveis.';
    } else {
        scoreCircle.className = 'score-circle needs-work';
        scoreDesc.textContent = 'Projeto precisa de atenção.';
    }

    // Atualiza badge de saúde
    const healthBadge = document.getElementById('health-badge');
    healthBadge.textContent = `${Math.round(currentData.overall_score)}% Saudável`;

    // Atualiza problemas prioritários
    updatePriorityIssues();

    // Atualiza estatísticas
    updateStats();

    // Atualiza gráficos
    updateCharts();
}

function updatePriorityIssues() {
    const container = document.getElementById('priority-issues');
    let html = '';

    if (currentData.priority_issues.length === 0) {
        html = '<div class="alert alert-success"><i class="fas fa-check"></i> Nenhum problema prioritário encontrado!</div>';
    } else {
        currentData.priority_issues.forEach(issue => {
            const badgeClass = issue.priority === 'high' ? 'danger' : 
                             issue.priority === 'medium' ? 'warning' : 'info';
            html += `
                <div class="alert alert-light border-start border-4 border-${badgeClass}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${issue.category}:</strong> ${issue.issue}
                        </div>
                        <span class="badge bg-${badgeClass}">${issue.priority.toUpperCase()}</span>
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = html;
}

function updateStats() {
    document.getElementById('files-count').textContent = currentData.stats.files_count;
    document.getElementById('commits-count').textContent = currentData.stats.commits_count;
    document.getElementById('issues-count').textContent = currentData.stats.issues_count;
}

function updateCharts() {
    updateCategoriesChart();
}

function updateCategoriesChart() {
    const ctx = document.getElementById('categories-chart').getContext('2d');

    const labels = Object.keys(currentData.categories).map(key => 
        key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
    const scores = Object.values(currentData.categories).map(cat => cat.score);

    if (charts.categoriesChart) {
        charts.categoriesChart.destroy();
    }

    charts.categoriesChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score',
                data: scores,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function runValidation() {
    const resultsContainer = document.getElementById('validation-results');
    resultsContainer.innerHTML = '<div class="loading-spinner"></div>';

    // Simula execução de validação
    setTimeout(() => {
        let html = '<div class="row">';

        Object.entries(currentData.categories).forEach(([category, data]) => {
            const statusClass = data.status === 'OK' ? 'success' : 'warning';
            const iconClass = data.status === 'OK' ? 'check-circle' : 'exclamation-triangle';

            html += `
                <div class="col-md-6 mb-3">
                    <div class="card border-${statusClass}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title">${category.replace('_', ' ').toUpperCase()}</h6>
                                    <p class="card-text">Score: ${data.score}%</p>
                                </div>
                                <i class="fas fa-${iconClass} fa-2x text-${statusClass}"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        resultsContainer.innerHTML = html;
    }, 2000);
}

function runCorrection(type) {
    const resultsContainer = document.getElementById('correction-results');

    let message = '';
    switch(type) {
        case 'basic':
            message = 'Corrigindo arquivos essenciais...';
            break;
        case 'config':
            message = 'Corrigindo configurações...';
            break;
        case 'docker':
            message = 'Corrigindo Docker...';
            break;
        case 'security':
            message = 'Aplicando correções de segurança...';
            break;
        case 'cicd':
            message = 'Configurando CI/CD...';
            break;
        case 'all':
            message = 'Aplicando TODAS as correções...';
            break;
    }

    resultsContainer.innerHTML = `
        <div class="alert alert-info">
            <div class="loading-spinner"></div>
            <strong>${message}</strong>
        </div>
    `;

    // Simula execução
    setTimeout(() => {
        const corrections = [
            '✅ README.md criado',
            '✅ .gitignore atualizado',
            '✅ Docker Compose configurado',
            '✅ Workflows CI/CD adicionados',
            '✅ Dependabot configurado'
        ];

        let html = '<div class="alert alert-success"><h6>Correções aplicadas com sucesso:</h6><ul>';
        corrections.forEach(correction => {
            html += `<li>${correction}</li>`;
        });
        html += '</ul></div>';

        resultsContainer.innerHTML = html;

        // Atualiza dados após correção
        setTimeout(refreshData, 1000);
    }, 3000);
}

function loadSectionData(sectionId) {
    // Carrega dados específicos para cada seção
    switch(sectionId) {
        case 'monitoring':
            // Já carregado com updateStats()
            break;
        case 'tools':
            initializeTerminal();
            break;
    }
}

function initializeTerminal() {
    // Terminal já inicializado no HTML
}

function handleTerminalInput(event) {
    if (event.key === 'Enter') {
        const input = event.target;
        const command = input.value.trim();
        const output = document.getElementById('terminal-output');

        // Adiciona comando ao output
        output.textContent += `\n$ ${command}`;

        // Processa comando
        let response = '';
        switch(command.toLowerCase()) {
            case 'help':
                response = `
Comandos disponíveis:
  help          - Mostra esta ajuda
  status        - Status do projeto
  validate      - Executa validação
  fix           - Aplica correções
  clear         - Limpa terminal
                `;
                break;
            case 'status':
                response = `\nStatus do projeto: ${Math.round(currentData.overall_score)}% saudável`;
                break;
            case 'validate':
                response = '\nExecutando validação... (use a seção Validação para detalhes)';
                break;
            case 'fix':
                response = '\nUse a seção Correções para aplicar fixes específicos';
                break;
            case 'clear':
                output.textContent = 'Will Finance 5.0 Project Manager Terminal\nDigite "help" para ver comandos disponíveis.';
                input.value = '';
                return;
            default:
                response = `\nComando não reconhecido: ${command}\nDigite "help" para ver comandos disponíveis.`;
        }

        output.textContent += response;
        output.scrollTop = output.scrollHeight;
        input.value = '';
    }
}

function exportReport(format) {
    const data = {
        timestamp: new Date().toISOString(),
        project: 'Will Finance 5.0',
        overall_score: currentData.overall_score,
        categories: currentData.categories,
        issues: currentData.priority_issues
    };

    switch(format) {
        case 'json':
            downloadJSON(data, 'will-finance-report.json');
            break;
        case 'csv':
            downloadCSV(data, 'will-finance-report.csv');
            break;
        case 'pdf':
            alert('Funcionalidade PDF em desenvolvimento');
            break;
    }
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function downloadCSV(data, filename) {
    let csv = 'Category,Score,Status\n';
    Object.entries(data.categories).forEach(([category, info]) => {
        csv += `${category},${info.score},${info.status}\n`;
    });

    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function setupWebSocket() {
    // WebSocket para updates em tempo real (implementar se necessário)
    console.log('WebSocket setup placeholder');
}

function showLoading() {
    // Implementar loading state
}

function hideLoading() {
    // Implementar hide loading
}

// Função para atualizar dados automaticamente
setInterval(refreshData, 30000); // Atualiza a cada 30 segundos