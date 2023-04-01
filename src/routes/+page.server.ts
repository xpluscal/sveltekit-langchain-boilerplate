import type { Actions } from './$types';
import { json } from '@sveltejs/kit';
import { OpenAI } from 'langchain/llms';
import { loadSummarizationChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import type { Document } from 'langchain/document';
import { AnalyzeDocumentChain } from 'langchain/chains';
import { PDFLoader } from 'langchain/document_loaders';
import { writeFile } from 'fs/promises';
import { OPENAI_API_KEY } from '$env/static/private';

export const actions = {
	summarize: async ({ request }) => {

        // Initialize the Model
        const model = new OpenAI({ temperature: 0, openAIApiKey: OPENAI_API_KEY });

        // Load and store the file
        const form = await request.formData();
        const file = form.get('file') as File;
        await writeFile(`static/files/${file.name}`, file.stream());

        // Convert the file to a Document
        const loader = new PDFLoader(`static/files/${file.name}`);
        const docs: Document[] = await loader.load();
        console.log(docs);

        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
        const chunks = await splitter.splitDocuments(docs);
        console.log(chunks);

        // Load the summarization chain
        const chain = loadSummarizationChain(model);
        // the analyzedocschain is used to summarize a single piece of text instead of chunks of text
        const res = await chain.call({
            input_documents: chunks
        });

        return { success: true, summary: res.text };
	}
} satisfies Actions;
