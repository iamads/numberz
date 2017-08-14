let prompt = require('prompt-sync')();
let cab = require('./cab');
let commuter = require('./commuter');

const MIN_CITY_X = -50;
const MAX_CITY_X = 50;
const MIN_CITY_Y = -50
const MAX_CITY_Y = 50

// gets location of entities for initialization
function get_location() {
  let x = parseFloat(prompt('X coordinate'));
  let y = parseFloat(prompt('Y coordinate'));
  
  if (isNaN(x) || isNaN(y)) {
    console.log("Something is wrong. Please try again");
    return get_location()
  }

  if ( x > MAX_CITY_X || x < MIN_CITY_X || y > MAX_CITY_Y || y < MIN_CITY_Y){
    console.log("Location out of city limits");
    return get_location();
  }

  return [x, y]
}

// gets all the commuters and returns an array of commuter location
function get_commuters() {
  let n = parseInt(prompt('How many commuters?'));

  let commuters = [];

  for(var i=0; i < n; i++){
    console.log("Commuter # " + (i+1));
    location = get_location();
    commuters.push(new commuter(location[0], location[1]));
  }

  return commuters;
}

// gets all the cabs and returns an array of cabs location
function get_cabs() {
  let m = parseInt(prompt('How many cabs?'));

  let cabs = [];

  for(var i=0; i < m; i++){
    console.log("Cab # " + (i+1))
    location = get_location();
    cabs.push(new cab(location[0], location[1]));
  }

  return cabs;
}

function get_nearby_cabs(min_x, max_x, min_y, max_y) {
  // This will break if there is no cab

  if (min_x === MIN_CITY_X && min_y === MIN_CITY_Y && max_x === MAX_CITY_X && max_y === MAX_CITY_Y ){
    return []
  }

  let nearby_cabs = [];

  cabs.forEach(function(cab){
    if (cab.x >= min_x && cab.x <= max_x && cab.y >= min_y && cab.y <= max_y  && cab.seats_left > 0) {
      nearby_cabs.push(cab);
    } 
  }) 

  if (nearby_cabs.length == 0){
    min_x = (min_x-1) >= MIN_CITY_X ? (min_x-1) : MIN_CITY_X;
    min_y = (min_y-1) >= MIN_CITY_Y ? (min_y-1) : MIN_CITY_Y;
    max_x = (max_x+1) <= MAX_CITY_X ? (max_x+1) : MAX_CITY_X;
    max_y = (max_y+1) <= MAX_CITY_Y ? (max_y+1) : MAX_CITY_Y; 
    
    return get_nearby_cabs(min_x, max_x, min_y, max_y);
  } else {
    return nearby_cabs;
  }
}

function get_nearest_cab(x, y, cabs) {
  let min = Infinity;
  let distance = 0;
  let selected_cab = {};

  cabs.forEach(function(cab){
    distance = Math.pow((cab.x - x), 2) + Math.pow((cab.y - y), 2);
    if (distance < min) {
      min = distance;
      selected_cab = cab;
    }
  }) 

  return selected_cab;
}



let cabs = get_cabs();
let commuters = get_commuters();
let total_distance_travelled_by_cabs = 0;

commuters.forEach(function(commuter){
  if (!commuter.alloted){
    let nearby_cabs = get_nearby_cabs(commuter.x-1, commuter.x+1, commuter.y-1, commuter.y+1);
    let selected_cab = get_nearest_cab(commuter.x, commuter.y, nearby_cabs);

    if (Object.keys(selected_cab).length === 0) {
      console.log("Error: No Cab was selected") 
    } else {
      commuter.alloted = true;
      selected_cab.seats_left -= 1;
      selected_cab.assigned.push(commuter) 
    }
  }  
})

console.log(JSON.stringify(cabs, null, 2));

cabs.forEach(function(cab){
  if (cab.assigned.length > 0) {
    let min = Infinity;
    let nearest_commuter = {};

    cab.assigned.forEach(function(commuter) {
      distance =  Math.sqrt(Math.pow((cab.x - commuter.x), 2) +  Math.pow((cab.y - commuter.y), 2))
      if (min > distance) {
        min = distance;
        nearest_commuter = commuter;   // taking the nearest commuter from the cab as pickup point for all the commuters  
      }
    })

    distance_to_nearest_commuter = min;
    distance_from_origin =  Math.sqrt(Math.pow(nearest_commuter.x, 2) + Math.pow(nearest_commuter.y, 2));

    total_distance_travelled_by_cabs += distance_to_nearest_commuter + distance_from_origin
  }
})

console.log(total_distance_travelled_by_cabs)
