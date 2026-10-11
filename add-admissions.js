const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function addAdmissions() {
  const admissions = [
    {
      type: "admission_process",
      title: "Choose a Course",
      details: "Select the preferred course such as B.E., MBA, MCA, BBA, BCA, or Diploma."
    },
    {
      type: "admission_process",
      title: "Check Eligibility",
      details: "Check the required academic qualifications and entrance examination requirements."
    },
    {
      type: "admission_process",
      title: "Apply for Admission",
      details: "Complete the application through the applicable admission portal or college admission office."
    },
    {
      type: "admission_process",
      title: "Entrance Exam and Counselling",
      details: "Appear for the required entrance examination and participate in applicable counselling or CAP."
    },
    {
      type: "admission_process",
      title: "Document Verification",
      details: "Submit the required documents for verification."
    },
    {
      type: "admission_process",
      title: "Pay Admission Fees",
      details: "Pay the applicable admission fees according to the official fee structure."
    },
    {
      type: "admission_process",
      title: "Confirm Admission",
      details: "Complete the required formalities and receive admission confirmation."
    },

    {
      type: "required_documents",
      title: "Required Documents",
      documents: [
        "10th Marksheet",
        "12th Marksheet",
        "Entrance Exam Scorecard (if applicable)",
        "School or College Leaving Certificate",
        "Nationality Certificate",
        "Aadhaar Card",
        "Caste Certificate (if applicable)",
        "Caste Validity Certificate (if applicable)",
        "Non-Creamy Layer Certificate (if applicable)",
        "Passport-size Photographs"
      ],
      note: "Required documents may vary by course and admission category."
    },

    {
      type: "eligibility",
      course: "B.E. / B.Tech",
      details: "12th Science with required subjects and entrance exam eligibility."
    },
    {
      type: "eligibility",
      course: "Diploma",
      details: "10th pass or equivalent."
    },
    {
      type: "eligibility",
      course: "MBA",
      details: "Bachelor's degree and applicable entrance exam eligibility."
    },
    {
      type: "eligibility",
      course: "MCA",
      details: "Bachelor's degree with required subjects and applicable entrance exam eligibility."
    },
    {
      type: "eligibility",
      course: "BBA / BCA",
      details: "12th pass with course-specific eligibility."
    },

    {
      type: "fees",
      course: "B.E. / B.Tech",
      duration: "4 Years",
      approximate_total_fees: "₹3,19,788"
    },
    {
      type: "fees",
      course: "M.E. / M.Tech",
      duration: "2 Years",
      approximate_total_fees: "Not Available"
    },
    {
      type: "fees",
      course: "MBA",
      duration: "2 Years",
      approximate_total_fees: "₹1,76,418"
    },
    {
      type: "fees",
      course: "MCA",
      duration: "2 Years",
      approximate_total_fees: "₹1,56,520"
    },
    {
      type: "fees",
      course: "BBA",
      duration: "4 Years",
      approximate_total_fees: "Not Available"
    },
    {
      type: "fees",
      course: "BCA",
      duration: "4 Years",
      approximate_total_fees: "Not Available"
    },
    {
      type: "fees",
      course: "Diploma in Engineering",
      duration: "3 Years",
      approximate_total_fees: "₹1,19,562"
    },
    {
      type: "fees",
      course: "Ph.D.",
      duration: "Varies",
      approximate_total_fees: "Not Available"
    },

    {
      type: "admission_note",
      title: "Admission Note",
      details: "Exact eligibility, entrance examinations, and admission steps may differ by course and academic year."
    }
  ];

  for (const admission of admissions) {
    await db.collection("admissions").add(admission);
  }

  console.log("Admissions information added successfully.");
}

addAdmissions().catch((error) => {
  console.error("Error adding admissions information:");
  console.error(error);
});