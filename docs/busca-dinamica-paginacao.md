# 📋 Documentação Técnica: Listagem de Pacientes com Paginação Híbrida (Backend + onBlur Client-Side)

Esta documentação detalha a implementação do componente `PatientsList`, responsável por exibir pacientes cadastrados, calcular idades dinamicamente e gerenciar a paginação de dados integrada à API, tratando buscas locais por desfoque de campo (`onBlur`).

---

## 🚀 Tecnologias e Hooks Utilizados

O componente foi desenvolvido em **React** utilizando **Tailwind CSS** para estilização responsiva e suporte nativo a Dark Mode. Os seguintes conceitos do React ancoram a arquitetura:

* **`useState`**: Gerencia os estados mutáveis como `patients`, `searchTerm`, `ages` e o objeto de `pagination` (fixado com `limit: 4`).
* **`useCallback`**: Memoriza a função de fetch para evitar recriações desnecessárias na memória e loops infinitos de re-render.
* **`useEffect`**: Dispara automaticamente a requisição inicial e as trocas de página, agindo apenas quando o campo de busca está vazio.

---

## ⚙️ Arquitetura de Integração com o Backend

O microsserviço de backend possui suporte a parâmetros de paginação via URL (`/pacientes?pagina=X&limite=Y`), mas **não expõe um endpoint ou filtro de busca (Search Query)**. Implementamos uma estratégia híbrida:

### 1. Fluxo Comum Paginado (Server-side)
Quando a tela inicia ou o usuário navega entre as páginas utilizando os botões, o front-end solicita apenas fatias pequenas de dados de tamanho controlado (`limit: 4`).

### 2. Fluxo de Busca sob Demanda (`onBlur`)
* **Ao Digitar (`onChange`)**: O estado `searchTerm` é atualizado para permitir que o método `.filter()` filtre visualmente os dados na tela.
* **Ao Desfocar (`onBlur`)**: Caso exista texto, a função faz uma chamada limpa sem paginação para trazer os dados gerais e filtrar em JavaScript.
* **Evitando Concorrência Assíncrona ("Piscadas")**: A string de busca é injetada via argumento (`currentSearch`) para evitar closures atrasadas do React. Se o input for limpo, o gatilho interrompe o fluxo imediatamente e força o reset para a paginação comum.

---

## 💻 Exemplos de Código Prático

Abaixo estão os trechos resumidos que demonstram como essa lógica foi estruturada no componente:

### Requisição Híbrida (API vs Memória)
```javascript
// O parâmetro 'currentSearch' evita o delay do estado do React
const fetchPatients = useCallback(async (page = 1, limit = 4, isBlurSearch = false, currentSearch = "") => {
  const hasSearchTerm = currentSearch.trim().length > 0;
  const shouldFetchAll = isBlurSearch && hasSearchTerm;
  
  // Condicional de URL: Traz tudo se for busca ou traz paginado se for navegação comum
  const url = shouldFetchAll ? `/pacientes` : `/pacientes?pagina=${page}&limite=${limit}`;
  const response = await apiClient.get(url);
  
  setPatients(response?.data?.data?.pacientes ?? []);
}, [user]);