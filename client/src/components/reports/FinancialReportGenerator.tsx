/**
 * Gerador de relatórios PDF financeiros
 * Sistema completo com gráficos, tabelas e análises
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useFamily, FamilyUser } from '../../contexts/FamilyContext';

// Registrar fontes personalizadas (opcional)
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2'
// });

// Estilos do PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #0891b2',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0891b2',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderLeft: '4px solid #0891b2',
  },
  table: {
    width: 'auto',
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#0891b2',
    color: 'white',
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    padding: 8,
    fontSize: 10,
    borderBottom: '1px solid #e5e7eb',
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#f8fafc',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  positive: {
    color: '#059669',
  },
  negative: {
    color: '#dc2626',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666666',
    fontSize: 10,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
  chart: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 10,
  },
});

// Interface para dados do relatório
interface ReportData {
  user: FamilyUser;
  period: {
    start: string;
    end: string;
  };
  transactions: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
  }>;
  summary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    transactionCount: number;
  };
  categoryBreakdown: Record<string, number>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
    balance: number;
  }>;
}

// Componente do documento PDF
const FinancialReportPDF: React.FC<{ data: ReportData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Relatório Financeiro Familiar</Text>
        <Text style={styles.subtitle}>
          Usuário: {data.user.name} ({data.user.role})
        </Text>
        <Text style={styles.subtitle}>
          Período: {new Date(data.period.start).toLocaleDateString()} -{' '}
          {new Date(data.period.end).toLocaleDateString()}
        </Text>
        <Text style={styles.subtitle}>
          Gerado em: {new Date().toLocaleDateString()} às {new Date().toLocaleTimeString()}
        </Text>
      </View>

      {/* Resumo Executivo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Resumo Executivo</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total de Receitas</Text>
          <Text style={[styles.summaryValue, styles.positive]}>
            R$ {data.summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total de Despesas</Text>
          <Text style={[styles.summaryValue, styles.negative]}>
            R$ {data.summary.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Saldo Final</Text>
          <Text
            style={[
              styles.summaryValue,
              data.summary.balance >= 0 ? styles.positive : styles.negative,
            ]}
          >
            R$ {data.summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total de Transações</Text>
          <Text style={styles.summaryValue}>{data.summary.transactionCount}</Text>
        </View>
      </View>

      {/* Análise por Categoria */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏷️ Análise por Categoria</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Categoria</Text>
            <Text style={styles.tableCell}>Valor</Text>
            <Text style={styles.tableCell}>% do Total</Text>
          </View>

          {Object.entries(data.categoryBreakdown).map(([category, amount]) => (
            <View style={styles.tableRow} key={category}>
              <Text style={styles.tableCell}>{category}</Text>
              <Text style={styles.tableCell}>
                R$ {Math.abs(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.tableCell}>
                {((Math.abs(amount) / data.summary.totalExpenses) * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tendência Mensal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Tendência Mensal</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Mês</Text>
            <Text style={styles.tableCell}>Receitas</Text>
            <Text style={styles.tableCell}>Despesas</Text>
            <Text style={styles.tableCell}>Saldo</Text>
          </View>

          {data.monthlyTrend.map(month => (
            <View style={styles.tableRow} key={month.month}>
              <Text style={styles.tableCell}>{month.month}</Text>
              <Text style={[styles.tableCell, styles.positive]}>
                R$ {month.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={[styles.tableCell, styles.negative]}>
                R$ {month.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
              <Text
                style={[styles.tableCell, month.balance >= 0 ? styles.positive : styles.negative]}
              >
                R$ {month.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Will Finance 5.0 - Sistema de Gestão Financeira Familiar | Confidencial
      </Text>
    </Page>

    {/* Segunda página - Detalhes das Transações */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Detalhes das Transações</Text>
        <Text style={styles.subtitle}>
          {data.transactions.length} transações no período selecionado
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>Data</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Descrição</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Categoria</Text>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>Tipo</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Valor</Text>
          </View>

          {data.transactions.slice(0, 50).map(transaction => (
            <View style={styles.tableRow} key={transaction.id}>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>
                {new Date(transaction.date).toLocaleDateString('pt-BR')}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {transaction.description.length > 30
                  ? transaction.description.substring(0, 30) + '...'
                  : transaction.description}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{transaction.category}</Text>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>
                {transaction.type === 'income' ? '💰' : '💸'}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  { flex: 1 },
                  transaction.type === 'income' ? styles.positive : styles.negative,
                ]}
              >
                R${' '}
                {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
        </View>

        {data.transactions.length > 50 && (
          <Text style={{ textAlign: 'center', color: '#666666', marginTop: 10 }}>
            Mostrando as primeiras 50 transações de {data.transactions.length} total. Para ver
            todas, exporte o relatório completo.
          </Text>
        )}
      </View>

      <Text style={styles.footer}>
        Will Finance 5.0 - Sistema de Gestão Financeira Familiar | Confidencial
      </Text>
    </Page>
  </Document>
);

// Gerador de dados de exemplo para teste
const generateSampleData = (user: FamilyUser): ReportData => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3); // Últimos 3 meses

  const categories = ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Casa', 'Outros'];
  const transactions = [];

  // Gerar transações de exemplo
  for (let i = 0; i < 50; i++) {
    const isIncome = Math.random() > 0.7; // 30% de chance de ser receita
    const amount = isIncome
      ? Math.random() * 5000 + 1000 // Receitas entre 1000-6000
      : Math.random() * 800 + 50; // Despesas entre 50-850

    const date = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    );

    transactions.push({
      id: `tx_${i}`,
      date: date.toISOString(),
      description: isIncome
        ? `Receita ${i + 1} - Salário/Freelance`
        : `Despesa ${i + 1} - ${categories[Math.floor(Math.random() * categories.length)]}`,
      amount: isIncome ? amount : -amount,
      type: isIncome ? ('income' as const) : ('expense' as const),
      category: isIncome ? 'Receita' : categories[Math.floor(Math.random() * categories.length)],
    });
  }

  // Calcular resumo
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(
    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  );

  // Calcular breakdown por categoria
  const categoryBreakdown: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + Math.abs(t.amount);
    });

  // Gerar tendência mensal
  const monthlyTrend = [];
  for (let i = 2; i >= 0; i--) {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() - i);
    const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    monthlyTrend.push({
      month: monthName,
      income: totalIncome / 3 + (Math.random() - 0.5) * 1000,
      expenses: totalExpenses / 3 + (Math.random() - 0.5) * 500,
      balance: (totalIncome - totalExpenses) / 3 + (Math.random() - 0.5) * 800,
    });
  }

  return {
    user,
    period: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    },
    transactions: transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    summary: {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: transactions.length,
    },
    categoryBreakdown,
    monthlyTrend,
  };
};

// Componente principal do gerador de relatórios
export const FinancialReportGenerator: React.FC = () => {
  const { currentUser, users } = useFamily();
  const [selectedUser, setSelectedUser] = useState<FamilyUser | null>(currentUser);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    if (!selectedUser) {
      toast.error('Selecione um usuário primeiro');
      return;
    }

    setIsGenerating(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));

      const data = generateSampleData(selectedUser);
      setReportData(data);

      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório');
      console.error('Erro:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToHTML = async () => {
    if (!reportData) return;

    try {
      // Criar elemento temporário com o conteúdo
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
          <h1 style="color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            Relatório Financeiro Familiar
          </h1>
          <p><strong>Usuário:</strong> ${reportData.user.name} (${reportData.user.role})</p>
          <p><strong>Período:</strong> ${new Date(reportData.period.start).toLocaleDateString()} - ${new Date(reportData.period.end).toLocaleDateString()}</p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #059669;">
              <h3 style="margin: 0; color: #1e293b;">Total de Receitas</h3>
              <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 5px 0;">
                R$ ${reportData.summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
              <h3 style="margin: 0; color: #1e293b;">Total de Despesas</h3>
              <p style="font-size: 24px; font-weight: bold; color: #dc2626; margin: 5px 0;">
                R$ ${reportData.summary.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #0891b2;">
              <h3 style="margin: 0; color: #1e293b;">Saldo Final</h3>
              <p style="font-size: 24px; font-weight: bold; color: ${reportData.summary.balance >= 0 ? '#059669' : '#dc2626'}; margin: 5px 0;">
                R$ ${reportData.summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      `;

      // Converter para canvas e depois para imagem
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      // Criar PDF com jsPDF
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `relatorio-financeiro-${reportData.user.name}-${new Date().toISOString().split('T')[0]}.pdf`
      );
      toast.success('Relatório exportado como PDF!');
    } catch (error) {
      toast.error('Erro ao exportar para PDF');
      console.error('Erro:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Seleção de usuário e controles */}
      <div className="rounded-xl border border-cyan-500/20 bg-gray-900/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-bold text-white">📊 Gerador de Relatórios Financeiros</h2>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Usuário para o relatório
            </label>
            <select
              value={selectedUser?.id || ''}
              onChange={e => {
                const user = users.find(u => u.id === e.target.value);
                setSelectedUser(user || null);
              }}
              className="w-full rounded-lg border border-gray-600/50 bg-gray-800/50 px-3 py-2 text-white focus:border-cyan-400/50 focus:outline-none"
              title="Selecionar usuário para gerar relatório"
              aria-label="Selecionar usuário para gerar relatório"
            >
              <option value="">Selecione um usuário</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={generateReport}
            disabled={!selectedUser || isGenerating}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-white transition-colors hover:bg-cyan-600 disabled:bg-gray-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Gerando...
              </>
            ) : (
              <>📊 Gerar Relatório</>
            )}
          </motion.button>

          {reportData && (
            <motion.button
              onClick={exportToHTML}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📄 Exportar PDF (HTML2Canvas)
            </motion.button>
          )}
        </div>
      </div>

      {/* Preview do relatório */}
      {reportData && (
        <div className="rounded-xl border border-cyan-500/20 bg-gray-900/50 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Preview do Relatório</h3>

            <PDFDownloadLink
              document={<FinancialReportPDF data={reportData} />}
              fileName={`relatorio-financeiro-${reportData.user.name}-${new Date().toISOString().split('T')[0]}.pdf`}
              className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
            >
              {({ blob: _blob, url: _url, loading, error: _error }) =>
                loading ? '⏳ Carregando...' : '📁 Download PDF (React-PDF)'
              }
            </PDFDownloadLink>
          </div>

          {/* Resumo rápido */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-green-500/30 bg-green-500/20 p-4">
              <div className="text-sm font-medium text-green-400">Receitas</div>
              <div className="text-xl font-bold text-white">
                R${' '}
                {reportData.summary.totalIncome.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="rounded-lg border border-red-500/30 bg-red-500/20 p-4">
              <div className="text-sm font-medium text-red-400">Despesas</div>
              <div className="text-xl font-bold text-white">
                R${' '}
                {reportData.summary.totalExpenses.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>

            <div
              className={`${reportData.summary.balance >= 0 ? 'border-cyan-500/30 bg-cyan-500/20' : 'border-red-500/30 bg-red-500/20'} rounded-lg p-4`}
            >
              <div
                className={`${reportData.summary.balance >= 0 ? 'text-cyan-400' : 'text-red-400'} text-sm font-medium`}
              >
                Saldo
              </div>
              <div className="text-xl font-bold text-white">
                R${' '}
                {reportData.summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="rounded-lg border border-gray-500/30 bg-gray-500/20 p-4">
              <div className="text-sm font-medium text-gray-400">Transações</div>
              <div className="text-xl font-bold text-white">
                {reportData.summary.transactionCount}
              </div>
            </div>
          </div>

          {/* Últimas transações */}
          <div className="rounded-lg bg-gray-800/30 p-4">
            <h4 className="mb-3 font-medium text-white">Últimas Transações</h4>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {reportData.transactions.slice(0, 10).map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded bg-gray-700/30 p-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{transaction.type === 'income' ? '💰' : '💸'}</span>
                    <div>
                      <div className="text-sm text-white">{transaction.description}</div>
                      <div className="text-xs text-gray-400">{transaction.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}
                    >
                      R${' '}
                      {Math.abs(transaction.amount).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReportGenerator;
