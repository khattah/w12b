
const activityBtn = document.getElementById("activityBtn");
const activityResult = document.getElementById("activityResult");

const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const accessibilityInput = document.getElementById("accessibility");

activityBtn.addEventListener("click", async function () {
    activityResult.textContent = "Loading activity...";
    activityBtn.disabled = true;

    try {
        const params = {
            type: categoryInput.value,
            maxPrice: priceInput.value,
            accessibility: accessibilityInput.value
        };

        const response = await axios.get(
            "http://127.0.0.1:5000/api/activity",
            { params }
        );

        activityResult.textContent = response.data.activity;

    } catch (error) {
        console.error("Error fetching activity:", error);

        activityResult.textContent =
            error.response?.data?.error ||
            "Sorry, something went wrong. Please try again.";

    } finally {
        activityBtn.disabled = false;
    }
});
