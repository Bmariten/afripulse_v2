import { User } from "../services/authService";

/**
 * Checks if a user's profile is complete based on their role.
 * This provides a comprehensive validation of all required fields.
 *
 * @param user The user object to check.
 * @returns `true` if the profile is complete, `false` otherwise.
 */
export const isProfileComplete = (user: User | null): boolean => {
  if (!user) {
    return false;
  }

  // --- Step 1: Check the base profile (required for all users) ---
  const baseProfile = user.profile;
  if (
    !baseProfile ||
    !baseProfile.name ||
    !baseProfile.phone ||
    !baseProfile.address ||
    !baseProfile.city ||
    !baseProfile.state ||
    !baseProfile.country ||
    !baseProfile.zip_code
  ) {
    return false;
  }

  // --- Step 2: Perform role-specific checks ---
  switch (user.role) {
    case 'seller':
      const sellerProfile = user.seller_profile;
      if (
        !sellerProfile ||
        !sellerProfile.business_name ||
        !sellerProfile.business_description ||
        !sellerProfile.business_address ||
        !sellerProfile.business_city ||
        !sellerProfile.business_state ||
        !sellerProfile.business_country ||
        !sellerProfile.business_zip_code ||
        !sellerProfile.business_phone ||
        !sellerProfile.business_email
      ) {
        return false;
      }
      break;

    case 'affiliate':
      const affiliateProfile = user.affiliate_profile;
      if (
        !affiliateProfile ||
        !affiliateProfile.website ||
        !affiliateProfile.niche ||
        !affiliateProfile.social_media
      ) {
        return false;
      }
      break;

    case 'admin':
    case 'customer':
      // For admins and customers, the base profile is sufficient.
      break;

    default:
      // If the role is unknown, assume incomplete.
      return false;
  }

  // If all checks pass, the profile is complete.
  return true;
};
