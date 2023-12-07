import {
    Button,
    Container,
    HStack,
    Spinner,
    Box
} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronUpIcon, InfoIcon, ChatIcon} from "@chakra-ui/icons";
import {useContext, useState} from "react";
import {gql, useQuery} from "@apollo/client";
import {AuthContext} from "../context/authContext";
import TitleBox from "./titleBox";
import OptionLists from "./optionLists";
import ChatWindow from "./classChatWindow";

const QUERY_USER = gql`
    query User($userId: ID!) {
       user(userId: $userId) {
        email
        isAdmin
        _id
        subjects {
          _id
        }
        username
      }
    }
`

const ClassTitleBox = (props) => {

    const [hidden, setHidden] = useState(false);

    // 모달 open 관련 state
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
      };
    
      const closeModal = () => {
        setModalOpen(false);
      };

    const context = useContext(AuthContext);
    const values = { userId : context.user.userId };
    const { data, loading, error } = useQuery(QUERY_USER, {
        variables: values,
        onError(graphglError){
            console.log(graphglError);
        }
    });



    const handleTopBox = () => {
        setHidden(!hidden);
    }

    // 모달 호출시 배경 설정
    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };

      // 모달 스타일 설정
      const modalStyle = {
        // position: 'relative',
        backgroundColor: 'white',
        padding: '2px',
        paddingBottom: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      };

      // 모달 닫기 버튼
      const closeButtonStyle = {
        marginLeft: 'auto',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
      };

    // Flex 컴포넌트
    const Flex = ({ children }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
    );

    if(loading) return (<Spinner />)
    if(!loading) return (
        <>
            <TitleBox hidden={hidden} data={data} title={props.title} setTitle={props.setTitle}/>
            <Container
                bgGradient='linear(to-t, #A0A0A0 0%, #F0F0F0 100%)'
                maxW="80%"
                h="50px"
            >
                <HStack
                    justify="space-between"
                    pt={3}
                >

                    <OptionLists data={data} setTitle={props.setTitle} />
                    <Button onClick={handleTopBox} size="xl" w="30px">
                        {hidden ? <ChevronDownIcon /> : <ChevronUpIcon />  }
                    </Button>
                    <Flex>
                    <Button
                        fontSize={13}
                        p={1}
                        border="solid"
                        borderColor="blackAlpha.300"
                        borderWidth="1px"
                        bgColor="yellow.200"  
                        size="xl"
                        mr={1}
                        onClick={openModal}
                    >
                        {/* 메시지 아이콘 + 채팅 텍스트 */}
                        <ChatIcon mr={1} />채팅
                    </Button>
                    <Button
                        fontSize={13}
                        p={1}
                        border="solid"
                        borderColor="blackAlpha.300"
                        borderWidth="1px"
                        bgColor="whiteAlpha.800"
                        size="xl"
                    >
                        <InfoIcon mr={1} />
                        강의계획서
                    </Button>
                    </Flex>
                </HStack>
                {isModalOpen && (
                    <Box style={modalOverlayStyle}>
                    <Box style={modalStyle}>
                        <Flex justifyContent="flex-end">
                        <Button onClick={closeModal} style={closeButtonStyle} marginBottom={10}>
                            <Box as="span" fontSize="xl" fontWeight="bold" color="gray.500">
                            x
                            </Box>
                        </Button>
                        </Flex>
                        <ChatWindow subject={{title: props.title}}/>
                    </Box>
                    </Box>
                )}
            </Container>
        </>
    )
}


export default ClassTitleBox;