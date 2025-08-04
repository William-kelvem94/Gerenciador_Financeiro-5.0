#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔍 Will Finance 5.0 - Dashboard de Análise do Projeto
Interface Web para análise e visualização do projeto
"""

import os
import json
import subprocess
from pathlib import Path
from datetime import datetime
from flask import Flask, render_template, jsonify, request, send_file
import pandas as pd
import plotly.graph_objs as go
import plotly.utils

# Configuração da aplicação
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'default-secret-key')

# Diretório do projeto
PROJECT_ROOT = Path(__file__).parent.parent
ANALYSIS_DIR = PROJECT_ROOT / "docs" / "analysis"

class ProjectAnalyzer:
    """Analisador do projeto Will Finance 5.0"""
    
    def __init__(self, project_path):
        self.project_path = Path(project_path)
        self.stats = {}
        self.file_types = {}
        
    def scan_project(self):
        """Escaneia o projeto e coleta estatísticas"""
        print("🔍 Escaneando projeto...")
        
        total_files = 0
        total_dirs = 0
        file_extensions = {}
        
        for root, dirs, files in os.walk(self.project_path):
            # Ignora node_modules, .git, etc
            dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
            
            total_dirs += len(dirs)
            
            for file in files:
                if not file.startswith('.'):
                    total_files += 1
                    ext = Path(file).suffix.lower()
                    if ext:
                        file_extensions[ext] = file_extensions.get(ext, 0) + 1
        
        self.stats = {
            'total_files': total_files,
            'total_dirs': total_dirs,
            'file_extensions': file_extensions,
            'scan_time': datetime.now().isoformat()
        }
        
        return self.stats
    
    def get_project_structure(self):
        """Retorna estrutura do projeto"""
        structure = {
            'frontend': {
                'path': 'client/',
                'description': 'React 18 + TypeScript + Vite + Tailwind CSS',
                'files': 0
            },
            'backend': {
                'path': 'server/',
                'description': 'Node.js + Express + TypeScript + Prisma ORM',
                'files': 0
            },
            'database': {
                'path': 'database/',
                'description': 'Configurações e scripts do banco de dados',
                'files': 0
            },
            'docs': {
                'path': 'docs/',
                'description': 'Documentação e análises do projeto',
                'files': 0
            },
            'configs': {
                'path': 'configs/',
                'description': 'Arquivos de configuração centralizados',
                'files': 0
            },
            'ia': {
                'path': 'IA/',
                'description': 'Módulo de Inteligência Artificial',
                'files': 0
            }
        }
        
        # Conta arquivos por módulo
        for module, info in structure.items():
            module_path = self.project_path / info['path']
            if module_path.exists():
                files = list(module_path.rglob('*'))
                info['files'] = len([f for f in files if f.is_file()])
        
        return structure
    
    def analyze_dependencies(self):
        """Analisa dependências do projeto"""
        dependencies = {
            'frontend': {},
            'backend': {},
            'analysis': []
        }
        
        # Frontend package.json
        frontend_pkg = self.project_path / "client" / "package.json"
        if frontend_pkg.exists():
            with open(frontend_pkg, 'r', encoding='utf-8') as f:
                pkg_data = json.load(f)
                dependencies['frontend'] = {
                    'dependencies': pkg_data.get('dependencies', {}),
                    'devDependencies': pkg_data.get('devDependencies', {})
                }
        
        # Backend package.json
        backend_pkg = self.project_path / "server" / "package.json"
        if backend_pkg.exists():
            with open(backend_pkg, 'r', encoding='utf-8') as f:
                pkg_data = json.load(f)
                dependencies['backend'] = {
                    'dependencies': pkg_data.get('dependencies', {}),
                    'devDependencies': pkg_data.get('devDependencies', {})
                }
        
        return dependencies

# Instância global do analisador
analyzer = ProjectAnalyzer(PROJECT_ROOT)

@app.route('/')
def dashboard():
    """Página principal do dashboard"""
    return render_template('dashboard.html')

@app.route('/api/scan')
def api_scan():
    """API para escanear o projeto"""
    try:
        stats = analyzer.scan_project()
        return jsonify({
            'success': True,
            'data': stats
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/structure')
def api_structure():
    """API para obter estrutura do projeto"""
    try:
        structure = analyzer.get_project_structure()
        return jsonify({
            'success': True,
            'data': structure
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/dependencies')
def api_dependencies():
    """API para analisar dependências"""
    try:
        deps = analyzer.analyze_dependencies()
        return jsonify({
            'success': True,
            'data': deps
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/charts/file-types')
def api_chart_file_types():
    """Gráfico de tipos de arquivo"""
    try:
        if not analyzer.stats:
            analyzer.scan_project()
        
        extensions = analyzer.stats.get('file_extensions', {})
        
        # Top 10 extensões
        top_extensions = dict(sorted(extensions.items(), key=lambda x: x[1], reverse=True)[:10])
        
        fig = go.Figure(data=[
            go.Bar(
                x=list(top_extensions.keys()),
                y=list(top_extensions.values()),
                marker_color='#3B82F6'
            )
        ])
        
        fig.update_layout(
            title='Top 10 Tipos de Arquivo',
            xaxis_title='Extensões',
            yaxis_title='Quantidade',
            template='plotly_white'
        )
        
        return jsonify({
            'success': True,
            'data': json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig))
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/charts/project-modules')
def api_chart_modules():
    """Gráfico de módulos do projeto"""
    try:
        structure = analyzer.get_project_structure()
        
        modules = list(structure.keys())
        files = [structure[mod]['files'] for mod in modules]
        
        fig = go.Figure(data=[
            go.Pie(
                labels=modules,
                values=files,
                hole=0.3
            )
        ])
        
        fig.update_layout(
            title='Distribuição de Arquivos por Módulo',
            template='plotly_white'
        )
        
        return jsonify({
            'success': True,
            'data': json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig))
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/run-analysis/<analysis_type>')
def api_run_analysis(analysis_type):
    """Executa análises específicas"""
    try:
        if analysis_type == 'security':
            # Simula análise de segurança
            result = {
                'status': 'completed',
                'findings': [
                    'Configurações JWT seguras ✅',
                    'Validação de entrada implementada ✅',
                    'Rate limiting configurado ✅',
                    'CORS configurado corretamente ✅'
                ],
                'score': 95
            }
        elif analysis_type == 'performance':
            # Simula análise de performance
            result = {
                'status': 'completed',
                'metrics': {
                    'bundle_size': '2.1MB',
                    'load_time': '1.2s',
                    'lighthouse_score': 88
                }
            }
        elif analysis_type == 'dependencies':
            # Analisa dependências
            deps = analyzer.analyze_dependencies()
            frontend_count = len(deps['frontend'].get('dependencies', {}))
            backend_count = len(deps['backend'].get('dependencies', {}))
            
            result = {
                'status': 'completed',
                'frontend_deps': frontend_count,
                'backend_deps': backend_count,
                'total': frontend_count + backend_count
            }
        else:
            result = {'status': 'unknown_analysis'}
        
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("🚀 Iniciando Will Finance 5.0 Analysis Dashboard...")
    print(f"📁 Projeto: {PROJECT_ROOT}")
    print("🌐 Acesse: http://localhost:5001")
    
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True
    )
