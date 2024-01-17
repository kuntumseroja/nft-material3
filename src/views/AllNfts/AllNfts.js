import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Main from 'layouts/Main';
import Container from 'components/Container';
import Contact from 'components/Contact';
import PortfolioGrid from 'components/PortfolioGrid';
import CsvViewer from 'components/Csv-Viewer';

import axios from 'axios';
import { ethers } from 'ethers';
import Material from 'contracts/Material.sol/Material.json';

const AllNfts = () => {
  const theme = useTheme();
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);

// New state for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const nftsPerPage = 6;
  const [searchQuery, setSearchQuery] = useState('');

  // Filter NFTs based on search query
 const filteredNfts = nfts.filter(nft => 
  nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  nft.description.toLowerCase().includes(searchQuery.toLowerCase())
);

// Calculate pagination details
 const pageCount = Math.ceil(filteredNfts.length / nftsPerPage);
 const indexOfLastNft = currentPage * nftsPerPage;
 const indexOfFirstNft = indexOfLastNft - nftsPerPage;
 const currentNfts = filteredNfts.slice(indexOfFirstNft, indexOfLastNft);
 const handlePageChange = (event, value) => {
  setCurrentPage(value);
};
//new from me

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.MUMBAI_URL,
    );
    const marketContract = new ethers.Contract(
      process.env.MARKETPLACE_ADDRESS,
      Material.abi,
      provider,
    );
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          mtdomain: meta.data.mtdomain,
          mtgroup: meta.data.mtgroup,
          mtclass1: meta.data.mtclass1,
          mtclass2: meta.data.mtclass2,
          mtclass3: meta.data.mtclass3,
          grade: meta.data.grade,
          mtlot: meta.data.mtlot,
          mtspecimen: meta.data.mtspecimen,
          address: meta.data.image,
          tokenURI, 
        };
        return item;
      }),
    );

    setNfts(items);
    setLoaded(true);
  }

  if (loaded && !nfts.length)
    return (
      <Main>
        <Box
          position={'relative'}
          marginTop={{ xs: 4, md: 6 }}
          sx={{
            backgroundColor: theme.palette.alternate.main,
          }}
        >
          <Box
            component={'svg'}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 1920 100.1"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transform: 'translateY(-50%)',
              zIndex: 2,
              width: 1,
            }}
          >
            <path
              fill={theme.palette.alternate.main}
              d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
            ></path>
          </Box>
        </Box>
        <Container>
          <Contact />
        </Container>
      </Main>
    );
  return (
    <Main>
      <Container>
      <TextField 
        label="Search NFTs" 
        variant="outlined" 
        onChange={(e) => setSearchQuery(e.target.value)}
      />
        <PortfolioGrid data={currentNfts} buttonShow={true} />
        <Pagination 
        count={pageCount} 
        page={currentPage} 
        onChange={handlePageChange} 
      />
      </Container>
      <Box
        position={'relative'}
        marginTop={{ xs: 4, md: 6 }}
        sx={{
          backgroundColor: theme.palette.alternate.main,
        }}
      >
        <Box
          component={'svg'}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            zIndex: 2,
            width: 1,
          }}
        >
          <path
            fill={theme.palette.alternate.main}
            d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
          ></path>
        </Box>
        <Container>
          <Contact />
        </Container>
      </Box>
    </Main>
  );
};

export default AllNfts;
