/**
 * Admin Configuration
 * 
 * These credentials grant direct access to the admin dashboard,
 * bypassing role selection and onboarding.
 * 
 * SECURITY NOTE: In production, move these to environment variables
 * and use a more secure authentication method.
 */

export const ADMIN_CREDENTIALS = {
  email: 'admin@nextignition.com',
  // Note: Password is validated at login, not stored here
  // Default admin password should be set during first admin user creation
};

/**
 * Check if an email belongs to an admin user
 */
export function isAdminEmail(email: string): boolean {
  return email.toLowerCase().trim() === ADMIN_CREDENTIALS.email.toLowerCase();
}
