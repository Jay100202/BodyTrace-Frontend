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
import { createUser, fetchUsers, getUserById, editUser } from "../../../../api/api"; // Import new API functions

// UserForm Component
const UserForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  handleCancel,
  isEditing,
  bgColor,
  textColor,
  borderColor,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [imeiNumbers, setImeiNumbers] = useState(formData.imei || [""]); // Initialize with an array

  // Move all useColorModeValue calls to the top level
  const inputBg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const buttonBg = useColorModeValue("gray.100", "gray.600");
  const buttonHoverBg = useColorModeValue("gray.200", "gray.700");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle changes to IMEI input fields
  const handleImeiChange = (index, value) => {
    const updatedImeis = [...imeiNumbers];
    updatedImeis[index] = value;
    setImeiNumbers(updatedImeis);
  };

  // Add a new IMEI input field
  const addImeiField = () => {
    setImeiNumbers([...imeiNumbers, ""]);
  };

  // Remove an IMEI input field
  const removeImeiField = (index) => {
    const updatedImeis = imeiNumbers.filter((_, i) => i !== index);
    setImeiNumbers(updatedImeis);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ ...formData, imei: imeiNumbers }); // Pass IMEI array to the parent
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
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          mb={6}
          color={textColor}
        >
          {isEditing ? "Edit User" : "Add User"}
        </Text>

        <form onSubmit={handleFormSubmit}>
          <FormControl>
            <FormLabel
              htmlFor="name-input"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Name
            </FormLabel>
            <Input
              id="name-input"
              placeholder="e.g., John Doe"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              bg={inputBg}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
              autoComplete="name"
              mb="24px"
            />

            <FormLabel
              htmlFor="email-input"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Email
            </FormLabel>
            <Input
              id="email-input"
              placeholder="e.g., john.doe@example.com"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              bg={inputBg}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
              autoComplete="email"
              mb="24px"
            />

            {!isEditing && (
              <>
                <FormLabel
                  htmlFor="password-input"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
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
                    bg={inputBg}
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
              </>
            )}

            <FormLabel
              htmlFor="imei-input"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              IMEI Numbers
            </FormLabel>
            {imeiNumbers.map((imei, index) => (
              <Flex key={index} align="center" mb="16px">
                <Input
                  id={`imei-input-${index}`}
                  placeholder={`IMEI Number ${index + 1}`}
                  value={imei}
                  onChange={(e) => handleImeiChange(index, e.target.value)}
                  bg={inputBg}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  autoComplete="off"
                  mr={2}
                />
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => removeImeiField(index)}
                >
                  Remove
                </Button>
              </Flex>
            ))}
            <Button
              size="sm"
              colorScheme="blue"
              onClick={addImeiField}
              mt={2}
            >
              + Add IMEI
            </Button>

            <Flex justifyContent="flex-end" mt={6} gap={3}>
              <Button
                variant="outline"
                onClick={handleCancel}
                color={textColor}
                borderColor={borderColor}
                _hover={{ bg: hoverBg }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="solid"
                color={textColor}
                bg={buttonBg}
                _hover={{ bg: buttonHoverBg }}
              >
                {isEditing ? "Update" : "Submit"}
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
  handleEditUser,
  bgColor,
  textColor,
  borderColor,
  secondaryBgColor,
  handleSearch,
  searchQuery,
  itemsPerPage,
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
                    {Array.isArray(user.imei) ? user.imei.join(", ") : user.imei || "N/A"}
                  </Td>
                  <Td py={4}>
                    <Button
                      variant="link"
                      color="purple.600"
                      fontWeight="bold"
                      onClick={() => handleEditUser(user._id)}
                    >
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
    imei: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const toast = useToast();

  const itemsPerPage = 9;

  const bgColor = useColorModeValue("white", "#7551ff");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryBgColor = useColorModeValue("gray.50", "gray.700");

  const fetchUserData = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await fetchUsers(page, itemsPerPage, "name", "asc", search);
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

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (isEditing) {
        // Update existing user
        const userData = {
          name: data.name,
          email: data.email,
          imei: data.imei,
        };

        await editUser(editingUserId, userData);

        toast({
          title: "User updated.",
          description: "The user has been successfully updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Create new user
        const { name, email, password, imei } = data;
        await createUser(name, email, password, imei);

        toast({
          title: "User created.",
          description: "The user has been successfully created.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      // Reset form and state
      setFormData({
        name: "",
        email: "",
        password: "",
        imei: [],
      });
      setShowUserForm(false);
      setIsEditing(false);
      setEditingUserId(null);

      // Refresh the user list
      fetchUserData(currentPage, searchQuery);
    } catch (error) {
      toast({
        title: "Error.",
        description: `Failed to ${isEditing ? "update" : "create"} user: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setShowUserForm(false);
    setIsEditing(false);
    setEditingUserId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      imei: [],
    });
  };

  const handleEditUser = async (userId) => {
    if (!userId) {
      toast({
        title: "Error.",
        description: "User ID is undefined.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const userData = await getUserById(userId);

      setFormData({
        name: userData.name,
        email: userData.email,
        password: "", // Password is not returned for security reasons
        imei: userData.imei || [],
      });

      setIsEditing(true);
      setEditingUserId(userId);
      setShowUserForm(true);
    } catch (error) {
      toast({
        title: "Error.",
        description: `Failed to fetch user details: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    fetchUserData(1, e.target.value);
  };

  const paginate = (pageNumber) => {
    fetchUserData(pageNumber, searchQuery);
  };

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
          isEditing={isEditing}
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
          handleEditUser={handleEditUser}
          bgColor={bgColor}
          textColor={textColor}
          borderColor={borderColor}
          secondaryBgColor={secondaryBgColor}
          handleSearch={handleSearch}
          searchQuery={searchQuery}
          itemsPerPage={itemsPerPage}
        />
      )}
    </Box>
  );
};

export default AddUser;