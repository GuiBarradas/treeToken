const contractAddress = "0x260c26896fa05548b3daEdbDe67595A47b50a037"
const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function burn(uint amount)",
  "function airdrop(address[] memory recipients, uint amount)",
]

let provider, signer, contract

const translations = {
  pt: {
    title: "🌳 Interface TreeToken",
    connect: "Conectar MetaMask",
    connectedBtn: "✅ Conectado",
    wallet: "Carteira: não conectada",
    walletConnected: "Carteira:",
    info: "🔍 Informações",
    name: "Nome:",
    symbol: "Símbolo:",
    supply: "Total Supply:",
    balance: "Seu saldo:",
    transferTitle: "💸 Transferir Tokens",
    transferBtn: "Transferir",
    burnTitle: "🔥 Queimar Tokens",
    burnBtn: "Queimar",
    airdropTitle: "🎁 Airdrop",
    airdropBtn: "Executar Airdrop",
    transferTo: "Endereço de destino",
    transferAmount: "Quantidade",
    burnAmount: "Quantidade a queimar",
    airdropList: "Endereços (1 por linha, mínimo 3)",
    airdropAmount: "Qtd por endereço",
    addressLabel: "Endereço de destino",
    amountLabel: "Quantidade",
    burnAmountLabel: "Quantidade a queimar",
    airdropListLabel: "Endereços (1 por linha, mínimo 3)",
    airdropAmountLabel: "Quantidade por endereço"
  },
  en: {
    title: "🌳 TreeToken Interface",
    connect: "Connect MetaMask",
    connectedBtn: "✅ Connected",
    wallet: "Wallet: not connected",
    walletConnected: "Wallet:",
    info: "🔍 Token Info",
    name: "Name:",
    symbol: "Symbol:",
    supply: "Total Supply:",
    balance: "Your Balance:",
    transferTitle: "💸 Transfer Tokens",
    transferBtn: "Transfer",
    burnTitle: "🔥 Burn Tokens",
    burnBtn: "Burn",
    airdropTitle: "🎁 Airdrop",
    airdropBtn: "Execute Airdrop",
    transferTo: "Recipient address",
    transferAmount: "Amount",
    burnAmount: "Amount to burn",
    airdropList: "Addresses (1 per line, min 3)",
    airdropAmount: "Amount per address",
    addressLabel: "Recipient address",
    amountLabel: "Amount",
    burnAmountLabel: "Amount to burn",
    airdropListLabel: "Addresses (1 per line, min 3)",
    airdropAmountLabel: "Amount per address"
  }
}

function clearUI() {
  document.getElementById("tokenName").innerText = "..."
  document.getElementById("tokenSymbol").innerText = "..."
  document.getElementById("totalSupply").innerText = "..."
  document.getElementById("userBalance").innerText = "..."
  const lang = document.getElementById("languageSelect").value
  document.getElementById("walletAddress").innerText = translations[lang].wallet
  const connectBtn = document.getElementById("connectBtn")
  connectBtn.classList.remove("connected")
  document.querySelector(".connect-text").innerText = translations[lang].connect
  signer = null
}

document.getElementById("languageSelect").onchange = () => {
  const lang = document.getElementById("languageSelect").value

  document.querySelectorAll("[data-text]").forEach((el) => {
    const key = el.getAttribute("data-text")
    if (el.classList.contains("btn-text") || el.classList.contains("connect-text")) {
      el.innerText = translations[lang][key]
    } else {
      el.innerText = translations[lang][key]
    }
  })

  document.querySelectorAll("[data-label]").forEach((el) => {
    const key = el.getAttribute("data-label")
    el.innerText = translations[lang][key]
  })

  const connectBtn = document.getElementById("connectBtn")
  if (signer) {
    signer.getAddress().then((addr) => {
      const address = ethers.utils.getAddress(addr)
      document.querySelector(".connect-text").innerText = translations[lang].connectedBtn
      document.getElementById("walletAddress").innerText = `${translations[lang].walletConnected} ${address}`
    })
  } else {
    clearUI()
  }
}

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark")
  document.body.classList.toggle("light")
}

document.getElementById("connectBtn").onclick = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      provider = new ethers.providers.Web3Provider(window.ethereum)
      signer = provider.getSigner()
      const address = await signer.getAddress()
      const checksummed = ethers.utils.getAddress(address)
      const lang = document.getElementById("languageSelect").value

      document.getElementById("walletAddress").innerText = `${translations[lang].walletConnected} ${checksummed}`
      const btn = document.getElementById("connectBtn")
      btn.classList.add("connected")
      document.querySelector(".connect-text").innerText = translations[lang].connectedBtn

      contract = new ethers.Contract(contractAddress, abi, signer)
      await loadTokenInfo()
    } catch (err) {
      alert("Erro ao conectar carteira: " + err.message)
    }
  } else {
    alert("MetaMask não detectado.")
  }
}

async function loadTokenInfo() {
  const name = await contract.name()
  const symbol = await contract.symbol()
  const totalSupply = await contract.totalSupply()
  const rawAddress = await signer.getAddress()
  const address = ethers.utils.getAddress(rawAddress)
  const balance = await contract.balanceOf(address)

  document.getElementById("tokenName").innerText = name
  document.getElementById("tokenSymbol").innerText = symbol
  document.getElementById("totalSupply").innerText = ethers.utils.formatUnits(totalSupply, 18)
  document.getElementById("userBalance").innerText = ethers.utils.formatUnits(balance, 18)
}

if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => {
    clearUI()
  })
}

document.getElementById("transferBtn").onclick = async () => {
  const to = document.getElementById("transferTo")
  const amount = document.getElementById("transferAmount")
  const btn = document.getElementById("transferBtn")

  try {
    if (!ethers.utils.isAddress(to.value.trim())) {
      alert("Endereço de destino inválido.")
      return
    }

    btn.classList.add("loading")
    const tx = await contract.transfer(to.value, ethers.utils.parseUnits(amount.value, 18))
    await tx.wait()
    await loadTokenInfo()
    btn.classList.remove("loading")
    btn.classList.add("done")
    setTimeout(() => btn.classList.remove("done"), 2000)
    to.value = ""
    amount.value = ""
  } catch (err) {
    btn.classList.remove("loading")
    alert("Erro ao transferir: " + err.message)
  }
}

document.getElementById("burnBtn").onclick = async () => {
  const amount = document.getElementById("burnAmount")
  const btn = document.getElementById("burnBtn")

  try {
    btn.classList.add("loading")
    const tx = await contract.burn(ethers.utils.parseUnits(amount.value, 18))
    await tx.wait()
    await loadTokenInfo()
    btn.classList.remove("loading")
    btn.classList.add("done")
    setTimeout(() => btn.classList.remove("done"), 2000)
    amount.value = ""
  } catch (err) {
    btn.classList.remove("loading")
    alert("Erro ao queimar: " + err.message)
  }
}

document.getElementById("airdropBtn").onclick = async () => {
  const list = document.getElementById("airdropList")
  const amount = document.getElementById("airdropAmount")
  const btn = document.getElementById("airdropBtn")

  try {
    const rawList = list.value.trim().split("\n")
    const recipients = rawList.map((addr) => addr.trim()).filter((addr) => ethers.utils.isAddress(addr))

    if (recipients.length < 3) {
      alert("Você precisa de pelo menos 3 endereços válidos.")
      return
    }

    btn.classList.add("loading")
    const tx = await contract.airdrop(recipients, ethers.utils.parseUnits(amount.value, 18))
    await tx.wait()
    await loadTokenInfo()
    btn.classList.remove("loading")
    btn.classList.add("done")
    setTimeout(() => btn.classList.remove("done"), 2000)
    list.value = ""
    amount.value = ""
  } catch (err) {
    btn.classList.remove("loading")
    alert("Erro no airdrop: " + err.message)
  }
}
