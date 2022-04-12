import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'
import '../styles/globals.css'

const activateChainId = ChainId.Rinkeby;

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider desiredChainId={activateChainId}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp
