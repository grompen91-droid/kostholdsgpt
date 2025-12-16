
async function loadPrompt() {
    try {
        const response = await fetch(`./prompt.json`)
        return await response.json();
    }   catch (error){
        console.error(`Noe gikk feil ${error.message}`)
    }
}
const jsonTemplate = loadPrompt();
console.log(jsonTemplate);

const input = document.getElementById(`input`);

/* input.addEventListener(`click`, (e) => {
    if (e.key === `Enter`) {
        console.log(`${e.key}, key pressed! ${jsonTemplate}`)
    }});*/


// fetch(`http://localhost:3000/api/chat`, {
//     method: `POST`,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//         model: `gpt-oss:120b-cloud`,
//         messages: [
//             {
//                 role: `user`,
//                 content: `Who are you?`
//             }
//         ]
//     })
// }).then(data => console.log(data.json()))
// .catch(error => console.error(error));
