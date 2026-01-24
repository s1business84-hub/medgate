import { MedicalSpecialty, CareerStage } from "./types";

/**
 * Medical Specialty Database
 * Comprehensive list of medical specialties with career progression details
 */
export const medicalSpecialties: MedicalSpecialty[] = [
  {
    id: "spec_general_surgery",
    name: "General Surgery",
    category: "Surgery",
    description: "Perform surgical procedures on various organs and body systems. Focus on abdominal surgeries, trauma, and emergency procedures.",
    averageTrainingYears: 7,
    commonSubspecialties: [
      "Trauma Surgery",
      "Colorectal Surgery",
      "Breast Surgery",
      "Endocrine Surgery",
      "Surgical Oncology"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "fellowship", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "General Surgery Board Certification",
      "ATLS Certification",
      "DHA/DOH/MOH License (UAE)"
    ],
    growthOutlook: "High",
    averageSalaryRange: "350k-600k AED",
    workLifeBalance: "Challenging",
    relatedDepartments: ["General Surgery", "Emergency Medicine", "Trauma"]
  },
  {
    id: "spec_cardiology",
    name: "Cardiology",
    category: "Internal Medicine",
    description: "Diagnose and treat heart and cardiovascular conditions. Specialize in interventional procedures, heart failure, arrhythmias.",
    averageTrainingYears: 6,
    commonSubspecialties: [
      "Interventional Cardiology",
      "Electrophysiology",
      "Heart Failure",
      "Preventive Cardiology",
      "Cardiac Imaging"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "fellowship", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "Internal Medicine Residency",
      "Cardiology Fellowship",
      "Board Certification in Cardiology"
    ],
    growthOutlook: "High",
    averageSalaryRange: "400k-700k AED",
    workLifeBalance: "Moderate",
    relatedDepartments: ["Cardiology", "Internal Medicine", "ICU"]
  },
  {
    id: "spec_emergency_medicine",
    name: "Emergency Medicine",
    category: "Emergency",
    description: "Provide immediate medical care for acute illnesses and injuries. Work in fast-paced emergency departments handling critical cases.",
    averageTrainingYears: 4,
    commonSubspecialties: [
      "Trauma Medicine",
      "Toxicology",
      "Pediatric Emergency",
      "Emergency Ultrasound",
      "Disaster Medicine"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "Emergency Medicine Residency",
      "ACLS, PALS, ATLS Certifications",
      "Board Certification"
    ],
    growthOutlook: "High",
    averageSalaryRange: "300k-550k AED",
    workLifeBalance: "Moderate",
    relatedDepartments: ["Emergency Medicine", "Trauma", "ICU"]
  },
  {
    id: "spec_internal_medicine",
    name: "Internal Medicine",
    category: "Internal Medicine",
    description: "Diagnose and treat a wide range of adult medical conditions. Serve as primary care physicians or hospitalists.",
    averageTrainingYears: 3,
    commonSubspecialties: [
      "Gastroenterology",
      "Nephrology",
      "Endocrinology",
      "Infectious Disease",
      "Rheumatology"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "Internal Medicine Residency",
      "Board Certification"
    ],
    growthOutlook: "High",
    averageSalaryRange: "250k-450k AED",
    workLifeBalance: "Good",
    relatedDepartments: ["Internal Medicine", "General Medicine", "ICU"]
  },
  {
    id: "spec_pediatrics",
    name: "Pediatrics",
    category: "Pediatrics",
    description: "Provide medical care for infants, children, and adolescents. Focus on growth, development, and childhood diseases.",
    averageTrainingYears: 3,
    commonSubspecialties: [
      "Neonatology",
      "Pediatric Cardiology",
      "Pediatric Emergency",
      "Developmental Pediatrics",
      "Pediatric Endocrinology"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "Pediatrics Residency",
      "PALS Certification",
      "Board Certification"
    ],
    growthOutlook: "Moderate",
    averageSalaryRange: "280k-500k AED",
    workLifeBalance: "Good",
    relatedDepartments: ["Pediatrics", "Neonatology", "NICU"]
  },
  {
    id: "spec_orthopedics",
    name: "Orthopedic Surgery",
    category: "Surgery",
    description: "Treat musculoskeletal conditions including bones, joints, ligaments, and tendons through surgical and non-surgical methods.",
    averageTrainingYears: 6,
    commonSubspecialties: [
      "Sports Medicine",
      "Joint Replacement",
      "Spine Surgery",
      "Trauma Orthopedics",
      "Hand Surgery"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "fellowship", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "Orthopedic Surgery Residency",
      "Board Certification",
      "Fellowship (optional)"
    ],
    growthOutlook: "High",
    averageSalaryRange: "400k-800k AED",
    workLifeBalance: "Moderate",
    relatedDepartments: ["Orthopedics", "Sports Medicine", "Trauma"]
  },
  {
    id: "spec_radiology",
    name: "Radiology",
    category: "Diagnostics",
    description: "Use medical imaging (X-rays, CT, MRI, ultrasound) to diagnose and treat diseases. Includes interventional procedures.",
    averageTrainingYears: 5,
    commonSubspecialties: [
      "Interventional Radiology",
      "Neuroradiology",
      "Musculoskeletal Radiology",
      "Breast Imaging",
      "Nuclear Medicine"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "fellowship", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "Radiology Residency",
      "Board Certification"
    ],
    growthOutlook: "High",
    averageSalaryRange: "350k-650k AED",
    workLifeBalance: "Excellent",
    relatedDepartments: ["Radiology", "Imaging", "Interventional Radiology"]
  },
  {
    id: "spec_anesthesiology",
    name: "Anesthesiology",
    category: "Surgery",
    description: "Manage anesthesia during surgery, pain management, and critical care. Ensure patient safety during procedures.",
    averageTrainingYears: 4,
    commonSubspecialties: [
      "Pain Medicine",
      "Cardiac Anesthesia",
      "Pediatric Anesthesia",
      "Critical Care",
      "Regional Anesthesia"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "Anesthesiology Residency",
      "Board Certification"
    ],
    growthOutlook: "Moderate",
    averageSalaryRange: "320k-600k AED",
    workLifeBalance: "Good",
    relatedDepartments: ["Anesthesiology", "ICU", "Surgery"]
  },
  {
    id: "spec_dermatology",
    name: "Dermatology",
    category: "Other",
    description: "Diagnose and treat skin, hair, and nail conditions. Include cosmetic procedures and dermatologic surgery.",
    averageTrainingYears: 4,
    commonSubspecialties: [
      "Cosmetic Dermatology",
      "Dermatopathology",
      "Pediatric Dermatology",
      "Mohs Surgery",
      "Dermatologic Oncology"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "Dermatology Residency",
      "Board Certification"
    ],
    growthOutlook: "High",
    averageSalaryRange: "300k-600k AED",
    workLifeBalance: "Excellent",
    relatedDepartments: ["Dermatology", "Cosmetic Surgery"]
  },
  {
    id: "spec_neurology",
    name: "Neurology",
    category: "Internal Medicine",
    description: "Diagnose and treat disorders of the nervous system including brain, spinal cord, and nerves.",
    averageTrainingYears: 5,
    commonSubspecialties: [
      "Stroke Medicine",
      "Movement Disorders",
      "Epilepsy",
      "Neuromuscular Medicine",
      "Neurointensive Care"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "fellowship", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "Neurology Residency",
      "Board Certification"
    ],
    growthOutlook: "High",
    averageSalaryRange: "350k-600k AED",
    workLifeBalance: "Moderate",
    relatedDepartments: ["Neurology", "Neurosurgery", "ICU"]
  },
  {
    id: "spec_family_medicine",
    name: "Family Medicine",
    category: "Primary Care",
    description: "Provide comprehensive primary care for patients of all ages. Manage chronic diseases and preventive care.",
    averageTrainingYears: 3,
    commonSubspecialties: [
      "Sports Medicine",
      "Geriatric Medicine",
      "Obstetric Care",
      "Adolescent Medicine",
      "Palliative Care"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "Family Medicine Residency",
      "Board Certification"
    ],
    growthOutlook: "High",
    averageSalaryRange: "220k-400k AED",
    workLifeBalance: "Excellent",
    relatedDepartments: ["Family Medicine", "Primary Care", "Outpatient"]
  },
  {
    id: "spec_obgyn",
    name: "Obstetrics & Gynecology",
    category: "Surgery",
    description: "Provide medical and surgical care for women's reproductive health, pregnancy, and childbirth.",
    averageTrainingYears: 5,
    commonSubspecialties: [
      "Maternal-Fetal Medicine",
      "Gynecologic Oncology",
      "Reproductive Endocrinology",
      "Urogynecology",
      "Minimally Invasive Surgery"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "fellowship", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "OB/GYN Residency",
      "Board Certification"
    ],
    growthOutlook: "Moderate",
    averageSalaryRange: "320k-600k AED",
    workLifeBalance: "Challenging",
    relatedDepartments: ["Obstetrics", "Gynecology", "Maternity"]
  },
  {
    id: "spec_psychiatry",
    name: "Psychiatry",
    category: "Other",
    description: "Diagnose and treat mental health disorders including depression, anxiety, bipolar disorder, and schizophrenia.",
    averageTrainingYears: 4,
    commonSubspecialties: [
      "Child & Adolescent Psychiatry",
      "Addiction Psychiatry",
      "Forensic Psychiatry",
      "Geriatric Psychiatry",
      "Consultation-Liaison Psychiatry"
    ],
    typicalCareerPath: ["medical_school", "observership", "internship", "residency", "consultant"],
    requiredCertifications: [
      "Medical Degree (MBBS/MD)",
      "Psychiatry Residency",
      "Board Certification"
    ],
    growthOutlook: "High",
    averageSalaryRange: "250k-500k AED",
    workLifeBalance: "Excellent",
    relatedDepartments: ["Psychiatry", "Mental Health", "Behavioral Health"]
  }
];

/**
 * Career Stage Descriptions
 */
export const careerStageInfo: Record<CareerStage, { title: string; description: string; duration: string }> = {
  medical_school: {
    title: "Medical School",
    description: "Complete undergraduate medical education (MBBS/MD) with clinical rotations and foundational training.",
    duration: "4-6 years"
  },
  observership: {
    title: "Observership",
    description: "Shadow physicians to gain exposure to different specialties and clinical environments. No hands-on procedures.",
    duration: "2-12 weeks"
  },
  internship: {
    title: "Internship",
    description: "Supervised clinical training with limited hands-on patient care responsibilities across multiple departments.",
    duration: "1 year"
  },
  residency: {
    title: "Residency",
    description: "Intensive specialty-specific training with progressive responsibility and independent patient care.",
    duration: "3-7 years (specialty dependent)"
  },
  fellowship: {
    title: "Fellowship",
    description: "Advanced subspecialty training focusing on a specific area within a broader specialty.",
    duration: "1-3 years"
  },
  consultant: {
    title: "Consultant/Attending",
    description: "Independent practice as a board-certified specialist with full clinical privileges and autonomy.",
    duration: "Career"
  }
};

/**
 * Get specialty recommendations based on completed departments
 */
export function getSpecialtyRecommendations(departments: string[]): MedicalSpecialty[] {
  return medicalSpecialties.filter(specialty => 
    specialty.relatedDepartments.some(dept => 
      departments.some(completedDept => 
        dept.toLowerCase().includes(completedDept.toLowerCase()) || 
        completedDept.toLowerCase().includes(dept.toLowerCase())
      )
    )
  );
}

/**
 * Calculate match score for a specialty based on student profile
 */
export function calculateSpecialtyMatch(
  specialty: MedicalSpecialty,
  studentProfile: {
    departments: string[];
    skillsAcquired: string[];
    yearOfStudy?: number;
    completedSessions: number;
  }
): number {
  let score = 0;

  // Department match (40 points)
  const departmentMatches = specialty.relatedDepartments.filter(dept =>
    studentProfile.departments.some(completedDept =>
      dept.toLowerCase().includes(completedDept.toLowerCase()) ||
      completedDept.toLowerCase().includes(dept.toLowerCase())
    )
  ).length;
  score += Math.min(40, departmentMatches * 15);

  // Experience level (30 points)
  if (studentProfile.completedSessions >= 3) score += 30;
  else if (studentProfile.completedSessions >= 2) score += 20;
  else if (studentProfile.completedSessions >= 1) score += 10;

  // Skills match (20 points)
  const relevantSkills = ["Patient Communication", "Clinical Assessment", "Team Collaboration"];
  const skillMatches = studentProfile.skillsAcquired.filter(skill =>
    relevantSkills.some(rs => skill.toLowerCase().includes(rs.toLowerCase()))
  ).length;
  score += Math.min(20, skillMatches * 7);

  // Year of study bonus (10 points)
  if (studentProfile.yearOfStudy && studentProfile.yearOfStudy >= 3) score += 10;

  return Math.min(100, score);
}
