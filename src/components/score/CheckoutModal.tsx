import Modal from 'antd/lib/modal/Modal';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { IScoreResponse, useScoreContext } from '@scorebox/src/context';
import CloseIcon from '@scorebox/src/components/CloseIcon';
import { DownloadOutlined } from '@ant-design/icons';
import Button, { BUTTON_STYLES } from '@scorebox/src/components/Button';
import { LoadingContainer } from '@scorebox/src/components/LoadingContainer';
import { storageHelper } from '@scorebox/src/context';
import getConfig from '@scorebox/src/utils/config';
import StoreScoreAbi from '@scorebox/src/contracts/abis/StoreScore.json';
import { notification } from 'antd';

export default function CheckoutModal({ setCheckoutModal }: any) {
  const {
    connection,
    wallet,
    account,
    scoreResponse,
    loading,
    setLoading,
    scoreContract,
    handleSetChainActivity,
    chainActivity,
  } = useScoreContext();

  const [addEncryption, setAddEncryption] = useState(true);
  const [permitName, setPermitName] = useState('');
  const [success, setSuccess] = useState(false);
  const [txnHash, setTxnHash] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState(null);

  const STORE_SCORE_PRICE = 1.0;
  const ENCRYPTION_PRICE = 0.5;
  const TOTAL_AMOUNT = addEncryption
    ? STORE_SCORE_PRICE + ENCRYPTION_PRICE
    : STORE_SCORE_PRICE;

  const config = getConfig(process.env.ENV_CONFIG as string);
  const router = useRouter();

  useEffect(() => {
    if (router.query.transactionHashes) {
      setSuccess(true);
      setTxnHash(router.query.transactionHashes);
      setDecryptionKey(storageHelper.get('decryption-key'));
      setPermitName(storageHelper.get('permit-name'));
    }
  }, []);

  const renderProvider = (scoreResponse: IScoreResponse) => {
    if (scoreResponse?.endpoint.includes('polygon')) {
      return 'Polygon';
    } else return 'Ethereum';
  };

  const handleNear = async () => {
    try {
      // 1. hitting the encrypt endpoint && save the score locally on our database
      const backend_response = await fetch(
        `${process.env.BACKEND_BASE_URL}/cryptography/encrypt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet_address: account,
            score_response: scoreResponse,
            blockchain: 'near',
            is_encrypt: addEncryption ? true : false,
            permit_name: addEncryption && permitName,
          }),
        }
      );
      setLoading(true);
      const encryptResponse = await backend_response.json();

      console.log(encryptResponse);

      // 2. temporaily storing on the localStorage
      storageHelper.persist('decryption-key', encryptResponse.decryption_key);
      storageHelper.persist('permit-name', permitName);

      handleSetChainActivity({
        scoreSubmitted: true,
        dataProvider: encryptResponse.oracle,
        scoreAmount: encryptResponse.score_int,
        scoreMessage: encryptResponse.score_blurb,
        timestamp: encryptResponse.timestamp,
        blockchain: encryptResponse.blockchain,
        isEncrypted: addEncryption,
      });

      // @TODO: pass the right amount in yoctoNEAR
      await scoreContract?.upload_score({
        callbackUrl: `${process.env.NEXT_BASE_URL}/applicant/score`,
        args: {
          score: encryptResponse.score_int,
          timestamp: encryptResponse.timestamp,
          oracle: encryptResponse.oracle,
          description: encryptResponse.score_blurb,
          beneficiary: process.env.CONTRACT_OWNER_ID as string,
          amount: 1000000000000,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handlePolygon = async () => {
    try {
      // 1. hitting the encrypt endpoint && save the score locally on our database
      const backend_response = await fetch(
        `${process.env.BACKEND_BASE_URL}/cryptography/encrypt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet_address: account,
            score_response: scoreResponse,
            blockchain: connection === 'NEAR' ? 'near' : 'polygon',
            is_encrypt: addEncryption ? true : false,
            permit_name: addEncryption && permitName,
          }),
        }
      );
      setLoading(true);
      const encryptResponse = await backend_response.json();
      setDecryptionKey(encryptResponse.decryption_key);

      // 2. save the score on the blockchain (upload)

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );

      const signer = provider.getSigner();

      const scoreContract = new ethers.Contract(
        process.env.POLYGON_SCORE_CONTRACT_ADDRESS as string,
        StoreScoreAbi,
        signer
      );

      // @TODO: pass the right amount in wei
      const uploadScoreTx = await scoreContract.uploadScore(
        encryptResponse.score_int,
        encryptResponse.score_blurb,
        process.env.POLYGON_SCORE_BENEFICIARY_ADDRESS,
        8,
        { value: 8 }
      );

      await uploadScoreTx.wait();
      setTxnHash(uploadScoreTx.hash);

      handleSetChainActivity({
        scoreSubmitted: true,
        dataProvider: encryptResponse.oracle,
        scoreAmount: encryptResponse.score_int,
        scoreMessage: encryptResponse.score_blurb,
        timestamp: encryptResponse.timestamp,
        blockchain: encryptResponse.blockchain,
        txnHash: txnHash,
        isEncrypted: addEncryption,
      });

      setLoading(false);
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setLoading(false);
      notification.error({
        message: 'Error saving your score on the blockchain. Plasea try again.',
      });
    }
  };

  const handleCloseModal = () => {
    if (connection === 'NEAR') {
      setCheckoutModal(false);
      router.replace('/applicant/score');
      storageHelper.persist('permit-name', null);
      storageHelper.persist('decryption-key', null);
    }
    setCheckoutModal(false);
  };

  return (
    <Modal
      width={700}
      footer={null}
      open={true}
      centered
      closable={true}
      closeIcon={<CloseIcon />}
      onCancel={() => handleCloseModal()}
      bodyStyle={{ padding: '4rem' }}
      maskClosable={false}
    >
      {loading && <LoadingContainer text='Loading..' />}
      {!loading && !success && (
        <div>
          <h2 className='text-scorebox-blue text-xl font-semibold tracking-tight text-center'>
            Checkout
          </h2>
          <p className='text-gray-600 trakcing-tight font-light text-center leading-`14'>
            Your score will be stored on{' '}
            <span className='text-black font-semibold tracking-tight'>
              {connection === 'NEAR' ? 'NEAR' : 'Polygon'}
            </span>{' '}
            <br />
            and your credit profile will be updated for{' '}
            <span className='text-black font-semibold tracking-tight'>
              {renderProvider(scoreResponse)}
            </span>
          </p>

          <h2 className='text-lg font-semibold tracking-tight'>Fees</h2>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='font-bold text-md m-0 tracking-tight'>
                Store score onchain
              </h3>
              <p className='text-gray-600'>
                Your score will be publicly available and your profile will be
                updated.
              </p>
            </div>
            <div>
              <p className='text-lg font-semibold text-gray-500 m-0'>
                {loading ? 'loading..' : STORE_SCORE_PRICE}{' '}
                {connection === 'NEAR' ? 'NEAR' : 'MATIC'}
              </p>
              <p className='text-xs text-right tracking-tight text-gray-500'>
                (≈$2.5 USD)
              </p>
            </div>
          </div>

          {addEncryption && (
            <>
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='font-bold text-md m-0 tracking-tight'>
                    Encrypt score
                  </h3>
                  <p className='text-gray-600'>
                    Your score will only be privately accessible via a viewing
                    permit.
                  </p>
                </div>

                <div>
                  <p className='text-lg font-semibold text-gray-500 m-0'>
                    {loading ? 'loaing..' : ENCRYPTION_PRICE}{' '}
                    {connection === 'NEAR' ? 'NEAR' : 'MATIC'}
                  </p>
                  <p className='text-xs text-right tracking-tight text-gray-500'>
                    (≈$0.5 USD)
                  </p>
                </div>
              </div>
              <div className='flex flex-col mb-2'>
                <label className='text-xs tracking-tight my-1 text-gray-500'>
                  Enter your permit name (should be under 16 characters)
                </label>
                <input
                  type='text'
                  className='border border-gray-300 rounded-sm p-1 text-xs'
                  placeholder='Permit Name'
                  maxLength={16}
                  onChange={(e) => {
                    setPermitName(e.target.value);
                  }}
                ></input>
              </div>
            </>
          )}

          <div className='flex '>
            <br />
            <input
              className='mr-2'
              type='checkbox'
              onChange={(e) => setAddEncryption(!e.target.checked)}
            ></input>
            <label className='tracking-tight  text-gray-500'>
              {' '}
              I don’t want to encrypt my score.
            </label>
          </div>

          <div className='flex justify-between mt-5'>
            <div className='text-xl font-semibold text-gray-500'> TOTAL</div>
            <div className='text-xl font-semibold text-gray-500'>
              {' '}
              {TOTAL_AMOUNT} {connection === 'NEAR' ? 'NEAR' : 'MATIC'}
            </div>
          </div>

          <div className='flex mt-5 justify-end items-center'>
            <Button text='Cancel' style={BUTTON_STYLES.LINK} />
            <Button
              text='Confirm'
              isDisabled={addEncryption && permitName.length === 0 && true}
              onClick={connection === 'NEAR' ? handleNear : handlePolygon}
            />
          </div>
        </div>
      )}
      {!loading && success && (
        <div className='flex flex-col items-center'>
          <img src='/images/check.png' alt='check-mark' className='w-14 mb-2' />
          <h2 className='text-2xl font-semibold tracking-tight text-center m-0'>
            Score Saved!
          </h2>
          <p className='tracking-tight text-scorebox-lightgray text-center leading-4 my-4'>
            Your score has successfully been{' '}
            {chainActivity.isEncrypted && 'encrypted and'} saved on the
            blockchain.<br></br>{' '}
            {chainActivity.isEncrypted &&
              'Please keep the information below safe.'}
          </p>
          {chainActivity.isEncrypted && (
            <>
              <div className='bg-gray-100 py-4 px-6 rounded w-full'>
                <div className='tracking-tight font-normal text-scorebox-lightgray mb-2'>
                  Your decryption key:
                  <div className='text-black font-medium'>{decryptionKey}</div>
                </div>

                <div className='tracking-tight font-normal text-scorebox-lightgray mb-2'>
                  Your permit name:
                  <div className='text-black font-medium'>{permitName}</div>
                </div>
                <div className='tracking-tight font-normal text-scorebox-lightgray'>
                  Timestamp:
                  <div className='text-black font-medium'>
                    {chainActivity.timestamp}
                  </div>
                </div>
                <div
                  className='text-xs font-bold underline flex items-center mt-3 cursor-pointer hover:text-scorebox-lightgray'
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob(
                      [
                        JSON.stringify({
                          decryptionKey: decryptionKey,
                          permit_name: permitName,
                          timestamp: chainActivity.timestamp,
                        }),
                      ],
                      {
                        type: 'text/plain',
                      }
                    );
                    element.href = URL.createObjectURL(file);
                    element.download = 'scorebox_decryption_info.txt';
                    document.body.appendChild(element); // Required for this to work in FireFox
                    element.click();
                    document.body.removeChild(element);
                  }}
                >
                  <DownloadOutlined style={{ marginRight: '0.2rem' }} />
                  Download as a .txt file
                </div>
              </div>
            </>
          )}

          <div className='underline my-3'>
            <a
              href={`${
                connection === 'NEAR'
                  ? `${config.explorerUrl}/transactions/${txnHash}`
                  : `${process.env.POLYGONSCAN_URL}/tx/${txnHash}`
              }`}
              target='_blank'
              rel='noreferrer'
            >
              {' '}
              Check your transaction on{' '}
              {connection === 'NEAR' ? 'NEAR Explorer' : 'Polygonscan'}
            </a>
          </div>
          <div className='flex items-center font-semibold tracking-tight border px-4 rounded-2xl cursor-pointer hover:bg-gray-100'>
            <img
              src='/images/push-org-logo.svg'
              alt='push-notifications'
              className='w-10'
            />
            Opt In for Push notifications
          </div>
        </div>
      )}
    </Modal>
  );
}
