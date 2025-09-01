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
  Spinner,
  IconButton,
  Circle,
  Input,
  Button,
  Select,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Card from "components/card/Card.js";
import { getUsersByMiddleAdmin } from "../../../../api/api";

const MiddleAdminImei = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10); // Added page size state
  const toast = useToast();
  const navigate = useNavigate();

  const middleAdminId = useSelector((state) => state.user.email);
  
  // Fixed dark mode colors to match the rest of the application
  const bgColor = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const tableHeaderColor = useColorModeValue("gray.500", "gray.300");
  const labelColor = useColorModeValue("gray.600", "gray.300");

  const fetchUsersByMiddleAdmin = async () => {
    setLoading(true);
    try {
      const response = await getUsersByMiddleAdmin(
        middleAdminId, 
        currentPage, 
        pageSize, // Updated to use pageSize instead of hardcoded 10
        'createdAt',
        'desc',
        searchQuery
      );
      
      if (response && Array.isArray(response.data)) {
        setDevices(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalCount(response.totalCount || 0);
      } else {
        setDevices([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch users: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleImeiClick = (imei) => {
    navigate("/admin/Client-dashboard", { state: { imei } });
  };

  // Added search handlers
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchUsersByMiddleAdmin();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  useEffect(() => {
    if (middleAdminId) {
      fetchUsersByMiddleAdmin();
    }
  }, [middleAdminId, currentPage, pageSize]); // Added pageSize dependency

  return (
    <Box
      p={{ base: 4, md: 8 }}
      pt={{ base: 20, md: 100 }}
      minH="100vh"
      maxW="1200px"
      mx="auto"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {/* Search Section */}
      <Card
        mb="20px"
        p={{ base: 4, md: 6 }}
        bg={bgColor}
        borderRadius="xl"
        boxShadow="sm"
        w="100%"
      >
        <Flex direction="column" gap="20px">
          <Box w="100%">
            <Text fontSize="sm" mb="2" color={labelColor}>
              Search Users
            </Text>
            <Input
              type="text"
              placeholder="Search by IMEI, email, or user data..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              w="100%"
              bg={bgColor}
              color={textColor}
              borderColor={borderColor}
            />
          </Box>
          <Flex justify="flex-start">
            <Button colorScheme="blue" onClick={handleSearch}>
              Search
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Table Card */}
      <Card
        p={{ base: 4, md: 6 }}
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
            <Table variant="simple" size={{ base: "sm", md: "md" }}>
              <Thead>
                <Tr>
                  <Th color={tableHeaderColor} fontWeight="medium">IMEI NUMBER</Th>
                  <Th color={tableHeaderColor} fontWeight="medium">LAST LOGIN</Th>
                  <Th color={tableHeaderColor} fontWeight="medium">EMAIL</Th>
                  <Th color={tableHeaderColor} fontWeight="medium">LAST DATA</Th>
                </Tr>
              </Thead>
              <Tbody>
                {devices.map((device, index) => {
                  const lastReportedData = device.lastReportedData || {};
                  let lastData = "N/A";

                  if (lastReportedData.values?.weight) {
                    lastData = `Weight: ${(lastReportedData.values.weight / 1000).toFixed(2)} kg`;
                  } else if (lastReportedData.values?.systolic && lastReportedData.values?.diastolic) {
                    lastData = `BP: ${lastReportedData.values.systolic / 100}/${lastReportedData.values.diastolic / 100} mmHg`;
                  }

                  return (
                    <Tr key={index} borderBottom="1px" borderColor={borderColor}>
                      <Td
                        color="blue.500"
                        cursor="pointer"
                        onClick={() => handleImeiClick(device.imei)}
                      >
                        {device.imei || "N/A"}
                      </Td>
                      <Td color={textColor}>
                        {device.lastLogin
                          ? new Date(device.lastLogin).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "Never Logged In"}
                      </Td>
                      <Td color={textColor}>{device.email || "N/A"}</Td>
                      <Td color={textColor}>{lastData}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            {/* Enhanced Pagination with Page Size Selector */}
            <Flex
              justify="space-between"
              align="center"
              mt={6}
              pt={2}
              borderTop="1px"
              borderColor={borderColor}
              flexDirection={{ base: "column", md: "row" }}
            >
              <Flex 
                direction={{ base: "column", md: "row" }}
                align={{ base: "flex-start", md: "center" }}
                gap={{ base: 4, md: 8 }}
                mb={{ base: 4, md: 0 }}
              >
                <Text fontSize="sm" color={tableHeaderColor}>
                  Showing page {currentPage} of {totalPages} ({totalCount} total entries)
                </Text>
                
                <Flex align="center">
                  <Text fontSize="sm" color={tableHeaderColor} mr={2}>
                    Show:
                  </Text>
                  <Select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    size="sm"
                    width="90px"
                    bg={bgColor}
                    color={textColor}
                    borderColor={borderColor}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                    <option value={60}>60</option>
                    <option value={80}>80</option>
                    <option value={100}>100</option>
                  </Select>
                </Flex>
              </Flex>

              <Flex align="center">
                <IconButton
                  icon={<ChevronLeftIcon />}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1}
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

export default MiddleAdminImei;