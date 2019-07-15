// Initialize Firebase
var selectedFile;
var user;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("signed in");
  } else {
    console.log("chungus");
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
    //TODO change file.name so its the uid
    storage.ref().child(file.name).put(file).then(function(snapshot) {
      //TODO add the file ref in firestore
    });
});

var imgArr = [];
var uid = "user1";
function getAllImages(callback) {
    document.getElementById("displayImg").innerHTML = "";
    db.collection("Users").doc(uid).collection("Images").get().then((col)=>{
      var c = 0;
        col.forEach((img) => {
            new Promise(resolve => {
                storage.ref().child("" + img.data().id).getDownloadURL().then(function (url) {
                    resolve(url);
                });
            }).then((res) => {
                c++;
                imgArr.push({
                    name: img.data().name,
                    des: img.data().description,
                    id: img.data().id,
                    url: res
                });
                if (c==col.size) {
                  callback&&callback();
                }
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
          str += "<div class=\"img row\">" +
              "<div class=\"col-6 px-0\">" +
              "<img src="+url+" class=\"img-fit\">" +
              "</div>" +
              "<div class=\"col-6\">" +
              "<h1>"+img.name+"</h1>" +
              "<h3>"+img.des+"</h3>" +
              "<a href="+url+" target=\"_blank\">View in new window</a>" +
              "</div></div>";
        }
        document.getElementById("displayImg").innerHTML = str;
    });
}
