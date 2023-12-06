import {
    Box,
    Container,
    Flex,
    Spinner
} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import NavBar from "../components/navBar";
import Footer from "../components/footer";
import ClassAccordionTab from "../components/classAccordionTab";
import ClassLearningContent from "../components/classLearningContent";
import ClassTitleBox from "../components/classTitleBox";
import ClassActivityContent from "../components/classActivityContent";
import FavoriteNoticeContent from "../components/favoriteNoticeContent";
import {gql, useQuery, useMutation} from "@apollo/client";
import {AuthContext} from "../context/authContext";

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

// 즐겨찾기 추가 mutation
const ADD_FAVORITE = gql`
  mutation AddFavorite($userId: ID!, $noticeId: String!) {
    addFavorite(userId: $userId, noticeId: $noticeId) {
      isPinned
    }
  }
`;

// 즐겨찾기 취소 mutation
const CANCEL_FAVORITE = gql`
  mutation CancelFavorite($userId: ID!, $noticeId: String!) {
    cancelFavorite(userId: $userId, noticeId: $noticeId) {
      isPinned
    }
  }
`;


const Class = (props) => {

    const [title, setTitle] = useState("");
    const [index, setIndex ] = useState(0);
    const [tab, setTab ] = useState(0);

     /*
  * 즐겨찾기
  */
    
    const [favNoticeList, setFavNoticeList] = useState([]);

   // 즐겨찾기 mutation 반환
   const [addFavorite, {addFavLoading}] = useMutation(ADD_FAVORITE, {
    // 성공적으로 mutation이 실행된 경우에 수행될 콜백
      onCompleted: (data) => {
        // mutation이 성공적으로 실행되었을 때의 로직을 추가
        console.log("Favorite added successfully");
      },
      // mutation 실행 중 에러가 발생한 경우에 수행될 콜백
      onError: (error) => {
        // mutation 실행 중 에러가 발생했을 때의 로직을 추가
        console.error("Error adding favorite:", error.message);
      },
      });
  
  
      // 즐겨찾기 취소 mutation 반환
      const [cancelFavorite, {cancelLoading}] = useMutation(CANCEL_FAVORITE, {
        // 성공적으로 mutation이 실행된 경우에 수행될 콜백
          onCompleted: (data) => {
            // mutation이 성공적으로 실행되었을 때의 로직을 추가
            console.log("Favorite canceled successfully");
          },
          // mutation 실행 중 에러가 발생한 경우에 수행될 콜백
          onError: (error) => {
            // mutation 실행 중 에러가 발생했을 때의 로직을 추가
            console.error("Error cancel favorite:", error.message);
          },
          });
    

    const context = useContext(AuthContext);
    const values = { userId : get_userId() };
    const { data, loading, error } = useQuery(QUERY_USER, {
        variables: values,
        onError(graphglError){
            console.log(graphglError);
        }
    });


    // 실제 즐겨찾기 추가 사용함수
    const handleAddFavorite = (noticeId) => {
        // addFavorite 함수를 호출하여 mutation 실행
        addFavorite({
          variables: {
            userId: data?.user?.email,
            noticeId: noticeId,
          },});
      };
  
      // 실제 즐겨찾기 삭제 사용함수
      const handleCancelFavorite = (noticeId) => {
        // addFavorite 함수를 호출하여 mutation 실행
        cancelFavorite({
          variables: {
            userId: data?.user?.email,
            noticeId: noticeId,
          },});
      };

    const setContents = (n, m) => {
        setIndex(n);
        setTab(m);
    }

    function get_userId () {
        if(localStorage.getItem("token")) return context?.user?.userId
        else {
            window.location.replace("/login");
        }
    }

    if(loading) return (<Spinner />)
    if(!loading && localStorage.getItem("token")) return (<>
        <NavBar />
        <ClassTitleBox title={title} setTitle={setTitle}/>

        <Container
            maxW="80%"
            p={0}
        >
            <Flex>
                <ClassAccordionTab setContets={setContents}/>
                {(index == 0) ? <ClassLearningContent tab={tab} setTab={setTab} title={title} setTitle={setTitle} user={data.user} /> : <Box />}
                {(index == 2) ? <ClassActivityContent favNoticesData={favNoticeList} handleAddFavorite={handleAddFavorite} handleCancelFavorite = {handleCancelFavorite} tab={tab} setTab={setTab} title={title} setTitle={setTitle} user={data.user} /> : <Box />}
                {(index == 8) ? <FavoriteNoticeContent favNoticesData={favNoticeList} tab={tab} setTab={setTab} user={data.user} handleCancelFavorite = {handleCancelFavorite} /> : <Box />}
            </Flex>
            <Footer />
        </Container>

    </>)
}

export default Class;