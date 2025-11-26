
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from '@google/genai';
import { GenerateImageParams, GenerationResult, GenerationMode, AspectRatio, ViralTitle } from '../types';

const generateSingleImage = async (
  ai: GoogleGenAI,
  prompt: string,
  params: GenerateImageParams,
  overrideAspectRatio?: AspectRatio
): Promise<string> => {
  const parts: any[] = [];

  // Add reference image if provided (Image-to-Image)
  if (params.referenceImage && params.referenceImageMimeType) {
    parts.push({
      inlineData: {
        data: params.referenceImage,
        mimeType: params.referenceImageMimeType,
      },
    });
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: params.model,
    contents: { parts: parts },
    config: {
      imageConfig: {
        aspectRatio: overrideAspectRatio || params.aspectRatio,
      },
    },
  });

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64EncodeString}`;
      }
    }
  }
  throw new Error('No image generated for this prompt.');
};

export const generateViralTitles = async (baseTitle: string): Promise<ViralTitle[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `You are a world-class YouTube Data Scientist and Psychologist.
    Analyze the following video topic and generate 5 highly viral title variations.
    
    For EACH title, you must provide:
    1. The Title itself (optimized for high CTR).
    2. A "Viral Score" (integer 0-100) based on historical performance of similar structures.
    3. The specific "Cognitive Bias" or psychological trigger used (e.g., Loss Aversion, Curiosity Gap, Negativity Bias, Urgency, FOMO).
    
    Topic: "${baseTitle}"
    
    Return ONLY a JSON object with a property "titles" containing the array of objects.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: {
            type: Type.ARRAY,
            items: { 
              type: Type.OBJECT, 
              properties: {
                title: { type: Type.STRING },
                score: { type: Type.INTEGER },
                cognitiveBias: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  const jsonStr = response.text || "{}";
  try {
    const data = JSON.parse(jsonStr);
    return data.titles || [];
  } catch (e) {
    console.error("Failed to parse viral titles", e);
    return [];
  }
}

export const generateImage = async (
  params: GenerateImageParams,
): Promise<GenerationResult> => {
  console.log('Starting generation with params:', params);
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // HANDLE VIRAL TITLE MODE
  if (params.mode === GenerationMode.VIRAL_TITLE) {
    const titles = await generateViralTitles(params.prompt);
    return { imageUrls: [], textResults: titles };
  }

  if (params.mode === GenerationMode.YOUTUBE_THUMBNAIL) {
    // Specialized logic for 3 High-CTR Thumbnails
    const basePrompt = params.prompt;
    
    // Strategy 1: The "Shock/Reaction" Face
    const prompt1 = `YouTube thumbnail for video titled "${basePrompt}". 
      Focus: Extreme Close-up Reaction. 
      Style: Hyper-realistic, 4k, Vibrant Colors.
      Visuals: A person with a shocked or extremely excited expression looking at the camera or pointing to the side. 
      Background: Blurred, high contrast, saturated blue or orange. 
      Text style: Bold, thick outline, "OMG" or "INSANE" vibe. 
      Goal: Impossible not to click. High CTR optimization.`;

    // Strategy 2: The "Before/After" or "Action" Split
    const prompt2 = `YouTube thumbnail for video titled "${basePrompt}". 
      Focus: Action/Storytelling.
      Style: Composite image, high contrast, glossy finish.
      Visuals: Dynamic composition, visual storytelling showing conflict or result. 
      Lighting: Cinematic, dramatic backlighting. 
      Colors: Neon greens, reds, and deeply saturated blacks. 
      Goal: Viral, trending tab style.`;

    // Strategy 3: The "Mystery/Object" Focus
    const prompt3 = `YouTube thumbnail for video titled "${basePrompt}". 
      Focus: The Object/Subject + Mystery.
      Style: 3D Render style or High-End Photography.
      Visuals: The main subject of the video in the center, large red arrow pointing to a detail, giant question mark. 
      Atmosphere: Intense, glowing effects. 
      Goal: Curiosity gap, 75% click-through rate design.`;

    try {
      // Run in parallel for speed
      const results = await Promise.all([
        generateSingleImage(ai, prompt1, params, AspectRatio.LANDSCAPE),
        generateSingleImage(ai, prompt2, params, AspectRatio.LANDSCAPE),
        generateSingleImage(ai, prompt3, params, AspectRatio.LANDSCAPE),
      ]);
      
      return { imageUrls: results };
    } catch (error) {
      console.error("Parallel generation failed, trying single fallback", error);
      throw error;
    }

  } else if (params.mode === GenerationMode.CHANNEL_BANNER) {
    // Specialized logic for 3 Channel Banners
    const channelName = params.prompt;
    const nicheDescription = params.description || "Content Creator";

    // Strategy 1: Modern & Sleek (Branding Focus)
    const prompt1 = `YouTube Channel Banner Art (2560x1440 layout). 
      Channel Name: "${channelName}".
      Context/Niche: ${nicheDescription}.
      Style: Ultra-modern, sleek, minimalist, high-tech.
      Visuals: Clean typography centered in the safe area. Abstract geometric shapes in background.
      Colors: Cool blues, dark grays, and white. Professional branding.`;

    // Strategy 2: Illustrative & Vibrant (Niche Focus)
    const prompt2 = `YouTube Channel Banner Art (2560x1440 layout).
      Channel Name: "${channelName}".
      Context/Niche: ${nicheDescription}.
      Style: Detailed illustration, digital art, vibrant.
      Visuals: Elements related to "${nicheDescription}" floating in background (e.g., if gaming, controllers; if cooking, food). Dynamic lighting.
      Composition: Text centered, artwork spreading to edges.`;

    // Strategy 3: Cinematic & Atmospheric (Mood Focus)
    const prompt3 = `YouTube Channel Banner Art (2560x1440 layout).
      Channel Name: "${channelName}".
      Context/Niche: ${nicheDescription}.
      Style: Cinematic, atmospheric, textured.
      Visuals: High-quality texture background (grunge, neon, or nature depending on niche). Glowing text effect for the channel name.
      Goal: Immersive brand identity.`;

     try {
      // Run in parallel
      const results = await Promise.all([
        generateSingleImage(ai, prompt1, params, AspectRatio.LANDSCAPE),
        generateSingleImage(ai, prompt2, params, AspectRatio.LANDSCAPE),
        generateSingleImage(ai, prompt3, params, AspectRatio.LANDSCAPE),
      ]);
      
      return { imageUrls: results };
    } catch (error) {
      console.error("Parallel generation failed, trying single fallback", error);
      throw error;
    }
  } else {
    // Standard Mode (Single Image)
    const imageUrl = await generateSingleImage(ai, params.prompt, params);
    return { imageUrls: [imageUrl] };
  }
};
