# WILL FINANCE - PARAR TODOS OS SERVICOS

Write-Host "PARANDO WILL FINANCE..." -ForegroundColor Red
Write-Host ""

# Listar processos Node.js em execução
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses.Count -gt 0) {
    Write-Host "Encontrados $($nodeProcesses.Count) processos Node.js rodando" -ForegroundColor Yellow
    Write-Host "Finalizando processos..." -ForegroundColor Yellow
    
    # Parar todos os processos Node.js
    $nodeProcesses | Stop-Process -Force
    
    Write-Host "Todos os servicos foram parados!" -ForegroundColor Green
} else {
    Write-Host "Nenhum processo Node.js encontrado" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "WILL FINANCE parado com sucesso!" -ForegroundColor Green
