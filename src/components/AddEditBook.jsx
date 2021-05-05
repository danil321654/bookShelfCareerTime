import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {createUseStyles} from 'react-jss';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import {TextField, Button} from '@material-ui/core';

import firebase from '../../firebase';


const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4)
        .toString(16),
  );
};

const isValidIsbn = function(str) {
  let sum;
  let weight;
  let digit;
  let check;
  let i;

  str = str.replace(/[^0-9X]/gi, '');

  if (str.length != 10 && str.length != 13) {
    return false;
  }

  if (str.length == 13) {
    sum = 0;
    for (i = 0; i < 12; i++) {
      digit = parseInt(str[i]);
      if (i % 2 == 1) {
        sum += 3 * digit;
      } else {
        sum += digit;
      }
    }
    check = (10 - (sum % 10)) % 10;
    return (check == str[str.length - 1]);
  }

  if (str.length == 10) {
    weight = 10;
    sum = 0;
    for (i = 0; i < 9; i++) {
      digit = parseInt(str[i]);
      sum += weight * digit;
      weight--;
    }
    check = (11 - (sum % 11)) % 11;
    if (check == 10) {
      check = 'X';
    }
    return (check == str[str.length - 1].toUpperCase());
  }
};


const stylesObject = {
  Back: {
    position: 'fixed',
    top: 0,
    left: 0,
  },
  container: {
    margin: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textbox: {

    width: '30%',
    minWidth: '400px',
  },
};

const useStyles = createUseStyles(stylesObject);

const ADD = 'ADD';
const UPDATE = 'UPDATE';

const AddEditBook = ({history, location}) => {
  const ref = firebase.firestore().collection('books');


  const classes = useStyles();
  const mode = location.state ? UPDATE : ADD;
  const [newAuthor, setAuthor] = useState(
      location.state ? location.state.author : '');
  const [newTitle, setTitle] = useState(
      location.state ? location.state.title : '');
  const [newYear, setYear] = useState(
      location.state ? location.state.year : 2000);
  const [newISBN, setISBN] = useState(
      location.state ? location.state.ISBN : '');


  const addBook = async () => {
    const newId = uuidv4();
    await ref
        .doc(newId)
        .set(
            {author: newAuthor,
              title: newTitle,
              year: newYear,
              ISBN: newISBN,
              id: newId,
            });
  };
  const editBook = async () => {
    await ref
        .doc(location.state.id)
        .update(
            {author: newAuthor,
              title: newTitle,
              year: newYear,
              ISBN: newISBN,
              id: location.state.id},
        ); ;
  };

  return (

    <div className={classes.container}>

      <Button onClick={() => history.push('/')}
        style={stylesObject.Back}>
        <ArrowBackIosOutlinedIcon className={classes.icon} />
      </Button>
      <TextField
        label="Author"
        style={stylesObject.textbox}
        value={newAuthor}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <TextField
        label="Title"
        value={newTitle}
        style={stylesObject.textbox}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Year"
        type="number"
        value={newYear}
        style={stylesObject.textbox}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <TextField
        label="ISBN"
        value={newISBN}
        error={!isValidIsbn(newISBN)}
        style={stylesObject.textbox}
        onChange={(e) => setISBN(e.target.value)}
        required
      />

      <Button onClick={() => mode === ADD ? addBook() : editBook()}
        disabled={
          newAuthor.length < 2 || newTitle.length < 2 || !isValidIsbn(newISBN)
        } >
        {mode}
      </Button>

    </div>
  );
};

AddEditBook.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};
export default AddEditBook;
