import Modal from 'antd/lib/modal/Modal';
import { useState } from 'react';
import { useScoreContext } from '@scorebox/src/context';
import CloseIcon from '@scorebox/src/components/CloseIcon';
import Button, { BUTTON_STYLES } from '@scorebox/src/components/Button';
import { LoadingContainer } from '@scorebox/src/components/LoadingContainer';

export default function CheckoutModal({ setCheckoutModal }) {
  const { connection, wallet, account, scoreResponse, loading, setLoading } =
    useScoreContext();
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
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
