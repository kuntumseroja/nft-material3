import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import LinkIcon from '@mui/icons-material/Link';
import Link from '@mui/material/Link';
import Papa from "papaparse";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CsvViewer from 'components/Csv-Viewer';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Paper } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {
  TextField,
  Snackbar,
  CircularProgress, 
  IconButton,
  Collapse,
  Alert,
  Divider,
} from '@mui/material';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import Material from 'contracts/Material.sol/Material.json';
import { Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
// import TextField from '@material-ui/core/TextField';

// const [openModal1, setOpenModal1] = useState(false);
// const handleClickOpen = async (item.address) => {
//   setSelectedHash(item.address);
//   const response = {item.address};
//   const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });
//   setCsvData(parsedData.data);
//   setOpenModal1(true);
// };
const fieldLabels = {
  mtdomain: 'Material Domain',
  mtgroup: 'Material Group',
  mtclass1: 'Material Class 1',
  mtclass2: 'Material Class 2',
  mtclass3: 'Material Class 3',
  grade: 'Material Grade',
  mtlot: 'Material Lot',
  mtspecimen: 'Material Specimen'
};

// Function to create a nested display
// const createNestedDisplay = (item, key, level = 0) => {
//   return (
//     <Box sx={{ marginLeft: `${level * 8}px` }} key={key}>
//       <Typography variant="caption" color="text.secondary">
//         {`${fieldLabels[key]}: ${item[key]}`}
//       </Typography>
//       {level < Object.keys(fieldLabels).length - 1 && createNestedDisplay(item, Object.keys(fieldLabels)[level + 1], level + 1)}
//     </Box>
//   );
// };

// new hirarki
const createNestedDisplay = (item, key, level = 0) => {
  return (
    <Box sx={{ ml: `${level * 2}em`, my: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }} key={key}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {level === 0 ? <FolderOpenIcon sx={{ color: 'primary.main', mr: 1 }} /> : <FolderIcon sx={{ color: 'grey.500', mr: 1 }} />}
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          {`${fieldLabels[key]}:`}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ ml: 4 }}>
        {item[key]}
      </Typography>
      {level < Object.keys(fieldLabels).length - 1 && createNestedDisplay(item, Object.keys(fieldLabels)[level + 1], level + 1)}
    </Box>
  );
};

// const headers = csvData.length > 0 ? Object.keys(csvData[0]) : [];
const PortfolioGrid = ({ data = [], dataCsv = [], buttonShow, buttonAsset }) => {
  const theme = useTheme();
  const [snackbarOpen1, setSnackbarOpen1] = useState(false);
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    setLoading(true);
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
      process.env.MARKETPLACE_ADDRESS,
      Material.abi,
      signer,
    );
    /* user will be prompted to pay the asking price to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    const transaction = await marketContract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    handleSnackbarOpen1(); 
    setLoading(false);
    // window.location.reload();


    // await loadNFTs();
    // await parse1();

  }
  const [openResellDialog, setOpenResellDialog] = useState(false);
  const [resellPrice, setResellPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tokenId, setTokenId] = useState(null);
  const [hash, setHash] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [nftName, setNftName] = useState('');
  const [loading, setLoading] = useState(false);

  // let tokenId;
  const handleResell = async () => {
    try {
      setLoading(true);
      const web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const marketContract = new ethers.Contract(
        process.env.MARKETPLACE_ADDRESS,
        Material.abi,
        signer,
      );

      // let listingPrice = await marketContract.getListingPrice(tokenId);
      // console.log('listingPrice:', listingPrice);  


      let listingPrice = await marketContract.getListingPrice();
      listingPrice = listingPrice.toString();

      console.log('resellPrice:', resellPrice);  

      // const resellPriceWei = ethers.utils.parseEther(resellPrice);
      // const transaction = await marketContract.resellToken(tokenId, resellPriceWei);
      const resellPriceWei = ethers.utils.parseEther(resellPrice.toString()); // Convert the resellPrice to a BigNumber
      console.log('resellPriceWei:', resellPriceWei);  
      let price = listingPrice;
      // const transaction1 = await marketContract.resellToken(tokenId, resellPriceWei); // Pass the BigNumber value to the function
      let transaction1 = await marketContract.resellToken(tokenId, price, {
        value: price,
      });
      await transaction1.wait();
      setLoading(false);
      setHash(transaction1.hash);
      setOpen(false);
      setSuccessMessage(`Material successfully listed for ${resellPrice} with hash ${hash}`);
      setDialogBoxOpen(false);
      setOpenResellDialog(false);
      handleSnackbarOpen(); 
      // window.location.reload();
    } catch (error) {
      setErrorMessage('Error in creating NFT! Please try again.');
      console.error(error);
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    window.location.reload();
  };

  const handleSnackbarClose1 = () => {
    setSnackbarOpen1(false);
    window.location.reload();
  };

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarOpen1 = () => {
    setSnackbarOpen1(true);
  };

  
  // setTimeout(() => {
  //   window.location.reload();
  // }, 10000);

  // async function parse1() {
  //   // State to store parsed data
  //   const [parsedData, setParsedData] = useState([]);
  
  //   //State to store table Column name
  //   const [tableRows, setTableRows] = useState([]);
  
  //   //State to store the values
  //   const [values, setValues] = useState([]);

  //     // Passing file data (event.target.files[0]) to parse using Papa.parse
  //     Papa.parse(item.address, {
  //       download: true,
  //       delimiter: ";",
  //       header: true,
  //       skipEmptyLines: true,
  //       complete: function (results) {
  //         const rowsArray = [];
  //         const valuesArray = [];
  
  //         // Iterating data to get column name and their values
  //         results.data.map((d) => {
  //           rowsArray.push(Object.keys(d));
  //           valuesArray.push(Object.values(d));
  //         });
  
  //         // Parsed Data Response in array format
  //         setParsedData(results.data);
  
  //         // Filtered Column Names
  //         setTableRows(rowsArray[0]);
  
  //         // Filtered Values
  //         setValues(valuesArray);
  //       },
  //     });
  //   }
  // const [selectedNFT, setSelectedNFT] = useState(null);
  // const handleNFTClick = (nft) => {
  //   setSelectedNFT(nft);
  // };
  // const [title, setTitle] = useState('');
  const [open, setOpen] = useState([]);
  const handleOpenDialog = (i, openState) => {
    const newOpen = open.slice();
    newOpen[i] = openState;
    setOpen(newOpen);
    // setTitle(DataSheet {item.name}-{item.address});
  };

  return (
    <Box>
      <Grid container spacing={4}>
        {data.map((item, i) => (
          // setNftName(`${item.name}`);
          <Grid item xs={12} sm={6} md={6} key={i}>
            <Box display={'block'} width={1} height={1}>
              <Box
                key={i}
                component={Card}
                width={1}
                height={1}
                display={'flex'}
                flexDirection={'column'}
              >
                <CardMedia
                  title={item.name}
                  //image={item.image}
                  image="https://mumbai.polygonscan.com/images/main/nft-placeholder.svg"
                  sx={{
                    position: 'relative',
                    height: { xs: 120, sm: 170, md: 140 },
                    // height: { xs: 240, sm: 340, md: 280 },
                    // overflow: 'hidden',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    position={'absolute'}
                    bottom={0}
                    padding={2}
                    width={1}
                  >
                    <Box
                      padding={1}
                      bgcolor={'background.paper'}
                      boxShadow={1}
                      borderRadius={2}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        {item.price} MATIC
                      </Typography>
                    </Box>
                    <Box
                      padding={1}
                      bgcolor={'background.paper'}
                      boxShadow={1}
                      borderRadius={2}
                    >
                      <Box
                        component={'svg'}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        width={16}
                        height={16}
                        color={'primary.main'}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardMedia>
                <CardContent>
                  <Typography
                    variant={'h6'}
                    align={'left'}
                    sx={{ fontWeight: 700 }}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant={'subtitle2'} color="text.secondary">
                      <Link href={`https://mumbai.polygonscan.com/address/${item.seller}`} underline="none">
                        Link to seller address
                      </Link>
                  </Typography>
                  {/* <Box display={'flex'} alignItems={'center'} marginY={2}>
                    <Typography variant={'caption'} color="text.secondary">
                      {item.description}
                    </Typography>
                    
                  </Box> */}
              <Typography variant="subtitle1" gutterBottom>
                Description
              </Typography>
                  <Box sx={{ border: 1, borderColor: 'grey.300', p: 1, my: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                    {item.description}
                    </Typography>
                  </Box> 

{/* add style hierarichal */}
<Box display="flex" flexDirection="column" gap={1}>
  {createNestedDisplay(item, 'mtdomain')}
</Box>

                    {/* <Box display="flex" flexDirection="column" gap={1}>
                    {['mtdomain', 'mtgroup', 'mtclass1', 'mtclass2', 'mtclass3', 'grade', 'mtlot', 'mtspecimen'].map(key => (
                      <Typography variant="caption" color="text.secondary" key={key}>
                    {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${item[key]}`}
                      </Typography>
                      ))}
                    </Box> */}
{/* 

                    <Box mt={2} display="flex" alignItems="center">
                     <LinkIcon sx={{ mr: 1 }} />
                      <Link href={`https://mumbai.polygonscan.com/address/${item.seller}`} underline="none">
                      View DataSheet NFT
                     </Link>
                    </Box> */}
               

                  <Box display={'flex'} alignItems={'center'}>
                    <Box
                      component={'svg'}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width={16}
                      height={16}
                      marginRight={1}
                    >
                      <LinkIcon />
                    </Box>
                    <Box
                      component={ListItem}
                      button
                      onClick={() => handleOpenDialog(i, true)}
                      sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
                       >
                      <Typography variant="subtitle1" fontWeight="fontWeightBold">View DataSheet NFT:</Typography>
                      <Typography variant="subtitle2" fontWeight="fontWeightBold">Seller</Typography>
                      <Typography variant="caption" style={{ fontStyle: 'italic' }}>{item.seller}</Typography>

                      <box>
                      <Typography variant="subtitle2" fontWeight="fontWeightBold">Owner:</Typography></box>
                      <box>
                      <Typography variant="caption" style={{ fontStyle: 'italic' }}>{item.owner}</Typography>
                      {/* <Typography variant="subtitle2">{item.tokenURI}</Typography> */}
                      </box>
                    </Box>
                    {/* compare button */}
                    {/* <Typography variant={'subtitle2'} color="text.secondary"> */}
                      {/* <Link href={item.address} underline="none">
                        Link to NFT
                      </Link> */}

                      {/* <Link href={item.tokenURI} underline="none">
                        Link to NFT tokenURI  
                      </Link>
                    </Typography> */}
                  </Box>

                  <Box display={'flex'} alignItems={'center'}>
                    <Box
                      component={'svg'}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width={16}
                      height={16}
                      marginRight={1}
                    >
                      <LinkIcon />
                    </Box>

                  {/* <Box
                      component={ListItem}
                      button
                      onClick={() => handleOpenDialog(i, true)}
                      sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
                       >
                      <Typography variant="subtitle2">Compare:</Typography>
                  </Box> */}

                  </Box>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    {buttonShow && (
                      <Button
                        onClick={() => buyNft(item)}
                        disabled={loading}
                        startIcon={
                          loading ? (
                            <CircularProgress size={24} />
                          ) : (           
                          <Box
                            component={'svg'}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width={24}
                            height={24}
                          >
                            <ShoppingBagIcon />
                          </Box>
                          )
                        }
                        
                      >
                        {/* Buy */}
                        {loading ? 'Processing' : 'Buy'}
                      </Button>
                    )}
                  {buttonAsset && (
                      <Button
                      onClick={() => {
                        setTokenId(item.tokenId);
                        setOpenResellDialog(true);
                      }}
                        startIcon={
                          <Box
                            component={'svg'}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width={24}
                            height={24}
                          >
                            <ShoppingBagIcon />
                          </Box>
                        }
                      >
                        Resell
                      </Button>
                    )}  
                  </CardActions>
                </CardContent>
              </Box>
            </Box>
          </Grid>
))}
      </Grid>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}
  // onClose={handleSnackbarClose}
  // message={successMessage}
  message={`Material successfully listed for ${resellPrice} with hash ${hash}`}
  buttonText="View on polygonscan"
  buttonLink={`https://mumbai.polygonscan.com/tx/${hash}`}
  action={
    <Button color="secondary" size="small" onClick={() => setSnackbarOpen(false)}>
      Close
    </Button>
  }
      />
   <Snackbar
  open={snackbarOpen1}
  autoHideDuration={6000}
  onClose={handleSnackbarClose1}
  // message={successMessage}
  message={`Material successfully transfered, check your asset`}
  // buttonText="View on polygonscan"
  // buttonLink={`https://mumbai.polygonscan.com/tx/${hash}`}
  action={
    <Button color="secondary" size="small" onClick={() => setSnackbarOpen(false)}>
      Close
    </Button>
  }
      />

      {/* //new */}
      {data.map((item, i) => (
        <Dialog key={i} open={open[i]} onClose={() => handleOpenDialog(i, false)} fullWidth maxWidth="md">
          <DialogTitle
          sx={{ 
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'primary.main', // Use a theme color
            fontFamily: 'Roboto, Arial',
            textAlign: 'center',
            // You can add more responsive styles or theming here
        // }}>DataSheet {item.name}-{item.address}</DialogTitle>
        }}>DataSheet {item.name}</DialogTitle>
          {/* <DialogTitle>{title}</DialogTitle> */}
          <DialogContent>
            {/* <CsvViewer fileUrl={item.address} listData={data} title={title} /> */}
            <CsvViewer fileUrl={item.address} listData={data} />


            
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleOpenDialog(i, false)}>Close</Button>
          </DialogActions>
        </Dialog>
      
      ))}
      

        <Dialog open={openResellDialog} onClose={() => setOpenResellDialog(false)}>
    <DialogTitle>Resell NFT  </DialogTitle>
    <DialogContent>
      <TextField
        label="New Price"
        value={resellPrice}
        onChange={(e) => setResellPrice(e.target.value)}
      />
     
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenResellDialog(false)}>Cancel</Button>
      {loading ? (
                <CircularProgress size={24} />
              ) : (
      <Button onClick={handleResell}>Resell</Button>
      )}
    </DialogActions>
  </Dialog>

      </Box>
    );
  };


PortfolioGrid.propTypes = {
  data: PropTypes.array,
  dataCsv: PropTypes.array,
  buttonShow: PropTypes.bool,
  buttonAsset: PropTypes.bool,
  materialNFTs: PropTypes.array,
};

export default PortfolioGrid;
