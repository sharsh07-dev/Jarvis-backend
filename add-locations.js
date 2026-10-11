const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

const locations = [
    {
        room: "202",
        name: "Tutorial Room",
        type: "Classroom",
        department: "Computer Engineering"
    },
    {
        room: "205",
        name: "Staff Room",
        type: "Staff Room",
        department: "Computer Engineering"
    },
    {
        room: "213",
        name: "SE A",
        type: "Classroom",
        year: "Second Year",
        department: "Computer Engineering"
    },
    {
        room: "214",
        name: "TE A",
        type: "Classroom",
        year: "Third Year",
        department: "Computer Engineering"
    },
    {
        room: "215",
        name: "Innovative Development Lab",
        type: "Laboratory",
        department: "Computer Engineering"
    },
    {
        room: "216",
        name: "Database Lab",
        type: "Laboratory",
        department: "Computer Engineering"
    },
    {
        room: "217",
        name: "Microprocessor Lab",
        type: "Laboratory",
        department: "Computer Engineering"
    },
    {
        room: "218",
        name: "TE C",
        type: "Classroom",
        year: "Third Year",
        department: "Computer Engineering"
    },
    {
        room: "219",
        name: "TE B",
        type: "Classroom",
        year: "Third Year",
        department: "Computer Engineering"
    },
    {
        room: "220",
        name: "SE B",
        type: "Classroom",
        year: "Second Year",
        department: "Computer Engineering"
    },
    {
        room: "221",
        name: "Classroom",
        type: "Classroom",
        department: "Computer Engineering"
    },
    {
        room: "222",
        name: "HOD Cabin",
        type: "Office",
        department: "Computer Engineering"
    },
    {
        room: "223",
        name: "Lab",
        type: "Laboratory",
        department: "Computer Engineering"
    },
    {
        room: "224",
        name: "Computer Lab",
        type: "Laboratory",
        department: "Computer Engineering"
    },
    {
        room: "227",
        name: "Computer Center",
        type: "Computer Center",
        department: "Computer Engineering"
    }
];

async function addLocations() {
    for (const location of locations) {
        await db.collection("locations").doc(location.room).set(location);
        console.log(`Added room ${location.room} - ${location.name}`);
    }

    console.log("\nAll Computer Department locations added successfully.");
    process.exit(0);
}

addLocations().catch(error => {
    console.error("Error:", error);
    process.exit(1);
});