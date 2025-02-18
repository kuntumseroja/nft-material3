import React, { useState } from "react";
import * as XLSX from "xlsx";
import { 
  Card, 
  CardContent,
  Typography,
  Button,
  Alert,
  Box 
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import Main from "layouts/Main";
import Container from "components/Container";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from "next/link";

const ExcelMatMLConverter = () => {
  const [xmlData, setXmlData] = useState(null);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");

  const convertToMatML = (jsonData) => {
    try {
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<MatML_Doc xmlns="http://www.matml.org/">\n`;
      
      // Safely extract metadata
      const getMetadataValue = (data, rowIndex) => {
        return data[rowIndex] && data[rowIndex][2] ? data[rowIndex][2].toString() : '';
      };

      const metadata = {
        composition: getMetadataValue(jsonData, 0),
        mass: getMetadataValue(jsonData, 1),
        currentDensity: getMetadataValue(jsonData, 2),
        potentialRange: getMetadataValue(jsonData, 3)
      };
      
      xml += `<Material>\n  <BulkDetails>\n    <Composition>\n`;
      
      // Parse composition with error handling
      try {
        const compounds = metadata.composition.split('・');
        compounds.forEach(compound => {
          const match = compound.match(/(\d+)(.+)/);
          if (match) {
            const [, percentage, formula] = match;
            xml += `      <Element>\n        <Name>${formula}</Name>\n        <Percentage>${percentage}</Percentage>\n      </Element>\n`;
          }
        });
      } catch (err) {
        console.error('Error parsing composition:', err);
      }
      
      // Extract numerical values with units
      const massValue = (metadata.mass.match(/[\d.]+/) || [0])[0];
      const currentDensityValue = (metadata.currentDensity.match(/[\d.]+/) || [0])[0];
      const potentialRangeValues = metadata.potentialRange.match(/[\d.]+/g) || [0, 0];
      
      xml += `    </Composition>\n    <Mass>${massValue}</Mass>\n    <CurrentDensity>${currentDensityValue}</CurrentDensity>\n    <PotentialRange lower="${potentialRangeValues[0]}" upper="${potentialRangeValues[1]}"/>\n  </BulkDetails>\n`;
      
      // Find data section
      const dataStartIndex = jsonData.findIndex(row => 
        row && row[0] === 'Cycles' && 
        row[1] === 'Potential [V]' && 
        row[2] === 'Capacity [mAh/g]'
      );
      
      if (dataStartIndex === -1) {
        throw new Error('Could not find cycling data headers');
      }

      xml += `  <CyclingData>\n`;
      const cyclingData = [];
      
      // Process cycling data
      for (let i = dataStartIndex + 1; i < jsonData.length; i++) {
        if (jsonData[i] && jsonData[i].length >= 3 && 
            jsonData[i][0] !== null && jsonData[i][1] !== null && jsonData[i][2] !== null) {
          const cycle = jsonData[i][0].toString();
          const potential = jsonData[i][1].toString();
          const capacity = jsonData[i][2].toString();
          
          xml += `    <Cycle number="${cycle}">\n      <Potential>${potential}</Potential>\n      <Capacity>${capacity}</Capacity>\n    </Cycle>\n`;
          
          cyclingData.push({
            cycle: parseFloat(cycle),
            potential: parseFloat(potential),
            capacity: parseFloat(capacity)
          });
        }
      }
      
      xml += `  </CyclingData>\n</Material>\n</MatML_Doc>`;
      setChartData(cyclingData);
      return xml;
    } catch (err) {
      throw new Error(`Error converting data: ${err.message}`);
    }
  };

  const handleFileUpload = (event) => {
    setError(null);
    setXmlData(null);
    setChartData(null);
    
    const file = event.target.files[0];
    if (!file) return;

    // Store original filename without extension
    const baseFileName = file.name.replace(/\.[^/.]+$/, "");
    setOriginalFileName(baseFileName);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { 
          header: 1,
          defval: null, // Use null for empty cells
          raw: true // Keep raw values
        });
        
        if (!jsonData || jsonData.length === 0) {
          throw new Error('No data found in Excel file');
        }
        
        const matmlXml = convertToMatML(jsonData);
        setXmlData(matmlXml);
      } catch (err) {
        setError(`Error processing file: ${err.message}`);
        console.error('Error details:', err);
      }
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadXmlFile = () => {
    if (!xmlData) return;
    // Create timestamp for unique filename
    const timestamp = Date.now();
    
    // Create filename using original excel name if available
    const fileName = originalFileName 
      ? `${originalFileName}_converted${timestamp}.xml`
      : `converted${timestamp}.xml`;

    const blob = new Blob([xmlData], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Main>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Link href="/convert-matml">
            <Button variant="outlined">Convert to MatML</Button>
          </Link>
        </Box>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Excel to MatML Converter
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button 
                variant="contained"
                onClick={() => document.getElementById("file-upload").click()}
                startIcon={<UploadIcon />}
              >
                Upload Excel
              </Button>
              <input 
                id="file-upload" 
                type="file" 
                accept=".xls,.xlsx" 
                style={{ display: 'none' }} 
                onChange={handleFileUpload} 
              />
              {xmlData && (
                <Button 
                  variant="outlined"
                  onClick={downloadXmlFile}
                  startIcon={<DownloadIcon />}
                >
                  Download XML
                </Button>
              )}
            </Box>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {chartData && chartData.length > 0 && (
              <Box sx={{ mt: 4, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Capacity vs Cycle Number
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="cycle" 
                      label={{ value: 'Cycle Number', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Capacity (mAh/g)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="capacity" 
                      stroke="#8884d8" 
                      name="Capacity"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Main>
  );
};

export default ExcelMatMLConverter;