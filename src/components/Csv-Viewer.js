import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, TextField,Paper, Box, Typography } from '@mui/material';
import axios from 'axios';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import { Modal, Button } from 'react-bootstrap';

const CsvViewer = ({ fileUrl, listData }) => {
  const [csvData, setCsvData] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  // const [modalOpen, setModalOpen] = useState(false);
  const [selectedNFTName, setSelectedNFTName] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      if (fileUrl) {
        try {
          const response = await axios.get(fileUrl);
          const parsedData = Papa.parse(response.data, { delimiter: ";", header: true, skipEmptyLines: true });
          setCsvData(parsedData.data);
          if (parsedData.errors.length === 0) {
            setCsvData(parsedData.data);
          } else {
            console.error("Error parsing CSV data:", parsedData.errors);
            // Handle parsing errors here
          }
        } catch (error) {
          console.error("Error fetching CSV data:", error);
          // Handle fetching errors here
        }
      }
    };

    fetchData();
  }, [fileUrl]);
  const [searchTerm, setSearchTerm] = useState('');
  // useEffect(() => {
  //   const fetchData1 = async () => {
  //     if (selectedNFT && selectedNFT.address) {
  //       const response = await axios.get(selectedNFT.address);
  //       const parsedData1 = Papa.parse(response.data, { delimiter: ";", header: true, skipEmptyLines: true });
  //       setSelectedNFT({ ...selectedNFT, data: parsedData1.data });
  //     }
  //   };

  //   fetchData1();
  // }, [selectedNFT]);


  const headers = csvData.length > 0 ? Object.keys(csvData[0]) : [];
  // const headers = selectedNFT.length > 0 ? Object.keys(selectedNFT[0]) : [];

  // const [selectedRow, setSelectedRow] = useState(null);

  const handleNFTClick = async (nft) => {
    // setSelectedNFT(nft);
    const response = await axios.get(nft.address);
        const parsedData = Papa.parse(response.data, { delimiter: ";", header: true, skipEmptyLines: true });
        // setSelectedNFT({ ...selectedNFT, data: parsedData1.data });
        setSelectedNFT(parsedData.data);
        setSelectedNFTName(nft.name);
        // setSelectedRow(nft.tokenId);

    // setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  // const chartData = selectedNFT ? [...csvData, selectedNFT] : csvData;
  console.log("CSV Data: ", csvData);
  console.log("Headers: ", headers);

  return (
    <Grid container spacing={3}>
       {/* CSV Data Table */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            CSV Data
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header, i) => (
                 <TableCell key={i}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
                <TableBody>
                  {csvData.map((row, i) => (
                    <TableRow key={i}>
                      {headers.map((header, cellIndex) => (
                      <TableCell key={cellIndex}>{row[header]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </Paper>
      </Grid>


    {/* Chart */}
      <Grid item xs={12} md={6}>
        {/* <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}> */}
        
          {/* <Typography variant="h6" gutterBottom component="div">
            Line Chart
          </Typography> */}
            {/* <Box sx={{ flexGrow: 1, width: '100%' }}> */}
            
                    {/* compare with {item.name} */}
                   
          
              <LineChart
              width={'100%'}
              height={300}
              data={csvData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={headers[0]} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" data={csvData} dataKey={headers[1]} stroke="#8884d8" activeDot={{ r: 8 }} />
                {/* {selectedNFT && selectedNFT.data && (
                  <Line type="monotone" data={selectedNFT} dataKey={headers[1]} stroke="#82ca9d" activeDot={{ r: 8 }} />
                )} */}
                <Line type="monotone" data={selectedNFT} dataKey={headers[1]} stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            {/* </Box> */}
        {/* </Paper> */}
        {selectedNFTName && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
             Selected DataSheet : {selectedNFTName}
          </div>
        )}
      </Grid>

      {/* <Grid item xs={12} md={12}>
      <Grid item xs={12}> */}
      {/* Filter Text Field */}
      <Grid item xs={12}>
        <TextField
          label="Filter Material NFT"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </Grid>
      {/* Material NFT List */}

      <Grid item xs={12}>

        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="Material Data List">
            <TableHead>
              <TableRow>
                <TableCell>Material Name</TableCell>
                 <TableCell>IPFS </TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                {/* {listData && listData.map((item) => ( */}
                {/* // <TableRow key={item.tokenId} className={selectedRow === item.tokenId ? "selected-row" : ""}  style={{ cursor: 'pointer' }}  hover onClick={() => handleNFTClick(item)}> */}
                {listData && listData
                .filter((item) =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.address.toLowerCase().includes(searchTerm.toLowerCase())
                )
                  .map((item) => (
                <TableRow key={item.tokenId}  style={{ cursor: 'pointer' }}  hover onClick={() => handleNFTClick(item)}>

                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.address}</TableCell>
                </TableRow>
                  ))
                }
      {/* ))} */}
              </TableBody>
          </Table>
        </TableContainer>
      </Grid>


{/* <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        {headers.map((header, i) => (
          <TableCell key={i}>{header}</TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {csvData.map((row, i) => (
        <TableRow key={i}>
          {headers.map((header, cellIndex) => (
            <TableCell key={cellIndex}>{row[header]}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer> */}






     
    </Grid>
  );
};

export default CsvViewer;
