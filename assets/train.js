// window.onload = function(){
  var config = {
    apiKey: "AIzaSyCOOwno5EMZwb3yQDx08UyyN1pjAXhTpT4",
    authDomain: "train-schedule-80d21.firebaseapp.com",
    databaseURL: "https://train-schedule-80d21.firebaseio.com",
    projectId: "train-schedule-80d21",
    storageBucket: "train-schedule-80d21.appspot.com",
    messagingSenderId: "453575324803"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var nextArrival = 0;
  var minutesAway = 0;
  var table = $("#train-table");
  var tStartArray = [];
  var tFreqArray = [];

	$("#add-train-btn").on("click", function(event) {
	  	event.preventDefault();
		
		  var trainName = $("#train-name").val().trim();
		  var trainDestination = $("#train-dest").val().trim();
		  var trainStart = $("#first-train-time").val().trim();
		  var trainFrequency = $("#train-freq").val();
		  tStartArray.push(trainStart);
		  tFreqArray.push(trainFrequency);

		  console.log(trainName, trainDestination, trainStart, trainFrequency);
		  
		  firebase.database().ref().push({
		      name: trainName,
		      destination: trainDestination,
		      start: trainStart,
		      frequency: trainFrequency,
		      dateAdded: firebase.database.ServerValue.TIMESTAMP
      	  });
      	$("#train-name").val("");
  		$("#train-dest").val("");
  		$("#first-train-time").val("");
  		$("#train-freq").val("");

      	var timeValues = timeCalculation(trainStart, trainFrequency); 
      	console.log("time values" + timeValues);   	
  		minutesAway = timeValues[0];
  		nextArrival = timeValues[1];
  		// display(table,trainName, trainDestination, trainFrequency, nextArrival, minutesAway);
      	// var newT = [];
      	// for (var i = 0; i < tStartArray.length; i++) {
      	// 	newT = timeUpdate(tStartArray[i],tFreqArray[i]);
      	// 	console.log("new time" + newT);
      	// 	table.rows[i].cells[4].innerHTML = newT[0];
      	// 	table.rows[i].cells[3].innerHTML = newT[1];
      	// }
      	
 	});
	database.ref().on("child_added", function(childSnapshot, prevChildName) {
	 	console.log(childSnapshot.val());
	 	console.log(prevChildName);
		var trainName = childSnapshot.val().name;
		var trainDestination = childSnapshot.val().destination;
		var trainStart = childSnapshot.val().start;
		var trainFrequency= childSnapshot.val().frequency;
		if (childSnapshot.child("key")==prevChildName){
			return
		}
		else{
			timeValues = timeCalculation(trainStart, trainFrequency);
			minutesAway = timeValues[0];
			nextArrival = timeValues[1];
			display(table, trainName, trainDestination, trainFrequency, nextArrival, minutesAway);		
			 
		}
	});

		function timeCalculation(trainStart, trainFrequency){
	      	var currentTime = moment();
	      	var trainStartConverted = moment(trainStart, "HH:mm").subtract(1, "years");
	    	console.log(trainStartConverted);
	    	console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	    	var diffTime = moment().diff(moment(trainStartConverted), "minutes");
	    	console.log("DIFFERENCE IN TIME: " + diffTime);
	    	var tRemainder = diffTime % trainFrequency;
	    	console.log("time remaining" + tRemainder);
	    	var minutesAway = trainFrequency - tRemainder;
	    	console.log("MINUTES TILL TRAIN: " + minutesAway);
	    // Next Train Arrival
	    	var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm");
	    	var timeValues = [minutesAway, nextArrival];
      		return timeValues;
      	};
      	// function to add a row to the table
      	function display(table, tN, tD, tF, nA, mA){
	      	var row = $("<tr>");
		    var nameDisplay = $("<td>");
		    var destDisplay = $("<td>");
		    var freqDisplay = $("<td>");
		    var nextDisplay = $("<td>");
		    var minutes = $("<td>");

		    nameDisplay.text(tN);
		    destDisplay.text(tD);
		    freqDisplay.text(tF);
		    nextDisplay.text(nA);
		    minutes.text(mA);

		    row.append(nameDisplay);
		    row.append(destDisplay);
		    row.append(freqDisplay);
		    row.append(nextDisplay);
		    row.append(minutes);
		    table.append(row);    
		}
		// function to update the time with each train addition
		function timeUpdate(trainStart, trainFrequency){
	      	var currentTime = moment();
	      	var trainStartConverted = moment(trainStart, "HH:mm").subtract(1, "years");
	    	var diffTime = moment().diff(moment(trainStartConverted), "minutes");
	    	var tRemainder = diffTime % trainFrequency;
	    	var minutesAway = trainFrequency - tRemainder;
	    	var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm");
	    	var newTime = [minutesAway, nextArrival];
      		return newTime;
      	};



    

    