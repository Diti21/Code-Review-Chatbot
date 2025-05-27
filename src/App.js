import React, { useState } from 'react';
import { marked } from 'marked';

export default function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenWarning, setTokenWarning] = useState('');

  const TOKEN_LIMIT = 3000;

  function handleCodeChange(e) {
    const val = e.target.value;
    if (val.length > TOKEN_LIMIT) {
      setTokenWarning(
        `Warning: Code truncated to ${TOKEN_LIMIT} characters to fit token limit.`
      );
      setCode(val.slice(0, TOKEN_LIMIT));
    } else {
      setTokenWarning('');
      setCode(val);
    }
  }

  async function handleReview() {
    if (!code.trim()) {
      setError('Please enter some code to review.');
      return;
    }
    setError('');
    setReview('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      if (response.ok) {
        setReview(data.review);
      } else {
        setError(data.error || 'Error reviewing code.');
      }
    } catch (e) {
      setError('Failed to connect to the server.');
    }
    setLoading(false);
  }

  function handleDownload() {
    if (!review) return;
    const blob = new Blob([review], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code-review.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '40px auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '30px',
        backgroundColor: '#ffffff',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#1a202c', marginBottom: '30px' }}>
        Code Review Assistant
      </h1>

      <label
        style={{
          display: 'block',
          fontWeight: 600,
          color: '#444',
          marginBottom: 8,
          fontSize: 16,
        }}
      >
        Programming Language:
      </label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          marginBottom: '20px',
          boxSizing: 'border-box',
        }}
      >
        <option>JavaScript</option>
        <option>Python</option>
        <option>Java</option>
        <option>C++</option>
        <option>Go</option>
        <option>Ruby</option>
      </select>

      <textarea
        rows={12}
        placeholder="Paste your code here..."
        value={code}
        onChange={handleCodeChange}
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '16px',
          fontFamily: 'monospace',
          borderRadius: '8px',
          border: '1px solid #ccc',
          resize: 'vertical',
          minHeight: '250px',
          marginBottom: '5px',
          boxSizing: 'border-box',
        }}
      />
      {tokenWarning && (
        <p style={{ color: '#e07c00', marginBottom: '20px', fontWeight: '600' }}>
          {tokenWarning}
        </p>
      )}

      <button
        onClick={handleReview}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px 0',
          fontSize: '18px',
          fontWeight: '600',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: 'white',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: loading ? 'none' : '0 4px 8px rgba(0, 123, 255, 0.4)',
        }}
      >
        {loading ? 'Reviewing...' : 'Get Review'}
      </button>

      {error && (
        <p
          style={{
            color: '#dc3545',
            marginTop: '20px',
            fontWeight: 600,
            textAlign: 'center',
            fontSize: '16px',
          }}
        >
          {error}
        </p>
      )}

      {review && (
        <div
          style={{
            marginTop: '40px',
            padding: '25px',
            backgroundColor: '#f8f9fa',
            borderLeft: '6px solid #007bff',
            borderRadius: '12px',
            fontFamily: 'monospace',
            color: '#1e1e1e',
            boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.03)',
            lineHeight: 1.6,
            overflowX: 'auto',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <h3 style={{ marginBottom: '20px', color: '#007bff' }}>🔍 Review Result</h3>

          <div
            style={{ margin: 0, fontSize: '15px', overflowX: 'auto' }}
            dangerouslySetInnerHTML={{ __html: marked(review) }}
          />

          <button
            onClick={handleDownload}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#28a745',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            📥 Download Review as .txt
          </button>
        </div>
      )}
    </div>
  );
}
