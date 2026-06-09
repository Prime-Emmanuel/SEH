// ⚠️ WARNING: EXPOSING THE API KEY CLIENT-SIDE IS A SECURITY RISK.
// ONLY DO THIS IF YOU UNDERSTAND THAT ANYONE VISITING YOUR SITE CAN EXTRACT YOUR KEY.
// DO NOT USE THIS IN PRODUCTION APPS WITH A PAID KEY UNLESS PROPERLY SECURED OR INTENDED.

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeImageWithAI = async (base64Image: string, mimeType: string, retries = 2): Promise<any> => {
  try {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      throw new Error("Clé API Gemini non configurée ! Veuillez la définir dans le Panel Admin.");
    }
    
    // Remove the data:image/...;base64, prefix if it exists to pass pure base64 to Gemini
    const pureBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: pureBase64,
                }
              },
              {
                text: `Analyse cette image d'une offre de propriété immobilière. Extrait toutes les informations suivantes si elles sont présentes et retourne-les au format JSON stricte :
- 'type' (ex: Terrain, Maison, Appartement, etc. Laisse vide si non précisé)
- 'title' (Génère un titre court et accrocheur comme "Terrain à Douala", ou utilise une information clé)
- 'description' (Extrait tout le texte décrivant le bien. Formatte correctement)
- 'characteristics' (Un tableau de strings extraites de la description, ex: ["Quartier viabilisé", "Vue sur crique"])
- 'city' (Extrait uniquement le nom de la ville, ex: "Douala")
- 'quarter' (Extrait le quartier, ex: "Bonapriso", "Bonabéri", "Dikolo")
- 'surface' (Superficie sous forme de nombre entier, ex: 1100. N'inclut pas "m²")
- 'totalPrice' (Le prix en nombre entier, ex: 88000000. Supprime les espaces et "FCFA")
- 'ownerName' (Nom du créateur ou contact)
- 'ownerPhone' (Numéro de téléphone sans espaces)
- 'ownerEmail' (Email ou laisse vide si non trouvé)

Ne retourne QUE du JSON sans markdown, strictement. Laisse null ou une chaine vide si l'info n'est pas trouvée.`
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Contenu bloqué par l'IA (raison: ${data.promptFeedback.blockReason})`);
    }

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      if (data.candidates?.[0]?.finishReason) {
        throw new Error(`L'analyse a été interrompue (raison: ${data.candidates[0].finishReason}). L'image pourrait ne pas être acceptée.`);
      }
      throw new Error("L'IA n'a retourné aucun résultat. L'image pourrait être trop complexe ou invalide (par exemple une facture au lieu d'une propriété).");
    }

    text = text.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim();
    return JSON.parse(text);
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes("503")) {
      console.warn("Gemini API overloaded, retrying in 2 seconds...");
      await sleep(2000);
      return analyzeImageWithAI(base64Image, mimeType, retries - 1);
    }
    console.error("Erreur complète de l'analyse d'image:", error);
    throw new Error(error?.message || error?.toString() || "Erreur inconnue");
  }
};
export const generateDescriptionWithAI = async (prompt: string, retries = 2): Promise<string> => {
  try {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      throw new Error("Clé API Gemini non configurée ! Veuillez la définir dans le Panel Admin.");
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        systemInstruction: {
          parts: [
            {
              text: "Tu es un agent immobilier expert. Génère une description professionnelle et attractive pour cette propriété en français."
            }
          ]
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes("503")) {
      console.warn("Gemini API overloaded, retrying in 2 seconds...");
      await sleep(2000);
      return generateDescriptionWithAI(prompt, retries - 1);
    }
    console.error("Erreur complète de la génération avec Gemini:", error);
    throw new Error(error?.message || error?.toString() || "Erreur inconnue");
  }
};
