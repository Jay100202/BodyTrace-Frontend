import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Text, Spinner, Flex, Select, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card";
import { fetchDeviceData } from "../../../api/api";
import { Line } from "react-chartjs-2";

export default function UserReports() {
  const imei = useSelector((state) => state.user.imei); // Single IMEI
  console.log("IMEI from Redux:", imei); // Debugging log
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState("Pounds"); // Default unit is Pounds

  // UI colors for dark mode consistency
  const bgColor = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("gray.800", "white");
  const noDataColor = useColorModeValue("gray.500", "gray.400");

  // Chart colors
  const chartTextColor = useColorModeValue("#1A202C", "#FFFFFF");
  const chartGridColor = useColorModeValue("rgba(0,0,0,0.1)", "rgba(255,255,255,0.1)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchDeviceData(imei); // Fetch data for the single IMEI

        console.log("Fetched device data:", data); // Debugging log
        // Filter out entries without `values`
        const filteredData = data.filter((item) => item.values);

        // Sort the data by date in ascending order (oldest first) for the chart
        filteredData.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        setDeviceData(filteredData);
      } catch (error) {
        console.error("Error fetching device data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (imei) {
      fetchData();
    }
  }, [imei]);

  // Convert weight based on the selected unit
  const convertWeight = (weightInGrams) => {
    if (unit === "Pounds") {
      return (weightInGrams / 453.592).toFixed(2); // Convert grams to pounds
    } else if (unit === "Kilograms") {
      return (weightInGrams / 1000).toFixed(2); // Convert grams to kilograms
    }
    return weightInGrams; // Default is grams
  };

  if (!imei) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Text color="red.500" fontSize="lg" textAlign="center">
          IMEI is missing. Please select a device.
        </Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Flex justify="center" align="center" h="200px">
          <Spinner size="lg" />
        </Flex>
      </Box>
    );
  }

  // Dynamically generate datasets based on available data
  const datasets = [];
  const labels = deviceData.map((item) =>
    new Date(item.dateTime).toLocaleDateString()
  );

  // Check for weight data
  const weightData = deviceData.filter((item) => item.values?.weight !== undefined);
  if (weightData.length > 0) {
    datasets.push({
      label: `Weight (${unit}) for IMEI: ${imei}`,
      data: weightData.map((item) => convertWeight(item.values.weight)),
      borderColor: "#4CAF50",
      backgroundColor: "rgba(76, 175, 80, 0.2)",
      tension: 0.4,
      fill: true,
    });
  }

  // Check for blood pressure data
  const bloodPressureData = deviceData.filter(
    (item) => item.values?.systolic !== undefined && item.values?.diastolic !== undefined
  );
  if (bloodPressureData.length > 0) {
    datasets.push(
      {
        label: `Systolic Pressure for IMEI: ${imei}`,
        data: bloodPressureData.map((item) => item.values.systolic / 100), // Convert to a readable format
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: `Diastolic Pressure for IMEI: ${imei}`,
        data: bloodPressureData.map((item) => item.values.diastolic / 100), // Convert to a readable format
        borderColor: "#33C3FF",
        backgroundColor: "rgba(51, 195, 255, 0.2)",
        tension: 0.4,
        fill: true,
      }
    );
  }

  const chartData = {
    labels,
    datasets,
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex justify="flex-end" mb="20px">
        <Select
          width="150px"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          size="sm"
          bg={bgColor}
          color={textColor}
        >
          <option value="Pounds">Pounds</option>
          <option value="Kilograms">Kilograms</option>
        </Select>
      </Flex>
      <Card mt="40px" p="20px" borderRadius="lg" boxShadow="md" bg={bgColor}>
        {deviceData.length === 0 ? (
          <Text color={noDataColor} fontSize="lg" textAlign="center">
            No data available for IMEI: {imei}
          </Text>
        ) : (
          <Box w="100%" overflowX="auto">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      color: chartTextColor,
                    }
                  },
                  title: {
                    display: true,
                    text: `Data Over Time for IMEI: ${imei}`,
                    color: chartTextColor,
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Date",
                      color: chartTextColor,
                    },
                    ticks: {
                      color: chartTextColor,
                    },
                    grid: {
                      color: chartGridColor,
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Values",
                      color: chartTextColor,
                    },
                    ticks: {
                      color: chartTextColor,
                    },
                    grid: {
                      color: chartGridColor,
                    }
                  },
                },
              }}
              height={300}
            />
          </Box>
        )}
      </Card>
    </Box>
  );
}