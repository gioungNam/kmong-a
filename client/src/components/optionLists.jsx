import { Select } from "@chakra-ui/react";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import { ChevronDownIcon } from "@chakra-ui/icons";

const QUERY_SUBJECT = gql`
  query Subjects {
    subjects {
      _id
      capacity
      classification
      credit
      name
      users {
        _id
      }
    }
  }
`;

const QUERY_SUBJECT_NOTICES = gql`
  query SubjectNotices($subjectId: ID!) {
    subjectNotices(subjectId: $subjectId) {
      _id
      title
      content
    }
  }
`;

const OptionLists = (props) => {
  const client = useApolloClient();

  const { data, loading, error } = useQuery(QUERY_SUBJECT, {
    onError(graphqlError) {
      console.log(graphqlError);
    },
  });

  function changeSelection() {
    const selectedItem = document.getElementById("select");
    const selectedSubjectId = selectedItem[selectedItem.selectedIndex].value;

    // 여기에서 선택한 subject의 id를 이용해 공지사항을 불러오는 함수 호출
    fetchNotices(selectedSubjectId);

    // 부모 컴포넌트에 선택한 subject의 id를 전달
    props.setTitle(selectedSubjectId);
  }

  async function fetchNotices(subjectId) {

    if (!subjectId || "" == subjectId) return;

    try {
      const { data } = await client.query({
        query: QUERY_SUBJECT_NOTICES,
        variables: { subjectId },
      });

      // 불러온 데이터를 사용하거나 저장
      console.log("Notices for selected subject:", data.subjectNotices);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  }

  function checkUser(item) {
    for (let i = 0; i < item.length; i++) {
      if (item[i]._id == props.data.user._id) return true;
    }
  }

  if (!loading) {
    return (
      <Select
        maxH="25px"
        w="250px"
        border="solid"
        borderColor="blackAlpha.300"
        borderWidth="3px"
        borderRadius="5px"
        bg="whiteAlpha.800"
        color="blackAlpha.800"
        size="sm"
        rightIcon={<ChevronDownIcon />}
        fontSize={12}
        placeholder="과목 선택"
        id="select"
        onChange={changeSelection}
      >
        {props.data.user.isAdmin
          ? data.subjects.map((item, index) => (
              <option id={index} value={item._id} key={index}>
                {" "}
                {item.name}{" "}
              </option>
            ))
          : data.subjects
              .filter((item) => checkUser(item.users))
              .map((item, index) => (
                <option id={index} value={item._id} key={index}>
                  {" "}
                  {item.name}{" "}
                </option>
              ))}
      </Select>
    );
  }
};

export default OptionLists;
