import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { createError } from "../error.js";

dotenv.config();

// Controller to generate Image
export const generateImage = async (req, res, next) => {
  try {
    // Get the prompt from the request body (adjust as needed)
    const { prompt } = req.body; 

//      const invokeUrl = "https://ai.api.nvidia.com/v1/genai/briaai/bria-2.3";
    const invokeUrl = "https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-3-medium"
    console.log("invokeUrl", invokeUrl);
    console.log("key ", process.env.NVIDIA_API_KEY);
    
    const headers = {
      "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`, // Use environment variable
      "Accept": "application/json",
      "Content-Type": "application/json" // Added content type for sending JSON
    };

    const payload = {
      prompt,
      cfg_scale: 5,
      aspect_ratio: "1:1",
      seed: 0,
      steps: 30,
      negative_prompt: ""
    };

    let response = await fetch(invokeUrl, {
      method: "POST", // Use POST method
      body: JSON.stringify(payload),
      headers,
    });
    // console.log("Res", response);

    if (response.status !== 200) {
      let errBody = await response.text();
      throw new Error(`NVIDIA API invocation failed with status ${response.status}: ${errBody}`);
    }

    let responseBody = await response.json();
    console.log("Res", responseBody);
    // Assuming the image data is in responseBody.image
    const imageData = responseBody.image; 

    // Send the base64 string with the data URL prefix
    return res.status(200).json({
      photo: `data:image/jpeg;base64,${imageData}`, // Adjust image type if needed
    });
  } catch (error) {
      console.error(error);
      next(error); // Pass error to error handling middleware
  }
};
