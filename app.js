
const activityBtn = document.getElementById("activityBtn");
const activityResult = document.getElementById("activityResult");

activityBtn.addEventListener("click", async function () {

    activityResult.textContent = "Loading activity...";
    activityBtn.disabled = true;

    try {
        const response = await axios.get(
            "http://127.0.0.1:5000/api/activity"
        );

        console.log(response.data);

        activityResult.textContent = response.data.activity;

    } catch (error) {
        console.error("Error fetching activity:", error);

        activityResult.textContent =
            "Sorry, something went wrong. Please try again.";

    } finally {
        activityBtn.disabled = false;
    }

});
