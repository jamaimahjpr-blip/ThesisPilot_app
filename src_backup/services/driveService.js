// src/services/driveService.js
// Service for managing Google Drive files, folders, and thesis document attachments

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_API_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

/**
 * Creates a dedicated folder in Google Drive for thesis assets.
 * @param {string} accessToken - Google OAuth Access Token
 * @param {string} folderName - Name of the folder (e.g., "Thesis pilot - Chapter PDFs")
 */
export const createThesisFolder = async (accessToken, folderName = 'ThesisPilot Documents') => {
  try {
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const response = await fetch(DRIVE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fileMetadata),
    });

    const data = await response.json();
    return data; // Returns folder metadata including `id`
  } catch (error) {
    console.error('Error creating Google Drive folder:', error);
    throw error;
  }
};

/**
 * Fetches/lists thesis files stored in Google Drive.
 * @param {string} accessToken - Google OAuth Access Token
 */
export const listThesisFiles = async (accessToken) => {
  try {
    const response = await fetch(
      `${DRIVE_API_URL}?pageSize=20&fields=files(id,name,mimeType,webViewLink,iconLink,createdTime)&q=trashed=false`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error fetching Google Drive files:', error);
    throw error;
  }
};

/**
 * Uploads a file (PDF, Document, Image) to Google Drive.
 * @param {string} accessToken - Google OAuth Access Token
 * @param {Object} file - File object containing name, uri, and mimeType
 * @param {string} parentFolderId - Optional parent folder ID
 */
export const uploadFileToDrive = async (accessToken, file, parentFolderId = null) => {
  try {
    const metadata = {
      name: file.name || 'Thesis_Document.pdf',
      mimeType: file.mimeType || 'application/pdf',
      ...(parentFolderId ? { parents: [parentFolderId] } : {}),
    };

    const formData = new FormData();
    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );

    formData.append('file', {
      uri: file.uri,
      name: file.name || 'Thesis_Document.pdf',
      type: file.mimeType || 'application/pdf',
    });

    const response = await fetch(UPLOAD_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();
    return data; // Returns uploaded file metadata
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
};