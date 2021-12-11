// import React, { useState, useEffect } from "react";
// import "./styles.css";

// function Box({ thing, index, style, updateStatus }) {
//   return (
//     <button
//       type="button"
//       className="Box"
//       style={style(index)}
//       onClick={() => updateStatus(index)}
//     >
//       <div>{thing[index].status}</div>
//     </button>
//   );
// }

// function Reset({ newColors, colors, thing }) {
//   return (
//     <button type="button" onClick={() => newColors(colors, thing)}>
//       Reset
//     </button>
//   );
// }

// function App() {
//   const [status, setStatus] = useState([
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false },
//     { status: null, clicked: false }
//   ]);

//   const [color, setColor] = useState([
//     "red",
//     "red",
//     "yellow",
//     "yellow",
//     "blue",
//     "blue",
//     "orange",
//     "orange",
//     "pink",
//     "pink",
//     "purple",
//     "purple",
//     "white",
//     "white",
//     "green",
//     "green"
//   ]);

//   const [holder, setHolder] = useState([]);

//   function updateStatus(index) {
//     if (!status[index].clicked) {
//       const newStatus = [...status];
//       newStatus[index].clicked = true;

//       let newHolder = [...holder, { index, color: color[index] }];

//       if (newHolder.length === 2) {
//         if (!holderTest(newHolder)) {
//           setTimeout(function () {
//             newHolder.map((x) => {
//               newStatus[x.index].clicked = false;
//               return setStatus(newStatus);
//             });
//           }, 2000);
//         }
//         newHolder = [];
//       }
//       setStatus(newStatus);
//       setHolder(newHolder);
//     }
//   }

//   console.log(holder.length);
//   console.log(holder);
//   console.log(status);

//   /*    function misMatch(newHolder){
//       return (newHolder.map((x) => {
//         newStatus[x.index].clicked = false;
//       }))
//     } */

//   function holderTest(holderToTest) {
//     if (holderToTest[0].color === holderToTest[1].color) {
//       return true;
//     }
//   }

//   function colorChange(index) {
//     return { backgroundColor: status[index].clicked ? color[index] : "black" };
//   }

//   function resetColor(array, array2) {
//     const newColors = [...array];
//     const newArray = [...array2];

//     for (var i = newColors.length - 1; i > 0; i--) {
//       var j = Math.floor(Math.random() * (i + 1));
//       var temp = newColors[i];
//       newColors[i] = newColors[j];
//       newColors[j] = temp;
//     }

//     newArray.map((x) => {
//       return x.clicked = false;
//     });
//     setStatus(newArray);
//     return setColor(newColors)

//   }

//   return (
//     <div>
//       <Reset newColors={resetColor} colors={color} thing={status} />
//       <div className="row">
//         <div className="column">
//           <Box
//             thing={status}
//             index={0}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//           <Box
//             thing={status}
//             index={1}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//           <Box
//             thing={status}
//             index={2}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//           <Box
//             thing={status}
//             index={3}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//         </div>
//         <div className="column">
//           <Box
//             thing={status}
//             index={4}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//           <Box
//             thing={status}
//             index={5}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//           <Box
//             thing={status}
//             index={6}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//           <Box
//             thing={status}
//             index={7}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//         </div>
//         <div className="column">
//           <Box
//             thing={status}
//             index={8}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//           <Box
//             thing={status}
//             index={9}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//           <Box
//             thing={status}
//             index={10}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//           <Box
//             thing={status}
//             index={11}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//         </div>
//         <div className="column">
//           <Box
//             thing={status}
//             index={12}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//           <Box
//             thing={status}
//             index={13}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//           <Box
//             thing={status}
//             index={14}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//           <Box
//             thing={status}
//             index={15}
//             style={colorChange}
//             updateStatus={updateStatus}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
const array = [5,1,6,2,4,3]
// bubble sort
// for (let i = 0; i < array.length; i++){
//   let flag = 0
//   for(let j = 0; j < array.length- i - 1; j++){
//     if (array[j] > array[j+1]){
//       let temp = array[j]
//       array[j] = array[j + 1]
//       array[j + 1] = temp
//       flag = 1 
//     }
//   }
//   if (flag  === 0){
//     break
//   }
// }

// insertion sort 

let i, j, key
for (i = 1; i < array.length; i++){
  key = array[i]
  j = i - 1
  while(j >= 0 && key < array[j]){
    array[j + 1] = array[j]
    j--
  }
  array[j + 1] = key
}
console.log(array)