 /* Error 400 */
//  if (status === 400) {
//     if (resJson.Error === "Faltan campos obligatorios: [LastName]") {
//       res.json({
//         ok,
//         status,
//         message: noLastNameMsg
//       });
//     }

//     if (
//       resJson.Error.contains("operation performed with inactive user")
//     ) {
//       res.json({
//         ok,
//         status,
//         message: inactiveUserMsg,
//         help: inactiveUserHelp
//       });
//     }
//   }

//   /* Error 404 */
//   if (status === 404) {
//     // Invalid user
//     if (resJson["Auth error"] === "invalid user") {
//       return res.json({
//         ok,
//         status,
//         message: invalidUserMsg,
//         help: invalidUserHelp
//       });
//     }

//     // Invalid password
//     if (resJson["Auth error"] === "invalid password") {
//       return res.json({
//         ok,
//         status,
//         message: invalidPasswordMsg,
//         help: invalidPasswordHelp
//       });
//     }
//   }

//   /* Error 412 */
//   if (status === 412) {
//     if (resJson.Error === "no dealer specified") {
//       return res.json({
//         ok,
//         status,
//         message: noDealerMsg,
//         help: noDealerHelp
//       });
//     }

//     if (resJson.Error === "Fuente no registrada") {
//       return res.json({
//         ok,
//         status,
//         message: invalidProviderMsg,
//         help: invalidProviderHelp
//       });
//     }
//   }


// ===================================



// async sendMultipleLeads(req, res) {
//     let arrOfLeads = req.body;
//     let arrLeadIDs = [];

//     for (let lead in arrOfLeads) {
//       let { name, lastname, phones, code, comments } = arrOfLeads[lead];

//       let prospectObj = makeProspectObject({
//         name,
//         lastname,
//         phones,
//         code,
//         comments
//       });

//       // Log of Prospect object
//       console.log("*");
//       console.log(JSON.stringify(prospectObj));
//       console.log("*");

//       const options = {
//         method: "post",
//         body: JSON.stringify(prospectObj),
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           username: process.env.HEADER_USERNAME,
//           password: process.env.HEADER_PASSWORD,
//           dealer: process.env.HEADER_DEALER
//         }
//       };

//       if (lastname) {
//         try {
//           let response = await fetch(url, options);
//           let resJson = await response.json();
//           const { ok, status } = response;

//           if (ok) {
//             console.log(resJson);
//             arrLeadIDs.push(resJson.LeadId);
//             let lastItem = arrOfLeads.length - 1;

//             if (lead == lastItem) {
//               res.send(arrLeadIDs);
//               break;
//             }
//           }

//           /* Error 400 */
//           if (status === 400) {
//             if (resJson.Error === "Faltan campos obligatorios: [LastName]") {
//               res.json({
//                 ok,
//                 status,
//                 message: noLastNameMsg
//               });
//             }

//             if (
//               resJson.Error.contains("operation performed with inactive user")
//             ) {
//               res.json({
//                 ok,
//                 status,
//                 message: inactiveUserMsg,
//                 help: inactiveUserHelp
//               });
//             }
//           }

//           /* Error 404 */
//           if (status === 404) {
//             // Invalid user
//             if (resJson["Auth error"] === "invalid user") {
//               return res.json({
//                 ok,
//                 status,
//                 message: invalidUserMsg,
//                 help: invalidUserHelp
//               });
//             }

//             // Invalid password
//             if (resJson["Auth error"] === "invalid password") {
//               return res.json({
//                 ok,
//                 status,
//                 message: invalidPasswordMsg,
//                 help: invalidPasswordHelp
//               });
//             }
//           }

//           /* Error 412 */
//           if (status === 412) {
//             if (resJson.Error === "no dealer specified") {
//               return res.json({
//                 ok,
//                 status,
//                 message: noDealerMsg,
//                 help: noDealerHelp
//               });
//             }

//             if (resJson.Error === "Fuente no registrada") {
//               return res.json({
//                 ok,
//                 status,
//                 message: invalidProviderMsg,
//                 help: invalidProviderHelp
//               });
//             }
//           }
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     }

//     res.end();
//   }