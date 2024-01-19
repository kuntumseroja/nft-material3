import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, TextField, Box, Typography, Paper } from '@mui/material';
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
        const response = await axios.get(fileUrl);
        const parsedData = Papa.parse(response.data, { delimiter: ";", header: true, skipEmptyLines: true });
        setCsvData(parsedData.data);
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

  return (
    <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
    <TableContainer component={Paper}>
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
    </Grid>
    <Grid item xs={12} md={6}>
            
                    {/* compare with {item.name} */}
                   
          
        <LineChart
          width={500}
          height={300}
          // data={csvData}
        
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
        {selectedNFTName && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
             Selected DataSheet : {selectedNFTName}
          </div>
        )}
      </Grid>
      <Grid item xs={12} md={12}>

      <TextField
        label="Filter Material NFT"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Material Name</TableCell>
        <TableCell>IPFS y</TableCell>
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
    </Grid>
  );
};

export default CsvViewer;