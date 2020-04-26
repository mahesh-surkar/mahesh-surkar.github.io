function laodTimeUtility()
{

    var heading = document.createElement("h1");
    var headingText = document.createTextNode("Time Conversion Tools");     // Create a text node
    heading.appendChild(headingText);                                   // Append the text to <h1>   
    document.body.appendChild(heading);

    addSysDateTime();
    addTimeZoneConvertor();
    addEpochConvertor(); 
    addCovertToEpoch();
}

function addSysDateTime()
{
   var d = new Date();
   var epochSec = d.getTime();
   var sysTimelabel =  document.createElement("h4"); //input element, text
   sysTimelabel.innerHTML = "Your system seconds since epoch : " + epochSec;
   sysTimelabel.id = "sysTimelabel";

   document.body.appendChild(sysTimelabel);

   var hLine = document.createElement("hr");         
   document.body.appendChild(hLine);

   setInterval(updateTime, 500);
}

function addCalender(calanderName, calendarLabel, nodeToAppend)
{

   var label = document.createElement("label"); //input element, text
   label.innerHTML = calendarLabel;

   var dateInput = document.createElement("input"); 
   dateInput.type = "text";
   dateInput.name = calanderName;
   dateInput.id = calanderName;
//  dateInput.className = "normal-form";

   nodeToAppend.appendChild(label); 
   nodeToAppend.appendChild(dateInput);

   $("#" + calanderName).datetimepicker({
	timeFormat: 'HH:mm:ssz',
	separator: 'T',
	showTimezone: true,
        showtimezoneName: true, 
        beforeShow: function (input, inst) {
           $.datepicker._pos = $.datepicker._findPos(input); //this is the default position
//           $.datepicker._pos[0] = 100; //left
           $.datepicker._pos[1] = 40; //top`
        }
    });
}

function getCalendarTime(calanderName)
{
   var dateTime = document.getElementById(calanderName).value;
   var dateObj = NaN;
   if (dateTime)
   {
     dateObj = moment(dateTime, "MM/DD/YYYYTHH:mm:ssZ").toDate();
   }
   return dateObj;
}

function addTimeZoneDisplay(node, timezoneLabel)
{
   var label = document.createElement("label"); //input element, text
   label.innerHTML = timezoneLabel;
   node.appendChild(label);

   var mySelect = document.createElement("select"); //input element, text
   mySelect.className = "list1";
  // mySelect.data-country = "US";
   mySelect.id = "timeZoneSelect";
   mySelect.name = "timeZoneSelect";
   
   node.appendChild(mySelect);
   $("#timeZoneSelect").timezones();

}

function convertTime(calendarName)
{

    calanderDate = getCalendarTime(calendarName); 
    if (calanderDate)
    {
        var dateAsObject = $(this).datepicker( 'getDate' ); //the getDate method
        selectedTZ = document.getElementById("timeZoneSelect").value;
  
        selectedTimeLabel.className = "infoLabel";
        selectedTimeLabel.innerHTML = "Selected time to convert : " + calanderDate;
        var convertedDate = moment(calanderDate).tz(selectedTZ).format('YYYY-MM-DD HH:mm:ss');
        converedTZLabel.innerHTML = "New converted time for  : " + selectedTZ + " timezone is : " + convertedDate;
    }
    else
    {
         selectedTimeLabel.className = "warnLabel";
         selectedTimeLabel.innerHTML = "Please select time to convert";  
    }
}

function addTimeZoneConvertor()
{

    var subHeading = document.createElement("h3");
    var subHeadingText = document.createTextNode("Convert time as per timezone");     // Create a text node
    subHeading.appendChild(subHeadingText);                                   // Append the text to <h1>
    document.body.appendChild(subHeading);

    var linebreak = document.createElement("br"); 
    addCalender("timeZoneCalander", "Select date and time and timezone to convert : ", document.body);
    document.body.appendChild(linebreak); 
    addTimeZoneDisplay(document.body, "Select new timezone : "); 

    var readbleConvertButton = document.createElement("input"); 
    readbleConvertButton.type = "button";
    readbleConvertButton.value = "Convert time";
    readbleConvertButton.setAttribute("onclick","javascript:convertTime('timeZoneCalander');")
    readbleConvertButton.className = "btn";

    var blank = document.createTextNode( '\u00A0' );
    document.body.appendChild(blank);

    document.body.appendChild(readbleConvertButton);

    var selectedTimeLabel = document.createElement("label"); //input element, text
    selectedTimeLabel.innerHTML = "";
    selectedTimeLabel.id = "selectedTimeLabel";
    selectedTimeLabel.setAttribute('class',"infoLabel");

    var converedTZLabel = document.createElement("label"); //input element, text
    converedTZLabel.innerHTML = "";
    converedTZLabel.id = "converedTZLabel";
    converedTZLabel.className = "infoLabel";

    var linebreak1 = document.createElement("br");
    var linebreak2 = document.createElement("br");
    var hLine = document.createElement("hr");

    document.body.appendChild(linebreak1);
    document.body.appendChild(selectedTimeLabel);
    document.body.appendChild(linebreak2);
    document.body.appendChild(converedTZLabel);
    document.body.appendChild(hLine);
}

function addCovertToEpoch()
{


    var subHeading = document.createElement("h3");
    var subHeadingText = document.createTextNode("Convert date time to epoch");     // Create a text node
    subHeading.appendChild(subHeadingText);                                   // Append the text to <h1>
    document.body.appendChild(subHeading);

    var blank = document.createTextNode( '\u00A0' );
    var linebreak1 = document.createElement("br");
    var linebreak2 = document.createElement("br");
 
    addCalender("convertToEpochCalander", "Enter date and time : ", document.body); 

    var readbleConvertButton = document.createElement("input"); //input element, Submit button
    readbleConvertButton.type = "button";
    readbleConvertButton.value = "Convert to epoch";
    readbleConvertButton.setAttribute("onclick","javascript:convertToepoch('convertToEpochCalander')");
    readbleConvertButton.className = "btn";

    var epochLabel = document.createElement("label"); //input element, text
    epochLabel.innerHTML = "";
    epochLabel.id = "epochLabel";
    epochLabel.classame = "infoLabel";
 
    document.body.appendChild(blank);    
    document.body.appendChild(readbleConvertButton);
    //document.body.appendChild(linebreak1);
    document.body.appendChild(linebreak2);
    document.body.appendChild(epochLabel);

    var hLine = document.createElement("hr");  
    document.body.appendChild(hLine);
}

function convertToepoch(calanderToRead)
{ 
   var d =  getCalendarTime(calanderToRead);
   if  (d)
   {
        var myEpoch = d.getTime()/1000.0;
        epochLabel.className = "infoLabel"; 
        document.getElementById('epochLabel').innerHTML = "Epoch time : "+ myEpoch;    
   }
   else
   {
         epochLabel.className = "warnLabel";
         epochLabel.innerHTML = "Please select time to convert";
   }

}

function parseDate(dateInput, timeInput) {
  var str1= dateInput.split('/');
  var str2= timeInput.split(':');  
  
  return new Date(str1[0], str1[1]-1, str1[2], str2[0], str2[1], str2[2]); 
}

function addEpochConvertor()
{
    var subHeading = document.createElement("h3");
    var subHeadingText = document.createTextNode("Convert epoch time to readable");     // Create a text node
    subHeading.appendChild(subHeadingText);                                   // Append the text to <h1>
    document.body.appendChild(subHeading);


    var epochForm = document.createElement("div");
  
    var linebreak = document.createElement("br"); 
    var linebreak1 = document.createElement("br");
    var linebreak2 = document.createElement("br");
    var linebreak3 = document.createElement("br");
    var blank = document.createTextNode( '\u00A0' );

    var label = document.createElement("label"); //input element, text
    label.innerHTML = "Enter the second since epoch (01 Jan 1970 00:00:00 GMT) : ";

    var epochInput = document.createElement("input"); //input element, text
    epochInput.type = "number";
    epochInput.name = "epochTime";    
    epochInput.id = "epochTime"; 

   var epochConvertButton = document.createElement("input"); //input element, Submit button
   epochConvertButton.type = "button";
   epochConvertButton.value = "Convert to readble format";
   epochConvertButton.setAttribute("onclick","javascript:convertToReadable();")
   epochConvertButton.className = "btn";

   var gmtLabel = document.createElement("label"); //input element, text
   gmtLabel.innerHTML = "";
   gmtLabel.id = "gmtLabel";
   gmtLabel.className = "infoLabel"; 

   var localTZLabel = document.createElement("label"); //input element, text
   localTZLabel.innerHTML = "";
   localTZLabel.id = "localTZLabel";
   localTZLabel.className = "infoLabel"; 
   
   epochForm.appendChild(label);
   epochForm.appendChild(epochInput);
   epochForm.appendChild(blank);
   epochForm.appendChild(epochConvertButton);
   epochForm.appendChild(linebreak);
   //epochForm.appendChild(linebreak1);
   epochForm.appendChild(gmtLabel);
   epochForm.appendChild(linebreak2);
   epochForm.appendChild(localTZLabel);

   document.body.appendChild(epochForm);
  
   var hLine = document.createElement("hr"); 
   document.body.appendChild(hLine);


   
}

function convertToReadable()
{
   utcSeconds  = document.getElementById('epochTime').value;
   if (!utcSeconds || isNaN(utcSeconds))
   {
       document.getElementById('localTZLabel').setAttribute('class',"warnLabel");
       document.getElementById('gmtLabel').setAttribute('class',"warnLabel");
       document.getElementById('gmtLabel').innerHTML = "Please enter valid epoch time.";       
       document.getElementById('localTZLabel').innerHTML = "";
       return false;
   }
  
   var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
   d.setUTCSeconds(utcSeconds);
   document.getElementById('localTZLabel').setAttribute('class',"infoLabel");
   document.getElementById('gmtLabel').setAttribute('class',"infoLabel"); 
   document.getElementById('localTZLabel').innerHTML = "UTC/GMT time : " + d.toUTCString();
   document.getElementById('gmtLabel').innerHTML = "Local time : " + d;
}   
 
function updateTime()
{
	var d = new Date();
	var  epochSec = d.getTime();
	document.getElementById('sysTimelabel').innerHTML = "Your system seconds since epoch : " + epochSec + " (" + d + ")";

}
