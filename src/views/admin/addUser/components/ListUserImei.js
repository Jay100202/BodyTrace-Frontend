import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  useToast,
  Spinner,
  IconButton,
  Circle,
  Input,
  Button,
  Select,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Card from "components/card/Card.js";
import { fetchFilteredDeviceData, downloadFilteredDeviceDataCSV } from "../../../../api/api";

const UserList = ({
  devices,
  loading,
  bgColor,
  textColor,
  borderColor,
  tableHeaderColor,
  dataColor,
  currentPage,
  totalPages,
  totalCount,
  handlePageChange,
  weightUnit,
}) => {
  const convertWeight = (weight) => {
    if (weightUnit === "lbs") {
      return (weight / 453.592).toFixed(2); // Convert grams to pounds
    }
    return (weight / 1000).toFixed(2); // Convert grams to kilograms
  };

  // Check if data contains weight or blood pressure information
  const hasWeightData = devices.some(device => device.values?.weight !== undefined);
  const hasSystolicData = devices.some(device => device.values?.systolic !== undefined);
  const hasDiastolicData = devices.some(device => device.values?.diastolic !== undefined);

  return (
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
        {loading ? (
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
                {devices.map((device, index) => (
                  <Tr key={index} borderBottom="1px" borderColor={borderColor}>
                    <Td pl={0} py={4} fontWeight="bold" color={textColor}>
                      {device.imei || "N/A"}
                    </Td>
                    
                    {hasWeightData && (
                      <Td py={4} color={dataColor}>
                        {device.values?.weight
                          ? convertWeight(device.values.weight)
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
                      {new Date(device.ts).toLocaleString() || "N/A"}
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
  );
};

const ListUserImei = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weightUnit, setWeightUnit] = useState("lbs");
  const toast = useToast();

  const imei = useSelector((state) => state.user.imei);

  // Updated colors for dark mode consistency
  const bgColor = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const tableHeaderColor = useColorModeValue("gray.500", "gray.300");
  const labelColor = useColorModeValue("gray.600", "gray.300");
  const dataColor = useColorModeValue("gray.600", "gray.400");

  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      const response = await fetchFilteredDeviceData(imei, startDate, endDate, currentPage);

      if (response && Array.isArray(response.data)) {
        setDevices(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalCount(response.totalCount || 0);
      } else {
        setDevices([]);
        setTotalPages(1);
        setTotalCount(0);
      }

      toast({
        title: "Data Fetched",
        description: "Device data has been successfully fetched.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch device data: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchFilteredData();
  };

  useEffect(() => {
    fetchFilteredData();
  }, [imei, currentPage]);

  const handlePageChange = (pageNumber, unit = weightUnit) => {
    setCurrentPage(pageNumber);
    setWeightUnit(unit);
  };

  return (
    <Box p={8} pt={12} maxW="1200px" mx="auto">
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

      <UserList
        devices={devices}
        loading={loading}
        bgColor={bgColor}
        textColor={textColor}
        borderColor={borderColor}
        tableHeaderColor={tableHeaderColor}
        dataColor={dataColor}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        handlePageChange={handlePageChange}
        weightUnit={weightUnit}
      />
    </Box>
  );
};

export default ListUserImei;