// src/services/docsService.js
import axios from 'axios';

/**
 * Creates a new Google Document for a thesis chapter.
 * @param {string} accessToken - Google OAuth Access Token
 * @param {string} title - Chapter Title
 */
export const createChapterDoc = async (accessToken, title) => {
  try {
    const response = await axios.post(
      'https://docs.googleapis.com/v1/documents',
      { title: title },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // Returns Document ID and structure
  } catch (error) {
    console.error('Error creating Google Doc:', error);
    throw error;
  }
};