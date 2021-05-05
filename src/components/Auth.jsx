import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {TextField, Button, Link} from '@material-ui/core';
import {createUseStyles} from 'react-jss';
import CryptoJS from 'crypto-js';
import firebase from '../../firebase';

const LOGIN = 'LOGIN';
const REGISTER = 'REGISTER';

const useStyles = createUseStyles({
  authContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    margin: '10px',
  },
});

const valEmail = (email) => /\S+@\S+\.\S+/.test(email);

const Auth = ({login}) => {
  const classes = useStyles();
  const [mode, setMode] = useState(LOGIN);
  const [errorMes, setErrorMes] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const ref = firebase.firestore().collection('users');
  const buttonCheck =
    email.length < 4 || password.length < 6 ||
      !valEmail(email);

  const handler = async () => {
    const item = await ref.get();
    const items = item.docs.map((doc) => doc.data());

    if (mode === REGISTER) {
      if (items.some((el) => el.email === email)) {
        setErrorMes('acc exists, login pls');
        setMode(LOGIN);
        return 0;
      }
      await ref.doc().set(
          // eslint-disable-next-line new-cap
          {email, password: CryptoJS.MD5(password).toString()});
      setMode(LOGIN);
    } else if (items.every((el) => el.email !== email)) {
      setErrorMes('acc doesn\'t exist, register pls');
      setMode(REGISTER);
    } else if (items.filter(
        (el) => el.email === email && el.password === CryptoJS.MD5(password).toString())
        .length === 1) {
      login(email);
    } else {
      setErrorMes('wrong pass');
    }
  };

  return (
    <div className={classes.authContainer}>
      {errorMes && <div className={classes.error}>{errorMes}</div>}
      <TextField
        type="email"
        label="Email"
        value={email}
        error={!valEmail(email)}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        type="password"
        label="Password"
        value={password}
        error={password.length < 6 || errorMes === 'wrong pass'}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button onClick={ () => handler()}
        disabled={buttonCheck}>
        {mode === LOGIN ? 'Login' : 'Register'}
      </Button>
      <Link onClick={
        () => mode === LOGIN ? setMode(REGISTER) : setMode(LOGIN)
      }>
        {mode === LOGIN ? 'Register' : 'Login'}
      </Link>
    </div>);
};


Auth.propTypes = {
  login: PropTypes.func.isRequired,
};

export default Auth;
