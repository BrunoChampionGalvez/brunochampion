export interface ChatResponseDto {
    response: string;
    references: Array<{
        id: string;
        chunk: string;
        source: string;
        position: number; // Position in the response where this reference applies
    }>;
}
