import {Box, Button, Container, Heading, HStack, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import GroupLists from "./groupLists";

const ClassActivityContent = (props) => {
    const handleTabClick = (n) => {
        props.setTab(n);
    }

     return (
        <Box
            flex={1}
            h="850px"
        >
            <Box
                h={100}
                p={10}

            >
                <HStack justify="space-between">
                    <Heading as="h2" fontSize={30}>학습 정보</Heading>
                    <Button>과목 정보</Button>
                </HStack>
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
                            
                        </TabPanel>
                        <TabPanel>
                        </TabPanel>
                        <TabPanel>
                        </TabPanel>
                        <TabPanel>
                        </TabPanel>
                        <TabPanel>
                        </TabPanel>
                        <TabPanel>
                            <Container alignItems="center" maxW="100%">
                                <GroupLists title={props.title} user={props.user} />
                            </Container>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    )
}

export default ClassActivityContent;