import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  Copy,  
  Trash2,
  ExternalLink 
} from 'lucide-react';
import axios from 'axios';
import URL from '../constants.js'

const URLShortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urlHistory, setUrlHistory] = useState([]);
  const [error, setError] = useState('');
  const [copiedUrl, setCopiedUrl] = useState('')
  const [animateSuccess, setAnimateSuccess] = useState(false);

  useEffect(() => {
    generateUrlHistory();
  }, []);

  const generateUrlHistory = async()=>{
    try{
      const response = await axios.get(
        `${URL}/url/link/history`,
        {
          headers: {
              'Content-Type': 'application/json'
          },
          withCredentials: true,
        }
      )
      setUrlHistory(response.data.history)
    }catch(err){
      console.log(`error while fetching history, ${err}`)
    }
  }

  const handleGenerateShortURL = async () => {
    if (!originalUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }
  
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*(\?[^#]*)?(\#.*)?$/;
    if (!urlPattern.test(originalUrl)) {
      setError('Please enter a valid URL');
      return;
    }
  
    try {
      const response = await axios.post(
        `${URL}/url`,
        { originalUrl: originalUrl },
        {
          headers: {
              'Content-Type': 'application/json'
          },
          withCredentials: true,
        }
      );
      
      let shortId = response.data.shortId;
      let shortURL = `${URL}/url/${shortId}`;

      setShortUrl(shortURL);
      setAnimateSuccess(true);
      generateUrlHistory();
      
      setError('');
    } catch (err) {
      console.error(`Error during sending originalUrl from Frontend:`, err);
      
      if (err.response) {
        setError(err.response.data.message || 'Failed to shorten URL');
      } else if (err.request) {
        setError('No response from server');
      } else {
        setError('Error in request setup');
      }
    }
  };

  const handleCopyUrl = async(shorturl)=>{
    try{
      navigator.clipboard.writeText(shorturl)
      setCopiedUrl(shorturl)
    
      const timer = setTimeout(() => {
        setCopiedUrl('')
      }, 1000);

      return () => clearTimeout(timer);
    }catch(err){
      console.log(`error while copying to clipboard`)
    }
  }

  const handleDeleteUrl = async(id)=>{
    try{
      await axios.delete(
        `${URL}/url/link/${id}`,
      )
      setUrlHistory(prevHistory => 
        prevHistory.filter(urlEntry => urlEntry._id !== id)
      );
    }catch(err){
      console.log(`error while deleting URL, ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden grid md:grid-cols-3 border border-gray-200">
        {/* URL Shortener Section */}
        <div className="md:col-span-2 p-10 bg-white border-r border-gray-100">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center items-center mb-4">
                <Link2 className="mr-3 text-blue-600" size={40} strokeWidth={2.5} />
                <h1 className="text-4xl font-extrabold text-gray-800">
                  LinkCraft
                </h1>
              </div>
              <p className="text-gray-500 text-sm">Create concise, shareable links with ease</p>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <input 
                  type="text" 
                  value={originalUrl}
                  onChange={(e) => {
                    setOriginalUrl(e.target.value);
                    setError('');
                    setAnimateSuccess(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleGenerateShortURL()
                    }
                  }}
                  placeholder="Paste your long URL here"
                  className={`
                    w-full p-4 pl-12 border-2 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    transition-all duration-300 
                    ${error 
                      ? 'border-red-400 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                    }`}
                />
                <Link2 className="absolute left-4 top-4 text-gray-400" size={24} />
                {error && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    {error}
                  </p>
                )}
              </div>
              
              <button 
                onClick={handleGenerateShortURL}
                className="w-full bg-blue-600 text-white p-4 rounded-xl 
                hover:bg-blue-700 transition-all duration-300 
                transform hover:-translate-y-1 hover:shadow-lg
                active:translate-y-0 active:shadow-md
                flex items-center justify-center gap-3 
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Link2 size={20} strokeWidth={2.5} />
                Shorten URL
              </button>

              {shortUrl && animateSuccess && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center space-x-4 animate-pulse">
                  <div className="flex-grow">
                    <p className="text-green-800 font-semibold mb-1">URL Shortened Successfully</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 text-sm truncate">{shortUrl}</span>
                      <a 
                        href={shortUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-700 hover:text-green-900"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => {
                        handleCopyUrl(shortUrl);
                      }}
                      className="text-green-700 hover:text-green-900 bg-green-100 p-2 rounded-full"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* URL History Section */}
        <div className="p-6 bg-gray-50 overflow-y-auto max-h-[700px]">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
            Link History
          </h2>
          
          {urlHistory.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Link2 className="text-blue-600" size={48} strokeWidth={2} />
              </div>
              <p>Your shortened links will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {urlHistory.map((urlEntry) => (
                <div 
                  key={urlEntry._id} 
                  className="bg-white p-4 rounded-xl border border-gray-200 
                  shadow-sm hover:shadow-md transition-all duration-300 
                  transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">
                        {urlEntry.redirectURL}
                      </p>
                      <span className="text-xs text-gray-400">
                        {urlEntry.visitHistory.length > 0 
                        ? urlEntry.visitHistory[urlEntry.visitHistory.length - 1].timestamp 
                        : "No visits yet"}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          const shortUrl = `${URL}/url/${urlEntry.shortId}`
                          handleCopyUrl(shortUrl)}
                        }
                        className={`
                          p-2 rounded-full transition-all duration-300 hover:bg-gray-200
                          ${copiedUrl === `${URL}/url/${urlEntry.shortId}` ? "bg-green-200" : ""}
                        `}
                      >
                        <Copy size={16}/>
                      </button>
                      <button 
                        onClick={() => handleDeleteUrl(urlEntry._id)}
                        className="text-red-500 hover:bg-red-100 hover:text-red-600 p-2 rounded-full transition-all duration-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        value={ `${URL}/url/${urlEntry.shortId}` } 
                        readOnly 
                        className="bg-gray-100 text-blue-600 px-3 py-1 rounded-md text-sm w-full truncate outline-none"
                      />
                      <a 
                        href={ `${URL}/url/${urlEntry.shortId}` } 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink 
                          size={16} 
                          onClick={()=>{
                            generateUrlHistory()
                          }}
                        />
                      </a>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 text-xs">Clicks:</span>
                      <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                        {urlEntry.visitHistory.length}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default URLShortener;