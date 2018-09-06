jQuery(document).ready(function($) {
var Template = $('#template').html();
var Template2 = $('#template2').html();
var Ajaxres;
var airplane = new RegExp('{{airplane}}','g');
function getLocation() {    
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, positionError);

    }
}

function showPosition(){
    $.ajax({
    url: 'http://ip-api.com/json',
    type: 'GET',
    dataType: 'JSON',
})
.done(function(res) {
    var Lat = res.lat;
    var Long = res.lon;
    console.log(Lat);
    console.log(Long);
    AjaxCall(Lat,Long);
    function AjaxCall(Lat,Long){
 
        $.ajax({
        url: 'http://public-api.adsbexchange.com/VirtualRadar/AircraftList.json',
        type: 'GET',
        dataType: 'JSONP',
    })
    .done(function(filter) { 
        Ajaxres = filter.acList;
 displayPlane(filter,Lat,Long);
 })   
          
        
    .fail(function() {
        console.log("error");
    })
    $("#dinamicno").find("tr:not(:first)").remove();
    setTimeout(AjaxCall,60000,Lat,Long)
}
})
.fail(function() {
    console.log("error");
});




function displayPlane(filter,Lat,Long){
    var text= "";
    filter.acList.sort(compare);
    filter.acList.forEach(
        function(e){
            if(Lat < e.Lat){
            WestAndEast(e)    
       text = Template.replace("{{altitude}}",e.Alt).replace("{{icaos}}",e.Icao).replace("{{icon}}",WestAndEast(e)).replace("{{id}}",e.Id);
       
       $('#dinamicno').append(text); 
   }
    })
};


function compare(a,b) {
  if (a.Alt > b.Alt)
    return -1;
  if (a.Alt < b.Alt)
    return 1;
  return 0;
}
}

function positionError(error) {
    if(error.PERMISSION_DENIED)
        alert("Please accept geolocation");
    hideLoadingDiv()
    showError('Geolocation is not enabled. Please enable to use this feature')
}

console.log(getLocation());


function WestAndEast(e){
    if(e.Trak < 180){
        return "airplane-right.png"
    }else(e.Trak > 180)
        return "airplane-left.png"
}


$(document).on('click', '.first', function(e) {
    var Id = $(this).attr("data-id");
    console.log(Id);
    var foundOne = Ajaxres.forEach(function(e){
        if(Id == e.Id){
            var txt = Template2.replace(airplane,e.Man)
                              .replace("{{model}}",e.Mdl)
                              .replace("{{destination}}",e.To)
                              .replace("{{origin}}",e.From);
        $(".container").html('');
        $(".container").append(txt);
        $('#izadji').click(function(event){
        $('#overlay').fadeOut();
})
         $('#overlay').fadeIn();
        }

    })
});

$('#overlay').click(function(e) {
        e.stopPropagation();
    });







});