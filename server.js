
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

const API_URL = "https://bored-api.appbrewery.com";

const categories = [
    "education", "recreational", "social",
    "charity", "cooking", "relaxation", "busywork"
];

// The API returns text, not numeric accessibility values.
// These scores are estimates for this practice assignment.
const accessibilityScores = {
    "Few to no challenges": 0,
    "Minor challenges": 0.25,
    "Some challenges": 0.5,
    "Major challenges": 0.75
};

app.get("/api/activity", async (req, res) => {
    try {
        const type = req.query.type || "";
        const maxPrice = Number(req.query.maxPrice ?? 1);
        const maxAccessibility = Number(
            req.query.accessibility ?? 1
        );

        if (
            (type && !categories.includes(type)) ||
            !Number.isFinite(maxPrice) ||
            !Number.isFinite(maxAccessibility) ||
            maxPrice < 0 || maxPrice > 1 ||
            maxAccessibility < 0 || maxAccessibility > 1
        ) {
            return res.status(400).json({
                error: "Invalid activity preferences."
            });
        }

        let activities = [];

        if (type) {
            // The Bored API supports filtering by category.
            const response = await fetch(
                `${API_URL}/filter?type=${encodeURIComponent(type)}`
            );

            if (!response.ok) {
                throw new Error("Category request failed");
            }

            activities = await response.json();
        } else {
            // Without a category, sample random activities.
            // Limit requests to respect the API rate limit.
            for (let i = 0; i < 5; i++) {
                const response = await fetch(
                    `${API_URL}/random`
                );

                if (!response.ok) {
                    throw new Error("Random activity request failed");
                }

                activities.push(await response.json());

                // One request is enough when no filters are set.
                if (maxPrice === 1 && maxAccessibility === 1) {
                    break;
                }
            }
        }

        const matching = activities.filter(activity => {
            const price = Number(activity.price);

            const accessibility =
                accessibilityScores[activity.accessibility];

            const priceMatches =
                Number.isFinite(price) && price <= maxPrice;

            const accessibilityMatches =
                maxAccessibility === 1 ||
                (accessibility !== undefined &&
                 accessibility <= maxAccessibility);

            return priceMatches && accessibilityMatches;
        });

        if (matching.length === 0) {
            return res.status(404).json({
                error: "No matching activity found. Try adjusting your filters."
            });
        }

        const randomIndex = Math.floor(
            Math.random() * matching.length
        );

        res.json(matching[randomIndex]);

    } catch (error) {
        console.error("Error:", error.message);

        res.status(502).json({
            error: "Unable to retrieve an activity. Please try again."
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://127.0.0.1:5000");
});
