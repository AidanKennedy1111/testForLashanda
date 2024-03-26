import React, { useEffect, useState } from 'react';
// Adjusted import to use named exports for `auth` and `googleAuthProvider`
import { auth, googleAuthProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Account from './Account'; // Import Account component
import Home from './Home'; // Import Home component
import UploadCSV from './UploadCSV'; // Import UploadCSV component
import EventManager from './Eventmanager'; // Import EventManager component
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Router>
        <div className="App">
            {user ? (
                <>
                    <header>
                        <Link to="/home">Home</Link>
                        <Link to="/account">Account</Link>
                        <Link to="/upload-csv">Upload CSV</Link>
                        <Link to="/event-manager">Event Manager</Link>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </header>
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/account" element={<Account user={user} />} />
                        <Route path="/upload-csv" element={<UploadCSV />} />
                        <Route path="/event-manager" element={<EventManager />} />
                    </Routes>
                    
                </>
            ) : (
              <div className = "signInScreen">
                <button onClick={handleGoogleSignIn}>Sign In with Google</button>
              </div>
                
            )}
        </div>
    </Router>
  );
}

export default App;
