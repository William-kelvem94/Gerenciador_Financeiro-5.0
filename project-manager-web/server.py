#!/usr/bin/env python3
"""
Will Finance 5.0 Project Manager API Server
"""

import os
import json
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import webbrowser

# Adiciona o caminho do projeto principal
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

class ProjectManagerHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)

        # Serve arquivos estáticos
        if parsed_path.path == '/' or parsed_path.path == '/index.html':
            self.serve_file('index.html', 'text/html')
        elif parsed_path.path == '/styles.css':
            self.serve_file('styles.css', 'text/css')
        elif parsed_path.path == '/app.js':
            self.serve_file('app.js', 'application/javascript')
        elif parsed_path.path.startswith('/api/'):
            self.handle_api(parsed_path)
        else:
            self.send_error(404)

    def do_POST(self):
        parsed_path = urlparse(self.path)
        if parsed_path.path.startswith('/api/'):
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            self.handle_api(parsed_path, post_data)
        else:
            self.send_error(404)

    def serve_file(self, filename, content_type):
        try:
            file_path = os.path.join(os.path.dirname(__file__), filename)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            self.send_response(200)
            self.send_header('Content-type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(content.encode('utf-8'))
        except FileNotFoundError:
            self.send_error(404)

    def handle_api(self, parsed_path, post_data=None):
        path_parts = parsed_path.path.split('/')

        if len(path_parts) >= 3:
            endpoint = path_parts[2]

            if endpoint == 'validate':
                self.api_validate()
            elif endpoint == 'correct':
                self.api_correct(post_data)
            elif endpoint == 'status':
                self.api_status()
            else:
                self.send_json_error('Endpoint não encontrado', 404)
        else:
            self.send_json_error('Endpoint inválido', 400)

    def api_validate(self):
        """API para validação do projeto"""
        try:
            # Simulação de validação do projeto enquanto o módulo não existe
            results = {
                'status': 'success',
                'project_structure': 'valid',
                'dependencies': 'checked',
                'config_files': 'found',
                'message': 'Validação simulada - integração com ProjectValidator pendente'
            }

            self.send_json_response(results)
        except Exception as e:
            self.send_json_error(f'Erro na validação: {str(e)}', 500)
    def api_correct(self, post_data):
        """API para correções do projeto"""
        try:
            # Parse dos dados POST
            data = json.loads(post_data.decode('utf-8')) if post_data else {}
            correction_type = data.get('type', 'all')

            # Simulação de correções enquanto o módulo não existe
            if correction_type == 'all':
                results = [
                    'Estrutura de diretórios verificada',
                    'Arquivos de configuração validados',
                    'Dependências verificadas',
                    'Correção simulada - integração com ProjectAutoCorrector pendente'
                ]
            else:
                results = [f'Correção específica do tipo {correction_type} em desenvolvimento']

            self.send_json_response({'corrections': results})
        except Exception as e:
            self.send_json_error(f'Erro na correção: {str(e)}', 500)
            self.send_json_response({'corrections': results})
        except Exception as e:
            self.send_json_error(f'Erro na correção: {str(e)}', 500)

    def api_status(self):
        """API para status do projeto"""
        try:
            # Status básico do projeto
            status = {
                'project_root': project_root,
                'timestamp': time.time(),
                'health': 'OK'
            }

            self.send_json_response(status)
        except Exception as e:
            self.send_json_error(f'Erro no status: {str(e)}', 500)

    def send_json_response(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def send_json_error(self, message, status_code):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        error_data = {'error': message, 'status': status_code}
        self.wfile.write(json.dumps(error_data).encode('utf-8'))

def start_server(port=8080):
    """Inicia o servidor web"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, ProjectManagerHandler)

    print(f"🌐 Will Finance 5.0 Project Manager")
    print(f"📍 Servidor rodando em: http://localhost:{port}")
    print(f"🔧 Gerenciando projeto: {project_root}")
    print("\n🚀 Abrindo navegador...")

    # Abre o navegador
    threading.Timer(1.0, lambda: webbrowser.open(f'http://localhost:{port}')).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n⏹️ Servidor finalizado.")
        httpd.shutdown()

if __name__ == '__main__':
    import time
    start_server()