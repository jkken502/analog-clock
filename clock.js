//global variables start
var seconds=0;
var minutes=0;
var hours=0;
var ampm="AM";//what time of day is it
var hoursoffset=0;//number of hours difference between local and server time
var minutesoffset=0;//number of minutes difference between local and server time
var digital=false;//are we displaying the time in digital format
var reset=true;//used so the change from ampm only happens the first time the hour changes to 12.
//global variables end
function draw()
{
	if(digital)
	{	if(hours<10 && typeof(hours)=="number")
		{
			hours="0"+hours;
       		}
		if(minutes<10 && typeof(minutes)=="number")
        	{
			minutes="0"+minutes;
        	}
		if(seconds<10 && typeof(seconds)=="number")
        	{
			seconds="0"+seconds;
        	}
		document.getElementById('digital').innerText=hours+":"+minutes+":"+seconds+" "+ampm;
	}
	else
	{	var sd=seconds*6;//seconds degrees
		var md=minutes*6;
		var hd=((hours%12)*30)+((minutes/60)*30);
		hd=Math.round(hd);
		//document.getElementById('digital').innerText="";
		//document.getElementById('digital').innerText=hd+":"+md+":"+sd;
		clock();
		hands(sd,md,hd);
	}
}
//may be called every once in awhile to resync time.
//return type:undefined, houroffset and minuteoffset type:number
function hardUpdate(hoursoffset,minutesoffset)
{
	//start number logic
	//if arguments are not numbers check if mutiplying the number by 1 converts it into a number, otherwise
	if(typeof(hoursoffset)!="number")
	{
		if((typeof(hoursoffset)*1)!="number")
		{
		hoursoffset=0;
		}
		else
		{
			hoursoffset=hoursoffset*1;
		}
	}
	if(typeof(minutesoffset)!="number")
	{
	if((typeof(minutesoffset)*1)!="number")
		{
		minutesoffset=0;
		}
		else
		{
			minutesoffset=minutesoffset*1;
		}
	}
	//end of number logic.

	date=new Date();
	date.setHours(date.getHours()+hoursoffset,date.getMinutes()+minutesoffset);
	seconds=date.getSeconds();
	minutes=date.getMinutes();
	hours=date.getHours();//this is currently the 24 hour version.
	if(hours<1)
	{
		hours=12;
	}
	ampm="PM";
	if(hours<12)
	{
		ampm="AM";
	}
	else
	{
		ampm="PM";
	}
	return undefined;
}

//will be called every 1 second to update the variables.
//return undefined, update boolean
function timer(update)
{
	//set the default value if update is 'undefined'.
	if(typeof(update)=="undefined")
	{
		update=true;
	}
	//if update is not either: a boolean, or the numbers (0 or 1); Then we will change update to true.
	if(!(typeof(update)=="boolean" || (typeof(update)=="number" && update===0 || update===1)))
	{
		update=true;
	}
	//if we are updating the time increase seconds
	if(update)
	{
		seconds++;
	}
	//if none of the values need to be updated, return from the function. "time is money"
	if(hours<12 && minutes<59 && seconds<59)
	{
		draw();
		return undefined;
	}
	//next few 3 if statements check
	if(seconds>59)
	{
		seconds=seconds-60;
		minutes++;
	}

	if(minutes>59)
	{
		hours++;
		minutes=minutes-60;
	}
	if(hours==12 && reset==true)
	{
	ampm=ampm=="AM"?"PM":"AM";
	reset=false;
	}
	if(hours!=12 && reset==false)
	{
		reset=true;
	}
	if(hours>12)
	{
		//hours=hours%12;
	}
	//Was able to make the code more effective by switching the order of if statements, so
	//everything will be correct the first time, and timer does not need to be called
	//again to verify everything was called correctly.
	//timer(false);
draw();
return undefined;
}

var request=new XMLHttpRequest();
request.onreadystatechange=function(){
	if(request.status==200 && request.readyState==4)
	{
		timejson=JSON.parse(request.responseText);
		afterRequestFinished();
	}
};
request.open("GET","http://worldclockapi.com/api/json/utc/now",true);
request.send();
var timezone;{let datetmp=new Date();timezone=(datetmp.getTimezoneOffset()/60)*-1}


function afterRequestFinished()
{
	date=new Date();
	seconds=date.getSeconds();
	minutes=date.getMinutes();
	hours=date.getHours();
	hoursoffset=hours-timejson.currentDateTime.split('-')[2].split('T')[1].split(":")[0]-timezone;
	minutesoffset=minutes-timejson.currentDateTime.split('-')[2].split('T')[1].split(":")[1].split('Z')[0];
	hardUpdate(hoursoffset,minutesoffset);
	timeInterval=setInterval(function(){timer()},1000);
}
c=document.getElementById('myclock').getContext('2d');
		c.clear=function(){c.clearRect(0,0,300,300);c.beginPath();}
		function number(num)
		{
			c.save();
			c.translate(145,155);
			c.rotate((30*num)*(Math.PI/180));
			c.beginPath();
			c.translate(0,-140);
			c.rotate((-30*num)*(Math.PI/180));
			c.fillText(num, 0, 0);
			c.stroke();
			c.restore();
		}
		function hand(degree, length, color)
		{	
			c.strokeStyle="black";
			c.save();

			c.translate(150,150);

			c.rotate((degree)*(Math.PI/180));

			c.beginPath();

			if(color!=undefined)c.strokeStyle=color;
			c.moveTo(0,0);

			c.lineTo(0,length*-1);

			c.stroke();

			c.restore();
		}
		function clock()
		{
			//circle
			c.clear();
			c.arc(150,150,150,0,2*Math.PI);
			c.stroke();
			//text
			for(i=1;i<13;i++)number(i);
			
		}
		function hands(sd,md,hd)
		{
			hand(sd,120,"red");
			hand(md,100);
			hand(hd,75);
		}



