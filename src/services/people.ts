import { API_ENDPOINTS } from "./apiEndpoints";
import httpClient from "./http";
interface UsePeopleParams {
  // Define any parameters you want to pass to the hook
  search?: string;
  filterBy?: string;
  sort?: string;
  page?: number;
  limit?: number;
  sortBy?: "asc" | "desc";
  deleted_profiles?: boolean;
}
class PeopleService {
  /**
   * get all people in the family
   * @param params
   */
  async getPeople(params: UsePeopleParams) {
    try {
      console.log("Making API call with params:", params);
      const response = await httpClient.get(API_ENDPOINTS.family.list, {
        params,
      });
      console.log("API response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  }

  /**
   * get person by id
   * @param id
   */

  async getPersonById(id: string) {
    try {
      const response = await httpClient.get(API_ENDPOINTS.family.member, {
        params: { id },
      });
      console.log("response::", response.data);
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  /**
   * get ancestors of a person by id
   * @param id
   * @param level - number of levels to fetch (default: 0)
   */
  async getAncestors(id: string, level: number = 0) {
    try {
      const response = await httpClient.get(API_ENDPOINTS.family.ancestors, {
        params: { id: id, level: level },
      });
      console.log("ancestors response::", response.data);
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  /**
   * get descendants of a person by id
   * @param id
   * @param level - number of levels to fetch (default: 1)
   */
  async getDescendants(id: string, level: number = 1) {
    try {
      const response = await httpClient.get(API_ENDPOINTS.family.descendents, {
        params: { id: id, level: level },
      });
      console.log("descendants response::", response.data);
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async getBusinessDirectory(params: UsePeopleParams) {
    try {
      const response = await httpClient.get(
        API_ENDPOINTS.family.businessDirectory,
        {
          params,
        },
      );
      console.log("response::", response.data);
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  /**
   * Update personal details of a person
   * @param data - object containing personal details to update
   */
  async updatePersonalDetails(data: any) {
    try {
      const response = await httpClient.put(
        API_ENDPOINTS.edit.personalDetails,
        data,
      );
      console.log("update response::", response.data);
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Add a new person to the family
   * @param data - object containing person details to add
   */
  async addPerson(data: any) {
    try {
      const response = await httpClient.post(
        API_ENDPOINTS.family.addPerson,
        data,
      );
      console.log("add person response::", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding person:", error);
      throw error;
    }
  }

  /**
   * Download profile PDF of a person by id
   * @param personId
   */
  async downloadProfilePdf(personId: string) {
    try {
      const response = await httpClient.get(API_ENDPOINTS.downloadProfilePdf, {
        params: { person_id: personId },
      });
      console.log("PDF download response::", response.data);
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
  async uploadProfileImage(formData: FormData) {
    try {
      const response = await httpClient.post(
        API_ENDPOINTS.asset.uploadFile,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      console.log("uploadProfileImage response::", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  private searchCache = new Map<string, any>();

  /**
   * Search for a person with strict matching to avoid duplicates
   * @param criteria - Object containing firstname, lastname, surname, dob, etc.
   */
  async searchPerson(criteria: any) {
    const cacheKey = JSON.stringify(criteria);
    if (this.searchCache.has(cacheKey)) {
      console.log("Returning cached search result");
      return this.searchCache.get(cacheKey);
    }

    try {
      console.log("Searching for person with criteria:", criteria);

      const fullNameSearch = [
        criteria.firstname,
        criteria.lastname,
        criteria.surname,
      ]
        .filter(Boolean)
        .join(" ");

      const results = await this.getPeople({
        search: fullNameSearch,
        limit: 20,
      });

      const people = results?.people || [];

      const match = people.find((p: any) => {
        const nameMatch =
          p.firstname?.toLowerCase() === criteria.firstname?.toLowerCase() &&
          p.lastname?.toLowerCase() === criteria.lastname?.toLowerCase() &&
          p.surname?.toLowerCase() === criteria.surname?.toLowerCase();

        const dobMatch = !criteria.dob || p.dob === criteria.dob;

        return nameMatch && dobMatch;
      });

      this.searchCache.set(cacheKey, match || null);
      return match || null;
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    }
  }

  /**
   * Validates if a relationship type is supported by the system
   */
  validateRelationship(type: string): boolean {
    const validTypes = [
      "father",
      "mother",
      "spouse",
      "sibling",
      "son",
      "daughter",
      "child",
    ];
    return validTypes.includes(type.toLowerCase());
  }

  /**
   * Update member relationship linkage
   */
  async updateMember(data: {
    person_id: string; // The target person whose family we are updating
    member_id: string; // The person being added as a relative
    type: string; // father, mother, spouse, etc.
    marriage_date?: string;
  }) {
    if (!this.validateRelationship(data.type)) {
      throw new Error(`Invalid relationship type: ${data.type}`);
    }

    try {
      console.log("Updating member relationship:", data);
      const response = await httpClient.put(
        API_ENDPOINTS.family.updateMember,
        data,
      );
      console.log("Update member response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update member error:", error);
      throw error;
    }
  }

  /**
   * Updates an existing person's details
   */
  async updatePerson(data: any, personId: string) {
    console.log("Updating person details:", personId);
    try {
      const payload = {
        ...data,
        person_id: personId,
      };
      const response = await httpClient.put(
        API_ENDPOINTS.edit.personalDetails,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Update person error:", error);
      throw error;
    }
  }

  /**
   * Soft-delete a person by setting delete = true
   */
  async deletePerson(personId: string) {
    const response = await httpClient.put(API_ENDPOINTS.edit.personalDetails, {
      person_id: personId,
      delete: true,
    });
    return response.data;
  }

  /**
   * Orchestrates the full flow of finding/creating a person and linking them
   * as a family member.
   */
  async handleMemberFlow(
    targetPersonId: string,
    memberData: any,
    relationshipType: string,
  ) {
    try {
      console.log(`Starting member flow for ${relationshipType} role...`);

      // Step 1: Search for existing person (Ensures no duplicate person creation)
      const person = await this.searchPerson(memberData);
      let personId = person?.id || person?.person_id;

      // Step 2: Logic Branch: Create if missing, Update if found
      if (!personId) {
        console.log("Person not found in system. Calling addPerson API...");
        const newPersonData = {
          ...memberData,
          person_id: crypto.randomUUID(),
        };

        const addResponse = await this.addPerson(newPersonData);
        personId = addResponse?.data?.person_id || addResponse?.person_id;

        if (!personId) {
          throw new Error(
            "Failed to receive valid person_id from addPerson API",
          );
        }
        console.log("New person created successfully with ID:", personId);
      } else {
        console.log("Found existing person in records. Updating details...");
        await this.updatePerson(memberData, personId);
      }

      // Step 3: Link the person via updateMember API
      return await this.updateMember({
        person_id: targetPersonId,
        member_id: personId,
        type: relationshipType,
        marriage_date: memberData.marriage_date || "",
      });
    } catch (error) {
      console.error("Critical failure in member relationship flow:", error);
      throw error;
    }
  }

  async addBusiness(data: any) {
    try {
      const response = await httpClient.post(
        API_ENDPOINTS.business.addBusiness,
        data,
      );
      console.log("addBusiness response::", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding business:", error);
      throw error;
    }
  }

  async editBusiness(data: any) {
    try {
      const response = await httpClient.put(
        API_ENDPOINTS.business.updateBusiness,
        data,
      );
      console.log("editBusiness response::", response.data);
      return response.data;
    } catch (error) {
      console.error("Error editing business:", error);
      throw error;
    }
  }
}

const peopleService = new PeopleService();
export default peopleService;
