declare module '@google/genai' {
    export * from '@google/genai'; 
    
    export class GoogleGenAI {
        constructor(options: { apiKey: string });
        models: {
            generateContent: (config: any) => Promise<any>;
        };
    }
}