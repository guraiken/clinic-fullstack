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

Essa abordagem é simples e funciona bem para um primeiro fluxo de exportação, mas não gera um PDF altamente customizado..
É possível fazer o uso da lib do jspdf que permite um visual mais profissional e robusto.
