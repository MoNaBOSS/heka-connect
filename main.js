import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { base } from '@reown/appkit/networks'

const TARGET_CHAIN = 8453 // Base mainnet

const params     = new URLSearchParams(location.search)
const WP_NONCE   = params.get('nonce')  || ''
const RETURN_URL = params.get('return') || 'https://hekaaffiliates.com/affiliate-area/crypto-rewards/'
const WP_API     = 'https://hekaaffiliates.com/wp-json/kar/v1/wallet'

const btn = document.getElementById('connect-btn')

function setStatus(msg, type) {
  const el = document.getElementById('status')
  el.innerHTML = msg
  el.className = 'status ' + type
}

async function saveWallet(addr) {
  const r = await fetch(WP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': WP_NONCE },
    credentials: 'include',
    body: JSON.stringify({ wallet: addr })
  })
  const d = await r.json()
  return d?.status === 'saved'
}

// Init AppKit
const modal = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [base],
  defaultNetwork: base,
  projectId: '9dbe73fc0675173f87ec2077f1cda3e2',
  metadata: {
    name: 'Heka & Affiliates',
    description: 'KA Token Rewards',
    url: 'https://monaboss.github.io',
    icons: ['https://hekaaffiliates.com/favicon.ico']
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
    onramp: false,
    swaps: false
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#f0a020',
    '--w3m-border-radius-master': '10px'
  }
})

// Listen for account changes
modal.subscribeAccount(async (account) => {
  if (!account.isConnected || !account.address) return

  setStatus('Wallet connected. Saving...', 'info')
  btn.disabled = true

  try {
    const saved = await saveWallet(account.address)
    if (saved) {
      setStatus('✓ Wallet saved! Redirecting to your rewards...', 'success')
      setTimeout(() => { location.href = RETURN_URL }, 1500)
    } else {
      setStatus('Wallet connected but failed to save. Please try again.', 'error')
      btn.disabled = false
    }
  } catch (e) {
    setStatus('Error saving wallet: ' + (e.message || 'Unknown error'), 'error')
    btn.disabled = false
  }
})

btn.addEventListener('click', () => modal.open())
