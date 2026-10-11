const fs = require("fs");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

async function importCourses() {
    try {
        const filePath = "./college-data/courses.json";

        const fileData = fs.readFileSync(filePath, "utf8");

        const data = JSON.parse(fileData);

        if (!data.courses || !Array.isArray(data.courses)) {
            throw new Error("Invalid courses.json format.");
        }

        const batch = db.batch();

        data.courses.forEach((course, index) => {
            const courseId = `course_${index + 1}`;

            const courseRef = db
                .collection("courses")
                .doc(courseId);

            batch.set(courseRef, course);
        });

        await batch.commit();

        console.log("");
        console.log("================================");
        console.log("COURSE IMPORT SUCCESSFUL");
        console.log("================================");
        console.log(`Imported courses: ${data.courses.length}`);
        console.log("Firestore collection: courses");
        console.log("================================");
        console.log("");

    } catch (error) {
        console.error("");
        console.error("COURSE IMPORT FAILED");
        console.error(error);
        console.error("");
    }
}

importCourses();