import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Main from 'layouts/Main';
import Container from 'components/Container';
import HomeGrid from 'components/HomeGrid';
import Contact from 'components/Contact';
import Hero from './components/Hero';
import FeaturedNfts from './components/FeaturedNfts';

import axios from 'axios';
import { ethers } from 'ethers';
import Material from 'contracts/Material.sol/Material.json';

const Home = () => {
  const theme = useTheme();
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    setLoading(true); // Set loading to true when fetching data
    try {
      const provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_URL);
      const marketContract = new ethers.Contract(
        process.env.MARKETPLACE_ADDRESS,
        Material.abi,
        provider,
      );
      const data = await marketContract.fetchMarketItems();

      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await marketContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
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
            tokenUri,
          };
          return item;
        }),
      );

      setNfts(items);
    } catch (error) {
      console.error('Error loading NFTs:', error);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }

  if (loaded && !nfts.length) {
    return (
      <Main>
        <Container>
          <Hero />
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
        </Box>
        <Container>
          <Contact />
        </Container>
      </Main>
    );
  }

  return (
    <Main>
      <Container>
        <Hero />
      </Container>
      <Container paddingY={3}>
        <HomeGrid data={nfts} />
      </Container>
      <Container>
        <FeaturedNfts data={nfts} />
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

export default Home;