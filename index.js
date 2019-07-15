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
  document.getElementById("loginPopUp").style.display = "block";
  document.getElementById("loginPopUp").innerHTML = "This might take a moment";

  var userEmail = document.getElementById("emailLogin").value;
  var userPassword = document.getElementById("passwordLogin").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {

  // Handle Errors here.

  var errorCode = error.code;
  var errorMessage = error.message;
  document.getElementById("loginPopUp").innerHTML = errorMessage;
  // ...
  });
}

function logout()
{
  document.getElementById("loginPopUp").style.display = "none";
  document.getElementById("signupPopUp").style.display = "none";

  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
}

function signUp()
{
  document.getElementById("signupPopUp").style.display = "block";
  document.getElementById("signupPopUp").innerHTML = "This might take a moment";

  var userEmailS = document.getElementById("emailSignUp").value;
  var userPasswordS = document.getElementById("passwordSignUp").value;

  firebase.auth().createUserWithEmailAndPassword(userEmailS, userPasswordS).catch(function(error) {
  // Handle Errors here.

  var errorCode = error.code;
  var errorMessage = error.message;

  document.getElementById("signupPopUp").innerHTML = errorMessage;
  // ...
  });
}
