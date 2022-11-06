import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from 'react';
import { connect, WalletConnection } from 'near-api-js';
import { ethers } from 'ethers';
import { notification } from 'antd';
import getConfig from '@scorebox/src/utils/config';
import { useRouter } from 'next/router';

export type Set_Score_Response = (scoreResponse: IScoreResponse | null) => void;
export interface IScoreResponse {
  endpoint: string;
  message: string;
  score: number;
}

export const storageHelper = {
  persist: (key: string, item: any) =>
    localStorage.setItem(key, JSON.stringify(item)),
  get: (key: string) => {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  },
};

export const Context = createContext(undefined);

const useScoreContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useScoreContext must be used within a Context Provider');
  }
  return context;
};

const initialState = {
  wallet: null,
  account: null,
  connection: null,
  isConnected: false,
  loading: true,
  scoreResponse: null,
};

function contextReducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_WALLET':
      return {
        ...state,
        wallet: action.payload,
      };
    case 'SET_ACCOUNT':
      return {
        ...state,
        account: action.payload,
      };
    case 'SET_CONNECTION':
      return {
        ...state,
        connection: action.payload,
      };
    case 'SET_IS_CONNECTED':
      return {
        ...state,
        isConnected: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_SCORE_RESPONSE':
      return {
        ...state,
        scoreResponse: action.payload,
      };

    default:
      return state;
  }
}

const ContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(contextReducer, initialState);

  const handlers = useMemo(() => {
    return {
      setWallet: (wallet) => dispatch({ type: 'SET_WALLET', payload: wallet }),
      setConnection: (connection: string | null) =>
        dispatch({ type: 'SET_CONNECTION', payload: connection }),
      setAccount: (account: string | null) =>
        dispatch({ type: 'SET_ACCOUNT', payload: account }),
      setIsConnected: (isConnected: boolean) =>
        dispatch({ type: 'SET_IS_CONNECTED', payload: isConnected }),
      setLoading: (loading: boolean) =>
        dispatch({ type: 'SET_LOADING', payload: loading }),
      setScoreResponse: (scoreResponse: IScoreResponse | null) =>
        dispatch({ type: 'SET_SCORE_RESPONSE', payload: scoreResponse }),
    };
  }, []);

  const {
    setWallet,
    setAccount,
    setConnection,
    setIsConnected,
    setLoading,
    setScoreResponse,
  } = handlers;

  const { wallet, account, connection, isConnected, loading, scoreResponse } =
    state;

  useEffect(() => {
    const networkId = process.env.ENV_CONFIG as string;

    const initNear = async () => {
      const config = getConfig(networkId);
      // Initialize connection to the network (testnet/mainnet)
      const nearConnection = await connect(config);
      // Initializing wallet based account.
      const nearWallet = new WalletConnection(nearConnection, 'score-box');
      setWallet(nearWallet);
    };
    initNear();
  }, []);

  // connecting to metamask
  const handleMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider: any = new ethers.providers.Web3Provider(window.ethereum);

      try {
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
        setConnection('MetaMask');
        setIsConnected(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      notification.error({ message: 'Please install MetaMask!' });
    }
  };

  // connecting to NEAR Wallet
  const handleNearSignIn = async () => {
    wallet?.requestSignIn({ contractId: 'scorev1.scorebox.testnet' });
  };

  // sign the user out
  const handleSignOut = () => {
    {
      connection === 'NEAR' && wallet?.signOut();
    }
    setAccount(null);
    setConnection(null);
    setIsConnected(false);
    setScoreResponse(null);
    localStorage.clear();
    notification.success({
      message: 'Successfully disconnected wallet',
    });
  };

  const router = useRouter();
  const accountIdQuery = router.query.account_id;

  // Set to connection when successfully connected to NEAR wallet
  useEffect(() => {
    if (accountIdQuery) {
      setAccount(wallet?.getAccountId());
      setIsConnected(true);
      setConnection('NEAR');
      storageHelper.persist('connection', 'NEAR');
      notification.success({ message: 'Successfully connected wallet!' });
      router.replace('/');
    }
  }, [router]);

  // Keeping the states on page reload

  useEffect(() => {
    connection && setIsConnected(true);
  }, [connection]);

  useEffect(() => {
    if (!loading) {
      storageHelper.persist('connection', connection);
      storageHelper.persist('account', account);
      storageHelper.persist('scoreResponse', scoreResponse);
    }
  }, [connection, account, loading, scoreResponse]);

  useEffect(() => {
    setAccount(storageHelper.get('account'));
    setConnection(storageHelper.get('connection'));
    setScoreResponse(storageHelper.get('scoreResponse'));
    setLoading(false);
  }, []);

  return (
    <Context.Provider
      value={{
        loading,
        setLoading,
        wallet,
        account,
        connection,
        isConnected,
        handleMetaMask,
        handleNearSignIn,
        handleSignOut,
        scoreResponse,
        setScoreResponse,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { useScoreContext, ContextProvider };
