//
  // Initialize Firebase
  // Be sure link to firebase.js is in Index.html
  // Add line to be sure HTML is finished loading before running any script

  $(document).ready(function() {

  var config = {
    apiKey: "AIzaSyBbOcbNOMvuxdhwRMvp91sKOOPx3j_z9xM",
    authDomain: "traintime-rmb.firebaseapp.com",
    databaseURL: "https://traintime-rmb.firebaseio.com",
    projectId: "traintime-rmb",
    storageBucket: "",
    messagingSenderId: "1054877003441"
  };
  // Note: "Uncaught ReferenceError: firebase is not defined" until I moved the link to firebase.js into
  // <head> and before the link to this JavaScript file

  
  firebase.initializeApp(config);

  var database = firebase.database();
// 2. When button to add a train's info to the schedule is clicked
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
    console.log("submit button clicked");  //OK to here
   
  
    // Grab user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#train-destination-input").val().trim();
    var trainFirstTime = moment($("#train-first-time-input").val().trim(), "HH:mm").format("X");
    var trainInterval = $("#train-interval-input").val().trim();
  
    // Local "temporary" object for holding train information
    var newTrain = {
      name: trainName,
      destination: trainDest,
      firstTime: trainFirstTime,
      interval: trainInterval
    };
  
    // Upload new train record to the database
    database.ref().push(newTrain);  //OK to here - data is showing up in Firebase database, though I need to change two fields
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTime);
    console.log(newTrain.interval);  //OK to here, so now add within this function clearing the table

    // Clear all the buttons by .val() = empty string
    $("#train-name-input").val("");
    $("#train-destination-input").val("");
    $("#train-first-time-input").val("");
    $("#train-interval-input").val("");  //OK to here
})
   // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log("Snapshot all = " + childSnapshot.val()); 

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainFirstTime = childSnapshot.val().firstTime;
    var trainInterval = childSnapshot.val().interval;

    // Console log the train info just before sending it to HTML
    console.log("line 70 " + trainName);
    console.log("line 71 " + trainDest);
    console.log("line 72 " + trainFirstTime);
    console.log("line 73 " + trainInterval);

    // make first time and interval useful to date/time calculations
    var currentTime = moment();
    // var frequency = moment(trainInterval, "HH:mm");
    // var frequency = trainInterval;
    var firstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(5, "days");
    

    // First, send name and destination plus two dummy times to the database, 
    //then do the math with moment.js and send
    // the proper data to the database
    // Calculate next arrival time
    
    console.log("current time = " + currentTime); //unix number
    console.log("frequency = " + trainInterval); //invalid date format
    console.log("interval, minutes = " + moment(trainInterval), "minutes");
    console.log("firstTimeConverted = " + firstTimeConverted); //unix number
    console.log("firstTimeConverted, formatted " + moment(firstTimeConverted).format("HH:mm")); //15:25
    console.log("currentTime formatted = " + moment(currentTime).format("HH:mm")); //3:27
    
    // from "train-example" class exercise:
    var tFrequency = trainInterval; 
    console.log("tFreq = " + tFrequency);
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    console.log("diffTime formatted " + moment(diffTime).format("HH:mm"));

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log("tRmainder = " + tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

    //Send data to the database: PUSH or APPEND each train's data into the table
    // Neither worked while I tried to eliminate "destination not defined" in next line
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainInterval + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");

})
  })