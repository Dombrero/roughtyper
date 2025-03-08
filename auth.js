// RoughType Authentication Module
// Handles user authentication with Google Firebase

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Ersetze dies mit deinem Firebase API-Key
  authDomain: "roughtype-game.firebaseapp.com",      // Ersetze mit deiner Firebase Domain
  projectId: "roughtype-game",                       // Ersetze mit deiner Projekt-ID
  storageBucket: "roughtype-game.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXX"
};

// Auth state
let authState = {
  isLoggedIn: false,
  userId: null,
  displayName: null,
  photoURL: null,
  email: null
};

// Initialize Firebase when the script loads
function initializeFirebase() {
  // Check if Firebase is already loaded
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded. Make sure to include the Firebase scripts.');
    return false;
  }
  
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // Set up auth state change listener
  firebase.auth().onAuthStateChanged(handleAuthStateChange);
  
  return true;
}

// Handle authentication state changes
function handleAuthStateChange(user) {
  if (user) {
    // User is signed in
    authState.isLoggedIn = true;
    authState.userId = user.uid;
    authState.displayName = user.displayName;
    authState.photoURL = user.photoURL;
    authState.email = user.email;
    
    // Update UI to show logged in state
    updateAuthUI(true);
    
    // Load user game data from Firebase
    loadUserGameData();
    
    console.log('User logged in:', authState.displayName);
  } else {
    // User is signed out
    authState.isLoggedIn = false;
    authState.userId = null;
    authState.displayName = null;
    authState.photoURL = null;
    authState.email = null;
    
    // Update UI to show logged out state
    updateAuthUI(false);
    
    console.log('User logged out');
  }
}

// Sign in with Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // This gives you a Google Access Token
      const credential = result.credential;
      const token = credential.accessToken;
      
      // Show success message
      showAuthMessage('Erfolgreich angemeldet!', 'success');
    })
    .catch((error) => {
      // Handle Errors here
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Google sign-in error:', errorCode, errorMessage);
      
      // Show error message
      showAuthMessage('Anmeldung fehlgeschlagen: ' + errorMessage, 'error');
    });
}

// Sign out
function signOut() {
  firebase.auth().signOut()
    .then(() => {
      showAuthMessage('Erfolgreich abgemeldet!', 'success');
    })
    .catch((error) => {
      console.error('Sign out error:', error);
      showAuthMessage('Abmeldung fehlgeschlagen!', 'error');
    });
}

// Update UI based on authentication state
function updateAuthUI(isLoggedIn) {
  const authContainer = document.getElementById('auth-container');
  if (!authContainer) return;
  
  if (isLoggedIn) {
    // User is logged in, show profile and logout button
    authContainer.innerHTML = `
      <div class="auth-profile">
        ${authState.photoURL ? `<img src="${authState.photoURL}" alt="Profile" class="auth-avatar">` : ''}
        <span class="auth-name">${authState.displayName || authState.email}</span>
        <button id="logout-button" class="auth-button">Logout</button>
      </div>
    `;
    
    // Add event listener to logout button
    document.getElementById('logout-button').addEventListener('click', signOut);
  } else {
    // User is logged out, show login button
    authContainer.innerHTML = `
      <button id="login-button" class="auth-button">Mit Google anmelden</button>
    `;
    
    // Add event listener to login button
    document.getElementById('login-button').addEventListener('click', signInWithGoogle);
  }
}

// Show authentication message
function showAuthMessage(message, type) {
  const messageContainer = document.createElement('div');
  messageContainer.className = `auth-message ${type}`;
  messageContainer.textContent = message;
  
  document.body.appendChild(messageContainer);
  
  // Remove message after 3 seconds
  setTimeout(() => {
    messageContainer.classList.add('fade-out');
    setTimeout(() => {
      document.body.removeChild(messageContainer);
    }, 500);
  }, 3000);
}

// Save game state to Firebase
function saveGameToFirebase(gameState) {
  if (!authState.isLoggedIn) return;
  
  const db = firebase.firestore();
  db.collection('users').doc(authState.userId).set({
    gameState: gameState,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log('Game state saved to Firebase');
  })
  .catch((error) => {
    console.error('Error saving game state:', error);
  });
}

// Load user game data from Firebase
function loadUserGameData() {
  if (!authState.isLoggedIn) return;
  
  const db = firebase.firestore();
  db.collection('users').doc(authState.userId).get()
    .then((doc) => {
      if (doc.exists && doc.data().gameState) {
        // We have saved game data
        const savedGameState = doc.data().gameState;
        
        // Emit an event that the main game can listen for
        const event = new CustomEvent('userGameDataLoaded', { 
          detail: { gameState: savedGameState } 
        });
        document.dispatchEvent(event);
        
        console.log('Game data loaded from Firebase');
      } else {
        console.log('No saved game data found');
      }
    })
    .catch((error) => {
      console.error('Error loading game data:', error);
    });
}

// Create auth container in the DOM
function createAuthContainer() {
  // Check if container already exists
  if (document.getElementById('auth-container')) return;
  
  const authContainer = document.createElement('div');
  authContainer.id = 'auth-container';
  authContainer.className = 'auth-container';
  
  // Add to document
  document.body.appendChild(authContainer);
  
  // Update UI based on current auth state
  updateAuthUI(authState.isLoggedIn);
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create auth container
  createAuthContainer();
  
  // Try to initialize Firebase
  const firebaseInitialized = initializeFirebase();
  if (!firebaseInitialized) {
    console.error('Firebase initialization failed. Authentication features will not work.');
  }
});

// Export functions for use in the main game
window.RoughTypeAuth = {
  isLoggedIn: () => authState.isLoggedIn,
  getUserId: () => authState.userId,
  getUserName: () => authState.displayName,
  saveGame: saveGameToFirebase,
  signIn: signInWithGoogle,
  signOut: signOut
}; 