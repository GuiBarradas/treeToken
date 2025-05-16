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
    wallet: "Carteira: não conectada",
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
    addressPlaceholder: "0x...",
    amountPlaceholder: "0.0",
    burnAmountPlaceholder: "Quantidade a queimar",
    airdropListPlaceholder: "0x...\n0x...\n0x...",
    airdropAmountPlaceholder: "Quantidade por endereço",
    addressLabel: "Endereço de destino",
    amountLabel: "Quantidade",
    burnAmountLabel: "Quantidade a queimar",
    airdropListLabel: "Endereços (1 por linha, mínimo 3)",
    airdropAmountLabel: "Quantidade por endereço",
  },
  en: {
    title: "🌳 TreeToken Interface",
    connect: "Connect MetaMask",
    wallet: "Wallet: not connected",
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
    addressPlaceholder: "0x...",
    amountPlaceholder: "0.0",
    burnAmountPlaceholder: "Amount to burn",
    airdropListPlaceholder: "0x...\n0x...\n0x...",
    airdropAmountPlaceholder: "Amount per address",
    addressLabel: "Destination address",
    amountLabel: "Amount",
    burnAmountLabel: "Amount to burn",
    airdropListLabel: "Addresses (1 per line, minimum 3)",
    airdropAmountLabel: "Amount per address",
  },
}

function updateLanguage(lang) {
  document.querySelectorAll("[data-text]").forEach((el) => {
    const key = el.getAttribute("data-text")
    el.innerText = translations[lang][key]
  })

  document.getElementById("transferTo").placeholder = translations[lang].addressPlaceholder
  document.getElementById("transferAmount").placeholder = translations[lang].amountPlaceholder
  document.getElementById("burnAmount").placeholder = translations[lang].amountPlaceholder
  document.getElementById("airdropList").placeholder = translations[lang].airdropListPlaceholder
  document.getElementById("airdropAmount").placeholder = translations[lang].amountPlaceholder

  document.querySelectorAll("[data-label]").forEach((label) => {
    const key = label.getAttribute("data-label")
    label.innerText = translations[lang][key]
  })
}

document.getElementById("languageSelect").onchange = () => {
  const lang = document.getElementById("languageSelect").value
  updateLanguage(lang)
}

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark")
  document.body.classList.toggle("light")

  const themeIcon = document.querySelector("#themeToggle i")
  if (document.body.classList.contains("dark")) {
    themeIcon.className = "fas fa-sun"
  } else {
    themeIcon.className = "fas fa-moon"
  }
}

document.getElementById("connectBtn").onclick = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      provider = new ethers.providers.Web3Provider(window.ethereum)
      signer = provider.getSigner()
      const address = await signer.getAddress()
      const checksummed = ethers.utils.getAddress(address)

      const shortAddress = `${checksummed.substring(0, 6)}...${checksummed.substring(checksummed.length - 4)}`
      document.getElementById("walletAddress").innerText = `Carteira: ${shortAddress}`

      const btn = document.getElementById("connectBtn")
      btn.classList.add("connected")
      document.querySelector(".connect-text").innerText = "✅ Conectado"

      contract = new ethers.Contract(contractAddress, abi, signer)
      await loadTokenInfo()

      animateWalletInfo()
    } catch (err) {
      showError("Erro ao conectar carteira: " + err.message)
    }
  } else {
    showError("MetaMask não detectado.")
  }
}

function animateWalletInfo() {
  const walletInfo = document.querySelector(".wallet-info")
  walletInfo.style.animation = "pulse 0.5s"
  setTimeout(() => {
    walletInfo.style.animation = ""
  }, 500)
}

async function loadTokenInfo() {
  try {
    const name = await contract.name()
    const symbol = await contract.symbol()
    const totalSupply = await contract.totalSupply()
    const rawAddress = await signer.getAddress()
    const address = ethers.utils.getAddress(rawAddress)
    const balance = await contract.balanceOf(address)

    animateValue("tokenName", "...", name)
    animateValue("tokenSymbol", "...", symbol)
    animateValue("totalSupply", "...", ethers.utils.formatUnits(totalSupply, 18))
    animateValue("userBalance", "...", ethers.utils.formatUnits(balance, 18))
  } catch (err) {
    showError("Erro ao carregar informações: " + err.message)
  }
}

function animateValue(elementId, oldValue, newValue) {
  const element = document.getElementById(elementId)
  element.style.opacity = "0"

  setTimeout(() => {
    element.innerText = newValue
    element.style.opacity = "1"
  }, 300)
}

function setButtonState(button, state) {
  button.classList.remove("loading", "done")

  if (state === "loading") {
    button.classList.add("loading")
    button.disabled = true
  } else if (state === "done") {
    button.classList.add("done")
    setTimeout(() => {
      button.classList.remove("done")
      button.disabled = false
    }, 2000)
  } else {
    button.disabled = false
  }
}

function showError(message) {
  alert(message)
}

document.getElementById("transferBtn").onclick = async () => {
  const to = document.getElementById("transferTo")
  const amount = document.getElementById("transferAmount")
  const btn = document.getElementById("transferBtn")

  if (!to.value || !amount.value) {
    showError("Preencha todos os campos")
    return
  }

  try {
    setButtonState(btn, "loading")

    const tx = await contract.transfer(to.value, ethers.utils.parseUnits(amount.value, 18))
    await tx.wait()

    setButtonState(btn, "done")
    await loadTokenInfo()

    to.value = ""
    amount.value = ""
  } catch (err) {
    setButtonState(btn, "normal")
    showError("Erro ao transferir: " + err.message)
  }
}

document.getElementById("burnBtn").onclick = async () => {
  const amount = document.getElementById("burnAmount")
  const btn = document.getElementById("burnBtn")

  if (!amount.value) {
    showError("Preencha o valor a queimar")
    return
  }

  try {
    setButtonState(btn, "loading")

    const tx = await contract.burn(ethers.utils.parseUnits(amount.value, 18))
    await tx.wait()

    setButtonState(btn, "done")
    await loadTokenInfo()

    amount.value = ""
  } catch (err) {
    setButtonState(btn, "normal")
    showError("Erro ao queimar: " + err.message)
  }
}

document.getElementById("airdropBtn").onclick = async () => {
  const list = document.getElementById("airdropList")
  const amount = document.getElementById("airdropAmount")
  const btn = document.getElementById("airdropBtn")

  if (!list.value || !amount.value) {
    showError("Preencha todos os campos")
    return
  }

  try {
    const recipients = list.value
      .trim()
      .split("\n")
      .filter((addr) => addr)

    if (recipients.length < 3) {
      showError("Você precisa de pelo menos 3 endereços.")
      return
    }

    setButtonState(btn, "loading")

    const tx = await contract.airdrop(recipients, ethers.utils.parseUnits(amount.value, 18))
    await tx.wait()

    setButtonState(btn, "done")
    await loadTokenInfo()

    list.value = ""
    amount.value = ""
  } catch (err) {
    setButtonState(btn, "normal")
    showError("Erro no airdrop: " + err.message)
  }
}

function createParticles() {
  const bgAnimation = document.getElementById("bgAnimation")
  const particleCount = 30

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div")
    particle.classList.add("particle")

    const size = Math.random() * 5 + 2
    const posX = Math.random() * 100
    const posY = Math.random() * 100
    const duration = Math.random() * 20 + 10
    const delay = Math.random() * 5

    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.left = `${posX}%`
    particle.style.top = `${posY}%`

    particle.style.animation = `floatParticle ${duration}s linear infinite`
    particle.style.animationDelay = `${delay}s`

    bgAnimation.appendChild(particle)
  }
}

function isLargeScreen() {
  return window.matchMedia("(min-width: 1440px)").matches
}

function adjustParticlesForScreenSize() {
  const bgAnimation = document.getElementById("bgAnimation")
  if (bgAnimation) {
    bgAnimation.innerHTML = ""

    const particleCount = isLargeScreen() ? 50 : 30

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.classList.add("particle")

      const size = Math.random() * (isLargeScreen() ? 8 : 5) + 2
      const posX = Math.random() * 100
      const posY = Math.random() * 100
      const duration = Math.random() * 20 + 10
      const delay = Math.random() * 5

      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${posX}%`
      particle.style.top = `${posY}%`

      particle.style.animation = `floatParticle ${duration}s linear infinite`
      particle.style.animationDelay = `${delay}s`

      bgAnimation.appendChild(particle)
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card")
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`
  })

  const lang = document.getElementById("languageSelect").value
  updateLanguage(lang)

  adjustParticlesForScreenSize()

  const style = document.createElement("style")
  style.textContent = `
    @keyframes floatParticle {
      0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.3;
      }
      90% {
        opacity: 0.3;
      }
      100% {
        transform: translate(${Math.random() > 0.5 ? "+" : "-"}${isLargeScreen() ? "150" : "100"}px, ${Math.random() > 0.5 ? "+" : "-"}${isLargeScreen() ? "150" : "100"}px) rotate(360deg);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
})

window.addEventListener("resize", () => {
  adjustParticlesForScreenSize()
})
