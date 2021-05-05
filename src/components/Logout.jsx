import React from 'react';
import PropTypes from 'prop-types';
import {IconButton} from '@material-ui/core';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';

const stylesObject = {
  Logout: {
    position: 'fixed',
    top: 0,
    right: 0,
  },
};

const Logout = ({logout}) => {
  return (
    <React.Fragment>
      <IconButton
        aria-label="add"
        style={stylesObject.Logout}
        onClick={() => logout()} >
        <ExitToAppOutlinedIcon />
      </IconButton>
    </React.Fragment>
  );
};
Logout.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default Logout;
