# Dark mode no painel e nos detalhes do paciente

## Como funciona

O botão de dark mode foi integrado ao header do painel do sistema e também passa a influenciar a tela de detalhes do paciente.

Ao clicar no botão:

1. o tema alterna entre claro e escuro;
2. o estado é armazenado no `localStorage` do navegador;
3. o layout do painel, os cards do dashboard e os blocos da tela de detalhes do paciente recebem as classes adequadas para o tema ativo.

## Ferramenta utilizada

A implementação foi feita com React + Tailwind CSS.

- `useState` e `useEffect` para controlar o estado do tema;
- classes condicionais do Tailwind para trocar as cores da interface;
- `localStorage` para persistir a escolha do usuário.

---

## 💻 Exemplos de Código Prático

Abaixo estão os trechos resumidos que demonstram como a lógica do Dark Mode foi estruturada no sistema:

### 1. Inicialização e Persistência de Estado
Este bloco demonstra como o estado lê o `localStorage` ao iniciar e como o `useEffect` grava a escolha do usuário sempre que o tema muda.

```jsx
// Inicializa o estado buscando o valor salvo no navegador (padrão é falso/light)
const [isDarkMode, setIsDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "dark"
})

// Salva a preferência no localStorage toda vez que o estado for alterado
useEffect(() => {
  localStorage.setItem("theme", isDarkMode ? "dark" : "light")
}, [isDarkMode])

// Função que alterna o booleano de controle
const toggleDarkMode = () => setIsDarkMode(prev => !prev)