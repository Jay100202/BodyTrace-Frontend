import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Text,
  Spinner,
  Flex,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  useToast,
  IconButton,
  Circle,
  Input,
  Button,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import { getDeviceData, fetchFilteredDeviceData, downloadFilteredDeviceDataCSV } from "../../../../api/api";
import { Line } from "react-chartjs-2";

const MiddleAdminDashboard = () => {
  const location = useLocation();
  const imei = location.state?.imei;
  const toast = useToast();

  console.log("IMEI:", imei);

  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState("Pounds");
  
  // Table state
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weightUnit, setWeightUnit] = useState("lbs");

  // UI colors - Fixed for dark mode consistency
  const bgColor = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const tableHeaderColor = useColorModeValue("gray.500", "gray.300");
  const labelColor = useColorModeValue("gray.600", "gray.300");
  const dataColor = useColorModeValue("gray.600", "gray.400");
  
  // Chart colors - Fixed for ESLint rules of hooks
  const chartTextColor = useColorModeValue("#1A202C", "#FFFFFF");
  const chartGridColor = useColorModeValue("rgba(0,0,0,0.1)", "rgba(255,255,255,0.1)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDeviceData(imei);
        const filteredData = data.filter((item) => item.values);
        filteredData.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setDeviceData(filteredData);
      } catch (error) {
        console.error("Error fetching device data:", error);
        toast({
          title: "Error",
          description: `Failed to fetch graph data: ${error.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (imei) {
      fetchData();
      fetchTableData();
    }
  }, [imei]);

  const fetchTableData = async () => {
    if (!imei) return;
    
    setTableLoading(true);
    try {
      const response = await fetchFilteredDeviceData(imei, startDate, endDate, currentPage);

      if (response && Array.isArray(response.data)) {
        setTableData(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalCount(response.totalCount || 0);
      } else {
        setTableData([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch device table data: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (imei) {
      fetchTableData();
    }
  }, [imei, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTableData();
  };

  const handleDownloadCSV = async () => {
    try {
      await downloadFilteredDeviceDataCSV(imei, startDate, endDate, currentPage);
      toast({
        title: "Download Successful",
        description: "The CSV file has been downloaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to download CSV: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePageChange = (pageNumber, unit = weightUnit) => {
    setCurrentPage(pageNumber);
    setWeightUnit(unit);
  };

  const convertWeight = (weightInGrams) => {
    if (unit === "Pounds") {
      return (weightInGrams / 453.592).toFixed(2);
    } else if (unit === "Kilograms") {
      return (weightInGrams / 1000).toFixed(2);
    }
    return weightInGrams;
  };

  const convertTableWeight = (weight) => {
    if (weightUnit === "lbs") {
      return (weight / 453.592).toFixed(2); // Convert grams to pounds
    }
    return (weight / 1000).toFixed(2); // Convert grams to kilograms
  };

  // Check if data contains weight or blood pressure information
  const hasWeightData = tableData.some(device => device.values?.weight !== undefined);
  const hasSystolicData = tableData.some(device => device.values?.systolic !== undefined);
  const hasDiastolicData = tableData.some(device => device.values?.diastolic !== undefined);

  if (!imei) {
    return (
      <Box pt="80px">
        <Text color="red.500" fontSize="lg" textAlign="center">
          IMEI is missing. Please go back and select a device from Middle Admin IMEI.
        </Text>
      </Box>
    );
  }

  if (loading && tableLoading) {
    return (
      <Box pt="80px">
        <Flex justify="center" align="center" h="200px">
          <Spinner size="lg" />
        </Flex>
      </Box>
    );
  }

  // Chart data preparation
  const datasets = [];
  const labels = deviceData.map((item) => new Date(item.dateTime).toLocaleDateString());

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
        data: bloodPressureData.map((item) => item.values.systolic / 100),
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: `Diastolic Pressure for IMEI: ${imei}`,
        data: bloodPressureData.map((item) => item.values.diastolic / 100),
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
    <Box pt="80px">
      {/* Chart Section */}
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
      <Card 
        p="20px" 
        borderRadius="lg" 
        boxShadow="md" 
        mb="40px"
        bg={bgColor}
      >
        <Box w="100%" overflowX="auto">
          {loading ? (
            <Flex justify="center" align="center" h="300px">
              <Spinner size="lg" />
            </Flex>
          ) : (
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
          )}
        </Box>
      </Card>

      {/* Filter and Table Section */}
      <Card
        mt="40px"
        mb="20px"
        pt={{ base: "40px", md: "60px" }}
        pb={{ base: "20px", md: "40px" }}
        px={{ base: "20px", md: "40px" }}
        bg={bgColor}
      >
        <Flex direction="column" gap="20px">
          <Flex
            direction={{ base: "column", md: "row" }}
            gap="20px"
            align="center"
            justify="space-between"
          >
            <Box w="100%">
              <Text fontSize="sm" mb="2" color={labelColor}>
                Start Date
              </Text>
              <Input
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                w="100%"
                bg={bgColor}
                color={textColor}
                borderColor={borderColor}
              />
            </Box>
            <Box w="100%">
              <Text fontSize="sm" mb="2" color={labelColor}>
                End Date
              </Text>
              <Input
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                w="100%"
                bg={bgColor}
                color={textColor}
                borderColor={borderColor}
              />
            </Box>
          </Flex>

          <Flex
            direction={{ base: "column", md: "row" }}
            gap="10px"
            mt={{ base: "20px", md: "0" }}
            align="center"
          >
            <Button w={{ base: "100%", md: "auto" }} colorScheme="blue" onClick={handleSearch}>
              Search
            </Button>
            <Button w={{ base: "100%", md: "auto" }} colorScheme="green" onClick={handleDownloadCSV}>
              Generate CSV
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Table Display */}
      <Box pt={6}>
        <Card
          p={4}
          bg={bgColor}
          borderRadius="xl"
          boxShadow="sm"
          w="100%"
          minH="500px"
          h="100%"
        >
          {tableLoading ? (
            <Flex justify="center" align="center" h="200px">
              <Spinner size="lg" />
            </Flex>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th pl={0} color={tableHeaderColor} fontWeight="medium">
                      IMEI NUMBER
                    </Th>
                    
                    {hasWeightData && (
                      <Th color={tableHeaderColor} fontWeight="medium">
                        <Flex align="center" gap="5px">
                          <Text>WEIGHT</Text>
                          <Select
                            size="sm"
                            w="100px"
                            value={weightUnit}
                            onChange={(e) => handlePageChange(1, e.target.value)}
                            bg={bgColor}
                            color={textColor}
                          >
                            <option value="lbs">Pounds (lbs)</option>
                            <option value="kg">Kilograms (kg)</option>
                          </Select>
                        </Flex>
                      </Th>
                    )}
                    
                    {hasSystolicData && (
                      <Th color={tableHeaderColor} fontWeight="medium">
                        SYSTOLIC (mmHg)
                      </Th>
                    )}
                    
                    {hasDiastolicData && (
                      <Th color={tableHeaderColor} fontWeight="medium">
                        DIASTOLIC (mmHg)
                      </Th>
                    )}
                    
                    <Th color={tableHeaderColor} fontWeight="medium">
                      DATE/TIME
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tableData.map((device, index) => (
                    <Tr key={index} borderBottom="1px" borderColor={borderColor}>
                      <Td pl={0} py={4} fontWeight="bold" color={textColor}>
                        {device.imei || imei || "N/A"}
                      </Td>
                      
                      {hasWeightData && (
                        <Td py={4} color={dataColor}>
                          {device.values?.weight
                            ? convertTableWeight(device.values.weight)
                            : "N/A"}
                        </Td>
                      )}
                      
                      {hasSystolicData && (
                        <Td py={4} color={dataColor}>
                          {device.values?.systolic
                            ? (device.values.systolic / 100).toFixed(0)
                            : "N/A"}
                        </Td>
                      )}
                      
                      {hasDiastolicData && (
                        <Td py={4} color={dataColor}>
                          {device.values?.diastolic
                            ? (device.values.diastolic / 100).toFixed(0)
                            : "N/A"}
                        </Td>
                      )}
                      
                      <Td py={4} color={dataColor}>
                        {new Date(device.ts || device.dateTime).toLocaleString() || "N/A"}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Flex
                justify="space-between"
                align="center"
                mt={6}
                pt={2}
                borderTop="1px"
                borderColor={borderColor}
                flexDirection={{ base: "column", md: "row" }}
              >
                <Text fontSize="sm" color={tableHeaderColor} mb={{ base: 4, md: 0 }}>
                  Showing page {currentPage} of {totalPages} ({totalCount} total entries)
                </Text>

                <Flex align="center">
                  <IconButton
                    icon={<ChevronLeftIcon />}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                    borderRadius="md"
                    aria-label="Previous page"
                    mr={2}
                    borderColor={borderColor}
                    color={textColor}
                  />

                  <Circle
                    size="35px"
                    bg="blue.500"
                    color="white"
                    border="1px"
                    borderColor="blue.500"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    {currentPage}
                  </Circle>

                  <IconButton
                    icon={<ChevronRightIcon />}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                    borderRadius="md"
                    aria-label="Next page"
                    ml={2}
                    borderColor={borderColor}
                    color={textColor}
                  />
                </Flex>
              </Flex>
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default MiddleAdminDashboard;