var currently_loged_in_as=localStorage.getItem('key');
setInterval(function(){
    console.log(currently_loged_in_as);
    if(currently_loged_in_as=='null')
{
    window.location.href='loginpage.html';
}
},1000);

document.getElementById('loggedinas').innerText=currently_loged_in_as;
console.log(currently_loged_in_as);
let slider=document.querySelector("#slider");
let timeremaining=document.querySelector(".timeremaining");
var init=1;
var f=0;
var currid=-1;
var fs=1;
var r=0;
var currsong_inqueue=-1;
var inqueue=[];
var liked=new Set();
var disliked=new Set();
let audioElement = document.createElement('audio');
let audio_slider=document.getElementById("#slider");
updateupnext=setInterval(setupnext,100);
function setTrack(trackId)
{
    currid=trackId;
    console.log(currid);
    if(init==1)
    {
        init=0;
    }
    if(f==0)
    {
        f=1;
        $("#play").toggleClass("fas fa-caret-square-right far fa-pause-circle");
    }
    $.post("load_data_from_db.php",{songId:trackId},function(data){
    var track=JSON.parse(data);
    console.log(track);
    audioElement.src=track.song;
    audioElement.play();
    $(".currsongimg").attr("src",track.img);
    $(".currsongname").text(track.name);
});
updateslider=setInterval(seekSlider,1000);
console.log(liked);
console.log(disliked);
if(liked.has(trackId))
{
    $('#like').css('color','#FFB6C1');
}
else
{
    $('#like').css('color','white');
}
if(disliked.has(trackId))
{
    $('#dislike').css('color','grey');
}
else
{
    $('#dislike').css('color','white');
}
}
function findtrack_by_id(trackId)
{
    $.post("load_data_from_db.php",{songId:trackId},function(data){
    var track=JSON.parse(data);
});
}
function convert_time(seconds)
{
    var time=Math.round(seconds);
    var min=Math.floor(seconds/60);
    var sec=time-(60*min);
    return (min+":"+sec);
}
function seekSlider()
{
    let slider_position=0;
    if((audioElement.currentTime!=audioElement.duration))
    {
        slider_position=(audioElement.currentTime/audioElement.duration)*100;
        var temp="position->"+slider_position.toString();
        slider.value=slider_position;
        timeremaining.textContent=convert_time(audioElement.duration-audioElement.currentTime);
    }
    else
    {
        if(inqueue.length>=1 && currsong_inqueue<=inqueue.length-2)
        {
            console.log("Setting up next track from queue");
            currsong_inqueue=currsong_inqueue+1;
            setTrack(inqueue[currsong_inqueue]);
        }
    }
}

function seekTo()
{
    let new_val=audioElement.duration*(slider.value/100);
    audioElement.currentTime=new_val;
}

var y=document.getElementById("songslider");
    y.oninput=function()
    {
        audioElement.volume=this.value/100;
    }


function playnext(trackid)
{
    inqueue.unshift(trackid);
}
function addtoqueuenext(trackid)
{
    inqueue.push(trackid);
}
function setupnext(){
    if(inqueue.length==0)
    {
        $('#upnext').css('opacity',0);
        /*$("#upnextimg").attr("src","data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=");
        $("#upnexttxt").text("");*/
    }
    if(inqueue.length>=1)
    {
    if(currsong_inqueue==inqueue.length-1)
    {
        $('#upnext').css('opacity',0);    
    }
    else
    {
    $('#upnext').css('opacity',1);
    $.post("load_data_from_db.php",{songId:inqueue[currsong_inqueue+1]},function(data){
    var track=JSON.parse(data);
    $("#upnextimg").attr("src",track.img);
    $("#upnexttxt").text(track.name);
});   }
    }
}

$('#sound').click(function(){
    f=1-f;
    $('#sound').toggleClass("fas fa-volume-up fas fa-volume-mute")
    if(f==0)
    audioElement.volume=0;
    else
    audioElement.volume=.5;
})

$('#play').click(function()
{
    f=1-f;
    if(f==0)
    audioElement.pause();
    else{
        if(init==0)
        audioElement.play();
        else
        {
            setTrack(1);
            init=0;
        }
    }
    $("#play").toggleClass("fas fa-caret-square-right far fa-pause-circle");
});

$('#replay').click(function(){
    var x=document.getElementById("replay");
    if(r==0)
    {
    x.style.color="grey";
    audioElement.loop=true;
    r=1;
    }
    else
    {
    x.style.color="white";
    audioElement.loop=false;
    r=0;
    }
});

$('#shuffle').click(function(){
    console.log("shuffle");
    setTrack(Math.floor((Math.random()*6) + 1));
});

$('#forw').click(function(){
    console.log("playnext");
    if(inqueue.length>=1 && currsong_inqueue<=inqueue.length-2)
    {
        currsong_inqueue=currsong_inqueue+1;
        setTrack(inqueue[currsong_inqueue]);
    }
});
$('#back').click(function(){
    console.log("playprev");
    if(inqueue.length>=1 && currsong_inqueue>=1) 
    {
        currsong_inqueue=currsong_inqueue-1;
        setTrack(inqueue[currsong_inqueue]);
    }
});
var prevdivid=-1;
var mouseoverqueue=0;
function makequeue(trackId,queue_pos)
{
    $.post("load_data_from_db.php",{songId:trackId},function(data){
    var track=JSON.parse(data);
    var list=document.getElementById('list');
    var listitem=document.createElement('LI');
    listitem.id=queue_pos.toString();
    var div=document.createElement('div');
    var playicn=document.createElement('i');
    var delicn=document.createElement('i');
    div.id=(trackId.toString());
    playicn.innerHTML='<i class="fas fa-play"></i>';
    delicn.innerHTML='<i class="fas fa-trash"></i>';
    playicn.style.color='white';
    delicn.style.color='white';
    div.style.position='relative';
    playicn.style.position='absolute';
    playicn.style.right='.5em';
    playicn.style.top='2em';
    playicn.style.fontSize='.8em';
    delicn.style.position='absolute';
    delicn.style.right='1.9em';
    delicn.style.top='2em';
    delicn.style.fontSize='.8em';
    div.style.marginTop=".4em";
    var spn=document.createElement('SPAN');
    spn.style.color="white"
    spn.style.position="relative";
    spn.style.left=".8em";
    spn.style.bottom="1.5em";
    var img=document.createElement('IMG');
    img.src=track[2];
    img.style.height="3.8em";
    img.style.width="4em";
    img.style.borderRadius="10%";
    img.style.position="relative";
    img.style.left=".2em";
    var txt=document.createTextNode(track[1]);
    spn.appendChild(txt);
    div.appendChild(img);
    div.appendChild(spn);
    div.appendChild(playicn);
    div.appendChild(delicn);
    listitem.appendChild(div);
    list.append(listitem);
    playicn.addEventListener('click',function(){
    setTrack(trackId);
    });
    delicn.addEventListener('click',function(){
    listitem=document.getElementById(queue_pos.toString()); 
    listitem.remove();
    var pos=inqueue.indexOf(trackId);
    inqueue.splice(pos,1);
    if(inqueue.length==0)
    currsong_inqueue=-1;
   });
});
}
$('#upnext').hover(function(){
    $('#upnext').css('height','15em');
    $('#upnext').css('width','11.5%');
    $('#upnextimg').css('opacity','0');
    $('#upnexttxt').css('opacity','0');
    $('#upnextheading').css('opacity','0');
    var i;
    var queue=document.getElementById('upnext');
    var list=document.createElement('OL');
    list.id='list';
    if(mouseoverqueue==0)
    {
    for(i=0;i<inqueue.length;i++)
    {
        makequeue(inqueue[i],i);
    }
    }
    queue.appendChild(list);
    mouseoverqueue=1;
    },function(){
    mouseoverqueue=0;
    $('#upnext').css('height','4em');
    $('#upnext').css('width','10%');
    $('#upnextimg').css('opacity','1');
    $('#upnexttxt').css('opacity','1');
    $('#upnextheading').css('opacity','1');
    list=document.getElementById('list');
    list.remove();
    }
);

$('#like').click(function(){
    if(liked.has(currid))
    {

    }
    else
    {
        console.log("Song added to liked set");
        liked.add(currid);
        $('#like').css('color','#FFB6C1');
        $('#dislike').css('color','white');
        if(disliked.has(currid))
        {
            disliked.delete(currid);
            console.log("Song deleted from disliked set");
        }
    }
});

$('#dislike').click(function(){
    if(disliked.has(currid))
    {

    }
    else
    {
        console.log("Song added to disliked set");
        disliked.add(currid);
        $('#like').css('color','white');
        $('#dislike').css('color','grey');
        if(liked.has(currid))
        {
            liked.delete(currid);
            console.log("Song deleted from liked set");
        }
    }
});
window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});
document.body.onkeyup = function(e){
    if(e.keyCode == 32)
    {
    f=1-f;
    if(f==0)
    audioElement.pause();
    else{
        if(init==0)
        audioElement.play();
        else
        {
            setTrack(1);
            init=0;
        }
    }
    $("#play").toggleClass("fas fa-caret-square-right far fa-pause-circle");
    }
}


function openmenu()
{
    var menu=document.getElementById('menubar');
    menu.style.opacity=1-menu.style.opacity;
}


function changepassword()
{

}

function forgotpassword()
{

}

function deleteaccount()
{
    console.log('Delete');
    $.post('loginpage.php',{username_:currently_loged_in_as},function(data){
    console.log(data);
    if(data==999)
    {
    alert('Account Deleted');
    localStorage.setItem('key','null');
    location.reload();
    }
});
}

function logout()
{
    localStorage.setItem('key','null');
    location.reload();
}