import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Text, Spinner, Flex, Select } from "@chakra-ui/react";
import Card from "components/card/Card"; // Import the Card component
import { fetchDeviceData } from "../../../api/api";
import { Line } from "react-chartjs-2";

export default function UserReports() {
  const imei = useSelector((state) => state.user.imei);
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState("Pounds"); // Default unit is Pounds

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchDeviceData(imei);
        // Filter out entries that do not have the `values` or `weight` field
        const filteredData = data.filter((item) => item.values && item.values.weight !== undefined);
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

  // Sort data by date
  const sortedDeviceData = [...deviceData].sort(
    (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
  );

  // Convert weight based on the selected unit
  const convertWeight = (weightInGrams) => {
    if (unit === "Pounds") {
      return (weightInGrams / 453.592).toFixed(2); // Convert grams to pounds
    } else if (unit === "Kilograms") {
      return (weightInGrams / 1000).toFixed(2); // Convert grams to kilograms
    }
    return weightInGrams; // Default is grams
  };

  // Prepare data for the graph
  const chartData = {
    labels: sortedDeviceData.map((item) => new Date(item.dateTime).toLocaleDateString()), // X-axis: Dates
    datasets: [
      {
        label: `Weight (${unit})`,
        data: sortedDeviceData.map((item) => convertWeight(item.values.weight)), // Y-axis: Converted weights
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  if (!imei) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Text color="red.500" fontSize="lg" textAlign="center">
          IMEI number is missing. Please select a device.
        </Text>
      </Box>
    );
  }

  if (deviceData.length === 0 && !loading) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Text color="gray.500" fontSize="lg" textAlign="center">
          No data available to display. Please check your device or try again later.
        </Text>
      </Box>
    );
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card mt="40px" p="20px" borderRadius="lg" boxShadow="md">
        {loading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="lg" />
          </Flex>
        ) : (
          <>
            <Flex justify="flex-end" mb="20px">
              <Select
                width="150px"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                size="sm"
              >
                <option value="Pounds">Pounds</option>
                <option value="Kilograms">Kilograms</option>
              </Select>
            </Flex>
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: `Weight Over Time (${unit})`,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `Weight: ${context.raw} ${unit}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Date",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: `Weight (${unit})`,
                    },
                  },
                },
              }}
            />
          </>
        )}
      </Card>
    </Box>
  );
}