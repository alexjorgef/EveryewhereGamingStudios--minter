import { useRouter } from 'next/router';
import React,
{
  useEffect,
  useState
} from 'react';
import { useMoralis } from 'react-moralis';
import Moralis from 'moralis';
import Web3 from 'web3';
import {
  contractABI,
  contractAddress,
  FactoryAddress,
  MasterWalletAddress
} from '../../contract';
import styles from '../../styles/Minter.module.css';
import classnames from 'classnames/bind';
import {
  inputSubmit,
  inputText,
  inputFiles,
  inputName,
  inputDescription,
  inputNumber,
  inputCollectionName,
  inputSupply,
  inputTokenId
} from '../../utils/input'
import { logo } from '../../utils/logos'
import HooverSpringer from '../../components/HooverSpringer';

import Collection_Minter1155_V1 from '../../../abi/Collection_Minter1155_V2.json';
import Minter1155_V1 from '../../../abi/minter1155_V2.json';

// global variables
const cx = classnames.bind(styles);

// initialize web3 package with Metamask
const web3 = new Web3(Web3.givenProvider); // new Web3('http://127.0.0.1:7545'); // Web3.givenProvider

// minter function
const Minter: React.FC = (): JSX.Element => {

  // variables to check if user is authenticated
  const {
    isAuthenticated,
    logout,
    user
  } = useMoralis();
  const router = useRouter();

  // variables to set state for the form to submit
  const [collectionName, setCollectionName] = useState<string>('Cosmic Exodus: Withstand Kairos Test');
  const [name, setName] = useState<string>('Welcome Badge');
  const [qty, setQty] = useState<number>(10000000000);
  const [tokenId, setTokenId] = useState<number>(0);
  const [description, setDescription] = useState<string>('Thank you for playing our game!');
  const [file, setFile] = useState<any>(null);

  // authentication to check if user is authenticated or not
  useEffect(() => {
    if (!isAuthenticated)
      router.push('/');
  }, [isAuthenticated]);

  // on submit function
  const onSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    console.log('file', file);
    try {

      // const Collection_Minter1155_V1Contract = new web3.eth.Contract(Collection_Minter1155_V1 as any, FactoryAddress);

      // const getFactoryAddressTx = await Collection_Minter1155_V1Contract.methods.getFactoryAddress().call({ from: MasterWalletAddress});

      // console.log('getFactoryAddressTx', getFactoryAddressTx);
      
      // if(parseInt(getFactoryAddressTx, 16) === 0) {
      //   const SetFactoryTx = await Collection_Minter1155_V1Contract.methods.setFactory(contractAddress).send({ from: MasterWalletAddress});
      //   console.log('SetFactoryTx', SetFactoryTx);
      // }

      // //const r = await _Everywhere_TowerDefense_Collection_Minter1155_V1Contract.methods.create(collectionName, "tcxxxx").call();
      // let MinterAddress = await Collection_Minter1155_V1Contract.methods.checkCollection(collectionName).call({ from: MasterWalletAddress});

      // console.log('MinterAddress call', MinterAddress);

      // if(parseInt(MinterAddress, 16) ===  0) {
      //   MinterAddress = await Collection_Minter1155_V1Contract.methods.createMinter(collectionName, 'CEWKtx').send({ from: MasterWalletAddress});
      // }

      // console.log('MinterAddress send', MinterAddress);
      // return;

      const MinterAddress = contractAddress;

      // save image to IPFS
      const fileToIpfs = new Moralis.File(
        file.name,
        file);
      await fileToIpfs.saveIPFS();
      const fileToIpfsurl = fileToIpfs.ipfs();

      // generate metadata and save to ipfs
      const metadata = {
        name,
        description,
        properties: {
          Collection: collectionName,
          TotalSupply: qty,
          tokenId,
        },
        image: fileToIpfsurl,
      };

      const regexp = /[^0-9a-z\-\_]/ig;
      const finalCollectionName = collectionName.replaceAll(regexp, '_');
      const finalName = name.replaceAll(regexp, '_');

      console.log(finalCollectionName);
      console.log(finalName);

      const fileToUpload = new Moralis.File(`${finalCollectionName}_${finalName}_metadata.json`, {
        base64: Buffer.from(JSON.stringify(metadata)).toString('base64'),
      });
      await fileToUpload.saveIPFS();
      const metadataurl = fileToUpload.ipfs();

      // interact with smart contract
      const contract = new web3.eth.Contract(
        Minter1155_V1 as any, 
        MinterAddress
      );
      const response = await contract.methods
        .mint(metadataurl, tokenId, qty)
        .send({ from: MasterWalletAddress }); // user?.get('ethAddress')

        console.log('response', response);

      // const _tokenId = response.events.Transfer.returnValues.tokenId;
      // console.log('_tokenId', _tokenId);
      // alert(
      //   `New NFT minted under contract ${contractAddress}`
      // );
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }
  };

  return (
    <div className={styles.container}>
      <HooverSpringer />
      <form
        className={styles.form}
        onSubmit={onSubmit}>
        <img
          src={logo}
          className={styles.logo} />

        <div className={cx(
          styles.inputContainer,
          styles.mt1
        )}>
          <input
            type={inputText}
            className={styles.input}
            placeholder={inputCollectionName}
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
        </div>
        <div className={cx(
          styles.inputContainer,
          styles.mt1
        )}>
          <input
            type={inputText}
            className={styles.input}
            placeholder={inputName}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={cx(
          styles.inputContainer,
          styles.mt1
        )}>
          <input
            type={inputNumber}
            className={styles.input}
            placeholder={inputTokenId}
            value={tokenId}
            onChange={(e) => setTokenId(parseInt(e.target.value, 10))}
          />
        </div>
        <div className={cx(
          styles.inputContainer,
          styles.mt1
        )}>
          <input
            type={inputNumber}
            className={styles.input}
            placeholder={inputSupply}
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value, 10))}
          />
        </div>
        <div className={cx(
          styles.inputContainer,
          styles.mt1
        )}>
          <input
            type={inputText}
            className={styles.input}
            placeholder={inputDescription}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={cx(
          styles.inputContainer,
          styles.mt1
        )}>
          <input
            type={inputFiles}
            className={styles.input}
            onChange={(e: any) => setFile(e.target.files[0])}
          />
        </div>
        <button
          type={inputSubmit}
          className={cx(
            styles.actionBtn,
            styles.mt1
          )}
        >
          Mint
        </button>
        <button
          onClick={logout}
          className={cx(
            styles.actionBtnSecondary,
            styles.mt1
          )}
        >
          Logout
        </button>
      </form>
    </div>
  );
}

export default Minter;
