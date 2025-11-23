import { useState, useEffect, useCallback } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

interface TransformResponse {
  output: string
}

interface FunctionsResponse {
  functions: string[]
}

interface ErrorResponse {
  error: string
}

function App() {
  const [input, setInput] = useState<string>('')
  const [output, setOutput] = useState<string>('')
  const [selectedFunction, setSelectedFunction] = useState<string>('leetspeak')
  const [availableFunctions, setAvailableFunctions] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [apiUrl, setApiUrl] = useState<string>(API_BASE_URL)
  const [copied, setCopied] = useState<boolean>(false)

  const fetchFunctions = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/functions`)
      if (!response.ok) throw new Error('Failed to fetch functions')
      const data: FunctionsResponse = await response.json()
      setAvailableFunctions(data.functions || [])
      if (data.functions && data.functions.length > 0 && !data.functions.includes(selectedFunction)) {
        setSelectedFunction(data.functions[0])
      }
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to connect to API: ${errorMessage}`)
      console.error('Error fetching functions:', err)
    }
  }, [apiUrl, selectedFunction])

  useEffect(() => {
    fetchFunctions()
  }, [fetchFunctions])

  const handleTransform = async (): Promise<void> => {
    if (!input.trim()) {
      setError('Please enter some text to transform')
      return
    }

    setLoading(true)
    setError(null)
    setOutput('')

    try {
      const response = await fetch(`${apiUrl}/transform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: selectedFunction,
          input: input,
        }),
      })

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        throw new Error(errorData.error || 'Transformation failed')
      }

      const data: TransformResponse = await response.json()
      setOutput(data.output || '')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during transformation'
      setError(errorMessage)
      console.error('Error transforming:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (): Promise<void> => {
    if (output) {
      try {
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleClear = (): void => {
    setInput('')
    setOutput('')
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">redstr</h1>
              <p className="text-sm text-purple-200 mt-1">
                String Transformation Tool for Security Testing
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-200">
              <span className="px-3 py-1 bg-white/10 rounded-full">
                {availableFunctions.length} functions
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* API Configuration */}
        <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <label htmlFor="api-url" className="text-white font-medium text-sm whitespace-nowrap">
              API URL:
            </label>
            <input
              id="api-url"
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8080"
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={fetchFunctions}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Main Transform Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <div className="mb-4">
              <label htmlFor="function-select" className="block text-white font-medium mb-2">
                Transformation Function
              </label>
              <select
                id="function-select"
                value={selectedFunction}
                onChange={(e) => setSelectedFunction(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {availableFunctions.map((func) => (
                  <option key={func} value={func} className="bg-slate-800">
                    {func}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="input" className="block text-white font-medium mb-2">
                Input Text
              </label>
              <textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to transform..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                rows={10}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleTransform}
                disabled={loading || !input.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Transforming...
                  </span>
                ) : (
                  'Transform'
                )}
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors border border-white/20"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <label htmlFor="output" className="block text-white font-medium">
                Output
              </label>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <textarea
              id="output"
              value={output}
              readOnly
              placeholder="Transformed output will appear here..."
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg text-white font-mono text-sm focus:outline-none resize-y"
              rows={10}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong className="text-red-200 font-semibold">Error:</strong>
                <p className="text-red-100 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">About redstr</h2>
          <p className="text-purple-100 mb-4 leading-relaxed">
            redstr is a comprehensive string transformation library for security testing, red team operations,
            and penetration testing. This frontend provides a modern web interface to interact with the
            redstr-server API.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-purple-300">{availableFunctions.length}</div>
              <div className="text-sm text-purple-200 mt-1">Transformation Functions</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-purple-300">30+</div>
              <div className="text-sm text-purple-200 mt-1">Security Techniques</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-purple-300">100%</div>
              <div className="text-sm text-purple-200 mt-1">Open Source</div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-purple-200">
              <strong className="text-white">Available Functions:</strong> Encoding, obfuscation, injection testing,
              web security, and more. Perfect for WAF bypass, XSS testing, SQL injection, and phishing detection.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-purple-200 text-sm">
              <a
                href="https://github.com/arvid-berndtsson/redstr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-300 underline transition-colors"
              >
                redstr
              </a>{' '}
              - For authorized security testing only
            </p>
            <div className="flex gap-4 text-sm text-purple-200">
              <a
                href="https://github.com/arvid-berndtsson/redstr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://github.com/arvid-berndtsson/redstr-server"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Server
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
