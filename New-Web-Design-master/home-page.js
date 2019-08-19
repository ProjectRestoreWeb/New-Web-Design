// Initialize Firebase
var selectedFile;
var user;
var uid = "";
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    uid = user.uid;
    console.log(uid)
    console.log(user)
    var providerData = user.providerData;
    // ...
  } else {
    // User is signed out.
    // ...
  }
});

$("#refresh-button").on('mousedown touchstart', function(e){
  e.preventDefault();
  $(this).addClass("activeRefresh");
})

$("#refresh-button").on("mouseup touchend", function(e) {
  e.preventDefault();
  $(this).removeClass("activeRefresh");
})

$("#add-image").on("click", function(e){
  e.preventDefault();
  toggleAddImage();
})

var addImageVisible = false;
function toggleAddImage() {
  addImageVisible = !addImageVisible;
  document.getElementById("add-image-display").style.display = (addImageVisible)?"block":"none";
}

$("#add-image-Img").on("change", function(event)
{
  selectedFile = event.target.files[0];
});
// Create a root reference
// var filename = selectedFile.name;
// var storageRef = firebase.storage().ref(/userImages/ + filename);
// var uploadTask = storageRef.put(selectedFile);
//
// uploadTask.on('state_changed', function(snapshot){
//
// }, function(error){
//
// }, function(){
//   var postKey = firebase.database().ref('Posts/').push().key;
//   var downloadURL = uploadTask.snapshot.downloadURL;
//   var postData =  {
//     url: downloadURL,
//     title: $('#add-image-name').val(),
//     caption: $('#add-image-description').val(),
//     user: user.uid
//   }
//   var updates = {};
//   updates['/Posts/' + postKey] = postData;
//   firebase.database().ref().update(updates);
//   console.log(downloadURL);
// });

// $("#add-image-Img").change(function(e){
//   console.log($(this).val());
// });
//
$("#add-image-submit").on('click', function(e) {
  e.preventDefault();
  var name = document.getElementById("add-image-name").value;
  var des =  document.getElementById("add-image-description").value;
  var file =  document.getElementById("add-image-Img").files[0];
  var fileN =  document.getElementById("add-image-Img").files[0].name;
  document.getElementById("add-image-name").value = "";
  document.getElementById("add-image-description").value = "";
  document.getElementById("add-image-Img").value = "";
  toggleAddImage();
  var d = new Date();
  var n = d.getTime();
  //TODO change file.name so its the uid
  storage.ref().child(uid).child(""+n).put(file).then(function(snapshot) {
    //TODO add the file ref in firestore
    //console.log("SNAPSHOT" + snapshot.ref)


    database.ref().child("Users").child(uid).child("Images").child(""+n).child(name).set(des);

  });
});

var imgArr = [];
function getAllImages(callback) {
  var c = 0;

  document.getElementById("displayImg").innerHTML = "";
  var reference = database.ref().child("Users").child(uid).child("Images");
  var total = 0;
  reference.once('value', function(snapshot) {
    console.log("Numchildren" + snapshot.numChildren())
    total = snapshot.numChildren();
    snapshot.forEach(function(childSnapshot) {
      var childKey = ""+childSnapshot.key;
      console.log(childKey)
      childSnapshot.forEach(function(childOfChildSnapshot){

        var nameVal = ""+childOfChildSnapshot.key;
        var descVal = ""+childOfChildSnapshot.val();

        var urlVal = storage.ref().child(uid).child(childKey).getDownloadURL().then(function(urlVal) {

          console.log("URL IS" + urlVal)

          imgArr.push({
            name: nameVal,
            des: descVal,
            url: urlVal
          });
          c++;
          console.log("C is " + c)
          if(c==total){
            console.log("returning")
            callback&&callback();
          }
        }).catch(function(error) {
          // Handle any errors
        });


      });



    });

  });


}

function displayImages() {
  new Promise(resolve=>{
    imgArr = [];
    getAllImages(()=>{resolve();});
  }).then((res)=>{
    var str = "";
    for (var img of imgArr) {
      var url = img.url + "";
      str += "<div class=\"img row\" style =\"display: flex; flex-direction: row; max-width: 900px\">" +
      "<div class=\"col-6 px-0\">" +
      "<img src="+url+" class=\"img-fit\">" +
      "</div>" +
      "<div class=\"col-6\"  style =\"width: 100%; margin-left: 10px\">" +
      "<div class = \"title\">"+img.name+"</div>" +
      "<div  style =\" font-size: 1.5em; border: 1px solid white; padding: 10px 20px\">"+img.des+"<br>"+
      "<a href="+url+" target=\"_blank\">View in new window</a>" +
      "</div></div></div>";
    }
    document.getElementById("displayImg").innerHTML = str;
  });
}
