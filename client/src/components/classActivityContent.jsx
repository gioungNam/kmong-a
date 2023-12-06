import {
  Box,
  Heading,
  Text,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Table,
  Tab, Tabs, TabList,
  TabPanel,
  TabPanels,TableContainer,
  IconButton
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { useMutation, gql } from "@apollo/client";
import { useEffect } from "react";
import { Container, Spinner } from "@chakra-ui/react";
import { StarIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';

const QUERY_SUBJECT = gql`
query Subject($subjectId: ID!) {
  subject(subjectId: $subjectId) {
    name
    classification
    credit
    capacity
    users {
      _id
    }
  }
}
`

const QUERY_SUBJECT_NOTICES = gql`
  query SubjectNotices($subjectId: ID!) {
    subjectNotices(subjectId: $subjectId) {
      _id
      title
    }
  }
`;

// 로그인한 유저 즐겨찾기 쿼리
export const QUERY_USER_FAVORITE = gql`
query FavoriteNotices($userId: ID!) {
  favoriteNotices(userId: $userId) {
    _id
    title
    content
    subject {
      _id
      name
    }
  }
}
`;


const ClassActivityContent = (props) => {

  const { data: favNoticesData, loading: favNoticesLoading, error: favNoticesError, refetch: refetchFavorites } = useQuery(QUERY_USER_FAVORITE, {
    variables: {
      userId: props?.user?.email,
    },fetchPolicy: "no-cache",
    onError(graphqlError) {
    console.log(graphqlError);
    }
  });

  const [favorites, setFavorites] = useState([]);

  // 즐찾 여부
  const isFavorite = (id) => favorites.includes(id);

  // 즐찾 클릭시 기능동작
  const toggleFavorite = (id) => {
    if (isFavorite(id)) {
      // 이미 즐겨찾기한 경우 해제
      props.handleCancelFavorite(id);
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      // 즐겨찾기 기능
      props.handleAddFavorite(id);
      setFavorites([...favorites, id]);
    }
  };

  useEffect(() => {
    if (!favNoticesLoading && favNoticesData) {
      const temp = favNoticesData?.favoriteNotices?.map(notice => notice._id) || [];
      setFavorites(temp);
    }
  }, [favNoticesLoading, favNoticesData]);


  const basicBoxStyles = {
    background: 'url(./pxfuel.jpg) center/cover no-repeat'
  };

  function get_id(title) {
    if (title) return title;
    else {
      if (props?.user?.isAdmin) {
        props.setTitle("6471ea1d8c0d64b3c26745d4");
        return "6471ea1d8c0d64b3c26745d4";
      } else {
        props.setTitle(props?.user?.subjects[0]._id);
        return props?.user?.subjects[0]._id;
      }
    }
  }

  const _id = get_id(props.title);
  const subjectValues = { subjectId: _id };
  const noticesValues = { subjectId: _id };
  const { data: subjectData, loading: subjectLoading, error: subjectError } = useQuery(QUERY_SUBJECT, {
    variables: subjectValues,
    onError(graphqlError) {
      console.log(graphqlError);
    }
  });


  const { data: noticesData, loading: noticesLoading, error: noticesError } = useQuery(QUERY_SUBJECT_NOTICES, {
    variables: noticesValues,
    onError(graphqlError) {
      console.log(graphqlError);
    }
  });


  if (subjectLoading || noticesLoading) return (
    <Container
      display={props.hidden ? "none" : "flex"}
      p={0}
      maxW="80%"
      wrap="wrap"
      justify="center"
      align="center"
    >
      <Box
        sx={basicBoxStyles}
        w="inherit"
        h="270px"
        mx="auto"
        objectFit='cover'
      >
        <Spinner size='xl' />
      </Box>
    </Container>)

if (!subjectLoading && !noticesLoading) {
  const subject = subjectData.subject;
  const subjectNotices = noticesData?.subject?.notices || [];
  if (!subject) {
    return <div>과목 정보를 찾을 수 없습니다.</div>;
  }

  // tab 관련
  const handleTabClick = (n) => {
    props.setTab(n);
  }


  return (
    <>
      <Container
        display={props.hidden ? "flex" : "none"}
        maxW="80%"
        h="65px"
      />
      <Container
        display={props.hidden ? "none" : "flex"}
        p={0}
        maxW="80%"
        wrap="wrap"
        justify="center"
        align="center"
      >
        <Box
            flex={1}
            h="850px"
        >
          <Box
                h={100}
                p={10}

            >
              <Heading as="h2" fontSize={30}>학습 정보</Heading>  
            </Box>
            <Box
                h={550}
                p={5}
            >
              <Tabs variant='enclosed' colorScheme='gray' index={props.tab} onChange={handleTabClick}>
              <TabList >
                        <Tab _selected={{ color: 'white', bg: 'blackAlpha.700' }} fontWeight="600">공지사항</Tab>
                        <Tab _selected={{ color: 'white', bg: 'blackAlpha.700' }} fontWeight="600">질의응답</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        {/*Table*/}
                        <TableContainer  >
                        <Table variant='simple' >
                          <Thead >
                          <Tr >
                                            {/* <Th w="10%" bgColor="blackAlpha.800" borderRightColor="white" borderRightWidth="1px">
                                                    <Text textAlign="center" fontSize="15" textColor="white">번호</Text>
                                            </Th> */}
                                            <Th w="80%" bgColor="blackAlpha.800" borderRightColor="white" borderRightWidth="1px">
                                                    <Text textAlign="center" fontSize="15" textColor="white">제목</Text>
                                            </Th>
                                            {/* <Th bgColor="blackAlpha.800" borderRightColor="white" borderRightWidth="1px">
                                                    <Text textAlign="center" fontSize="15" textColor="white">작성자</Text>
                                            </Th>
                                            <Th bgColor="blackAlpha.800" borderRightColor="white" borderRightWidth="1px">
                                                    <Text textAlign="center" fontSize="15" textColor="white">작성일</Text>
                                            </Th>
                                            <Th w="10%" bgColor="blackAlpha.800" borderRightColor="white" borderRightWidth="1px">
                                                    <Text textAlign="center" fontSize="15" textColor="white">조회수</Text>
                                            </Th> */}
                                            <Th bgColor="blackAlpha.800" borderRightColor="white" borderRightWidth="1px">
                                              <Text textAlign="center" fontSize="15" textColor="white">즐겨찾기</Text>
                                            </Th>
                                        </Tr>
                                        </Thead>
                          <Tbody >
                          {noticesData?.subjectNotices?.map((notice) => (
                              <Tr key={notice?._id}>
                                {/* <Td><Text textAlign="center" fontSize="15">번호</Text></Td> */}
                                <Td><Text textAlign="center" fontSize="15">{notice?.title}</Text></Td>
                                {/* <Td><Text textAlign="center" fontSize="15">작성자</Text></Td>
                                <Td><Text textAlign="center" fontSize="15">작성일</Text></Td>
                                <Td><Text textAlign="center" fontSize="15">조회수</Text></Td> */}
                                <Td textAlign="center"><IconButton
                                  icon={<StarIcon color={isFavorite(notice?._id) ? 'yellow.500' : 'gray.500'} />}
                                  bg="white"
                                  colorScheme={isFavorite(notice?._id) ? 'yellow' : 'yellow'}
                                  onClick={() => toggleFavorite(notice?._id)}
                                  aria-label="즐겨찾기"
                                /></Td>
                              </Tr>
                            ))}
                          </Tbody>
                          </Table>
                        </TableContainer>
                      </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>

      </Container>
    </>
  )
}
};

export default ClassActivityContent;
