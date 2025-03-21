"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

// Utility function to sanitize file names
const sanitizeFileName = (fileName) => {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")          // Replace spaces with underscores
    .replace(/[^a-z0-9_.-]/g, "");   // Remove non-alphanumeric characters (except underscore, dot, and hyphen)
};

export default function UploadDocuments({ residentId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);

  // Handle file selection
  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  }, []);

  // Upload the file to Supabase Storage
  const handleUpload = async () => {
    if (!selectedFile || !residentId) return;

    setUploading(true);
    const sanitizedFileName = sanitizeFileName(selectedFile.name);
    // Construct the file path using the residentId and current timestamp
    const filePath = `${residentId}/${Date.now()}-${sanitizedFileName}`;

    const { data, error } = await supabase
      .storage
      .from("Documents")
      .upload(filePath, selectedFile);

    if (error) {
      console.error("Upload error:", error.message);
    } else {
      const { publicURL } = supabase
        .storage
        .from("Documents")
        .getPublicUrl(filePath);
      setDocuments((prev) => [...prev, { filePath, publicURL }]);
    }
    setUploading(false);
    setSelectedFile(null);
  };

  // Fetch the list of documents for this resident from the storage bucket
  const fetchDocuments = useCallback(async () => {
    if (!residentId) return;
    const { data, error } = await supabase
      .storage
      .from("Documents")
      .list(residentId, { limit: 100 });
    if (error) {
      console.error("Error listing documents:", error.message);
    } else {
      // Map each file to its public URL
      const docs = data.map((file) => {
        const { publicURL } = supabase
          .storage
          .from("Documents")
          .getPublicUrl(`${residentId}/${file.name}`);
        return { filePath: `${residentId}/${file.name}`, publicURL };
      });
      setDocuments(docs);
    }
  }, [residentId]);

  useEffect(() => {
    if (residentId) {
      fetchDocuments();
    }
  }, [residentId, fetchDocuments]);

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
      <div className="flex items-center gap-2">
        <input
          type="file"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium">Uploaded Documents</h3>
        {documents.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {documents.map((doc, index) => (
              <li key={index}>
                <a
                  href={doc.publicURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {doc.filePath}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No documents uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
