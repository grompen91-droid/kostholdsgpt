const root = document.getElementById(`recipe`);
const recipe = JSON.parse(localStorage.getItem(`currentRecipe`) || `null`);

function esc(str) {
    const div = document.createElement(`div`);
    div.textContent = str == null ? `` : String(str);
    return div.innerHTML;
}

if (!recipe) {
    root.innerHTML = `<p class="loading">No recipe selected. <a class="link" href="index.html" style="color:black">Go back</a></p>`;
} else {
    const n = recipe.nutrition || {};
    root.innerHTML = `
        <div class="recipeImg"><img alt="${esc(recipe.name)}"></div>
        <h1 class="recipeTitle">${esc(recipe.name)}</h1>
        <div class="recipeMeta">
            <span>Time to create: ${esc(recipe.time)}</span>
            <span>Portions: ${esc(recipe.portions)}</span>
        </div>
        <section>
            <h2>Ingredients</h2>
            <ul>${(recipe.ingredients || []).map(i => `<li>${esc(i)}</li>`).join(``)}</ul>
        </section>
        <section>
            <h2>Nutrition per portion</h2>
            <ul>${Object.entries(n).map(([k, v]) => `<li>${esc(k)}: ${esc(v)}</li>`).join(``)}</ul>
        </section>
        <section>
            <h2>How to make</h2>
            <ol>${(recipe.steps || []).map(s => `<li>${esc(s)}</li>`).join(``)}</ol>
        </section>`;
    const heroImg = root.querySelector(`.recipeImg img`);
    fetch(`/api/image?q=${encodeURIComponent(recipe.name)}`)
        .then(r => r.json())
        .then(d => {
            if (d.image) {
                heroImg.src = d.image;
                heroImg.classList.add(`loaded`);
            }
        })
        .catch(() => { /* keep placeholder */ });
}
