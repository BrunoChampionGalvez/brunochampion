import { Injectable, Logger } from '@nestjs/common';
import { ChatQueryDto } from './dto/chat-query.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PineconeEmbeddings, PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { InjectRepository } from '@nestjs/typeorm';
import { SemanticSearchResults } from './entities/semantic-search-results.entity';
import { In, Repository } from 'typeorm';
import { Document } from '@langchain/core/documents';
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { Technology } from 'src/technologies/entities/technology.entity';

@Injectable()
export class ChatService {
    private readonly logger = new Logger(ChatService.name);

    constructor(
        @InjectRepository(Technology)
        private technologyRepository: Repository<Technology>,
        private configService: ConfigService
    ) { }
    async *processQuery(chatQueryDto: ChatQueryDto): AsyncGenerator<string> {
        // TODO: Implement RAG query processing with LangChain.js
        // This is the main entry point for the RAG system

        this.logger.debug('Chat service processing query.')

        // Step 1: Process the user query
        const processedQueries = await this.decomposeUserQuery(chatQueryDto.query);

        this.logger.debug('Chat service decompossed queries.')

        // Step 2: Classify queries as general or specific
        const queries = await this.processUserQuery(processedQueries, chatQueryDto.technologyIds ? chatQueryDto.technologyIds : []);

        this.logger.debug('Chat service classied queries.')

        // Step 3: Handle general vs specific queries
        const context = await this.retrieveContext(
            queries,
            chatQueryDto.technologyIds ? chatQueryDto.technologyIds : [],
        );

        this.logger.debug('Chat service retrieved context.')

        // Step 4: Generate response with LLM
        // Step 4: Generate response with LLM
        const response = this.generateResponse(
            queries,
            context,
            chatQueryDto.conversationHistory,
        );

        yield* response;
    }

    private async decomposeUserQuery(query: string): Promise<string[]> {
        // TODO: Implement with LangChain.js
        // This method should:
        // 1. Call an LLM to analyze the query
        // 2. Decompose complex queries into simpler sub-queries if needed
        // 3. Clean and rewrite the query for better retrieval
        // 4. Return an array of processed queries

        this.logger.debug('Chat service processing user query.')

        const queriesFormat = z.object({
            queries: z.array(z.string()).min(1),
        })

        const llm = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-flash-lite',
            maxRetries: 2,
            apiKey: this.configService.getOrThrow('GOOGLE_API_KEY')
        })

        const structuredOutputLlm = llm.withStructuredOutput(queriesFormat, {
            method: 'jsonSchema',
            strict: true,
        })

        const result = await structuredOutputLlm.invoke([
            {
                role: "system",
                content: "You are a user query decomposser. Your role is to decompose complex queries into simpler sub-queries if needed. In case the query is simple, just return it as a single-item array. You have to return a JSON structure with the following format: { queries: [string] }"
            },
            {
                role: "user",
                content: query
            }
        ])

        this.logger.debug('User query decompossed.')

        // Placeholder: return the original query as a single-item array
        return result.queries;
    }

    private async processUserQuery(queries: string[], technologyIds: string[]): Promise<string[]> {
        // TODO: Implement with LangChain.js
        // This method should:
        // 1. For each query, call an LLM to determine if it's general or specific
        // 2. General queries: broad questions about concepts, comparisons, best practices
        // 3. Specific queries: questions about specific APIs, configurations, syntax
        // 4. Return classified queries with their types

        const technologies = await this.technologyRepository.find({
            where: {
                id: In(technologyIds)
            }
        });

        this.logger.debug('Chat service classifying queries.')

        const queriesFormat = z.object({
            queries: z.array(z.string()).min(1),
        });

        const llm = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-flash',
            maxRetries: 2,
            apiKey: this.configService.getOrThrow('GOOGLE_API_KEY')
        })

        const structuredOutputLlm = llm.withStructuredOutput(queriesFormat, {
            method: 'jsonSchema',
            strict: true,
        })

        const result = await structuredOutputLlm.invoke([
            {
                role: "system",
                content: "You are a user query categorizer. You will receive queries about technologies' documentations. Your role is to reformulate the queries if necessary in case they are too generic. In case they are too generic, use the name of the technology that you will be given to generate queries about the technology, so that they can be sent to a vector database for semantic search.  For example, if one of the queries is 'What can you tell me about this technology?', or 'What can you tell me about Docker?', to give you a example technology, you should generate more queries that when answered can respond the initial query (use your knowledge base about the technologies). The goal of the resulting queries is to send them to a vector databases for semantic searches, so take that into consideration using your knowledge about vector databases semantic searches. You have to return a JSON structure with the following format: { queries: string[] }"
            },
            {
                role: "user",
                content: `Queries: ${JSON.stringify(queries)}\n\nTechnologies: ${JSON.stringify(technologies.map(tech => `${tech.name},`))}`
            }
        ])

        this.logger.debug('User query categorized.')

        // Placeholder: return the original query as a single-item array
        return result.queries;
    }

    private async retrieveContext(
        queries: string[],
        technologyIds: string[],
    ): Promise<Array<{ content: string; url: string; technologyId: string }>> {
        // TODO: Implement with LangChain.js and vector database
        // This method should:
        // 1. For general queries: Use the general query processing path (to be implemented)
        // 2. For specific queries:
        //    a. Create embeddings for each query using LangChain.js
        //    b. Perform semantic search in the vector database
        //    c. Filter by technologyIds if provided, otherwise search all technologies
        //    d. Retrieve the most relevant chunks with their metadata
        // 3. Return the retrieved context chunks

        const embeddings = new PineconeEmbeddings({
            apiKey: this.configService.getOrThrow('PINECONE_API_KEY'),
        })

        const pinecone = new Pinecone({
            apiKey: this.configService.getOrThrow('PINECONE_API_KEY'),
        })

        const pineconIndex = pinecone.index(this.configService.getOrThrow('PINECONE_INDEX_NAME'));

        const vectorStore = new PineconeStore(embeddings, {
            pineconeIndex: pineconIndex,
            maxConcurrency: 5,
        });

        let genericContext: Array<{ content: string; url: string; technologyId: string }> = [];

        const specificResults = await Promise.all(queries.map(async query => {
            const results = await vectorStore.similaritySearch(query, 10, { technologyId: { $in: technologyIds } })
            return results
        }))

        const specificDocs = specificResults.flat().map(result => {
            // handle both naming conventions
            const text = result.pageContent ?? "";
            const meta = result.metadata ?? {};
            return {
                content: text,
                url: meta.url ?? null,
                technologyId: meta.technologyId ?? null,
            };
        });

        const allDocs = [...genericContext, ...specificDocs];

        return allDocs;
    }

    private async *generateResponse(
        queries: string[],
        context: Array<{ content: string; url: string; technologyId: string }>,
        conversationHistory?: Array<{ role: string; content: string }>,
    ): AsyncGenerator<string> {

        const llm = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-flash',
            temperature: 0,
            maxRetries: 2,
            apiKey: this.configService.getOrThrow('GOOGLE_API_KEY')
        })

        const response = await llm.stream([
            {
                role: "system",
                content: "You are a chatbot that can answer user queries about technologies. You can receive from one to many queries. You will receive the context of the documents that you can use to answer the queries. You will receive the conversation history if available. Respond to the user in a concise and helpful way in markdown format. IMPORTANT: When receiving context chunks, each one will be accompanied by a source, you should return the source next to each statement that you provided when the statement belongs to a specific source.The source should be in the format [source](url), being [source] always present as a non-changing marker (it is always the same), and (url) the url of the source inside parenthesis. You MUST provide your response in a markdown format. ALWAYS return your response with a title or big heading (that represents the main topic, using the one of the biggest markdown headings), and if applicable subheadings, bullet points, and numbered lists. Use code blocks when providing code examples."
            },
            {
                role: "user",
                content: `Queries: ${JSON.stringify(queries.length > 0 ? queries : "No queries")}\n\nContext: ${JSON.stringify(context.map(context => context.content).length > 0 ? context.map(context => {
                    return {
                        content: context.content,
                        url: context.url,
                        technologyId: context.technologyId
                    }
                }) : "No context")}\n\nConversation History: ${JSON.stringify(conversationHistory?.map(conversation => { return { role: conversation.role, content: conversation.content } }).length ?? 0 > 0 ? conversationHistory?.map(conversation => { return { role: conversation.role, content: conversation.content } }) : "No conversation history")}`
            }
        ])
        let finalResponse = ''
        for await (const chunk of response) {
            const content = Array.isArray(chunk.content)
                ? chunk.content.map((c) => (c as any).text || '').join('')
                : chunk.content;
            finalResponse += content;
            yield content;
        }
        return finalResponse;
    }

    async summarizeDocuments(
        chunks: SemanticSearchResults[],
        userQuery?: string
    ): Promise<string> {
        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            temperature: 0,
            apiKey: this.configService.getOrThrow('GOOGLE_API_KEY')
        });

        // For small number of chunks, use "stuff" (concatenate all)
        if (chunks.length <= 3) {
            return await this.stuffSummarize(chunks, llm, userQuery);
        }

        // For larger documents, use map-reduce
        return await this.mapReduceSummarize(chunks, llm, userQuery);
    }

    /**
         * "Stuff" approach: concatenate all chunks and summarize in one call
         * Best for documents that fit in context window
         */
    async stuffSummarize(
        chunks: SemanticSearchResults[],
        llm: ChatGoogleGenerativeAI,
        userQuery?: string
    ): Promise<string> {
        const chunkContent = chunks
            .map((doc, i) => `Chunk ${i + 1}:\n${doc.content}`)
            .join("\n\n---\n\n");

        const promptTemplate = PromptTemplate.fromTemplate(`
        Based on the following document chunks, provide a comprehensive summary.
        ${userQuery ? `Focus on: ${userQuery}` : ""}

        DOCUMENT CHUNKS:
        {content}

        Please provide a clear, detailed summary capturing the main points and key information.
        `);

        const chain = promptTemplate.pipe(llm);

        const result = await chain.invoke({
            content: chunkContent,
        });

        return result.content as string;
    }

    /**
     * Map-reduce approach: summarize each chunk, then summarize summaries
     * Best for large documents exceeding context window
     */
    async mapReduceSummarize(
        chunks: SemanticSearchResults[],
        llm: ChatGoogleGenerativeAI,
        userQuery?: string
    ): Promise<string> {
        // STEP 1: MAP - Summarize each chunk individually
        const mapPromptTemplate = PromptTemplate.fromTemplate(`
        Provide a concise summary of this document chunk:

        {chunk}

        Summary:
        `);

        const mapChain = mapPromptTemplate.pipe(llm);

        // Process chunks in batches to avoid rate limits and memory issues
        const batchSize = 20;
        const chunkSummaries: string[] = [];

        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
            this.logger.debug(`Processing summarization batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`);

            const batchResults = await Promise.all(
                batch.map(async (chunk) => {
                    try {
                        const result = await mapChain.invoke({
                            chunk: chunk.content,
                        });
                        return result.content as string;
                    } catch (error: any) {
                        this.logger.warn(`Failed to summarize chunk: ${error.message}`);
                        return ""; // Return empty string on failure to continue processing
                    }
                })
            );

            chunkSummaries.push(...batchResults.filter(s => s.trim() !== ""));
        }

        // STEP 2: REDUCE - Combine summaries
        // If we have many summaries, recursively reduce them
        if (chunkSummaries.length > 5) {
            // Group summaries into batches of 5 and reduce each batch
            const batches: string[][] = [];
            for (let i = 0; i < chunkSummaries.length; i += 5) {
                batches.push(chunkSummaries.slice(i, i + 5));
            }

            // Reduce each batch
            const reducedSummaries = await Promise.all(
                batches.map((batch) => this.reduceSummaries(batch, llm, userQuery))
            );

            // If multiple batches, reduce the reduced summaries
            if (reducedSummaries.length > 1) {
                return await this.reduceSummaries(reducedSummaries, llm, userQuery);
            }

            return reducedSummaries[0];
        }

        // For fewer summaries, reduce in one step
        return await this.reduceSummaries(chunkSummaries, llm, userQuery);
    }

    /**
     * Reduce: Take multiple summaries and create a final summary
     */
    async reduceSummaries(
        summaries: string[],
        llm: ChatGoogleGenerativeAI,
        userQuery?: string
    ): Promise<string> {
        const summaryContent = summaries
            .map((sum, i) => `Summary ${i + 1}:\n${sum}`)
            .join("\n\n---\n\n");

        const reducePromptTemplate = PromptTemplate.fromTemplate(`
        Combine these summaries into one coherent, comprehensive summary.
        ${userQuery ? `Focus on: ${userQuery}` : ""}

        SUMMARIES TO COMBINE:
        {summaries}

        Final consolidated summary:
        `);

        const reduceChain = reducePromptTemplate.pipe(llm);

        const result = await reduceChain.invoke({
            summaries: summaryContent,
        });

        return result.content as string;
    }

    /**
     * Main handler: routes query to appropriate summary method
     */
    async handleGeneralQuery(
        userQuery: string,
        technologyId: string,
        allChunks: SemanticSearchResults[]
    ): Promise<string> {
        // Filter chunks by file_id to get only this file's content
        const relevantChunks = allChunks.filter(
            (chunk) => chunk.technologyId === technologyId
        );

        if (relevantChunks.length === 0) {
            throw new Error(`No chunks found for technology: ${technologyId}`);
        }

        console.log(
            `Summarizing ${relevantChunks.length} chunks using map-reduce...`
        );

        return await this.summarizeDocuments(relevantChunks, userQuery);
    }
}
