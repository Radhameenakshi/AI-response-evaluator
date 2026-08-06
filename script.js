// ===============================
// AI Response Evaluator
// ===============================

// Evaluation criteria
const criteria = [
    "Accuracy",
    "Clarity",
    "Completeness",
    "Relevance",
    "Creativity"
];

const container = document.getElementById("criteriaContainer");

// Generate evaluation UI
criteria.forEach((criterion, index) => {

    const div = document.createElement("div");
    div.className = "criterion";

    div.innerHTML = `
        <h3>${criterion}</h3>

        <div class="rating-row">

            <div class="rating">
                <strong>Response A</strong>

                ${createStars("A", index)}
            </div>

            <div class="rating">
                <strong>Response B</strong>

                ${createStars("B", index)}
            </div>

        </div>
    `;

    container.appendChild(div);
});

// Create 5 stars
function createStars(response, criterionIndex) {

    let stars = "";

    for (let i = 1; i <= 5; i++) {

        stars += `
            <button
                class="star"
                data-response="${response}"
                data-criterion="${criterionIndex}"
                data-value="${i}"
            >
                ⭐
            </button>
        `;
    }

    return stars;
}

// Activate stars
document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("star")) return;

    const response = e.target.dataset.response;
    const criterion = e.target.dataset.criterion;
    const value = Number(e.target.dataset.value);

    const stars = document.querySelectorAll(
        `.star[data-response="${response}"][data-criterion="${criterion}"]`
    );

    stars.forEach(star => {

        if (Number(star.dataset.value) <= value) {
            star.classList.add("active");
        } else {
            star.classList.remove("active");
        }

    });

});

// ===============================
// Evaluate Button
// ===============================

document.getElementById("evaluateBtn").addEventListener("click", evaluate);

function evaluate() {

    let scoreA = 0;
    let scoreB = 0;

    criteria.forEach((_, index) => {

        scoreA += getRating("A", index);
        scoreB += getRating("B", index);

    });

    document.getElementById("scoreA").textContent =
        `${scoreA} / ${criteria.length * 5}`;

    document.getElementById("scoreB").textContent =
        `${scoreB} / ${criteria.length * 5}`;

    const winner = document.getElementById("winner");

    if (scoreA > scoreB) {

        winner.textContent = "🏆 Response A performs better.";

    }

    else if (scoreB > scoreA) {

        winner.textContent = "🏆 Response B performs better.";

    }

    else {

        winner.textContent = "🤝 Both responses performed equally.";

    }

    saveHistory(scoreA, scoreB);

}

// Get selected rating
function getRating(response, criterionIndex) {

    const activeStars = document.querySelectorAll(
        `.star.active[data-response="${response}"][data-criterion="${criterionIndex}"]`
    );

    return activeStars.length;

}

// ===============================
// Reset Button
// ===============================

document.getElementById("resetBtn").addEventListener("click", resetEvaluation);

function resetEvaluation() {

    document.getElementById("prompt").value = "";
    document.getElementById("responseA").value = "";
    document.getElementById("responseB").value = "";

    document.querySelectorAll(".star").forEach(star => {
        star.classList.remove("active");
    });

    document.getElementById("scoreA").textContent = "0 / 25";
    document.getElementById("scoreB").textContent = "0 / 25";

    document.getElementById("winner").textContent =
        "No evaluation yet.";

}

// ===============================
// Local Storage
// ===============================

function saveHistory(scoreA, scoreB) {

    const history =
        JSON.parse(localStorage.getItem("evaluationHistory")) || [];

    history.push({

        prompt: document.getElementById("prompt").value,

        scoreA,

        scoreB,

        winner:
            scoreA > scoreB
                ? "Response A"
                : scoreB > scoreA
                ? "Response B"
                : "Tie",

        date: new Date().toLocaleString()

    });

    localStorage.setItem(
        "evaluationHistory",
        JSON.stringify(history)
    );

}

console.log("AI Response Evaluator Loaded Successfully!");
