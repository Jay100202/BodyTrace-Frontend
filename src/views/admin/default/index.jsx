import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Text, Spinner, Flex, Select } from "@chakra-ui/react";
import Card from "components/card/Card";
import { fetchDeviceData } from "../../../api/api";
import { Line } from "react-chartjs-2";

export default function UserReports() {
  const imeis = useSelector((state) => state.user.imei); // Array of IMEIs
  console.log("IMEIs from Redux:", imeis); // Debugging log
  const [deviceData, setDeviceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState("Pounds"); // Default unit is Pounds

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchDeviceData(imeis); // Fetch data for all IMEIs

        console.log("Fetched device data:", data); // Debugging log
        // Group data by IMEI and filter out entries without `weight`
        const groupedData = data.reduce((acc, item) => {
          const imei = item.imei;
          if (!acc[imei]) acc[imei] = [];
          // Only include entries with `values` and `weight`
          if (item.values && item.values.weight !== undefined) {
            acc[imei].push(item);
          }
          return acc;
        }, {});
        setDeviceData(groupedData);
      } catch (error) {
        console.error("Error fetching device data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (imeis && imeis.length > 0) {
      fetchData();
    }
  }, [imeis]);

  // Convert weight based on the selected unit
  const convertWeight = (weightInGrams) => {
    if (unit === "Pounds") {
      return (weightInGrams / 453.592).toFixed(2); // Convert grams to pounds
    } else if (unit === "Kilograms") {
      return (weightInGrams / 1000).toFixed(2); // Convert grams to kilograms
    }
    return weightInGrams; // Default is grams
  };

  if (!imeis || imeis.length === 0) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Text color="red.500" fontSize="lg" textAlign="center">
          IMEI numbers are missing. Please select a device.
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

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
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
      {Object.keys(deviceData).map((imei) => {
        // Sort data by date in descending order (most recent first)
        const sortedDeviceData = [...(deviceData[imei] || [])].sort(
          (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
        );

        const chartData = {
          labels: sortedDeviceData.map((item) =>
            new Date(item.dateTime).toLocaleDateString()
          ), // X-axis: Dates
          datasets: [
            {
              label: `Weight (${unit}) for IMEI: ${imei}`,
              data: sortedDeviceData.map((item) =>
                convertWeight(item.values.weight)
              ), // Y-axis: Converted weights
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        };

        return (
          <Card key={imei} mt="40px" p="20px" borderRadius="lg" boxShadow="md">
            {sortedDeviceData.length === 0 ? (
              <Text color="gray.500" fontSize="lg" textAlign="center">
                No data available for IMEI: {imei}
              </Text>
            ) : (
              <Box w="100%" overflowX="auto">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false, // Makes the graph responsive
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: `Weight Over Time (${unit}) for IMEI: ${imei}`,
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
                  height={300} // Adjust height for better responsiveness
                />
              </Box>
            )}
          </Card>
        );
      })}
    </Box>
  );
}