const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function addContact() {
  const contact = {
    name: "Navsahyadri Education Society's Group of Institutions",

    address: "Sr. No. 69, 70, 71, Naigaon (Nasrapur), Tal. Bhor, Pune – 412205, Maharashtra.",

    contact_numbers: [
      "+91 77699 27007",
      "+91 77699 37007"
    ],

    email: "director@navsahyadri.edu.in",

    office_timing: "9:30 AM – 5:00 PM",

    website: "www.navsahyadri.edu.in"
  };

  await db.collection("college_info").doc("contact").set(contact);

  console.log("College contact information added successfully.");
}

addContact().catch((error) => {
  console.error("Error adding contact information:");
  console.error(error);
});