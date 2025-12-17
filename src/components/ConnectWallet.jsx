import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { useTranslation } from 'react-i18next';
import { expectedChainId, expectedChainName } from '../config/wagmi';
import './ConnectWallet.css';

const ConnectWallet = () => {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const isWrongNetwork = isConnected && chainId !== expectedChainId;

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = () => {
    // Essayer de se connecter avec le premier connecteur disponible (MetaMask ou Injected)
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  return (
    <div className="connect-wallet">
      {!isConnected ? (
        <button 
          onClick={handleConnect} 
          disabled={isPending}
          className="connect-button"
        >
          {isPending ? `⏳ ${t('common.loading')}` : `🔗 ${t('wallet.connect')}`}
        </button>
      ) : (
        <div className="wallet-connected">
          {isWrongNetwork && (
            <div className="network-warning">
              {t('wallet.wrongNetwork')} - {expectedChainName}
            </div>
          )}
          <div className="wallet-info">
            <span className="wallet-address" title={address}>
              {formatAddress(address)}
            </span>
            <span className="wallet-network">
              {isWrongNetwork ? '❌' : '✅'} Chain {chainId}
            </span>
            <button 
              onClick={() => disconnect()} 
              className="disconnect-button"
              title={t('wallet.disconnect')}
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
