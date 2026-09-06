export interface ProfileData {
  name: string;
  chineseName: string;
  institution: string;
  socials: {
    email: string;
    cvUrl: string;
  };
}

export const profileData: ProfileData = {
  name: "Yi Wang",
  chineseName: "王怡",
  institution: "University of Regensburg",
  socials: {
    email: "mailto:Yi.Wang@stud.uni-regensburg.de",
    cvUrl: "/CV_full_academic_no_photo.pdf",
  }
};
