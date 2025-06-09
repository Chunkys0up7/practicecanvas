
import React, { useState, FormEvent } from 'react';
import { generateCode, generateTextWithGoogleSearch } from '../services/geminiService';
import Button from '../components/common/Button';
import Textarea from '../components/common/Textarea';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Code2, Sparkles, Link as LinkIcon } from 'lucide-react';
import { GroundingChunk } from '../types';

const CodeGeneratorPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [language, setLanguage] = useState<string>('Python');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchPrompt, setSearchPrompt] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string>('');
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedCode('');
    setExplanation('');

    try {
      const response = await generateCode({ prompt, language });
      setGeneratedCode(response.code);
      setExplanation(response.explanation || '');
      if (response.code.startsWith("// Error:")) {
        setError(response.explanation || "An unknown error occurred during code generation.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchPrompt.trim()) {
      setSearchError("Search prompt cannot be empty.");
      return;
    }
    setIsSearchLoading(true);
    setSearchError(null);
    setSearchResults('');
    setGroundingChunks([]);
    try {
      const { text, groundingMetadata } = await generateTextWithGoogleSearch(searchPrompt);
      setSearchResults(text);
      if (groundingMetadata?.groundingChunks) {
        setGroundingChunks(groundingMetadata.groundingChunks);
      }
      if (text.startsWith("// Error:")) {
         setSearchError(text);
      }
    } catch (err) {
      console.error(err);
      setSearchError(err instanceof Error ? err.message : "An unknown error occurred during search.");
    } finally {
      setIsSearchLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center mb-4">
          <Code2 size={32} className="mr-3 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">AI Code Generator</h1>
        </div>
        <p className="text-gray-400 mb-6">
          Describe the functionality you need, and our AI assistant will generate code for you.
          Powered by Gemini.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-xl">
          <Textarea
            id="prompt"
            label="Code Description / Prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'a Python function to sort a list of dictionaries by a specific key'"
            rows={4}
            required
            className="bg-gray-700 border-gray-600"
          />
          <Input
            id="language"
            label="Target Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="e.g., Python, JavaScript, Java"
            className="bg-gray-700 border-gray-600"
          />
          <Button type="submit" variant="primary" isLoading={isLoading} leftIcon={<Sparkles size={18}/>}>
            Generate Code
          </Button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>

        {isLoading && <LoadingSpinner text="Generating code..." className="my-8" />}

        {!isLoading && generatedCode && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-3">Generated Code ({language})</h2>
            <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm">
              <code className={`language-${language.toLowerCase()}`}>{generatedCode}</code>
            </pre>
            {explanation && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Explanation</h3>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <hr className="border-gray-700 my-12" />

      <div>
        <div className="flex items-center mb-4">
          <Sparkles size={32} className="mr-3 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">AI Search Assistant</h1>
        </div>
        <p className="text-gray-400 mb-6">
          Ask questions about recent events or topics requiring up-to-date information. Powered by Gemini with Google Search.
        </p>

        <form onSubmit={handleSearchSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-xl">
          <Textarea
            id="searchPrompt"
            label="Your Question"
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder="e.g., 'What were the key highlights of the recent tech summit?'"
            rows={3}
            required
            className="bg-gray-700 border-gray-600"
          />
          <Button type="submit" variant="primary" isLoading={isSearchLoading} leftIcon={<Sparkles size={18}/>}>
            Search with AI
          </Button>
          {searchError && <p className="text-red-400 text-sm">{searchError}</p>}
        </form>

        {isSearchLoading && <LoadingSpinner text="Searching..." className="my-8" />}

        {!isSearchLoading && searchResults && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-3">Search Results</h2>
            <p className="text-gray-300 text-sm whitespace-pre-wrap mb-4">{searchResults}</p>
            
            {groundingChunks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Sources:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {groundingChunks.map((chunk, index) =>
                    chunk.web ? (
                      <li key={index} className="text-sm">
                        <a
                          href={chunk.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center"
                        >
                          <LinkIcon size={14} className="mr-1.5 shrink-0" />
                          {chunk.web.title || chunk.web.uri}
                        </a>
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default CodeGeneratorPage;
