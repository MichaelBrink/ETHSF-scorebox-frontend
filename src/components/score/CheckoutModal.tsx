import Modal from 'antd/lib/modal/Modal';
import { useState } from 'react';
import { useScoreContext } from '@scorebox/src/context';
import CloseIcon from '@scorebox/src/components/CloseIcon';
import Button, { BUTTON_STYLES } from '@scorebox/src/components/Button';
import { LoadingContainer } from '@scorebox/src/components/LoadingContainer';
import { storageHelper } from '@scorebox/src/context';

export default function CheckoutModal({ setCheckoutModal }) {
  const {
    connection,
    wallet,
    account,
    scoreResponse,
    loading,
    setLoading,
    scoreContract,
    handleSetChainActivity,
  } = useScoreContext();

  const [addEncryption, setAddEncryption] = useState(true);
  const [permitName, setPermitName] = useState('');
  const [success, setSuccess] = useState(false);
  const [decryptionKey, setDecryptionKey] = useState(null);

  const STORE_SCORE_PRICE = 1.0;
  const ENCRYPTION_PRICE = 0.5;
  const TOTAL_AMOUNT = addEncryption
    ? STORE_SCORE_PRICE + ENCRYPTION_PRICE
    : STORE_SCORE_PRICE;

  const renderProvider = (scoreResponse) => {
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
  return (
    <Modal
      width={700}
      footer={null}
      open={true}
      centered
      closable={true}
      closeIcon={<CloseIcon />}
      onCancel={() => setCheckoutModal(false)}
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
              onClick={handleNear}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
