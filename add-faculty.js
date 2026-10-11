const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

const faculty = [
    {
        name: "Shri. P.N. Suke",
        designation: "Founder President",
        category: "Management"
    },
    {
        name: "Mr. Sagar P. Suke",
        designation: "Group Director",
        category: "Management"
    },
    {
        name: "Mrs. Sayali S. Suke",
        designation: "Management Representative",
        category: "Management"
    },
    {
        name: "Dr. T. D. Dabade",
        designation: "Director",
        category: "Management"
    },
    {
        name: "Dr. G. A. Hinge",
        designation: "Principal of Engineering",
        category: "Engineering Management"
    },
    {
        name: "Prof. Tushar Kolhe",
        designation: "HOD",
        department: "Computer Engineering",
        category: "Faculty"
    },
    {
        name: "Prof. Onkar Wadane",
        designation: "Faculty",
        subject: "Computer Networks",
        department: "Computer Engineering",
        year: "Third Year",
        division: "A",
        category: "Faculty"
    },
    {
        name: "Prof. Sonali Singh",
        designation: "Faculty",
        subject: "TOC",
        department: "Computer Engineering",
        category: "Faculty"
    },
    {
        name: "Prof. Pooja Thengal",
        designation: "Faculty",
        subject: "AI",
        department: "Computer Engineering",
        category: "Faculty"
    },
    {
        name: "Prof. Shreyas Panpat",
        designation: "Faculty",
        subject: "Cloud Computing",
        department: "Computer Engineering",
        category: "Faculty"
    },
    {
        name: "Prof. Dhanashri Londhe",
        designation: "Faculty",
        subject: "Business Administration",
        department: "Computer Engineering",
        category: "Faculty"
    },
    {
        name: "Prof. S. Raskar",
        designation: "Faculty",
        subject: "Robotics and Automation",
        department: "Computer Engineering",
        category: "Faculty"
    }
];

const collegeInfo = {
    college_timing: {
        start: "9:00 AM",
        end: "4:00 PM",
        description: "College timing is from 9:00 AM to 4:00 PM."
    }
};

async function addFaculty() {

    for (const person of faculty) {

        const id = person.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");

        await db.collection("faculty").doc(id).set(person);

        console.log(`Added faculty: ${person.name}`);
    }

    await db.collection("college_info").doc("timing").set(collegeInfo);

    console.log("Added college timing: 9:00 AM to 4:00 PM");

    console.log("\nFaculty and timing information added successfully.");

    process.exit(0);
}

addFaculty().catch(error => {
    console.error("Error:", error);
    process.exit(1);
});