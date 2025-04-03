import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
import { requestPasswordReset } from '../../../api/api'; // Import the API function
import illustration from 'assets/img/auth/auth.png';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the API to send the password reset email
            await requestPasswordReset(email);
            setSuccess('Password reset email sent successfully.');
            setError('');
            toast({
                title: 'Email Sent.',
                description: 'Check your inbox for the password reset link.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (err) {
            setError(`Failed to send reset email: ${err.message}`);
            setSuccess('');
        }
    };

    // Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');
    const textColorSecondary = 'gray.400';
    const textColorBrand = useColorModeValue('brand.500', 'white');

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
                        Forgot your password?
                    </Heading>
                    <Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
                        No problem. Just let us know your email address and we’ll email you a password reset link.
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
                            <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                                Email<Text color={textColorBrand}>*</Text>
                            </FormLabel>
                            <Input
                                isRequired
                                variant="auth"
                                fontSize="sm"
                                type="email"
                                placeholder="mail@simmmple.com"
                                mb="24px"
                                fontWeight="500"
                                size="lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {error && (
                                <Text color="red.500" mb="24px">
                                    {error}
                                </Text>
                            )}
                            {success && (
                                <Text color="green.500" mb="24px">
                                    {success}
                                </Text>
                            )}
                            <Button fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px" type="submit">
                                Email password reset link
                            </Button>
                        </FormControl>
                    </form>
                    <Flex justifyContent="center" alignItems="center" mt="4">
                        <NavLink to="/auth/sign-in">
                            <Text color={textColorBrand} fontSize="sm" fontWeight="500" _hover={{ textDecoration: 'underline' }}>
                                Back to Sign In
                            </Text>
                        </NavLink>
                    </Flex>
                </Flex>
            </Flex>
        </DefaultAuth>
    );
}

export default ForgetPassword;