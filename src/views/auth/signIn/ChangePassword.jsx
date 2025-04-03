import React, { useState } from "react";
import {
    Box,
    Button,
    Flex,
    Text,
    Input,
    FormControl,
    FormLabel,
    InputGroup,
    InputRightElement,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { useSelector } from "react-redux"; // To fetch email from Redux
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import Card from "components/card/Card.js";
import { changePassword } from "../../../api/api"; // Import the changePassword API

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const toast = useToast();

    // Fetch email from Redux
    const email = useSelector((state) => state.user.email); // Replace with the correct Redux state path

    // Chakra color mode values
    const bgColor = useColorModeValue("white", "#7551ff");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const inputBg = useColorModeValue("white", "gray.700");
    const hoverBg = useColorModeValue("gray.100", "gray.600");
    const buttonBg = useColorModeValue("gray.100", "gray.600");
    const buttonHoverBg = useColorModeValue("gray.200", "gray.700");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "New password and confirm password do not match.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            // Call the changePassword API
            await changePassword(email, oldPassword, newPassword, confirmPassword);

            toast({
                title: "Password Changed",
                description: "Your password has been successfully changed.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Reset form fields
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to change password.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
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
                    Change Password
                </Text>

                <form onSubmit={handleSubmit}>
                    <FormControl>
                        {/* Email Field (Read-Only) */}
                        <FormLabel htmlFor="email-input" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                            Email
                        </FormLabel>
                        <Input
                            id="email-input"
                            value={email || ""}
                            isReadOnly
                            bg={inputBg}
                            border="1px"
                            borderColor={borderColor}
                            borderRadius="md"
                            mb="24px"
                        />

                        {/* Old Password Field */}
                        <FormLabel htmlFor="old-password-input" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                            Old Password
                        </FormLabel>
                        <InputGroup size="md" mb="24px">
                            <Input
                                id="old-password-input"
                                placeholder="Enter old password"
                                type={showPassword ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                bg={inputBg}
                                border="1px"
                                borderColor={borderColor}
                                borderRadius="md"
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

                        {/* New Password Field */}
                        <FormLabel htmlFor="new-password-input" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                            New Password
                        </FormLabel>
                        <InputGroup size="md" mb="24px">
                            <Input
                                id="new-password-input"
                                placeholder="Enter new password"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                bg={inputBg}
                                border="1px"
                                borderColor={borderColor}
                                borderRadius="md"
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

                        {/* Confirm Password Field */}
                        <FormLabel htmlFor="confirm-password-input" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                            Confirm Password
                        </FormLabel>
                        <InputGroup size="md" mb="24px">
                            <Input
                                id="confirm-password-input"
                                placeholder="Confirm new password"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                bg={inputBg}
                                border="1px"
                                borderColor={borderColor}
                                borderRadius="md"
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

                        {/* Submit Button */}
                        <Flex justifyContent="flex-end" mt={6}>
                            <Button
                                type="submit"
                                variant="solid"
                                color={textColor}
                                bg={buttonBg}
                                _hover={{ bg: buttonHoverBg }}
                            >
                                Change Password
                            </Button>
                        </Flex>
                    </FormControl>
                </form>
            </Card>
        </Box>
    );
};

export default ChangePassword;