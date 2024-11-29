import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Ensure correct variable names
const supabaseUrl : any = process.env.SUPABASE_ENDPOINT;
const supabaseAnonKey : any = process.env.SUPABASE_ANON_KEY;
const supabaseBucket : any = process.env.SUPABASE_BUCKET;

// Initialize Supabase
const supabase : any = createClient(supabaseUrl, supabaseAnonKey);

export const saveRecordingToStorage = async (
  userMockId: string,
  questionNumber: number,
  recordingBlob: Blob,
): Promise<string> => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/[-:T]/g, '') // Remove unwanted characters
      .slice(0, 15) // Keep YYYYMMDD_HHmmss format
      .replace('Z', '') // Remove trailing 'Z' if present
      .replace('.', ''); // Remove . if present

    // Generate a unique file path
    const filePath = `recordings/${userMockId}_${formattedDate}_${uuidv4()}.webm`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from(supabaseBucket) // Use your specific Supabase bucket
      .upload(filePath, recordingBlob, {
        upsert: false, // Do not overwrite existing files
      });

    if (error) {
      throw new Error(`Error uploading recording: ${error.message}`);
    }

    // Ensure the file was uploaded successfully
    if (!data) {
      throw new Error('File upload failed with no data returned.');
    }

    // console.log('Supabase response', data.path);

    // Get the public URL for the uploaded file
    // const { publicURL, error: urlError } = supabase.storage
    //   .from(supabaseBucket)
    //   .getPublicUrl(filePath);

    // Check if the public URL was successfully generated
    if (!data.path) {
      throw new Error(`Error getting relative path to URL: ${error}`);
    }

    // console.log('Recording uploaded successfully:', data.path);
    return data.path;
  } catch (error) {
    console.error('Error saving recording to Supabase:', error);
    throw error;
  }
};
