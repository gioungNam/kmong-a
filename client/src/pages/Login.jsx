import {
    Box,
    Button,
    Container,
    Divider,
    Heading, HStack,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Stack,
    Text, useToast, VStack
} from "@chakra-ui/react";
import {useState, useRef, useContext} from "react";
import {useMutation, gql } from "@apollo/client";
import {AuthContext} from "../context/authContext";
import {useForm} from "../utility/useForm";

const LOGIN_USER = gql`
  mutation Login($loginId: String!, $password: String!) {
    login(id: $loginId, password: $password) {
        token
        user {
          _id
          isAdmin
          username
          subjects {
            _id
          }
        }
    }
  }
`

const Login = (props) => {

    const context = useContext(AuthContext);
    const [ errors, setErrors ] = useState([]);

    const loginUserCallback = async () => {
        await login();
    }

    const { onIdChange, onPwChange, onSubmit, values } = useForm(loginUserCallback, {
        loginId: '',
        password: ''
    });

    const [login, {loading}] = useMutation(LOGIN_USER, {
        variables:  values ,
        update(proxy, {data: {login: userData }}) {
            context.login(userData);
            addSuccessToast(userData.user.username);
            setInterval( () => {
                window.location.replace("/class/");
            }, 1000);
        },
        onError({graphQLErrors}){
            setErrors(graphQLErrors);
            addErrorToast();
        }
    });

    //CSS
    const toast = useToast()
    const toastIdRef = useRef()
    const [show, setShow] = useState(false)

    function addErrorToast() {
       toastIdRef.current = toast(
           {
               description: '다시 입력해주세요 :(',
               status: 'error'
           })
    }

    function addSuccessToast(username) {
        toastIdRef.current = toast(
            {
                description: `${username}님 환영합니다 :)`,
                status: 'success'
            })
    }

    const basicBoxStyles = {
        background:
            'url(/dgu_logo.png) center/cover no-repeat'
    }

    const handleClick = () => setShow(!show)

    return (
        <Container p={10}>
            <HStack spacing={5} mt={100}>
                <Box sx={basicBoxStyles} w="30px" h="65px"/>
                <VStack align="center">
                    <Heading as="h1" color="#FBB738">Dongguk University</Heading>
                    <Text fontWeight="1000" color="#864600">동국대학교 이클래스</Text>
                </VStack>
            </HStack>

            <Divider my={6} />
            <Box my={6} align="center" >
                <Stack spacing={4}>
                    <InputGroup>
                        <InputLeftAddon children='학번' bgColor="#FBB738" textColor="#864600" fontWeight="800"/>
                        <Input onChange={onIdChange} focusBorderColor='#FBB738' type='search' placeholder='학번을 입력해주세요!' />
                    </InputGroup>
                    <InputGroup>
                        <InputLeftAddon children='비밀번호' bgColor="#FBB738" textColor="#864600" fontWeight="800"/>
                        <Input onChange={onPwChange} focusBorderColor='#FBB738' type={show ? 'text' : 'password'} placeholder='비밀번호를 입력해주세요!' />
                        <InputRightElement width='8rem'>
                        <Button h='1.75rem' size='sm' color="white" bg="#FBB738" onClick={handleClick}>
                                {show ? '비밀번호 숨기기' : '비밀번호 확인'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    <Button
                        onClick={onSubmit}
                        bgColor="#FBB738"
                        _hover={{ bgColor: '#FBB738' }}
                        _focus={{ bgColor: '#FBB738' }}
                    >
                        <Text color="white">로그인</Text>
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
}

export default Login;