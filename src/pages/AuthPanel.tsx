import { Toaster, toaster } from "../shared/components/ui/toaster";
import { useAuth } from "../shared/context/AuthContext";
import {
  Box,
  Button,
  Input,
  Link,
  Stack,
  Text,
  Field,
  Container,
  Heading,
  RadioGroup,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

type User = {
  fullname?: string;
  email: string;
  password: string;
}

const AuthPanel: React.FC = () => {
  const [value, setValue] = useState<string | null>(null)
  const [changeAuth, setChangeAuth] = useState('login')
  const [user, setUser] = useState<User>({
    fullname: '',
    email: '',
    password: ''
  })
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (changeAuth === 'register') {
      try {
        await axios.post('http://localhost:5000/api/auth/register', user)
        toaster.create({
          description: 'Usuário cadastrado com sucesso!',
          type: "success",
          duration: 3000
        })
        setChangeAuth('login')
      } catch(err: any) {
        toaster.create({
          description: err?.response?.status === 409
            ? 'Email já cadastrado!'
            : 'Erro ao cadastrar o usuário. Verifique os campos e tente novamente.',
          type: "error",
          duration: 5000
        })
        console.error(err)
      }
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', user)
        if (response.status === 200 && response.data.token) {
          console.log(JSON.stringify(response.data))
          const userData = {
            name: user.email.split('@')[0],
            email: user.email
          };

          setTimeout(() => {
            login(userData)
            localStorage.setItem('token', response.data.token)
          }, 4000)
        }
        toaster.create({
          description: 'Usuário logado com sucesso!',
          type: "success",
          duration: 3000
        })
        setTimeout(() => {
          navigate('/')
        }, 5000)
      } catch(err) {
        toaster.create({
          description: 'Credenciais inválidas. Verifique seu email e senha.',
          type: "error",
          duration: 4000
        })
        console.error(err)
      }
    }
    setUser({
      fullname: '',
      email: '',
      password: ''
    })
  };

  const items = [
    { label: "Freelancer", value: "1" },
    { label: "Contratante", value: "2" },
  ]

  console.log(user)
  return (
    <Box bg="radial-gradient(circle at top, #1a1a1d, #0f0f10 70%)" color="white" maxH={{base: "100% "}} py={{base: 40}} display="flex" justifyContent="center">
      <Container maxW={{base: "xs", md: "lg"}} minH={{base: "sm", md: "50vh"}} bg="gray.800" p={10} borderRadius={{base: "none", md: "lg"}} boxShadow="0 8px 32px rgba(0,0,0,0.6)" alignContent="center">
        <Heading
          fontWeight="bold"
          size="3xl"
          textAlign="center"
          mb={8}
        >
          MeContrate
        </Heading>

        <Stack gap={8}>
          { changeAuth == 'login' ?
            (
              <Box as="form" onSubmit={handleSubmit}>
                <Stack gap={4}>
                  <Field.Root id="email-login" required>
                    <Field.Label>Email</Field.Label>
                    <Input value={user.email} name="email" css={{ "--focus-color": "#ff0095" }} bg="gray.900" px={3} type="email" placeholder="seuemail@exemplo.com" onChange={handleChange} />
                  </Field.Root>
                  <Field.Root id="password-login" required>
                    <Field.Label>Senha</Field.Label>
                    <Input value={user.password} name="password" css={{ "--focus-color": "#ff0095" }} bg="gray.900" px={3} type="password" placeholder="Digite sua senha" onChange={handleChange} />
                  </Field.Root>
                  <Button type="submit" colorScheme="yellow" bg="gray.900" size="lg" border=".5px solid #ff0095" color="white" mt={4} transition="1s ease-in-out" _hover={{ bg: "#ff0095" }} >Entrar</Button>
                </Stack>
                <Text mt={4} textAlign="center">
                  Não tem conta? <Link color="#ff0095" onClick={() => setChangeAuth('register')}>Cadastre-se</Link>
                </Text>
              </Box>
            )
            :
            (
              <Box as="form" onSubmit={handleSubmit}>
                <Stack gap={4}>
                  <Field.Root id="name" required>
                    <Field.Label>Nome Completo</Field.Label>
                    <Input value={user.fullname} name="fullname" css={{ "--focus-color": "#ff0095" }} bg="gray.900" px={3} type="text" placeholder="Seu nome" onChange={handleChange} />
                  </Field.Root>
                  <Field.Root id="email" required>
                    <Field.Label>Email</Field.Label>
                    <Input value={user.email} name="email" css={{ "--focus-color": "#ff0095" }} bg="gray.900" px={3} type="email" placeholder="seuemail@exemplo.com" onChange={handleChange} />
                  </Field.Root>
                  <Field.Root id="password" required>
                    <Field.Label>Senha</Field.Label>
                    <Input value={user.password} name="password" css={{ "--focus-color": "#ff0095" }} bg="gray.900" px={3} type="password" placeholder="Crie uma senha" onChange={handleChange} />
                  </Field.Root>
                  <Field.Root id="confirmPassword" required>
                    <Field.Label>Confirme a Senha</Field.Label>
                    <Input name="confirmPassword" css={{ "--focus-color": "#ff0095" }} bg="gray.900" px={3} type="password" placeholder="Confirme a Senha" onChange={handleChange} />
                  </Field.Root>
                  <RadioGroup.Root mx="auto" value={value} onValueChange={(e) => setValue(e.value)}>
                  {items.map((item) => (
                    <RadioGroup.Item key={item.value} value={item.value} mx="10" mt="5">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  ))}
                  </RadioGroup.Root>
                  <Button type="submit" colorScheme="yellow" bg="gray.900" size="lg" mt={4} border="1px solid" borderColor="#ff0095" color="white" transition="1s ease-in-out" _hover={{ bg: "#ff0095" }}>Cadastrar</Button>
                </Stack>
                <Text mt={4} textAlign="center">
                    Já possui uma conta? <Link color="#ff0095" onClick={() => setChangeAuth('login')}>Login</Link>
                  </Text>
              </Box>
            ) 
          }
        </Stack>
      </Container>
      <Toaster />
    </Box>
  );
}

export default AuthPanel;