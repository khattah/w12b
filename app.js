
const activityBtn = document.getElementById("activityBtn");
const activityResult = document.getElementById("activityResult");

activityBtn.addEventListener("click", async function () {

    activityResult.textContent = "Loading activity...";

    try {
        const response = await axios.get(
            "https://bored-api.appbrewery.com/random"
        );

        console.log(response.data);

        activityResult.textContent = response.data.activity;

    } catch (error) {
        console.error("Error fetching activity:", error);

        activityResult.textContent =
            "Sorry, something went wrong. Please try again.";
    }

});
