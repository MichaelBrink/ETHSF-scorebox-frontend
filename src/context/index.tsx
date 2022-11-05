import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from 'react';
import { ethers } from 'ethers';
import { notification } from 'antd';

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
  account: null,
  connection: null,
  isConnected: false,
  loading: true,
};

function contextReducer(state: any, action: any) {
  switch (action.type) {
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

    default:
      return state;
  }
}

const ContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(contextReducer, initialState);

  const handlers = useMemo(() => {
    return {
      setConnection: (connection: string) =>
        dispatch({ type: 'SET_CONNECTION', payload: connection }),
      setAccount: (account: string) =>
        dispatch({ type: 'SET_ACCOUNT', payload: account }),
      setIsConnected: (isConnected: boolean) =>
        dispatch({ type: 'SET_IS_CONNECTED', payload: isConnected }),
      setLoading: (loading: boolean) =>
        dispatch({ type: 'SET_LOADING', payload: loading }),
    };
  }, []);

  const { setAccount, setConnection, setIsConnected, setLoading } = handlers;

  const { wallet, account, connection, isConnected, loading } = state;

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

  useEffect(() => {
    storageHelper.persist('connection', connection);
    storageHelper.persist('account', account);
  }, [connection, account, loading]);

  useEffect(() => {
    setAccount(storageHelper.get('account'));
    setConnection(storageHelper.get('connection'));
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
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { useScoreContext, ContextProvider };
