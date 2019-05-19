   import React, { Component } from 'react';
   import ReactDOM from 'react-dom';
   import * as THREE from 'three'; 
   import 'babel-polyfill';
   import * as createPanZoom from 'three.map.control';
   var Convert = require('ansi-to-html');
   var convert = new Convert();
   


   var ansi_str = "\x1b[1m\x1b[32ms\x1b[0;37m\x1b[32mt\x1b[1m\x1b[30mri\x1b[0;37m\x1b[32mn\x1b[1m\x1b[32mg\x1b[0;37m of a \x1b[1m\x1b[30mw\x1b[0;37m\x1b[31my\x1b[1m\x1b[30mv\x1b[0;37m\x1b[31me\x1b[1m\x1b[30mrn\x1b[0;37m";
   var parsed = convert.toHtml(ansi_str);


const MapElement = function(center)  {
   var renderer = null; 
   const scene = new THREE.Scene();
   const camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 2000 );
   var panZoom = null;
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
        console.log('bfs completed');
      } 

      function getExits(room) {
         return room['exits'];
      }

      async function loadData(scene, center) {
             const response = await fetch("mud.json"); 
             const roomsMap = await response.json();
             const c = roomsMap[center]; 
             
             console.log('data loaded');

             c.x = 0;
             c.y = 0;
             c.z = 0;
             c.color = 'red';

             scene.add(makeCube(c.x,c.y,c.z,c.color));
             room_stack.push(c);
             bfs(roomsMap);
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

      function makeCube(x,y,z, color) 
      {
          const cube = new THREE.Mesh( new THREE.CubeGeometry(0.5,0.5,0.5) , new THREE.MeshBasicMaterial( { color: (color ? color : "orange")  } ));
          cube.position.x = x;
          cube.position.y = y;
          cube.position.z = z;
          return cube;
      }

      function resizeCanvas() {
             loadData(scene, center);
         
             const canvas = document.createElement('canvas');     
             const p = document.getElementById('mapperCanvas');
             p.appendChild(canvas);
             canvas.style.width = "100%";
             canvas.style.height= "100%";
             canvas.width = canvas.offsetWidth;
             canvas.height = canvas.offsetHeight;

             p.appendChild(canvas);

             renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false});
             panZoom = createPanZoom(camera, renderer.domElement);

             camera.position.set( 0, 0, 0);
             camera.lookAt( 0 , 0, -3 );                     

             renderer.setSize( window.innerWidth, window.innerHeight );
             camera.position.z = 100;
             render();
      }

      function update() {
         renderer.render(scene, camera);
      }


      function render() {
           requestAnimationFrame(render);
           update();  
      }

      resizeCanvas();
   }

   class EverwarMap extends React.Component {

       componentDidMount()
       {
          MapElement(6232);
       }

       render() {
           return (<div>
                      <p>Welcome to Everwar</p>
                      <div id="mapperCanvas"></div>
                   </div>);
       }
   }

   var map = document.getElementById('mapper');
   ReactDOM.render(<EverwarMap/>, map);
