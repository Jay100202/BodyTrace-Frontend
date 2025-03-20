import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useColorModeValue,
  useToast,
  FormControl,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import Card from "components/card/Card.js";
import { createUser, fetchUsers } from "../../../../api/api"; // Import fetchUsers API

// UserForm Component
const UserForm = ({ formData, handleInputChange, handleSubmit, handleCancel, bgColor, textColor, borderColor }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" mb={6} color={textColor}>
          Add User
        </Text>

        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel htmlFor="name-input" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
              Name
            </FormLabel>
            <Input
              id="name-input"
              placeholder="e.g., John Doe"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              bg={useColorModeValue("white", "gray.700")}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
              autoComplete="name"
              mb="24px"
            />

            <FormLabel htmlFor="email-input" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
              Email
            </FormLabel>
            <Input
              id="email-input"
              placeholder="e.g., john.doe@example.com"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              bg={useColorModeValue("white", "gray.700")}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
              autoComplete="email"
              mb="24px"
            />

            <FormLabel htmlFor="password-input" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
              Password
            </FormLabel>
            <InputGroup size="md" mb="24px">
              <Input
                id="password-input"
                placeholder="e.g., ********"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                bg={useColorModeValue("white", "gray.700")}
                border="1px"
                borderColor={borderColor}
                borderRadius="md"
                autoComplete="new-password"
              />
              <InputRightElement>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePasswordVisibility}
                  _hover={{ bg: "transparent" }}
                >
                  {showPassword ? (
                    <RiEyeCloseLine color={textColor} />
                  ) : (
                    <MdOutlineRemoveRedEye color={textColor} />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>

            <FormLabel htmlFor="imei-input" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
              IMEI Number
            </FormLabel>
            <Input
              id="imei-input"
              placeholder="e.g., 123456789012345"
              name="imei"
              value={formData.imei}
              onChange={handleInputChange}
              bg={useColorModeValue("white", "gray.700")}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
              autoComplete="off"
              mb="24px"
            />

            <Flex justifyContent="flex-end" mt={6} gap={3}>
              <Button
                variant="outline"
                onClick={handleCancel}
                color={textColor}
                borderColor={borderColor}
                _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="solid"
                color={textColor}
                bg={useColorModeValue("gray.100", "gray.600")}
                _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
              >
                Submit
              </Button>
            </Flex>
          </FormControl>
        </form>
      </Card>
    </Box>
  );
};

// UserList Component
const UserList = ({
  users,
  loading,
  paginate,
  totalPages,
  currentPage,
  setShowUserForm,
  bgColor,
  textColor,
  borderColor,
  secondaryBgColor,
  handleSearch,
  searchQuery,
  itemsPerPage, // Add itemsPerPage as a prop
}) => (
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
      <Flex w="100%" maxW="500px" mb={4} mx="auto" align="center">
        <InputGroup flex="1">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.500" />
          </InputLeftElement>
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            bg={secondaryBgColor}
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
          />
        </InputGroup>
        <Button ml={4} colorScheme="blue" onClick={() => setShowUserForm(true)}>
          Add User
        </Button>
      </Flex>

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
                  NAME
                </Th>
                <Th color="gray.500" fontWeight="medium">
                  EMAIL
                </Th>
                <Th color="gray.500" fontWeight="medium">
                  IMEI NUMBER
                </Th>
                <Th color="gray.500" fontWeight="medium">
                  ACTIONS
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id} borderBottom="1px" borderColor={borderColor}>
                  <Td pl={0} py={4} fontWeight="bold" color={textColor}>
                    {user.name}
                  </Td>
                  <Td py={4} color="gray.600">
                    {user.email}
                  </Td>
                  <Td py={4} color="gray.600">
                    {user.imei}
                  </Td>
                  <Td py={4}>
                    <Button variant="link" color="purple.600" fontWeight="bold">
                      Edit user
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {totalPages > 1 && (
        <Flex justify="space-between" align="center" mt={4}>
          <Text color="gray.500" fontSize="sm">
            Showing {currentPage * itemsPerPage - itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, users.length)} of {users.length} entries
          </Text>
          <Flex>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                size="sm"
                mx={1}
                onClick={() => paginate(i + 1)}
                bg={currentPage === i + 1 ? "blue.500" : "gray.200"}
                color={currentPage === i + 1 ? "white" : "gray.800"}
              >
                {i + 1}
              </Button>
            ))}
          </Flex>
        </Flex>
      )}
    </Card>
  </Box>
);

// AddUser Component
const AddUser = () => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    imei: "",
  });
  const toast = useToast();

  const itemsPerPage = 9;

  // Color modes
  const bgColor = useColorModeValue("white", "#7551ff");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryBgColor = useColorModeValue("gray.50", "gray.700");

  // Fetch users dynamically from the server
  const fetchUserData = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await fetchUsers(page, itemsPerPage, "name", "asc", search); // Call the API
      setUsers(response.users);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      toast({
        title: "Error.",
        description: `Failed to fetch users: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, imei } = formData;

    try {
      // Call the createUser API
      await createUser(name, email, password, imei);

      toast({
        title: "User created.",
        description: "The user has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset the form and hide the form view
      setFormData({
        name: "",
        email: "",
        password: "",
        imei: "",
      });
      setShowUserForm(false);

      // Refresh the user list
      fetchUserData(currentPage, searchQuery);
    } catch (error) {
      toast({
        title: "Error.",
        description: `Failed to create user: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Cancel form
  const handleCancel = () => {
    setShowUserForm(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      imei: "",
    });
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    fetchUserData(1, e.target.value); // Fetch users based on search query
  };

  // Change page
  const paginate = (pageNumber) => {
    fetchUserData(pageNumber, searchQuery);
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Box p={4} maxW="1200px" mx="auto">
      {showUserForm ? (
        <UserForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          bgColor={bgColor}
          textColor={textColor}
          borderColor={borderColor}
        />
      ) : (
        <UserList
          users={users}
          loading={loading}
          paginate={paginate}
          totalPages={totalPages}
          currentPage={currentPage}
          setShowUserForm={setShowUserForm}
          bgColor={bgColor}
          textColor={textColor}
          borderColor={borderColor}
          secondaryBgColor={secondaryBgColor}
          handleSearch={handleSearch}
          searchQuery={searchQuery}
          itemsPerPage={itemsPerPage} // Pass itemsPerPage as a prop
        />
      )}
    </Box>
  );
};

export default AddUser;