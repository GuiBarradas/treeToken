# 🌳 TreeToken Challenge

Desafio técnico – Desenvolvimento de um token ERC-20 com frontend web para interação via MetaMask e Alchemy (ethers.js).

---

## 📁 Estrutura do Projeto

```
tree-token-challenge/
├── contracts/
│   └── TreeToken.sol
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── scripts/
│   └── deploy.js
├── .env
├── .gitignore
├── hardhat.config.js
├── package.json
├── README.md
```

---

## 🧱 Tecnologias Utilizadas

- Solidity (v0.8.20)
- Hardhat
- Ethers.js
- AlchemyProvider
- HTML5, CSS3, JavaScript
- MetaMask (integração de carteira)
- OpenZeppelin Contracts (v5.x)

---

## ⚙️ Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/tree-token-challenge.git
   cd tree-token-challenge
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

---

## 🔐 Configuração

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
ALCHEMY_API_KEY=SUA_ALCHEMY_API_KEY
PRIVATE_KEY=SUA_PRIVATE_KEY_SEM_0x
```

> ⚠️ Sua `PRIVATE_KEY` deve ser da conta MetaMask que realizará o deploy, e deve **estar com saldo Sepolia**.

---

## 📰 Endereço do Contrato

Segue o link para o endereço do contrato no EtherScan
[Contrato](https://sepolia.etherscan.io/address/0x260c26896fa05548b3daEdbDe67595A47b50a037)

## 📤 Deploy do Contrato (Caso deseje)

1. Compile o contrato:
   ```bash
   npx hardhat compile
   ```

2. Faça o deploy na rede Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. O endereço do contrato será exibido no terminal. Copie e atualize o valor da variável `contractAddress` no `frontend/app.js`.

---

## 💻 Executar o Frontend

1. Acesse a pasta `frontend`:

   ```bash
   cd frontend
   ```

2. Rode via Live Server (VS Code) ou outro servidor HTTP.  
   Alternativas:

   - Live Server:
     - Clique com o botão direito no `index.html` > “Open with Live Server”
   - Python:
     ```bash
     python3 -m http.server
     ```

3. Acesse via navegador com MetaMask instalado.

---

## ✅ Funcionalidades Implementadas

### Smart Contract (TreeToken.sol)

- Nome do token: `TreeToken`
- Símbolo: `TREE`
- Decimais: `18`
- Supply inicial: `1.000.000 TREE` tokens (mintado para `msg.sender`)
- Funções públicas:
  - `burn(uint256 amount)`
  - `airdrop(address[] memory recipients, uint256 amount)`

> Baseado em `ERC20` e `Ownable` da biblioteca OpenZeppelin para segurança e boas práticas.

---

### Frontend Web (HTML/CSS/JS)

#### Conecta com:
- MetaMask (via `window.ethereum`)
- Alchemy (via `AlchemyProvider`)

#### Exibe:
- Nome do token
- Símbolo
- Total supply
- Saldo da conta conectada

#### Permite:
- Transferir tokens
- Queimar tokens
- Airdrop para múltiplos endereços (mínimo 3)

#### Recursos adicionais (UX):
- Atualização automática após cada transação
- Modo claro/escuro
- Troca de idioma (Português/Inglês)
- Inputs com placeholders dinâmicos
- Botão de conexão com feedback visual

---

## 🔌 Integração com Alchemy

A integração foi feita utilizando o `AlchemyProvider` da ethers.js:

```js
import { AlchemyProvider } from "@ethersproject/providers";

const provider = new AlchemyProvider("sepolia", "SUA_ALCHEMY_API_KEY");
```

O provedor Alchemy é usado para leitura e criação do contrato, enquanto a assinatura das transações ocorre via MetaMask (`window.ethereum`).

---

## 📸 Preview (UI)

> Interface simples e funcional com layout amigável, dark/light mode e suporte multilíngue.

| Light Mode 🇧🇷 | Dark Mode 🇺🇸 |
|---------------|--------------|
| ![preview light](https://i.imgur.com/bNOrnxG.png) | ![preview dark](https://i.imgur.com/aiEswkt.png) |

---

## 📌 Observações

- Optei por não utilizar o Alchemy SDK devido ao tempo reduzido, mas mantive a integração com o AlchemyProvider conforme permitido no enunciado.
- Todas as funcionalidades obrigatórias estão implementadas e testadas.
- O projeto foi desenvolvido em poucas horas, com atenção à clareza de código e experiência do usuário.

---

## 🙌 Autor

**Guilherme M. Barradas**  
[LinkedIn](https://www.linkedin.com/in/guilherme-barradas-47781820b/) • [GitHub](https://github.com/GuiBarradas)

---

## 📅 Entregue com leve atraso, mas com dedicação e qualidade.

Obrigado pela oportunidade!
