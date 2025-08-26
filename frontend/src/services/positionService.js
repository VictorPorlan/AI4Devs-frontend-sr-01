import { API_CONFIG, buildApiUrl } from '../config/apiConfig';

export const positionService = {
  // Get interview flow for a specific position
  async getInterviewFlow(positionId) {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.POSITIONS.INTERVIEW_FLOW(positionId)));
      if (!response.ok) {
        throw new Error('Failed to fetch interview flow');
      }
      const data = await response.json();
      // The backend returns { interviewFlow: {...} }, so we need to extract it
      return data.interviewFlow;
    } catch (error) {
      console.error('Error fetching interview flow:', error);
      throw error;
    }
  },

  // Get candidates for a specific position
  async getCandidates(positionId) {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.POSITIONS.CANDIDATES(positionId)));
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },

  // Update candidate stage
  async updateCandidateStage(candidateId, newInterviewStep) {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CANDIDATES.UPDATE_STAGE(candidateId)), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: candidateId,
          currentInterviewStep: newInterviewStep
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update candidate stage');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating candidate stage:', error);
      throw error;
    }
  }
};
