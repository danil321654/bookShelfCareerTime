import React, {useState, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import {createUseStyles} from 'react-jss';
import firebase from '../../firebase';
import {Button} from '@material-ui/core';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import BookShelfStyles from '../styles/BookShelfStyles';
import Book from './Book';


const useStyles = createUseStyles(BookShelfStyles);

const BookShelf = ({history}) => {
  const classes = useStyles();
  const ref = firebase.firestore().collection('books');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const getBooks = () =>{
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setBooks(items);
      setLoading(false);
    });
  };

  useLayoutEffect(() => {
    getBooks();
  }, []);

  return loading ?
  <div>loads...</div> :
      <div className={classes.books}> {books.map((el) =>
        <Book key={el.id} {...el}
          history={history}
          deleteSelf={() => ref.doc(el.id).delete().catch((err) =>
            console.error(err),
          )} />)}

      <Button
        style={BookShelfStyles.button} onClick={() => history.push('/addedit')}>
        <AddBoxOutlinedIcon className={classes.icon} />

      </Button>
      </div>;
};
BookShelf.propTypes = {
  history: PropTypes.object.isRequired,
};


export default BookShelf;
