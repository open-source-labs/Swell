/*
This Component is used to auto update the app, but it doesn't really work.
When migrating to gitHub Actions, it was disabled, but we didn't want to delete
it if it turned out to be useful for future iterators. That being said, if the 
app has solved the update task, this comp and the code in main.js ought to be 
deleted. 
*/

// import React, { useEffect, useState } from 'react';

// const { api } = window;

// const UpdatePopUpContainer = () => {
//   // Used to toggle the "update" pop-up.
//   const [message, setMessage] = useState(null);

//   useEffect(() => {
//     api.receive('message', (e, text) => {
//       console.log('AUTO-UPDATER STATUS: ' + e);
//       if (text) setMessage(text);
//     });
//   });

//   if (!message) {
//     return null;
//   }

//   const handleUpdateClick = () => {
//     api.send('quit-and-install');
//     setMessage(null);
//   };

//   return (
//     <div id="update-modal">
//       <span>{message}</span>

//       {message === 'Update downloaded.' && (
//         <>
//           <span className="updateMessage">
//             Do you want to restart and install now? (If not, will auto-install
//             on restart.)
//           </span>
//         </>
//       )}

//       <button
//         className="button is-small modal-button"
//         onClick={() => setMessage(null)}
//       >
//         Dismiss
//       </button>

//       {message === 'Update downloaded.' && (
//         <button
//           className="button is-small is-full-width modal-button-update"
//           onClick={handleUpdateClick}
//         >
//           Update
//         </button>
//       )}
//     </div>
//   );
// };

// export default UpdatePopUpContainer;
