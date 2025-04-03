import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Text,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import { resetPassword } from '../../../api/api'; // API for resetting the password
import illustration from 'assets/img/auth/auth.png';

function ResetPassword() {
    const { resetToken } = useParams(); // Get the reset token from the URL
    const navigate = useNavigate();
    const toast = useToast();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(resetToken, newPassword, confirmPassword); // Call the API to reset the password
            toast({
                title: 'Password Reset Successful.',
                description: 'You can now log in with your new password.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            navigate('/auth/sign-in'); // Redirect to the sign-in page
        } catch (err) {
            setError(err.message);
        }
    };

    // Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');
    const textColorSecondary = 'gray.400';

    return (
        <DefaultAuth illustrationBackground={illustration} image={illustration}>
            <Flex
                maxW={{ base: '100%', md: 'max-content' }}
                w="100%"
                mx={{ base: 'auto', lg: '0px' }}
                me="auto"
                h="100%"
                alignItems="start"
                justifyContent="center"
                mb={{ base: '30px', md: '60px' }}
                px={{ base: '25px', md: '0px' }}
                mt={{ base: '40px', md: '14vh' }}
                flexDirection="column"
            >
                <Box me="auto">
                    <Heading color={textColor} fontSize="36px" mb="10px">
                        Reset your password
                    </Heading>
                    <Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
                        Enter your new password below.
                    </Text>
                </Box>
                <Flex
                    zIndex="2"
                    direction="column"
                    w={{ base: '100%', md: '420px' }}
                    maxW="100%"
                    background="transparent"
                    borderRadius="15px"
                    mx={{ base: 'auto', lg: 'unset' }}
                    me="auto"
                    mb={{ base: '20px', md: 'auto' }}
                >
                    <form onSubmit={handleSubmit}>
                        <FormControl>
                            <FormLabel fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                                New Password
                            </FormLabel>
                            <Input
                                isRequired
                                type="password"
                                placeholder="Enter new password"
                                mb="24px"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <FormLabel fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                                Confirm Password
                            </FormLabel>
                            <Input
                                isRequired
                                type="password"
                                placeholder="Confirm new password"
                                mb="24px"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {error && (
                                <Text color="red.500" mb="24px">
                                    {error}
                                </Text>
                            )}
                            <Button fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px" type="submit">
                                Reset Password
                            </Button>
                        </FormControl>
                    </form>
                </Flex>
            </Flex>
        </DefaultAuth>
    );
}

export default ResetPassword;