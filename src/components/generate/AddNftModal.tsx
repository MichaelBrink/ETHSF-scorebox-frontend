import { Modal } from 'antd';
import { storageHelper, useScoreContext } from '@scorebox/src/context';
import Button, { BUTTON_STYLES } from '@scorebox/src/components/Button';

const AddNftModal = ({
  router,
  addNftModal,
  setAddNftModal,
  setStartCovalent,
  setStartPolygon,
  polygonSelected,
}: any) => {
  const { account } = useScoreContext();

  const getNftInfo = async () => {
    try {
      const backend_response = await fetch(
        `${process.env.BACKEND_BASE_URL}/opensea/getnft`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: account,
            API_token: '',
          }),
        }
      );
      const nftDataResponse = await backend_response.json();
      storageHelper.persist('nftData', nftDataResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetNft = async () => {
    await getNftInfo();
    router.replace('/applicant/nft');
  };

  return (
    <Modal
      footer={null}
      centered
      closable={true}
      onCancel={() => setAddNftModal(false)}
      open={addNftModal}
    >
      <div className='h-52 w-full flex justify-center items-center flex-col font-sans z-10 px-5'>
        <h2 className='text-xl font-semibold tracking-tight text-center'>
          Add NFT assets to your score?
        </h2>

        <div className='w-full justify-center flex mt-3 mb-5'>
          <img width={'30%'} src={`/images/opensea-logo.png`} />
        </div>
        <p className='tracking-tight text-center text-scorebox-lightgray'>
          (Only NFTs from credible collections listed on OpenSea will be
          considered in your portfolio calculation.){' '}
        </p>
      </div>
      <div className='flex flex-col w-full justify-center items-center font-sans mb-3'>
        <div className='w-max'>
          <Button
            onClick={() => handleGetNft()}
            text='Evaluate my NFT assets'
            style={BUTTON_STYLES.DEFAULT}
          />
        </div>
        <div className='w-max mt-3'>
          <Button
            onClick={() => {
              polygonSelected ? setStartPolygon() : setStartCovalent();
            }}
            text='Calculate score without NFT assets'
            style={BUTTON_STYLES.LINK}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddNftModal;
