# Exportação de PDF do prontuário

## Como funciona

A exportação de PDF foi implementada na tela de detalhes do paciente, no componente de prontuário.

Ao clicar no botão "Exportar PDF do prontuário", o sistema:

1. coleta os dados do paciente;
2. reúne o histórico de consultas e exames já carregados na tela;
3. monta uma página temporária no navegador;
4. abre a janela de impressão do navegador para salvar ou exportar como PDF.

## Ferramenta utilizada

A implementação foi feita sem dependência extra, usando apenas recursos nativos do navegador:

- `window.open()` para abrir a janela temporária;
- `document.write()` para montar o conteúdo do relatório;
- `window.print()` para disparar a exportação/impresão em PDF.

## Observação

Essa abordagem é simples e funciona bem para um primeiro fluxo de exportação, mas não gera um PDF altamente customizado.
É possível fazer o uso da lib do jspdf que permite um visual mais profissional e robusto.

---

## 💻 Exemplos de Código Prático

Abaixo estão os trechos que demonstram a implementação nativa atual e uma prévia de refatoração para `jspdf`.

### 1. Abordagem Atual (Nativa do Navegador)
Este bloco ilustra como os dados em tela são injetados em uma nova janela para disparar a caixa de diálogo de impressão do sistema operacional.

```javascript
const handleExportPDFNative = (patient, history) => {
  // Abre uma janela temporária em branco
  const printWindow = window.open("", "_blank");
  
  // Monta a estrutura HTML contendo os dados coletados do estado
  printWindow.document.write(`
    <html>
      <head>
        <title>Prontuário - ${patient.nome}</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          h1 { color: #075985; }
          .box { border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>Prontuário Médico: ${patient.nome}</h1>
        <div class="box">
          <p><strong>E-mail:</strong> ${patient.email}</p>
          <p><strong>Telefone:</strong> ${patient.telefone}</p>
        </div>
        <h2>Histórico de Consultas</h2>
        <ul>
          ${history.map(item => `<li>${item.data}: ${item.diagnostico}</li>`).join("")}
        </ul>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // Dispara o comando de impressão/salvamento do navegador
  printWindow.print();
};