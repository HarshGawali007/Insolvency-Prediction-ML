import React, { useState } from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import img1 from "./img1.jpg"; // Adjust the import path as needed

const theme = createTheme({
  typography: {
    fontFamily: "Abril Fatface,Dancing Script, cursive, Satisfy,Bree Serif",
    fontSize: 16,
    fontWeightRegular: 400,
    fontWeightBold: 700,
  },
});

// Import the image

const PredictionPage = () => {
  const [inputData, setInputData] = useState({
    ROA_C: 0.8,
    ROA_A: 0.7,
    ROA_B: 0.9,
    persistent_EPS: 0.4,
    per_share_net_profit: 20.0,
    debt_ratio: 0.5,
    net_worth_assets: 0.6,
    net_profit_before_tax_paid_in_capital: 0.3,
    retained_earnings_total_assets: 0.4,
    net_income_total_assets: 0.5,
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePrediction = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        inputData
      );
      setPrediction(response.data.prediction);
      setError(null);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setError("Error fetching prediction. Please try again.");
      setPrediction(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          marginBottom={5}
          fontFamily="Dancing Script"
          style={{ color: "#fff" }}
        >
          Data-driven Insolvency Prognosis
        </Typography>
        <Box
          border="1px solid #ccc"
          borderRadius={4}
          p={2}
          maxWidth={500}
          mx="auto"
          overflow="auto" // Set overflow to auto to allow scrolling
          maxHeight={350} // Added max height to enable scrolling
          backgroundColor="rgba(255, 255, 255, 0.8)" // Added background color with transparency
          css={{
            "&::-webkit-scrollbar": {
              width: "8px", // Customize scrollbar width
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888", // Customize scrollbar thumb color
              borderRadius: "4px", // Customize scrollbar thumb border radius
            },
          }}
        >
          <Typography variant="h5" gutterBottom textAlign={"center"}>
            Enter the Input Parameters
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(inputData).map(([param, value]) => (
              <Grid item xs={12} key={param}>
                <TextField
                  fullWidth
                  type="number"
                  label={param.replace(/_/g, " ")}
                  name={param}
                  value={value}
                  onChange={handleInputChange}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Predict button outside the Box */}
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrediction}
          style={{ marginTop: 20 }}
        >
          Predict
        </Button>
        {/* Display prediction result and error message */}
        <Box
          border="1px solid #ccc"
          borderRadius={4}
          p={2}
          maxWidth={500}
          mx="auto"
          marginTop={3}
          textAlign="center"
          backgroundColor="rgba(255, 255, 255, 0.8)" // Added background color with transparency
        >
          {prediction !== null && (
            <Typography
              variant="body1"
              color={prediction === 0 ? "textSecondary" : "error"}
            >
              {" "}
              {prediction === 0
                ? "Company may go bankrupt"
                : "Company is stable may not go bankrupt"}
            </Typography>
          )}
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default PredictionPage;
