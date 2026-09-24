# Butique das Carnes - PWA de Catálogo & Pedidos de Açougue

PWA ultrarrápido, responsivo e mobile-first no estilo mini iFood exclusivo para açougue e churrasco, com envio direto pelo WhatsApp e Painel Administrativo integrado.

---

## ⚡ Características Principais

- **Zero dependência de IA em tempo de execução**: alta performance, sem latência e sem consumo de APIs externas.
- **Mobile First & PWA Instalável**:
  - `manifest.webmanifest` e Service Worker (`sw.js`) com cache offline.
  - Ícones adaptáveis (192x192 e 512x512).
  - Experiência que lembra app nativo sem barras de navegador.
- **Identidade Visual Premium de Açougue**:
  - Preto `#111111`
  - Vermelho Principal `#B5121B`
  - Vermelho Escuro `#7D0A10`
  - Branco `#FFFFFF`
  - Cinza Claro `#F4F4F4`
- **Catálogo & Cálculos Precisos**:
  - **16 Carnes Nobres e do Dia a Dia** vendidas por **KG** com seletor de peso dinâmico (presets de 0,5 kg, 1 kg, 1,5 kg, 2 kg e peso decimal livre, ex: 1,2 kg = R$ 80,40).
  - **4 Espetinhos Tradicionais** vendidos por **UNIDADE** com controle rápido `[-] X [+]`.
  - Cálculo decimal sem erros de ponto flutuante.
- **Carrinho & Checkout WhatsApp**:
  - Barra fixa inferior `[ 🛒 X itens | R$ YYY,YY ]` sempre ao alcance do polegar.
  - Opção de **Entrega** (calcula taxa configurável e coleta endereço completo) ou **Retirada no Balcão** (taxa grátis e exibe endereço da loja).
  - Geração da mensagem oficial pronta e codificada no WhatsApp oficial do açougue.
- **Painel Administrativo (`/admin` ou `#admin`)**:
  - Protegido por login (senha padrão: `admin123`).
  - **Dashboard**: totalizadores de catálogo, faturamento e pedidos.
  - **Produtos**: CRUD completo, fotos com compressão WebP embutida, ativação de destaques e controle de estoque.
  - **Edição Rápida de Preços ("PREÇOS")**: altere valores de qualquer corte em 1 segundo.
  - **Pedidos**: gestão de pedidos recebidos com alteração de status (`NOVO`, `EM PREPARAÇÃO`, `PRONTO`, `SAIU PARA ENTREGA`, `CONCLUÍDO`, `CANCELADO`).
  - **Configurações**: número do WhatsApp, taxa de entrega, endereço da loja, horário de atendimento, etc.
- **Persistência Híbrida**:
  - Funciona imediatamente offline (LocalStorage/IndexedDB).
  - Script SQL pronto para Supabase em `supabase/schema.sql` com Row Level Security (RLS) e Storage.

---

## 🚀 Como Executar

### 1. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
O catálogo abrirá em: `http://localhost:5173`

### 2. Acessar o Painel Administrativo
- Clique no ícone de escudo no topo direito do catálogo público, ou acerte a rota:
  `http://localhost:5173/#admin`
- Senha de acesso padrão: `admin123`

### 3. Rodar a suíte de testes automatizados
```bash
npm test
```

### 4. Compilar para Produção
```bash
npm run build
```
Os arquivos otimizados serão gerados na pasta `dist/`.

---

## 🥩 Lista de Produtos Pré-Cadastrados

### Carnes por KG:
1. Picanha aparada — R$ 67,00/kg
2. Filé — R$ 55,00/kg
3. Contra-filé — R$ 48,00/kg
4. Alcatra — R$ 48,00/kg
5. Maminha — R$ 48,00/kg
6. Patinho — R$ 45,00/kg
7. Coxão mole — R$ 45,00/kg
8. Cupim — R$ 45,00/kg
9. Fraldinha — R$ 42,00/kg
10. Coxão duro — R$ 42,00/kg
11. Lagarto — R$ 42,00/kg
12. Acém — R$ 28,00/kg
13. Paleta — R$ 28,00/kg
14. Músculo sem osso — R$ 28,00/kg
15. Peito — R$ 25,00/kg
16. Costela — R$ 25,00/kg

### Espetinhos por Unidade:
17. Espetinho de carne — R$ 5,50/unidade
18. Coração — R$ 5,00/unidade
19. Frango — R$ 4,50/unidade
20. Porco — R$ 4,50/unidade
