import React, { useState } from "react";
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
  Tag,
  useColorModeValue,
  Textarea,
  HStack,
  Circle,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

// Import your Card component
import Card from "components/card/Card.js";

// Sample initial data
const initialProducts = [
  { id: 1, name: "Venus Dashboard Builder PRO", email: "vlad@simmmple.com", date: "Oct 24, 2022", status: "COMPLETED", price: 59.90 },
  { id: 2, name: "Venus Design System PRO", email: "fredy@simmmple.com", date: "Nov 17, 2019", status: "COMPLETED", price: 149.90 },
  { id: 3, name: "Vision UI Dashboard Chakra PRO", email: "mark@yahoo.com", date: "Jan 30, 2021", status: "COMPLETED", price: 69.00 },
  { id: 4, name: "Purity UI Dashboard PRO", email: "markus.a@gmail.com", date: "Aug 02, 2021", status: "COMPLETED", price: 69.00 },
  { id: 5, name: "Argon Dashboard Chakra PRO", email: "lorentz@gmail.com", date: "Apr 19, 2021", status: "COMPLETED", price: 129.90 },
  { id: 6, name: "Vision UI Dashboard MUI PRO", email: "wilson.tim@msn.com", date: "Sep 12, 2021", status: "COMPLETED", price: 349.90 }
];

const AddUser = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    collection: "",
    weight: "",
    color: "",
    description: "",
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  // Color modes
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const completedBgColor = useColorModeValue("green.100", "green.900");
  const completedTextColor = useColorModeValue("green.700", "green.200");
  const secondaryBgColor = useColorModeValue("gray.50", "gray.700");

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      name: formData.name,
      email: "new@example.com",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      status: "COMPLETED",
      price: 99.99,
    };

    setProducts([...products, newProduct]);

    setFormData({
      name: "",
      collection: "",
      weight: "",
      color: "",
      description: "",
    });
    setShowProductForm(false);
  };

  // Cancel form
  const handleCancel = () => {
    setShowProductForm(false);
    setFormData({
      name: "",
      collection: "",
      weight: "",
      color: "",
      description: "",
    });
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Product Form View
  const ProductForm = () => (
    <Box pt={20}>
      <Card
        p={4}
        bg={bgColor}
        borderRadius="xl"
        boxShadow="sm"
        w="100%"
        minH="500px" // Set a fixed minimum height
        h="100%" // Ensure the card takes full height
      >
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" mb={6} color={textColor}>
          Add Product
        </Text>

        <Flex direction="column" gap={4}>
          <Box>
            <Text mb={2} fontWeight="medium" color={textColor}>
              Product Name
            </Text>
            <Input
              placeholder="e.g., Elegant Chair"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              bg={useColorModeValue("white", "gray.700")}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
            />
          </Box>

          <Box>
            <Text mb={2} fontWeight="medium" color={textColor}>
              Collection
            </Text>
            <Input
              placeholder="e.g., Classics"
              name="collection"
              value={formData.collection}
              onChange={handleInputChange}
              bg={useColorModeValue("white", "gray.700")}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
            />
          </Box>

          <Flex direction={{ base: "column", md: "row" }} gap={4}>
            <Box flex="1">
              <Text mb={2} fontWeight="medium" color={textColor}>
                Weight
              </Text>
              <Input
                placeholder="e.g., 20kg"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                bg={useColorModeValue("white", "gray.700")}
                border="1px"
                borderColor={borderColor}
                borderRadius="md"
              />
            </Box>
            <Box flex="1">
              <Text mb={2} fontWeight="medium" color={textColor}>
                Color
              </Text>
              <Input
                placeholder="e.g., Purple"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                bg={useColorModeValue("white", "gray.700")}
                border="1px"
                borderColor={borderColor}
                borderRadius="md"
              />
            </Box>
          </Flex>

          <Box>
            <Text mb={2} fontWeight="medium" color={textColor}>
              Description
            </Text>
            <Textarea
              placeholder="Short description about the product"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              bg={useColorModeValue("white", "gray.700")}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
              rows={4}
            />
          </Box>
        </Flex>

        <Flex justify="flex-end" mt={6} gap={3}>
          <Button
            variant="outline"
            onClick={handleCancel}
            color={textColor}
            borderColor={borderColor}
            _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
          >
            Cancel
          </Button>
          <Button bg="indigo.900" color="white" _hover={{ bg: "indigo.800" }} onClick={handleSubmit}>
            Submit
          </Button>
        </Flex>
      </Card>
    </Box>
  );

  // Product List View
  const ProductList = () => (
    <Box pt={20}>
      <Card
        p={4}
        bg={bgColor}
        borderRadius="xl"
        boxShadow="sm"
        w="100%"
        minH="500px" // Set a fixed minimum height
        h="100%" // Ensure the card takes full height
      >
        <Flex w="100%" maxW="500px" mb={4} mx="auto" align="center">
          <InputGroup flex="1">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              bg={secondaryBgColor}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
            />
          </InputGroup>
          <Button ml={4} colorScheme="blue" onClick={() => setShowProductForm(true)}>
            Add User
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th pl={0} color="gray.500" fontWeight="medium">
                  PRODUCT NAME
                </Th>
                <Th color="gray.500" fontWeight="medium">
                  EMAIL
                </Th>
                <Th color="gray.500" fontWeight="medium">
                  DATE
                </Th>
                <Th color="gray.500" fontWeight="medium">
                  STATUS ORDER
                </Th>
                <Th color="gray.500" fontWeight="medium">
                  TOTAL PRICE
                </Th>
                <Th color="gray.500" fontWeight="medium">
                  ORDER ACTIONS
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentItems.map((product) => (
                <Tr key={product.id} borderBottom="1px" borderColor={borderColor}>
                  <Td pl={0} py={4} fontWeight="bold" color={textColor}>
                    {product.name}
                  </Td>
                  <Td py={4} color="gray.600">
                    {product.email}
                  </Td>
                  <Td py={4} color="gray.600">
                    {product.date}
                  </Td>
                  <Td py={4}>
                    <Tag
                      size="md"
                      borderRadius="full"
                      bg={completedBgColor}
                      color={completedTextColor}
                      px={3}
                      py={1}
                    >
                      {product.status}
                    </Tag>
                  </Td>
                  <Td py={4} fontWeight="bold" color={textColor}>
                    ${product.price.toFixed(2)}
                  </Td>
                  <Td py={4}>
                    <Button variant="link" color="purple.600" fontWeight="bold">
                      Edit order
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );

  return <Box p={4} maxW="1200px" mx="auto">{showProductForm ? <ProductForm /> : <ProductList />}</Box>;
};

export default AddUser;