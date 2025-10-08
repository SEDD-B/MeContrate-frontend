import { Avatar, Button, Flex, Text } from "@chakra-ui/react"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import Sidebar from "../components/Sidebar/Sidebar"
import { Link } from "react-router-dom"

export const Header = () => {
    const { user } = useAuth()
    const [ sideBarOpen, setSideBarOpen ] = useState(false)

    return (
        <Flex
            alignItems="center"
            justifyContent="flex-end"
            mr={{base: 1, md: 0}}
            my={{base: 2, md: 0}}
            p={{base: 0, md: 3}}
            backgroundColor="gray.800"
        >
            <Flex
                flexDirection="column"
                alignItems="center"
                mr={2}
            >
                <Text
                    fontSize={"md"}
                    fontWeight={"bold"}
                    alignSelf="end"
                >
                    {user?.name}
                </Text>
                <Text as={"small"}>
                    Desenvolvedor Front-End
                </Text>
            </Flex>
            <Avatar.Root
                size={"xl"}
                colorPalette={"green"}
                _hover={{ cursor: "pointer" }}
                onClick={() => {sideBarOpen == true ? setSideBarOpen(false) : setSideBarOpen(true)}}
            >
                <Avatar.Fallback
                    name={user?.name}
                />
            </Avatar.Root>

            { sideBarOpen == true ? 
                (<Sidebar
                    isOpen={sideBarOpen}
                    onClose={() => setSideBarOpen(false)}
                    width={320}
                    position="right"
                >
                    <Button
                        width="100%"
                        height="75px" 
                        variant="ghost"
                        bg="gray.900"
                        my={1}
                        _hover={{ bg: "gray.950" }}
                    >
                        <Link to="/">Inicio</Link>
                    </Button>
                    <Button
                        width="100%"
                        height="75px" 
                        variant="ghost"
                        bg="gray.900"
                        my={1}
                        _hover={{ bg: "gray.950" }}
                    > 
                        <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    <Button
                        width="100%"
                        height="75px" 
                        variant="ghost"
                        bg="gray.900"
                        my={1}
                        _hover={{ bg: "gray.950" }}
                        onClick={() => {setSideBarOpen(false)}}
                    > Fechar </Button>
                    </Sidebar>) : (null)}
        </Flex>
    )
}