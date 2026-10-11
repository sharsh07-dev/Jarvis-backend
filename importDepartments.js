const fs = require("fs");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

async function importDepartments() {
    try {
        const filePath = "./college-data/departments.json";

        const fileData = fs.readFileSync(filePath, "utf8");
        const data = JSON.parse(fileData);

        if (!data.departments || !Array.isArray(data.departments)) {
            throw new Error("Invalid departments.json format.");
        }

        const batch = db.batch();

        data.departments.forEach((department, index) => {
            const departmentId = `department_${index + 1}`;

            const departmentRef = db
                .collection("departments")
                .doc(departmentId);

            batch.set(departmentRef, department);
        });

        await batch.commit();

        console.log("");
        console.log("================================");
        console.log("DEPARTMENT IMPORT SUCCESSFUL");
        console.log("================================");
        console.log(`Imported departments: ${data.departments.length}`);
        console.log("Firestore collection: departments");
        console.log("================================");
        console.log("");

    } catch (error) {
        console.error("");
        console.error("DEPARTMENT IMPORT FAILED");
        console.error(error);
        console.error("");
    }
}

importDepartments();