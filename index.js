firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("signed").style.display = "flex";
    document.getElementById("notSigned").style.display = "none";
  } else {
    document.getElementById("signed").style.display = "none";
    document.getElementById("notSigned").style.display = "flex";
  }
});

function login()
{
  var userEmail = document.getElementById("emailLogin").value;
  var userPassword = document.getElementById("passwordLogin").value;

  console.log(userEmail + " " + userPassword);

  firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;

  window.alert(errorMessage);
  // ...
  });
}

function logout()
{
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
}

function signUp()
{
  var userEmailS = document.getElementById("emailSignUp").value;
  var userPasswordS = document.getElementById("passwordSignUp").value;

  firebase.auth().createUserWithEmailAndPassword(userEmailS, userPasswordS).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  });
}
