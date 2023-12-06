// apiCalls.js 파일

import { useQuery, gql } from '@apollo/client';

const QUERY_NOTICE = gql`
  query Notices($subjectId: ID!) {
    subject(id: $subjectId) {
      _id
      notices {
        _id
        title
        content
      }
    }
  }
`;

export const fetchData = async (subjectId) => {
  const { data, loading, error } = useQuery(QUERY_NOTICE, {
    variables: { subjectId },
  });

  if (loading) {
    // 로딩 중일 때 수행할 작업
  }

  if (error) {
    // 에러가 발생했을 때 수행할 작업
  }

  if (data && data.subject) {
    // 데이터가 있을 때 수행할 작업
    return data.subject.notices;
  }
};
