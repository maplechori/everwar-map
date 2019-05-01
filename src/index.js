   import React, { Component } from 'react';
   import * as THREE from 'three'; 
   import * as ansi from 'ansicolor';
   import * as createPanZoom from 'three.map.control';

   var scene = new THREE.Scene();
   var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 2000 );
   var renderer = new THREE.WebGLRenderer();
   var panZoom = createPanZoom(camera, renderer.domElement);
   
   renderer.setSize( window.innerWidth, window.innerHeight );

   camera.position.set( 0, 0, 0);
   camera.lookAt( 0 , 0, -3 );

   document.body.appendChild( renderer.domElement );

   function makeCube(x,y,z, color) {
        var cube = new THREE.Mesh( new THREE.CubeGeometry(0.5,0.5,0.5) , new THREE.MeshBasicMaterial( { color: (color ? color : "orange")  } ));
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        return cube;
   }

   function getExits(room) {
       return room['exits'];
   }

   function getColorFromSector(sector)
   {
       switch(sector)
       {
          case 0:
          case 1:
              return "#E8E8E8";
          case 5:
          case 13:
          case 14:
          case 15:
              return 'white';
          case 2:
          case 3:
          case 4:
          case 76:
              return 'gray';
          case 6:
          case 24:
              return 'green';
          case 7:
          case 30:
          case 31:
              return 'yellow';
          case 8:
              return 'brown';
          case 9:
              return '#33abf9';
          case 10:
          case 11:
              return 'blue';
          case 12:
          case 27:
              return 'purple';

          case 16:
          case 17:
              return '#00FFFF';
          case 36:
          case 25:
              return 'red';    
          case 26:
              return '#99FF33';
          default:
              return 'white';
       }

   }


   var room_stack = [];

   function bfs(rooms)
   {
       while(room_stack.length)
       { 
          var current = room_stack.pop();
           
          for (var j in getExits(current))
          {   
             if (current.exits[j] == 0)
                 continue;
               
             var new_room = rooms[current.exits[j]];

             if (j  == "south") {
                new_room.x = current.x;
                new_room.y = current.y - 1;
                new_room.z = current.z;
             } else if (j == "west") { 
                new_room.x = current.x - 1;
                new_room.y = current.y;
                new_room.z = current.z;
             } else if (j == "east") {
                new_room.x = current.x + 1;
                new_room.y = current.y;
                new_room.z = current.z;
             } else if (j == "north") {
                new_room.x = current.x;
                new_room.y = current.y + 1;
                new_room.z = current.z;
             } else if (j == "up") {
                new_room.x = current.x;
                new_room.y = current.y;
                new_room.z = current.z - 1;
             } else if (j == "down") {
                new_room.x = current.x;
                new_room.y = current.y;
                new_room.z = current.z + 1;
             }

             if (!new_room.visited)
             {
                 new_room.color = getColorFromSector(new_room.sector);

                 if (new_room.x == 0 && new_room.y == 0 && new_room.z == 0)
                     new_room.color = "red";
                                                             
                 scene.add(makeCube(new_room.x, new_room.y, new_room.z, new_room.color));      
                 new_room.visited = true;
                 room_stack.unshift(new_room);
             }
          }
       }
   } 


   var CENTER = 6232;

   fetch("mud.json")  
    .then(response => response.json())
    .then( (roomsMap) => {
            
            var center = roomsMap[CENTER]; 
          
            center.x = 0;
            center.y = 0;
            center.z = 0;
            center.color = 'red';

            scene.add(makeCube(center.x,center.y,center.z,center.color));
            room_stack.push(center);
            
            bfs(roomsMap);

    });

   camera.position.z = 100;

   var animate = function () 
   {
     requestAnimationFrame( animate );
     renderer.render( scene, camera );
   }; 

   animate();

   class EverwarMap extends Component {

       componentDidMount()
       {

       }

       render() {
           return (<div></div>);
       }
   }

