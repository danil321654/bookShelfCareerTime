import React from 'react';
import PropTypes from 'prop-types';
import {createUseStyles} from 'react-jss';
import BookStyles from '../styles/BookStyles';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import {Button} from '@material-ui/core';
const useStyles = createUseStyles(BookStyles);

const Book = ({
  author, title, year, ISBN, id, deleteSelf, history,
}) => {
  const classes = useStyles();

  return (

    <div className={classes.book}>
      <div>{author}</div>
      <div className={classes.title}>
        {title}
      </div>
      {' '}
      <div>
        {` ${year}`}
      </div>
      <div>
        {`${ISBN}`}
      </div>
      <div>
        <Button onClick={()=>deleteSelf()}>
          <DeleteOutlinedIcon className={classes.icon} />
        </Button>
        <Button onClick={() => history.push({
          pathname: '/addedit',
          state: {author, title, year, ISBN, id}})}>
          <EditOutlinedIcon className={classes.icon} />
        </Button>
      </div>
    </div>
  );
};

Book.propTypes = {
  author: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  ISBN: PropTypes.string.isRequired,
  deleteSelf: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default Book;
