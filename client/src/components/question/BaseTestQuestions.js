import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../layouts/Spinner';
import { getBaseTestQuestions } from '../../actions/question';
import BaseAnswerSubmitModal from '../answer/BaseAnswerSubmitModal';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  FormTextarea,
  FormGroup,
} from 'shards-react';
import { Pagination } from 'react-bootstrap';

const BaseTestQuestions = ({ location, history }) => {
  let base_id = location.state !== undefined ? location.state.base_id : '';
  let test_id = location.state !== undefined ? location.state.test_id : '';
  let module_ids =
    location.state !== undefined ? location.state.module_ids : '';

  const { auth, question } = useSelector((state) => ({
    auth: state.auth,
    question: state.question,
  }));
  const { baseTestQuestions, answers, loading } = question;
  const dispatch = useDispatch();

  useEffect(() => {
    auth.user &&
      dispatch(
        getBaseTestQuestions(
          base_id,
          auth.user._id,
          history,
          module_ids,
          test_id
        )
      );
    baseTestQuestions.length > 0 && setQuestion(baseTestQuestions);
    setHookanswer(answers);
    //eslint-disable-next-line
  }, [baseTestQuestions.length, base_id, auth.user, history]);

  const [hookanswer, setHookanswer] = useState({});
  const handleChange = (e) => {
    answers[e.target.name] = e.target.value;
    setHookanswer({ ...answers });
  };
  const [questions, setQuestion] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(1);

  //Get current posts
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(baseTestQuestions.length / questionsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }
  return !loading &&
    baseTestQuestions !== null &&
    baseTestQuestions.length > 0 ? (
    <Fragment>
      <div className='display-5 lead text-center mb-3'>
        Question Round : Base Test
      </div>
      {currentQuestions.map((baseTestQuestion, index) => (
        <Card key={baseTestQuestion._id} style={{ backgroundColor: '#f9f7f7' }}>
          <CardHeader>Rank : {baseTestQuestion.rank}</CardHeader>
          <CardBody>
            <CardTitle>{baseTestQuestion.question}</CardTitle>
            <CardHeader>Seperate points using empty lines</CardHeader>
            <FormGroup>
              <label htmlFor='anskey'>
                <span className=''>Answer</span>
              </label>
              <FormTextarea
                name={baseTestQuestion._id}
                value={hookanswer[baseTestQuestion._id]}
                rows='10'
                onChange={(e) => handleChange(e)}
              />
            </FormGroup>
          </CardBody>
        </Card>
      ))}
      <Fragment>
        <Pagination className='d-flex justify-content-center'>
          <Pagination.First onClick={() => setCurrentPage(pageNumbers[0])} />
          <Pagination.Prev
            onClick={() => {
              let prev;
              currentPage > 1
                ? (prev = currentPage - 1)
                : (prev = pageNumbers[0]);
              setCurrentPage(prev);
            }}
          />
          {pageNumbers.map((num) => (
            <Pagination.Item
              key={num}
              active={num === currentPage}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => {
              let next;
              currentPage < pageNumbers.length
                ? (next = currentPage + 1)
                : (next = pageNumbers[pageNumbers.length - 1]);
              setCurrentPage(next);
            }}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(pageNumbers[pageNumbers.length - 1])}
          />
        </Pagination>
        <BaseAnswerSubmitModal
          answers={hookanswer}
          test_id={test_id}
          base_id={base_id}
          history={history}
          module_ids={module_ids}
        />
      </Fragment>
    </Fragment>
  ) : (
    <Spinner />
  );
};

export default BaseTestQuestions;
