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
  Circle
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Card from "components/card/Card.js";
import { fetchDeviceData } from "../../../../api/api";

// UserList Component with Simplified Pagination
const UserList = ({ 
  devices, 
  loading, 
  bgColor, 
  textColor, 
  borderColor, 
  currentPage, 
  itemsPerPage, 
  handlePageChange 
}) => {
  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = devices.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(devices.length / itemsPerPage);

  return (
    <Box pt={20}>
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
                    BATTERY VOLTAGE
                  </Th>
                  <Th color="gray.500" fontWeight="medium">
                    SIGNAL STRENGTH
                  </Th>
                  <Th color="gray.500" fontWeight="medium">
                    RSSI
                  </Th>
                  <Th color="gray.500" fontWeight="medium">
                    WEIGHT
                  </Th>
                  <Th color="gray.500" fontWeight="medium">
                    DATE/TIME
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentItems.map((device, index) => (
                  <Tr key={index} borderBottom="1px" borderColor={borderColor}>
                    <Td pl={0} py={4} fontWeight="bold" color={textColor}>
                      {device.imei || "N/A"}
                    </Td>
                    <Td py={4} color="gray.600">
                      {device.batteryVoltage || "N/A"}
                    </Td>
                    <Td py={4} color="gray.600">
                      {device.signalStrength || "N/A"}
                    </Td>
                    <Td py={4} color="gray.600">
                      {device.rssi || "N/A"}
                    </Td>
                    <Td py={4} color="gray.600">
                      {device.values?.weight || "N/A"}
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
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, devices.length)} of {devices.length} entries
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
  const itemsPerPage = 10; // Updated to show 10 items per page
  const toast = useToast();

  // Get IMEI number from Redux
  const imei = useSelector((state) => state.user.imei);
  const name = useSelector((state) => state.user.name);
  
  // Color modes
  const bgColor = useColorModeValue("white", "#7551ff");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Fetch device data based on IMEI number
  const fetchDeviceDataByImei = async () => {
    if (!imei) {
      toast({
        title: "Error.",
        description: "IMEI number is missing.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const data = await fetchDeviceData(imei);
      setDevices(data);
      toast({
        title: "Device Data Fetched.",
        description: "Device data has been successfully fetched.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error.",
        description: `Failed to fetch device data: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch device data on component mount
  useEffect(() => {
    fetchDeviceDataByImei();
  }, [imei]); // Re-fetch if IMEI changes

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Box p={4} maxW="1200px" mx="auto">
      <UserList
        devices={devices}
        loading={loading}
        bgColor={bgColor}
        textColor={textColor}
        borderColor={borderColor}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
      />
    </Box>
  );
};

export default ListUserImei;