
let graficosAtivos = [];

let totalLinhas = 1;
let totalColunas = 1;
let totalGraficos = 1;

const paletaCores = [
    '#6366f1', '#ec4899', '#10b981', '#f59e0b', 
    '#8b5cf6', '#06b6d4', '#f43f5e', '#3b82f6'
];

function atualizarStepper(passo) {
    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById(`step-indicator-${i}`);
        if (!el) continue;

        if (i < passo) {
            el.className = 'step-item completed';
        } else if (i === passo) {
            el.className = 'step-item active';
        } else {
            el.className = 'step-item';
        }
    }
}

function configurarGradeDashboard() {
    totalGraficos = parseInt(document.getElementById('qtdGraficos').value) || 1;
    totalLinhas = parseInt(document.getElementById('qtdLinhas').value) || 1;
    totalColunas = parseInt(document.getElementById('qtdColunas').value) || 1;
    
    const container = document.getElementById('containerConfiguracao');
    container.innerHTML = ''; 

    for (let i = 1; i <= totalGraficos; i++) {
        container.innerHTML += `
            <div class="setup-block glass-card">
                <div class="setup-block-header">
                    <h3><i class="fa-solid fa-chart-simple"></i> Configuração do Gráfico ${i}</h3>
                    <span class="badge-mini">#0${i}</span>
                </div>
                
                <div class="input-group-row">
                    <div class="input-field" style="flex: 2;">
                        <label><i class="fa-solid fa-heading"></i> Título</label>
                        <input type="text" class="titulo-grafico" placeholder="Ex: Métricas de Vendas ${i}">
                    </div>
                    <div class="input-field" style="flex: 1.2;">
                        <label><i class="fa-solid fa-chart-pie"></i> Formato Visual</label>
                        <select class="tipo-grafico">
                            <option value="bar">Barras Neon</option>
                            <option value="line">Linhas Fluídas</option>
                            <option value="area">Área Suave (Glow)</option>
                            <option value="pie">Setores (Pizza)</option>
                            <option value="doughnut">Rosca Futurista</option>
                        </select>
                    </div>
                </div>

                <div class="input-group-row">
                    <div class="input-field">
                        <label><i class="fa-solid fa-tag"></i> Categorias (separadas por vírgula)</label>
                        <input type="text" class="nomes-itens" placeholder="Ex: Q1, Q2, Q3, Q4">
                    </div>
                    <div class="input-field">
                        <label><i class="fa-solid fa-hashtag"></i> Valores (separados por vírgula)</label>
                        <input type="text" class="valores-itens" placeholder="Ex: 450, 890, 1200, 750">
                    </div>
                </div>
            </div>
        `;
    }

    document.getElementById('etapa1').classList.add('hidden');
    document.getElementById('etapa2').classList.remove('hidden');
    atualizarStepper(2);
}

function voltarParaEtapa1() {
    document.getElementById('etapa2').classList.add('hidden');
    document.getElementById('etapa1').classList.remove('hidden');
    atualizarStepper(1);
}

function renderizarDashboardFinal() {
    const gridDashboard = document.getElementById('gridDashboard');
    gridDashboard.innerHTML = ''; 

    graficosAtivos.forEach(chart => chart.destroy());
    graficosAtivos = [];

    const titulos = document.querySelectorAll('.titulo-grafico');
    const tipos = document.querySelectorAll('.tipo-grafico');
    const inputsNomes = document.querySelectorAll('.nomes-itens');
    const inputsValores = document.querySelectorAll('.valores-itens');

    gridDashboard.style.gridTemplateColumns = `repeat(${totalColunas}, 1fr)`;
    gridDashboard.style.gridTemplateRows = `repeat(${totalLinhas}, auto)`;

    titulos.forEach((tituloInput, index) => {
        const tituloCard = tituloInput.value || `Gráfico ${index + 1}`;
        const tipoEscolhido = tipos[index].value;
        
        const txtNomes = inputsNomes[index].value;
        const labels = txtNomes ? txtNomes.split(',').map(item => item.trim()) : ['Jan', 'Fev', 'Mar', 'Abr'];

        const txtValores = inputsValores[index].value;
        const dados = txtValores ? txtValores.split(',').map(item => Number(item.trim())) : [100, 250, 180, 320];

        const cardId = `card-chart-${index}`;
        gridDashboard.innerHTML += `
            <div class="chart-card glass-card">
                <canvas id="${cardId}"></canvas>
            </div>
        `;

        setTimeout(() => {
            const ctx = document.getElementById(cardId).getContext('2d');
            
            let chartType = tipoEscolhido;
            let isArea = false;

            if (tipoEscolhido === 'area') {
                chartType = 'line';
                isArea = true;
            }

            const isSectorChart = ['pie', 'doughnut'].includes(chartType);

            let fillBg;
            if (isArea) {
                fillBg = ctx.createLinearGradient(0, 0, 0, 300);
                fillBg.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
                fillBg.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
            } else if (isSectorChart) {
                fillBg = paletaCores.slice(0, dados.length);
            } else {
                fillBg = '#6366f1';
            }

            const novoGrafico = new Chart(ctx, {
                type: chartType,
                data: {
                    labels: labels,
                    datasets: [{
                        label: tituloCard,
                        data: dados,
                        backgroundColor: fillBg,
                        borderColor: isSectorChart ? '#0f172a' : '#818cf8',
                        borderWidth: isSectorChart ? 3 : 2,
                        borderRadius: chartType === 'bar' ? 8 : 0,
                        fill: isArea,
                        tension: 0.4, // Curvas bem fluidas
                        pointBackgroundColor: '#ec4899',
                        pointBorderColor: '#ffffff',
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: tituloCard,
                            color: '#f8fafc',
                            font: { size: 16, family: 'Outfit', weight: '600' },
                            padding: { bottom: 20 }
                        },
                        legend: {
                            display: isSectorChart,
                            labels: { color: '#cbd5e1', font: { family: 'Plus Jakarta Sans' } }
                        }
                    },
                    scales: isSectorChart ? {} : {
                        x: {
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { color: '#94a3b8' }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { color: '#94a3b8' }
                        }
                    }
                }
            });

            graficosAtivos.push(novoGrafico);
        }, 0);
    });

    document.getElementById('etapa2').classList.add('hidden');
    document.getElementById('dashboardArea').classList.remove('hidden');
    atualizarStepper(3);
}

function reiniciarGerador() {
    graficosAtivos.forEach(chart => chart.destroy());
    graficosAtivos = [];

    document.getElementById('qtdGraficos').value = 3;
    document.getElementById('qtdLinhas').value = 2;
    document.getElementById('qtdColunas').value = 2;

    document.getElementById('dashboardArea').classList.add('hidden');
    document.getElementById('etapa1').classList.remove('hidden');
    atualizarStepper(1);
}