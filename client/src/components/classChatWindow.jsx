// ChatWindow 컴포넌트
import {
  Box,
  Button,
  Container,
  Divider,
  Heading, HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Text,  VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {gql, useQuery } from "@apollo/client";

const QUERY_SUBJECT = gql`
query Subject($subjectId: ID!) {
  subject(subjectId: $subjectId) {
    name
    classification
    capacity
    credit
    openurl
  }
}
`
/**
 * 오픈채팅 모달
 * @param {*} props 
 * @returns 
 */
const ChatWindow = (props) => {

  // 과목 오픈채팅url을 얻기 위해 query 실행
  const { data: subjectInfo, loading: subjectInfoLoading } = useQuery(QUERY_SUBJECT, {
    variables: {
      subjectId: props?.subject?.title
    },fetchPolicy: "no-cache",
    onError(graphqlError) {
    console.log(graphqlError);
    }

  });

  // url
  const [curUrl, setUrl] = useState("");

  useEffect(() => {
    if (!subjectInfoLoading && subjectInfo) {
      setUrl(subjectInfo?.subject?.openurl);
    }
  }, [subjectInfoLoading, subjectInfo]);

  // 채팅 join
    const joinOpenChat = (openurl) => {
        // openurl 새 탭으로 실행
        window.open(openurl, '_blank');
    }

    // 핸들러
    const handleJoinOpenChat = () => {
      joinOpenChat(curUrl);
    };

    const basicBoxStyles = {
        background:
            'url(/dgu_logo.png) center/cover no-repeat'
    }

  console.log("curUrl");
  console.log(curUrl);
  return (
    <Container p={10}>
            <HStack spacing={5} mt={1}>
                <Box sx={basicBoxStyles} w="30px" h="65px"/>
                <VStack align="center">
                    <Heading as="h1" color="#FBB738">Dongguk University</Heading>
                    <Text fontWeight="1000" color="#864600">E-Class 오픈채팅</Text>
                </VStack>
            </HStack>

            <Divider my={6} />
            <Box my={6} align="center" >
                <Stack spacing={4}>
                    <InputGroup>
                        <InputLeftAddon children='주소' bgColor="#FBB738" textColor="#864600" fontWeight="800"/>
                        <Input focusBorderColor='#FBB738' type='search' placeholder='오픈채팅 url을 입력해주세요!' value={subjectInfo?.subject?.openurl}/>
                    </InputGroup>
                    <Button
                        onClick={handleJoinOpenChat}
                        bgColor="#FBB738"
                        _hover={{ bgColor: '#FBB738' }}
                        _focus={{ bgColor: '#FBB738' }}
                    >
                        <Text color="white">접속</Text>
                    </Button>
                </Stack>
            </Box>
        </Container>
  );
};

export default ChatWindow;