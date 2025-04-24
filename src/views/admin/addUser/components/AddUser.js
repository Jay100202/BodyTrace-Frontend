import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FaFileExcel, FaDownload } from "react-icons/fa";
import Card from "components/card/Card.js";
import { createUsersFromExcel } from "../../../../api/api";

const ExcelUploadDownload = () => {
  const [isExcelProcessing, setIsExcelProcessing] = useState(false);
  const [processedExcelData, setProcessedExcelData] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  // Change the dark mode background color to navy.800 instead of #7551ff
  const bgColor = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const noteTextColor = useColorModeValue("gray.500", "gray.400");

  const handleExcelUpload = async (file) => {
    if (!file) return;
    
    setIsExcelProcessing(true);
    try {
      const responseBlob = await createUsersFromExcel(file);
      setProcessedExcelData(responseBlob);
      
      toast({
        title: "Excel processed successfully",
        description: "Your file has been processed. You can now download the results.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error processing Excel file",
        description: error.message || "There was an error processing your Excel file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsExcelProcessing(false);
    }
  };

  const handleDownloadExcel = () => {
    if (!processedExcelData) return;
    
    // Create a download link for the blob
    const url = window.URL.createObjectURL(processedExcelData);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_users.xlsx';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Reset state to allow uploading another file
    setProcessedExcelData(null);
    
    toast({
      title: "Download started",
      description: "Your file is being downloaded.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box pt={20}>
      <Card
        p={4}
        bg={bgColor}
        borderRadius="xl"
        boxShadow="sm"
        w="100%"
        minH="200px"
        h="100%"
      >
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          mb={6}
          color={textColor}
        >
          Bulk User Management
        </Text>

        <Flex 
          direction="column"
          align="center"
          justify="center"
          h="150px"
          border="2px dashed"
          borderColor={borderColor}
          borderRadius="md"
          p={4}
          mb={4}
        >
          {isExcelProcessing ? (
            <Flex direction="column" align="center" justify="center">
              <Spinner size="xl" mb={4} />
              <Text color={textColor}>Processing your Excel file...</Text>
            </Flex>
          ) : processedExcelData ? (
            <Flex direction="column" align="center" justify="center">
              <Text mb={4} color={textColor}>Your file has been processed and is ready for download</Text>
              <Button 
                colorScheme="green" 
                leftIcon={<FaDownload />}
                onClick={handleDownloadExcel}
                size="lg"
              >
                Download Results
              </Button>
            </Flex>
          ) : (
            <Flex direction="column" align="center" justify="center">
              <Text mb={4} color={textColor}>Upload an Excel file containing user information</Text>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".xlsx, .xls"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    handleExcelUpload(e.target.files[0]);
                  }
                }}
              />
              <Button 
                colorScheme="teal" 
                leftIcon={<FaFileExcel />}
                onClick={() => fileInputRef.current.click()}
                size="lg"
              >
                Upload Excel
              </Button>
            </Flex>
          )}
        </Flex>

        <Box mt={4}>
          <Text fontSize="sm" color={noteTextColor}>
            Note: The Excel file should contain columns for Name, Email, Password, and IMEI numbers. After processing, you will receive a file with results of the operation.
          </Text>
        </Box>
      </Card>
    </Box>
  );
};

export default ExcelUploadDownload;