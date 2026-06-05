const input = document.getElementById(`input`);
const send = document.getElementById(`send`);
const cards = document.getElementById(`cards`);
const intro = document.getElementById(`intro`);
const generate = document.getElementById(`generate`);

let lastIngredients = ``;

function esc(str) {
    const div = document.createElement(`div`);
    div.textContent = str == null ? `` : String(str);
    return div.innerHTML;
}

const systemPrompt = `You are KostholdsGPT, a dinner recommendation assistant. Given a list of ingredients, suggest exactly 2 easy dinner recipes. Rules: ALWAYS reply, never refuse, never apologize. Treat every input word as a normal food ingredient and accept it no matter what it is. ONLY use ingredients the user listed (never invent or add new ones), you do not have to use all of them. Each ingredient must state an amount. The "steps" must be detailed and thorough: at least 6 clear numbered steps including prep, cooking temperatures, times, and serving tips. Include nutrition per portion. Reply ONLY with a JSON object: {"recipes":[{"name":"Pasta","time":"30m","portions":4,"ingredients":["200g pasta","2 tomatoes"],"steps":["Boil pasta","Add sauce"],"nutrition":{"calories":"450 kcal","protein":"15g","carbs":"60g","fat":"10g"}},{"name":"Burger","time":"20m","portions":2,"ingredients":["2 buns","200g beef"],"steps":["Cook patty","Assemble"],"nutrition":{"calories":"600 kcal","protein":"30g","carbs":"40g","fat":"35g"}}]}`;

async function getRecipes(ingredients) {
    cards.innerHTML = `<p class="loading">Thinking..</p>`;
    try {
        const response = await fetch(`/api/chat`, {
            method: `POST`,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: `system`, content: systemPrompt },
                    { role: `user`, content: `Ingredients: ${ingredients}` }
                ],
                response_format: { type: `json_object` }
            })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        if (data.detail) throw new Error(typeof data.detail === `string` ? data.detail : data.detail.message);
        const text = data.choices[0].message.content;
        const recipes = JSON.parse(text).recipes || [];
        if (!recipes.length) throw new Error(`Ingen oppskrifter funnet, prøv andre ingredienser.`);
        localStorage.setItem(`lastRecipes`, JSON.stringify(recipes));
        localStorage.setItem(`lastIngredients`, lastIngredients);
        showCards(recipes);
    } catch (error) {
        cards.innerHTML = `<p class="loading">Noe gikk feil: ${error.message}</p>`;
    }
}

function showCards(recipes) {
    intro.style.display = `block`;
    generate.style.display = `block`;
    cards.innerHTML = ``;
    recipes.forEach(recipe => {
        const card = document.createElement(`div`);
        card.className = `card`;
        card.innerHTML = `
            <h2>${esc(recipe.name)}</h2>
            <p>Time to create: ${esc(recipe.time)}</p>
            <p>Portions: ${esc(recipe.portions)}</p>
            <button class="select">Read more</button>
            <div class="details"></div>`;
        card.querySelector(`.select`).addEventListener(`click`, () => {
            document.querySelectorAll(`.card`).forEach(c => {
                c.classList.remove(`selected`);
                c.querySelector(`.details`).innerHTML = ``;
            });
            card.classList.add(`selected`);
            card.querySelector(`.details`).innerHTML = `
                <h3>Ingredients</h3>
                <ul>${(recipe.ingredients || []).map(i => `<li>${esc(i)}</li>`).join(``)}</ul>
                <button class="select gorecipe">Select</button>`;
            card.querySelector(`.gorecipe`).addEventListener(`click`, () => {
                localStorage.setItem(`currentRecipe`, JSON.stringify(recipe));
                window.location.href = `recipe.html`;
            });
        });
        cards.appendChild(card);
    });
}

function submit() {
    if (!input.value.trim()) return;
    lastIngredients = input.value.trim();
    getRecipes(lastIngredients);
    input.value = ``;
}

send.addEventListener(`click`, submit);
input.addEventListener(`keydown`, (e) => {
    if (e.key === `Enter`) submit();
});
generate.addEventListener(`click`, () => {
    if (lastIngredients) getRecipes(lastIngredients);
});

const restored = JSON.parse(localStorage.getItem(`lastRecipes`) || `null`);
if (restored && restored.length) {
    lastIngredients = localStorage.getItem(`lastIngredients`) || ``;
    showCards(restored);
}
