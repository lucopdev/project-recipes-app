import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Header from '../components/header/Header';

function Profile() {
  const [email, setEmail] = useState('');
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      setEmail(user.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    history.push('/');
  };

  return (
    <>
      <Header title="Profile" />
      <div>

        <p data-testid="profile-email">
          {email}
        </p>

        <button data-testid="profile-done-btn">
          <Link to="/done-recipes">Done Recipes</Link>
        </button>

        <button data-testid="profile-favorite-btn">
          <Link to="/favorite-recipes">Favorite Recipes</Link>
        </button>

        <button data-testid="profile-logout-btn" onClick={ handleLogout }>
          Logout
        </button>

      </div>
    </>
  );
}

export default Profile;
