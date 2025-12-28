# Role-Specific Onboarding Implementation

## ✅ Changes Made

### 1. **Updated OnboardingData Type** (`types/onboarding.ts`)
- Added all missing fields to match edit-profile exactly:
  - **Investor**: `investmentFirm`, `investorType`, `yearsExperience`, `ventureIndustry`, `ventureStage`, `investmentRange`, `portfolioSize`, `investmentFocus`
  - **Expert**: `expertiseAreas` (supports both array and string), `yearsExperience`, `hourlyRate`
  - **Founder**: Already had all fields

### 2. **Role-Specific Field Display** (`components/onboarding/RoleSpecificStep.tsx`)
- ✅ **Founder/Co-founder**: Shows only venture-related fields
  - Venture Name
  - Venture Description
  - Industry (Picker)
  - Current Stage (Picker)

- ✅ **Investor**: Shows only investor-related fields (matches edit-profile)
  - Company/Firm Name
  - Investor Type (Picker)
  - Years of Investment Experience
  - Industry Focus (Picker)
  - Preferred Investment Stage (Picker)
  - Typical Investment Range
  - Number of Active Investments
  - Investment Focus Areas

- ✅ **Expert**: Shows only expert-related fields (matches edit-profile)
  - Expertise Areas (comma-separated)
  - Years of Experience
  - Hourly Rate (USD)

### 3. **Data Pre-filling** (`app/(auth)/onboarding.tsx`)
- Updated `useEffect` to only pre-fill fields relevant to the user's role
- Founder fields only pre-filled for founders/cofounders
- Investor fields only pre-filled for investors
- Expert fields only pre-filled for experts

### 4. **Data Saving** (`app/(auth)/onboarding.tsx`)
- Updated `handleComplete` to save all role-specific fields to database
- Properly handles data type conversions:
  - `yearsExperience`: number
  - `portfolioSize`: number (converts from string)
  - `expertiseAreas`: array (converts from comma-separated string)
  - `hourlyRate`: number

### 5. **Validation** (`app/(auth)/onboarding.tsx`)
- Updated validation to be role-specific:
  - **Founder**: Requires `ventureName` and `ventureDescription`
  - **Investor**: Requires `investmentFirm` and `investorType`
  - **Expert**: Requires `expertiseAreas`

## 📋 Field Mapping: Onboarding → Edit Profile

### Founder/Co-founder
| Onboarding Field | Edit Profile Field | Status |
|-----------------|-------------------|--------|
| `ventureName` | `ventureName` | ✅ |
| `ventureDescription` | `ventureDescription` | ✅ |
| `ventureIndustry` | `ventureIndustry` | ✅ |
| `ventureStage` | `ventureStage` | ✅ |

### Investor
| Onboarding Field | Edit Profile Field | Status |
|-----------------|-------------------|--------|
| `investmentFirm` | `investmentFirm` | ✅ |
| `investorType` | `investorType` | ✅ |
| `yearsExperience` | `yearsExperience` | ✅ |
| `ventureIndustry` | `ventureIndustry` | ✅ |
| `ventureStage` | `ventureStage` | ✅ |
| `investmentRange` | `investmentRange` | ✅ |
| `portfolioSize` | `portfolioSize` | ✅ |
| `investmentFocus` | `investmentFocus` | ✅ |

### Expert
| Onboarding Field | Edit Profile Field | Status |
|-----------------|-------------------|--------|
| `expertiseAreas` | `expertiseAreas` | ✅ |
| `yearsExperience` | `yearsExperience` | ✅ |
| `hourlyRate` | `hourlyRate` | ✅ |

## 🔄 Data Flow

1. **Onboarding** → User fills role-specific fields
2. **Save to Database** → All fields saved to `profiles` table
3. **Edit Profile** → All fields pre-filled from database (already implemented)
4. **Update** → Changes saved back to database

## ✅ Verification Checklist

- [x] Onboarding form shows only role-specific fields
- [x] All fields from edit-profile are in onboarding
- [x] Data is properly saved to database
- [x] Data is pre-filled in edit-profile (already working)
- [x] Validation is role-specific
- [x] Data types are correctly handled (numbers, arrays, strings)

## 🎯 Result

- **Founders** see only founder fields in onboarding
- **Investors** see only investor fields in onboarding
- **Experts** see only expert fields in onboarding
- All fields from edit-profile are available in onboarding
- All onboarding data is pre-filled in edit-profile

