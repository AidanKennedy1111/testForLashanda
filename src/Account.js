import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { deleteUser } from 'firebase/auth';
import { auth } from './firebase'; // Make sure to import auth correctly from your Firebase config

function Account({ user }) {
    const [editing, setEditing] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState(user.displayName || '');

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = async () => {
        if (auth.currentUser && newDisplayName !== user.displayName) {
            await updateProfile(auth.currentUser, {
                displayName: newDisplayName,
            }).then(() => {
                // Update successful
                alert("Profile updated successfully!");
                setEditing(false);
            }).catch((error) => {
                // An error occurred
                alert(error.message);
            });
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
            deleteUser(auth.currentUser).then(() => {
                alert("Account deleted successfully.");
            }).catch((error) => {
                alert(error.message);
            });
        }
    };

    return (
        <div className="account">
            <p>Welcome, {user.displayName}!</p>
            {editing ? (
                <>
                    <input
                        type="text"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                    />
                    <button onClick={handleSave}>Save Changes</button>
                </>
            ) : (
                <>
                    <button onClick={handleEdit}>Edit Name</button>
                    <button onClick={handleDeleteAccount}>Delete Account</button>
                </>
            )}
        </div>
    );
}

export default Account;
