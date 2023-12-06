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
    IconButton, Container, Button, Icon
  } from "@chakra-ui/react";

import { CloseIcon } from '@chakra-ui/icons';
import React, { useState, useEffect } from 'react';
import { QUERY_USER_FAVORITE } from "../components/classActivityContent";
import { useQuery } from "@apollo/client";

const FavoriteNoticeContent = (props) => {

    // 초기 value
    const { data: initFavList, loading: initLoading } = useQuery(QUERY_USER_FAVORITE, {
        variables: {
        userId: props.user.email
        },fetchPolicy: "no-cache",
        onError(graphqlError) {
        console.log(graphqlError);
        }

    });

    const [favList, setFavList] = useState(initFavList?.favoriteNotices);
    

    useEffect(() => {
        if (!initLoading && initFavList) {
          setFavList(initFavList?.favoriteNotices);
        }
      }, [initLoading, initFavList]);

    // tab 관련
    const handleTabClick = (n) => {
        props.setTab(n);
    }

    const handleCancelClick = (noticeId) => {
        // 즐겨찾기 삭제
        props.handleCancelFavorite(noticeId);
        // state update하여 리렌더링
        const updatedList = favList.filter((notice) => notice._id !== noticeId);
        setFavList(updatedList);
    }

    return (
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
            h="850px">
                <Box
                h={100}
                p={10}>
              <Heading as="h2" fontSize={30}>즐겨찾기</Heading>  
            </Box>
            <Box
                h={550}
                p={5}
            >
                <Tabs variant='enclosed' colorScheme='gray' index={props.tab} onChange={handleTabClick}>
                <TabList >
                        <Tab _selected={{ color: 'white', bg: 'blackAlpha.700' }} fontWeight="600">즐겨찾기</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>  
                        <TableContainer  >
                                <Table variant='simple' >
                                <Thead >
                                <Tr >
                                                    <Th w="20%" bgColor="blackAlpha.800" borderRightColor="white" borderRightWidth="1px">
                                                            <Text textAlign="center" fontSize="15" textColor="white">과목</Text>
                                                    </Th>
                                                    <Th bgColor="blackAlpha.800" borderRightColor="white" borderRightWidth="1px">
                                                            <Text textAlign="center" fontSize="15" textColor="white">제목</Text>
                                                    </Th>
                                                    <Th w="10%" bgColor="blackAlpha.800" borderRightColor="white" borderRightWidth="1px">
                                                            <Text textAlign="center" fontSize="15" textColor="white">취소</Text>
                                                    </Th>
                                                </Tr>
                                                </Thead>
                                <Tbody >
                                    {favList?.map((notice) => (
                                        <Tr key={notice?._id}>
                                        <Td><Text textAlign="center" fontSize="15">{notice?.subject?.name}</Text></Td>
                                        <Td><Text textAlign="center" fontSize="15">{notice?.title}</Text></Td>
                                        <Td textAlign="center">
                                        <IconButton
                                            aria-label="취소"
                                            icon={<CloseIcon />}
                                            onClick={() => handleCancelClick(notice._id)}
                                            variant="ghost"
                                        />
                                        </Td>
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
    );

};


export default FavoriteNoticeContent;