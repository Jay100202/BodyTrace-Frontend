import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  Image,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import logoWhite from "assets/img/layout/logoWhite.png";

export function SidebarLinks(props) {
  // Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  const { routes } = props;

  // Get user type from Redux
  const userType = useSelector((state) => state.user.type);

  console.log("User Type:", userType); // Debugging line to check user type

  // Filter routes based on user type and display property
  const filteredRoutes = routes.filter((route) => {
    // Exclude routes with display: false
    if (route.display === false) {
      return false;
    }

    // Admin: Show "Add User" and "Middle Admin"
    if (userType === "admin") {
      return route.name === "Add User" || route.name === "Middle Admin";
    }

    // Middle Admin: Show "Middle Admin IMEI" and "Middle Admin Dashboard"
    if (userType === "middleAdmin") {
      return route.name === "Middle Admin IMEI" || route.name === "Middle Admin Dashboard";
    }

    // User: Show only "Main Dashboard" and "List User IMEI"
    if (userType === "user") {
      return route.name === "Main Dashboard" || route.name === "List User IMEI";
    }

    return false; // Default: show nothing if userType is undefined
  });

  return (
    <Flex direction="column" height="100%" pt="25px" px="16px" borderRadius="30px">
      {/* Brand/Logo Section */}
      <Flex alignItems="center" justifyContent="center" mb="20px">
        <Image
          src={logoWhite}
          alt="Horizon Free Logo"
          width="100%"
          maxWidth="110px"
          objectFit="contain"
        />
        {!logoWhite && (
          <Heading ml="10px" size="md" color={activeColor}>
            Body Trace
          </Heading>
        )}
      </Flex>

      {/* Navigation Links */}
      <VStack spacing="10px" align="stretch" width="full" mb="auto">
        {filteredRoutes.map((route, index) => {
          if (route.category) {
            return (
              <Text
                key={index}
                fontSize="md"
                color={activeColor}
                fontWeight="bold"
                ps={{ sm: "10px", xl: "16px" }}
                pt="18px"
                pb="12px"
              >
                {route.name}
              </Text>
            );
          } else {
            return (
              <NavLink key={index} to={route.layout + route.path}>
                {({ isActive }) => {
                  const activeRoute = isActive;
                  return (
                    <HStack
                      spacing={activeRoute ? "22px" : "26px"}
                      py="5px"
                      ps="10px"
                      bg={activeRoute ? "gray.100" : "transparent"}
                      borderRadius="md"
                      _hover={{
                        bg: activeRoute ? "gray.100" : "gray.50",
                      }}
                    >
                      <Flex w="100%" alignItems="center" justifyContent="space-between">
                        <Flex alignItems="center">
                          <Box color={activeRoute ? activeIcon : textColor} me="18px">
                            {route.icon}
                          </Box>
                          <Text
                            color={activeRoute ? activeColor : textColor}
                            fontWeight={activeRoute ? "bold" : "normal"}
                          >
                            {route.name}
                          </Text>
                        </Flex>
                        <Box
                          h="36px"
                          w="4px"
                          bg={activeRoute ? brandColor : "transparent"}
                          borderRadius="5px"
                        />
                      </Flex>
                    </HStack>
                  );
                }}
              </NavLink>
            );
          }
        })}
      </VStack>
    </Flex>
  );
}

export default SidebarLinks;