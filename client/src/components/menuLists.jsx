import { Select, Spinner } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { ChevronDownIcon } from "@chakra-ui/icons";

const QUERY_SUBJECT = gql`
  query Subject($id: ID!) {
    subject(_id: $id) {
      _id
      name
      users {
        _id
      }
    }
  }
`;

const MenuLists = (props) => {
  const { data, loading, error } = useQuery(QUERY_SUBJECT, {
    onError(graphqlError) {
      console.log(graphqlError);
    },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  const handleSelectChange = (event) => {
    const selectedSubjectId = event.target.value;
    props.setTitle(selectedSubjectId);
  };

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
      onChange={handleSelectChange}
    >
      {props.data.user.subjects.map((item) => (
        <option key={item._id} value={item._id}>
          {item.name}
        </option>
      ))}
      {data.subject && (
        <option key={data.subject._id} value={data.subject._id}>
          {data.subject.name}
        </option>
      )}
    </Select>
  );
};

export default MenuLists;
