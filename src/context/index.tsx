import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from 'react';
import { connect, WalletConnection, Contract } from 'near-api-js';
import { ethers } from 'ethers';
import { notification } from 'antd';
import getConfig from '@scorebox/src/utils/config';
import { useRouter } from 'next/router';

export enum CHAIN_ACTIVITIES {
  scoreSubmitted = 'scoreSubmitted',
  dataProvider = 'dataProvider',
  scoreAmount = 'scoreAmount',
  scoreMessage = 'scoreMessage',
  timestamp = 'timestamp',
  blockchain = 'blockchain',
  txnHash = 'txnHash',
}

export type Set_Score_Response = (scoreResponse: IScoreResponse | null) => void;
export interface IScoreResponse {
  endpoint: string;
  message: string;
  score: number;
}

export interface IChainActivity {
  [CHAIN_ACTIVITIES.scoreSubmitted]?: boolean;
  [CHAIN_ACTIVITIES.dataProvider]?: 'Coinbase' | 'Covalent';
  [CHAIN_ACTIVITIES.scoreAmount]?: number;
  [CHAIN_ACTIVITIES.scoreMessage]?: string;
  [CHAIN_ACTIVITIES.timestamp]?: number;
  [CHAIN_ACTIVITIES.blockchain]?: boolean;
  [CHAIN_ACTIVITIES.txnHash]?: string;
}

export const CHAIN_ACTIVITIES_INIT = {
  scoreSubmitted: undefined,
  dataProvider: undefined,
  scoreAmount: undefined,
  scoreMessage: undefined,
  timestamp: undefined,
  blockchain: undefined,
  txnHash: undefined,
};

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
  scoreContract: null,
  chainActivity: CHAIN_ACTIVITIES_INIT,
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
    case 'SET_SCORE_CONTRACT':
      return {
        ...state,
        scoreContract: action.payload,
      };
    case 'SET_CHAIN_ACTIVITY':
      return {
        ...state,
        chainActivity: action.payload,
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
      setScoreContract: (contract: Contract | null) =>
        dispatch({ type: 'SET_SCORE_CONTRACT', payload: contract }),
      setChainActivity: (chainActivity: IChainActivity) =>
        dispatch({ type: 'SET_CHAIN_ACTIVITY', payload: chainActivity }),
    };
  }, []);

  const {
    setWallet,
    setAccount,
    setConnection,
    setIsConnected,
    setLoading,
    setScoreResponse,
    setScoreContract,
    setChainActivity,
  } = handlers;

  const {
    wallet,
    account,
    connection,
    isConnected,
    loading,
    scoreResponse,
    scoreContract,
    chainActivity,
  } = state;

  useEffect(() => {
    const networkId = process.env.ENV_CONFIG as string;

    const initNear = async () => {
      const config = getConfig(networkId);
      // Initialize connection to the network (testnet/mainnet)
      const nearConnection = await connect(config);
      // Initializing wallet based account.
      const nearWallet = new WalletConnection(nearConnection, 'score-box');
      setWallet(nearWallet);

      const scoreContract = new Contract(
        nearWallet.account(),
        process.env.SCORE_CONTRACT_NAME as string,
        {
          viewMethods: ['get_scores'],
          changeMethods: ['upload_score'],
        }
      );
      setScoreContract(scoreContract);
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
    wallet?.requestSignIn({
      contractId: process.env.SCORE_CONTRACT_NAME as string,
    });
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

  // Redirect users to the homepage when logged out
  useEffect(() => {
    const returnHome = () => {
      if (typeof window !== 'undefined') {
        (router.pathname.includes('start') ||
          router.pathname.includes('applicant') ||
          router.pathname.includes('provider')) &&
          router.push('/');
      }
    };
    if (!loading) {
      !connection && returnHome();
    }
  }, [router, isConnected, loading, connection]);

  useEffect(() => {
    if (!loading) {
      storageHelper.persist('connection', connection);
      storageHelper.persist('account', account);
      storageHelper.persist('scoreResponse', scoreResponse);
      //   storageHelper.persist('chainActivity', chainActivity);
    }
  }, [connection, account, loading, scoreResponse, chainActivity]);

  useEffect(() => {
    setAccount(storageHelper.get('account'));
    setConnection(storageHelper.get('connection'));
    setScoreResponse(storageHelper.get('scoreResponse'));
    setChainActivity(storageHelper.get('chainActivity'));
    setLoading(false);
  }, []);

  const handleSetChainActivity = (val: IChainActivity | null) => {
    if (val) {
      setChainActivity({ ...chainActivity, ...val });
      storageHelper.persist('chainActivity', val);
    } else {
      setChainActivity(CHAIN_ACTIVITIES_INIT);
      storageHelper.persist('chainActivity', CHAIN_ACTIVITIES_INIT);
    }
  };

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
        scoreContract,
        handleSetChainActivity,
        chainActivity,
        setChainActivity,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { useScoreContext, ContextProvider };
