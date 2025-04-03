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
  Select, // Import Select for dropdown
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Card from "components/card/Card.js";
import { fetchFilteredDeviceData, downloadFilteredDeviceDataCSV } from "../../../../api/api"; // Import the download API

// UserList Component with Simplified Pagination
const UserList = ({
  devices,
  loading,
  bgColor,
  textColor,
  borderColor,
  currentPage,
  totalPages,
  totalCount,
  handlePageChange,
  weightUnit, // Pass weight unit as a prop
}) => {
  // Function to convert weight based on the selected unit
  const convertWeight = (weight) => {
    if (weightUnit === "lbs") {
      return (weight / 453.592).toFixed(2); // Convert grams to pounds
    }
    return (weight / 1000).toFixed(2); // Convert grams to kilograms
  };

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
                  <Th pl={0} color="gray.500" fontWeight="medium">
                    IMEI NUMBER
                  </Th>
                  <Th color="gray.500" fontWeight="medium">
                    <Flex align="center" gap="5px"> {/* Reduced gap */}
                      <Text>WEIGHT</Text>
                      <Select
                        size="sm"
                        w="100px"
                        value={weightUnit}
                        onChange={(e) => handlePageChange(1, e.target.value)} // Reset to page 1 on unit change
                      >
                        <option value="lbs">Pounds (lbs)</option>
                        <option value="kg">Kilograms (kg)</option>
                      </Select>
                    </Flex>
                  </Th>
                  <Th color="gray.500" fontWeight="medium">
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
                    <Td py={4} color="gray.600">
                      {device.values?.weight
                        ? convertWeight(device.values.weight)
                        : "N/A"}
                    </Td>
                    <Td py={4} color="gray.600">
                      {new Date(device.ts).toLocaleString() || "N/A"}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* Simplified Pagination Component */}
            <Flex
              justify="space-between"
              align="center"
              mt={6}
              pt={2}
              borderTop="1px"
              borderColor={borderColor}
            >
              <Text fontSize="sm" color="gray.500">
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
                />
              </Flex>
            </Flex>
          </Box>
        )}
      </Card>
    </Box>
  );
};

// ListUserImei Component
const ListUserImei = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weightUnit, setWeightUnit] = useState("lbs"); // Default weight unit
  const toast = useToast();

  const imei = useSelector((state) => state.user.imei);

  const bgColor = useColorModeValue("white", "#7551ff");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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
    setWeightUnit(unit); // Update weight unit if changed
  };

  return (
    <Box p={8} pt={12} maxW="1200px" mx="auto">
      {/* Date Range Selection Card */}
                                <Card
                    mt="40px" // Add margin-top to bring the card down
                    mb="20px"
                    pt={{ base: "40px", md: "60px" }} // Add responsive padding-top
                    pb={{ base: "20px", md: "40px" }} // Add responsive padding-bottom
                    px={{ base: "20px", md: "40px" }} // Add responsive padding-left and padding-right
                  >
                    <Flex
                      direction="column" // Stack items vertically by default
                      gap="20px"
                    >
                      {/* Start Date and End Date Inputs */}
                      <Flex
                        direction={{ base: "column", md: "row" }} // Stack inputs vertically on small screens
                        gap="20px"
                        align="center"
                        justify="space-between"
                      >
                        <Box w="100%"> {/* Ensure inputs take full width on small screens */}
                          <Text fontSize="sm" mb="2" color="gray.600">
                            Start Date
                          </Text>
                          <Input
                            type="date"
                            placeholder="Start Date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            w="100%" // Make input take full width
                          />
                        </Box>
                        <Box w="100%"> {/* Ensure inputs take full width on small screens */}
                          <Text fontSize="sm" mb="2" color="gray.600">
                            End Date
                          </Text>
                          <Input
                            type="date"
                            placeholder="End Date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            w="100%" // Make input take full width
                          />
                        </Box>
                      </Flex>
                  
                      {/* Buttons */}
                      <Flex
                        direction={{ base: "column", md: "row" }} // Stack buttons vertically on small screens
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
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        handlePageChange={handlePageChange}
        weightUnit={weightUnit} // Pass weight unit to UserList
      />
    </Box>
  );
};

export default ListUserImei;