import { http, createConfig } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';

// Configuration des réseaux Intuition selon le backend
// Mainnet: chainId 1155
// Testnet: chainId 13579

// Définition du réseau Intuition Mainnet
export const intuitionMainnet = {
  id: 1155,
  name: 'Intuition Network',
  nativeCurrency: {
    name: 'TRUST',
    symbol: 'TRUST',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.intuition.systems'],
      webSocket: ['wss://rpc.intuition.systems/ws'],
    },
    public: {
      http: ['https://rpc.intuition.systems'],
      webSocket: ['wss://rpc.intuition.systems/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Intuition Explorer',
      url: 'https://explorer.intuition.systems',
    },
  },
};

// Définition du réseau Intuition Testnet
export const intuitionTestnet = {
  id: 13579,
  name: 'Intuition Network Testnet',
  nativeCurrency: {
    name: 'TRUST',
    symbol: 'TRUST',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.intuition.systems/http'],
      webSocket: ['wss://testnet.rpc.intuition.systems/ws'],
    },
    public: {
      http: ['https://testnet.rpc.intuition.systems/http'],
      webSocket: ['wss://testnet.rpc.intuition.systems/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Intuition Testnet Explorer',
      url: 'https://explorer-testnet.intuition.systems',
    },
  },
};

// Déterminer le réseau par défaut depuis l'environnement ou mainnet par défaut
const defaultNetwork = import.meta.env.VITE_INTUITION_NETWORK === 'testnet' 
  ? intuitionTestnet 
  : intuitionMainnet;

// Configuration wagmi
export const config = createConfig({
  chains: [defaultNetwork],
  connectors: [
    injected({ target: 'metaMask' }),
    injected({ target: 'injected' }),
    // WalletConnect peut être ajouté avec un projectId
    // walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
  ],
  transports: {
    [defaultNetwork.id]: http(),
  },
});

// Exporter le réseau par défaut pour vérification
export const expectedChainId = defaultNetwork.id;
export const expectedChainName = defaultNetwork.name;
