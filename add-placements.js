const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function addPlacements() {
  const placements = [
    {
      type: "placement_cell",
      title: "Career Guidance & Placement Cell",
      details: "The college has a Career Guidance & Placement Cell that supports students with placement preparation and career guidance."
    },

    {
      type: "placement_statistics",
      academic_year: "2023-24",
      highest_package: "₹8.5 LPA",
      average_package: "₹2.47 LPA",
      students_placed: 57,
      companies: 30
    },

    {
      type: "top_recruiters",
      recruiters: [
        "TCS",
        "Infosys",
        "Wipro",
        "Tech Mahindra",
        "MI Tech Solution",
        "Q-Spider",
        "Philips",
        "Accenture",
        "Capgemini",
        "Deloitte"
      ]
    },

    {
      type: "placement_training",
      training_programs: [
        "Resume Building",
        "Mock Interviews",
        "Communication Skills",
        "Personality Development",
        "Pre-placement Training",
        "Industry Workshops"
      ]
    },

    {
      type: "placement_contact",
      phone: "9011727007",
      email: "director@navsahyadri.edu.in"
    }
  ];

  for (const placement of placements) {
    await db.collection("placements").add(placement);
  }

  console.log("Placement information added successfully.");
}

addPlacements().catch((error) => {
  console.error("Error adding placement information:");
  console.error(error);
});