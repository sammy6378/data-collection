import "dotenv/config";
import mongoose from "mongoose";
import { DataModel, Type, Level, Experience } from "./model/data";
import { connectDb } from "./utils/db";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

// ─── Reference data ───────────────────────────────────────────────────────────

const firstNames = [
    "James", "Amara", "Brian", "Fatuma", "Daniel", "Grace", "Kevin", "Lydia",
    "Samuel", "Wanjiru", "Peter", "Aisha", "John", "Mercy", "David", "Esther",
    "Michael", "Cynthia", "Robert", "Beatrice", "Charles", "Diana", "George",
    "Hellen", "Patrick", "Joyce", "Steven", "Nancy", "Victor", "Florence",
];

const lastNames = [
    "Ochieng", "Kamau", "Njoroge", "Waweru", "Mwangi", "Otieno", "Kariuki",
    "Mutua", "Kimani", "Omondi", "Ndung'u", "Gitau", "Mugo", "Wambua", "Chebet",
    "Korir", "Ruto", "Kiptoo", "Auma", "Adhiambo", "Simiyu", "Barasa", "Were",
];

const departments = [
    "Finance", "Human Resources", "ICT", "Operations", "Procurement",
    "Legal", "Communications", "Strategy", "Administration", "Audit",
];

const sections = [
    "Planning", "Compliance", "Support", "Development", "Analysis",
    "Reporting", "Field Operations", "Coordination", "Research", "Monitoring",
];

const supervisors = [
    "Jane Muthoni", "Paul Njeru", "Alice Wangari", "Tom Odhiambo",
    "Sarah Akinyi", "Mark Kiprono", "Ruth Cherotich", "Felix Onyango",
];

const locations = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"];
const countries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia"];

const schools = [
    "University of Nairobi", "Kenyatta University", "Strathmore University",
    "Moi University", "USIU Africa", "Makerere University", "University of Dar es Salaam",
    "Kenya Methodist University", "Daystar University", "Mount Kenya University",
];

const jobTitles = [
    "Software Engineer", "Finance Officer", "HR Manager", "Operations Analyst",
    "Procurement Officer", "Legal Counsel", "Communications Specialist",
    "Strategy Analyst", "Administrative Assistant", "Internal Auditor",
    "Data Analyst", "Project Manager", "Field Coordinator", "M&E Officer",
    "IT Support Specialist", "Accountant", "Program Officer", "Research Associate",
];

const organizations = [
    "Equity Bank", "Safaricom", "KCB Group", "Nation Media Group",
    "Kenya Power", "KPMG Kenya", "Deloitte East Africa", "PwC Kenya",
    "USAID Kenya", "World Bank Group", "UNICEF Kenya", "Save the Children",
    "Ministry of Finance", "Nairobi City County", "Kenya Revenue Authority",
];

const positionTitles = [
    "Senior Analyst", "Team Lead", "Associate Consultant", "Project Officer",
    "Finance Assistant", "IT Administrator", "Operations Coordinator",
    "Research Officer", "Communications Officer", "Procurement Assistant",
];

const contributionSnippets = [
    "Led cross-functional team to streamline procurement processes, reducing cycle time by 30%.",
    "Developed and maintained internal reporting dashboards used by senior leadership.",
    "Coordinated field operations across three regions, managing a team of 12 staff.",
    "Implemented financial controls that reduced budget variance from 15% to under 3%.",
    "Designed and delivered staff capacity-building workshops for 80+ employees.",
    "Managed vendor relationships and contract negotiations saving the organisation KES 4M annually.",
    "Oversaw compliance audits and ensured 100% regulatory adherence across all departments.",
    "Built automated data pipelines that reduced manual reporting effort by 60%.",
    "Spearheaded a digital transformation initiative adopted organisation-wide.",
    "Authored key policy documents that formed the basis of the organisation's HR framework.",
];

const summaries = [
    "A results-driven professional with a strong background in analytics and stakeholder engagement.",
    "Experienced team leader with a track record of delivering complex projects on time and within budget.",
    "Detail-oriented specialist passionate about process improvement and operational excellence.",
    "Strategic thinker with expertise in financial management and organisational development.",
    "Dedicated professional with deep experience in field operations and community engagement.",
];

const qualificationsList = [
    "CPA (K)", "ACCA", "CIPS", "PMP", "CISSP", "CFA Level 1",
    "SHRM-CP", "Prince2 Practitioner", "CIMA", "",
];

const skillsList = [
    "Advanced Excel, Power BI, SQL",
    "Stakeholder management, report writing",
    "Python, data visualisation, GIS",
    "Budget management, procurement systems",
    "Communication, public relations, media",
    "",
];

const cvPlaceholder =
    "https://res.cloudinary.com/demo/raw/upload/sample.pdf";

const yearsOptions = Object.values(Experience);
const jobTypes = Object.values(Type);
const eduLevels = Object.values(Level);

// ─── Record builder ───────────────────────────────────────────────────────────

const buildRecord = () => {
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const expCount = randInt(1, 4);

    const experienceList = Array.from({ length: expCount }, () => ({
        organization: pick(organizations),
        positionHeld: pick(positionTitles),
        years: pick(yearsOptions),
        contributions: pick(contributionSnippets),
    }));

    return {
        name,
        jobTitle: pick(jobTitles),
        jobType: pick(jobTypes),
        supervisor: pick(supervisors),
        department: pick(departments),
        section: pick(sections),
        location: pick(locations),
        country: pick(countries),
        school: pick(schools),
        educationLevel: pick(eduLevels),
        experienceList,
        experienceSummary: pick(summaries),
        qualifications: pick(qualificationsList),
        otherEducation: "",
        otherSkills: pick(skillsList),
        cvFile: cvPlaceholder,
        dataConsent: true,
    };
};

// ─── Seed ─────────────────────────────────────────────────────────────────────

const SEED_COUNT = 200;

const seed = async () => {
    await connectDb();
    console.log("✅ Connected to database");

    const existing = await DataModel.countDocuments();
    if (existing > 0) {
        console.log(`⚠️  Database already has ${existing} record(s).`);
        console.log("   Pass --force to wipe and re-seed, or run without --force to append.");

        if (!process.argv.includes("--force")) {
            await mongoose.disconnect();
            process.exit(0);
        }

        await DataModel.deleteMany({});
        console.log("🗑️  Existing records cleared.");
    }

    const records = Array.from({ length: SEED_COUNT }, buildRecord);
    await DataModel.insertMany(records);

    console.log(`🌱 Seeded ${SEED_COUNT} records successfully.`);
    await mongoose.disconnect();
    process.exit(0);
};

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
