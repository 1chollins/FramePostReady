// TODO: Sprint 9 — Google Drive upload for generated PDFs
// This module will upload branded PDFs to the agent's Google Drive folder.

export interface DriveUploadOptions {
  filePath: string
  fileName: string
  folderId: string
  mimeType?: string
}

export async function uploadToDrive(_options: DriveUploadOptions): Promise<string> {
  throw new Error('Google Drive upload not yet implemented — coming in Sprint 9')
}

export async function getOrCreateAgentFolder(
  _agentName: string,
  _parentFolderId?: string
): Promise<string> {
  throw new Error('Google Drive folder management not yet implemented — coming in Sprint 9')
}
