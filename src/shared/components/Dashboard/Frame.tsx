import { Box, Flex, Text } from "@chakra-ui/react";

import React from "react";

interface FrameProps {
    title: string;
    quantity: number;
    children?: React.ReactNode;
}

export default function Frame ({ title, quantity, children }: FrameProps) {
    return (
        <Flex
            minWidth={{base: "90dvw", md: "175px", lg: "275px"}}
            width="fit-content"
            height="90px"
            //justifyContent={{base: "flex-start", md: "space-around"}}
            justifyContent="flex-start"
            alignItems="center"
            direction="row"
            //borderImage="linear-gradient(90deg, #2a5cff, #c46cff) 1"
            //borderImageSlice="1"
            bg="gray.950"
            borderRadius="3xl"
            border="2px solid transparent"
            p={5}
            gap={3}
            cursor="pointer"
            _hover={{bg:"radial-gradient(#151515, #111111) padding-box, linear-gradient(90deg, #2a5cff, #c46cff) border-box"}}
        >
            <Flex
                width={{base: "60px", md: "60px"}}
                height={{base: "60px", md: "60px"}}
                bg="radial-gradient(circle at top, #47474fff, #111113ff 70%)"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
            >
                {children}
            </Flex>
            <Flex
                flexDirection="column"
                alignItems="start"
                justifyContent={{base: "flex-start", md: "center"}}
            >
                <Box>
                    <Text
                        fontSize="3xl"
                        fontWeight="bold"
                    >{ title == "Ganhos Totais" ? (`${quantity.toLocaleString('pt-BR', {style: "currency", currency: "BRL"})}`) : (`${quantity}`)}</Text>
                </Box>
                <Box
                    mt={{base: -1 , md: -3}}
                >
                    <Text
                        fontSize="md"
                        fontWeight="light"
                    >{title}</Text>
                </Box>
            </Flex>
        </Flex>
    )
}