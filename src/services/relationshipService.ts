import { API_ENDPOINTS } from "./apiEndpoints";
import httpClient from "./http";
import peopleService from "./people";

export interface RelationshipData {
  firstname: string;
  lastname: string;
  surname: string;
  gender: string;
  dob?: string;
  marriage_date?: string;
  [key: string]: any;
}

export interface UpdateMemberPayload {
  person_id: string;
  member_id: string;
  type: string;
  marriage_date: string;
}

/**
 * Validates relationship types based on system requirements
 */
export const validateRelationshipType = (type: string): boolean => {
  const validTypes = ["father", "mother", "spouse", "sibling", "son", "daughter","child"];


  return validTypes.includes(type.toLowerCase());
};

/**
 * Step 1: Search Person
 * Searches for a person with strict matching to prevent duplicate creation
 * Logs request and response for debugging as per requirements
 */
export async function searchPerson(criteria: RelationshipData) {
  console.log("[RelationshipService] Searching for person:", criteria);
  
  const fullName = [criteria.firstname, criteria.lastname, criteria.surname]
    .filter(Boolean)
    .join(" ");

  try {
    const results = await peopleService.getPeople({
      search: fullName,
      limit: 20 // Fetch a reasonable set for client-side strict filtering
    });

    const people = results?.people || [];
    
    // Strict matching logic: Ensure no duplicate person creation
    // Edge case handling: Missing DOB reduces matching confidence but still checked if present
    const match = people.find((p: any) => {
      const nameMatch = 
        p.firstname?.toLowerCase() === criteria.firstname?.toLowerCase() &&
        p.lastname?.toLowerCase() === criteria.lastname?.toLowerCase() &&
        p.surname?.toLowerCase() === criteria.surname?.toLowerCase();
        
      const dobMatch = !criteria.dob || p.dob === criteria.dob;
      
      return nameMatch && dobMatch;
    });

    console.log("[RelationshipService] Search response:", match ? `Found (ID: ${match.id || match.person_id})` : "Not Found");
    return match || null;
  } catch (error) {
    console.error("[RelationshipService] Search failed:", error);
    throw error;
  }
}

/**
 * Step 1b: Add Person (Fallback)
 * Calls addPerson API with all required fields if search yields no results
 */
export async function addPerson(data: RelationshipData) {
  console.log("[RelationshipService] Adding new person:", data);
  try {
    const payload = {
      ...data,
      person_id: crypto.randomUUID() // Client-generated UUID for idempotency support
    };
    const response = await httpClient.post(API_ENDPOINTS.family.addPerson, payload);
    console.log("[RelationshipService] AddPerson response:", response.data);
    return response.data;
  } catch (error) {
    console.error("[RelationshipService] AddPerson failed:", error);
    throw error;
  }
}

/**
 * Step 1c: Update Person (Enhancement)
 * Updates existing person details before linking relationship
 */
export async function updatePerson(data: RelationshipData, personId: string) {
  console.log("[RelationshipService] Updating existing person details:", personId);
  try {
    const payload = {
      ...data,
      person_id: personId
    };
    const response = await httpClient.put(API_ENDPOINTS.edit.personalDetails, payload);
    console.log("[RelationshipService] UpdatePerson response:", response.data);
    return response.data;
  } catch (error) {
    console.error("[RelationshipService] UpdatePerson failed:", error);
    throw error;
  }
}

/**
 * Step 2: Update Member Relationship
 * Finalizes the connection between the target profile and the member
 */
export async function updateMember(payload: UpdateMemberPayload) {
  // Use validation rule
  if (!validateRelationshipType(payload.type)) {
    throw new Error(`Unsupported relationship type: ${payload.type}`);
  }

  console.log("[RelationshipService] Updating relationship link:", payload);
  try {
    const response = await httpClient.put(API_ENDPOINTS.family.updateMember, payload);
    console.log("[RelationshipService] UpdateMember response:", response.data);
    return response.data;
  } catch (error) {
    console.error("[RelationshipService] UpdateMember failed:", error);
    throw error;
  }
}

/**
 * Main Orchestration: handleMemberFlow
 * Updated flow: Search -> Found? (UpdatePerson) : (AddPerson) -> UpdateMember
 */
export async function handleMemberFlow(
  targetPersonId: string, 
  memberData: RelationshipData, 
  relationshipType: string
) {
  try {
    console.info(`[RelationshipFlow] Initiating flow for ${relationshipType} relation to person ${targetPersonId}`);

    // 1. Search existing
    let person = await searchPerson(memberData);
    let personId = person?.id || person?.person_id;

    // 2. Logic Branch: If person exists, update them. If not, create them.
    if (!personId) {
      console.warn("[RelationshipFlow] Person not found, triggering addPerson...");
      const added = await addPerson(memberData);
      personId = added?.data?.person_id || added?.person_id;
      
      if (!personId) {
        throw new Error("System error: Valid person_id was not returned from the server");
      }
    } else {
      console.info("[RelationshipFlow] Found existing record, updating details before linkage...");
      await updatePerson(memberData, personId);
    }

    // 3. Link relationship through PUT updateMember
    const result = await updateMember({
      person_id: targetPersonId,
      member_id: personId,
      type: relationshipType,
      marriage_date: memberData.marriage_date || ""
    });

    console.info(`[RelationshipFlow] Relationship established successfully.`);
    return {
      success: true,
      personId,
      result
    };
  } catch (error: any) {
    console.error("[RelationshipFlow] Process aborted due to error:", error.message);
    throw error; // Re-throw for UI error handling (toasts/modals)
  }
}
