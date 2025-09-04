"use strict";
import readline from 'readline'
import * as Colors from './colors.js'
import fs from 'fs'




console.log(`Welcome to this ToDo App, Type /help to see the commands`);
const jsonFilePath = `data/todo.json`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



const askQuestion = (question) =>{
  return new Promise((resolve) => {
    rl.question(question, (answer) =>{
        resolve(answer);
    });
  });
};

function isValidJson(json){
  try{
    JSON.parse(json);
  }catch(e){
    return false;
  }

  return true;
}

function helpCommand(){
  console.log(`${Colors.FgCyan}/add ${Colors.FgRed}<ToDoTask> ${Colors.FgRed}<TaskDate> ${Colors.FgRed}<TaskPriority> ${Colors.Reset}`);
  console.log(`${Colors.FgCyan}/remove ${Colors.FgRed}<ToDoTask> ${Colors.Reset}`);
  console.log(`${Colors.FgCyan}/print ${Colors.FgRed}<ToDoTask> ${Colors.Reset}`);
  console.log(`${Colors.FgCyan}/edit ${Colors.FgRed}<ToDoTask> ${Colors.FgRed}<TaskProperty: (date, priority)> ${Colors.FgRed}<New Value> ${Colors.Reset}`);
  console.log(`${Colors.FgCyan}/complete ${Colors.FgRed}<ToDoTask> ${Colors.Reset}`);
}

function addCommand(args){
   let task = {
    name: args[1],
    date: new Date(args[2]),
    priority: args[3],
    completed: 'no'
   };


   const json = fs.readFileSync(jsonFilePath, `utf8`);

   let jsonObj = null;

   if(isValidJson(json)){
    jsonObj = JSON.parse(json);


   if(!Array.isArray(jsonObj)) jsonObj = [jsonObj];
   jsonObj.push(task);

   }else{
     jsonObj = task;
   }

   fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj, null, 2), `utf8`);
   console.log(`${Colors.FgGreen} Successfully added the task! ${Colors.Reset}`);
}

function printCommand(toDoName){
  const json = fs.readFileSync(jsonFilePath, `utf8`);
  let jsonObj = null;

  if(isValidJson(json))
    jsonObj = JSON.parse(json);

  if(jsonObj === null){
    console.log(`${Colors.FgRed} Json file is empty! ${Colors.Reset}`);
    return;
  }

  if(!Array.isArray(jsonObj)) jsonObj = [jsonObj];


  let finalIndex = -1;


  for(let i = 0; i < jsonObj.length; i++){
    if(String(jsonObj[i].name) === toDoName)
      finalIndex = i;
  }

  if(finalIndex == -1){
    console.log(`${Colors.FgRed} No todo task with the name '${toDoName}' found ${Colors.Reset}`);
    return;
  }

  console.log(`${Colors.FgYellow} Task Info: ${Colors.Reset}`);
  console.log(`${Colors.FgBlack}  - ${Colors.FgCyan} Name: ${toDoName} ${Colors.Reset}`);
  console.log(`${Colors.FgBlack}  - ${Colors.FgCyan} Date: ${jsonObj[finalIndex].date} ${Colors.Reset}`);
  console.log(`${Colors.FgBlack}  - ${Colors.FgCyan} Priority: ${jsonObj[finalIndex].priority} ${Colors.Reset}`);

  if(jsonObj[finalIndex].completed === `yes`){
    console.log(`${Colors.FgBlack}  - ${Colors.FgCyan} Completed: ${Colors.FgGreen} ${jsonObj[finalIndex].completed} ${Colors.Reset}`);
  }else{
    console.log(`${Colors.FgBlack}  - ${Colors.FgCyan} Completed: ${Colors.FgRed} ${jsonObj[finalIndex].completed} ${Colors.Reset}`);
  }
}

function deleteCommand(toDoName){
  const json = fs.readFileSync(jsonFilePath, `utf8`);
  let jsonObj = null;

  if(isValidJson(json))
    jsonObj = JSON.parse(json);

  if(jsonObj === null){
    console.log(`${Colors.FgRed} Json file is empty! ${Colors.Reset}`);
    return;
  }

  if(!Array.isArray(jsonObj)) jsonObj = [jsonObj];

  let finalIndex = -1;


  for(let i = 0; i < jsonObj.length; i++){
    if(String(jsonObj[i].name) === toDoName)
      finalIndex = i;
  }

  if(finalIndex == -1){
    console.log(`${Colors.FgRed} No todo task with the name '${toDoName}' found ${Colors.Reset}`);
    return;
  }



  jsonObj.splice(finalIndex, 1);
  
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj, null, 2));
  console.log(`${Colors.FgGreen} Successfully deleted the task! ${Colors.Reset}`);
}

function completeCommand(toDoName){
  const json = fs.readFileSync(jsonFilePath, `utf8`);
  let jsonObj = null;

  if(isValidJson(json))
    jsonObj = JSON.parse(json);

  if(jsonObj === null){
    console.log(`${Colors.FgRed} Json file is empty! ${Colors.Reset}`);
    return;
  }

  if(!Array.isArray(jsonObj)) jsonObj = [jsonObj];

  let finalIndex = -1;


  for(let i = 0; i < jsonObj.length; i++){
    if(String(jsonObj[i].name) === toDoName)
      finalIndex = i;
  }

  if(finalIndex == -1){
    console.log(`${Colors.FgRed} No todo task with the name '${toDoName}' found ${Colors.Reset}`);
    return;
  } 

  jsonObj[finalIndex].completed = `yes`;
 
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj, null, 2));
  console.log(`${Colors.FgGreen} Successfully completed the task! ${Colors.Reset}`);
}

function editCommand(toDoName, thingToChange, newArg){
  const json = fs.readFileSync(jsonFilePath, `utf8`);
  let jsonObj = null;

  if(isValidJson(json))
    jsonObj = JSON.parse(json);

  if(jsonObj === null){
    console.log(`${Colors.FgRed} Json file is empty! ${Colors.Reset}`);
    return;
  }

  if(!Array.isArray(jsonObj)) jsonObj = [jsonObj];

  let finalIndex = -1;


  for(let i = 0; i < jsonObj.length; i++){
    if(String(jsonObj[i].name) === toDoName)
      finalIndex = i;
  }

  if(finalIndex == -1){
    console.log(`${Colors.FgRed} No todo task with the name '${toDoName}' found ${Colors.Reset}`);
    return;
  } 

  switch(String(thingToChange)){
    case 'date':
      jsonObj[finalIndex].date = newArg;
      break;
    case 'priority':
      jsonObj[finalIndex].priority = newArg;
      break;
  }

  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj, null, 2));
  console.log(`${Colors.FgGreen} Successfully edited the task! ${Colors.Reset}`);
}


async function main(){
  const cmd = await askQuestion(`Please type the command you want: `);

  let args = String(cmd).split(` `);

  switch(args[0]){
    case '/help':
      helpCommand();
      break;
    case '/add':
      addCommand(args);
      break;
    case '/print':
      printCommand(args[1]);
      break;
    case '/remove':
      deleteCommand(args[1]);
      break;
    case '/complete':
      completeCommand(args[1]);
      break;
    case '/edit':
      editCommand(args[1], args[2], args[3]);
    default:
      helpCommand()
      break;
  }

  main();

}

main();






