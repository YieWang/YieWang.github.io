export interface ProfileData {
  name: string;
  chineseName: string;
  avatarText: string;
  avatarUrl?: string;
  statusBadge: string;
  location: string;
  title: string;
  institution: string;
  degree: string;
  bioShort: string;
  bioLong: string;
  academicInterests: string[];
  socials: {
    email: string;
    altEmail?: string;
    cvUrl: string;
    mathTranslations?: string;
    github?: string;
  };
}

export const profileData: ProfileData = {
  name: "Yi Wang",
  chineseName: "王怡",
  avatarText: "YW",
  avatarUrl: "",
  statusBadge: "M.Sc. Student in Mathematics",
  location: "Regensburg, Germany",
  title: "数学在读硕士研究生",
  institution: "University of Regensburg",
  degree: "M.Sc. Mathematics",
  bioShort: "I am Yi Wang (王怡), a Master's student in Mathematics at the University of Regensburg.",
  bioLong: "My research interests lie in Arithmetic Geometry, Algebraic Geometry, and Algebraic Number Theory.",
  academicInterests: [
    "Arithmetic Geometry",
    "Algebraic Geometry",
    "Algebraic Number Theory"
  ],
  socials: {
    email: "mailto:Yi.Wang@stud.uni-regensburg.de",
    altEmail: "mailto:kasaaa0412@gmail.com",
    cvUrl: "/CV_full_academic_no_photo.pdf",
    mathTranslations: "https://mathtranslations.org",
    github: "https://github.com/YieWang",
  }
};
