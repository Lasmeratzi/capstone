import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin";

const IlluraAccount = () => {
  const [gcashInfo, setGcashInfo] = useState({
    gcash_number: "",
    gcash_name: "",
    qr_code_path: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrCodeFile, setQrCodeFile] = useState(null);

  useEffect(() => {
    fetchGcashInfo();
  }, []);

  const fetchGcashInfo = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/admin/illura-account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGcashInfo(response.data);
    } catch (error) {
      console.error("Error fetching GCash info:", error);
      alert("Failed to load GCash information.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setQrCodeFile(e.target.files[0]);
  };

  const updateGcashInfo = async () => {
    if (!gcashInfo.gcash_number || !gcashInfo.gcash_name) {
      alert("GCash number and account name are required.");
      return;
    }

    setSaving(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("gcash_number", gcashInfo.gcash_number);
      formData.append("gcash_name", gcashInfo.gcash_name);
      if (qrCodeFile) {
        formData.append("qr_code", qrCodeFile);
      }

      await axios.put("http://localhost:5000/api/admin/illura-account", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      
      setIsEditing(false);
      setQrCodeFile(null);
      fetchGcashInfo(); // Refresh data
      alert("GCash information updated successfully!");
    } catch (error) {
      console.error("Error updating GCash info:", error);
      alert("Failed to update GCash information.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-gray-100 min-h-screen">
        <div className="fixed h-full">
          <SideAdmin />
        </div>
        <div className="flex-grow p-6 ml-48">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Illura Account - GCash Information</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="fixed h-full">
        <SideAdmin />
      </div>

      <div className="flex-grow p-6 ml-48">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Illura Account - GCash Information</h1>
        <p className="text-gray-600 mb-8">This GCash information will be shown to buyers when they win auctions.</p>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">GCash Number</label>
            {isEditing ? (
              <input
                type="text"
                value={gcashInfo.gcash_number}
                onChange={(e) => setGcashInfo({...gcashInfo, gcash_number: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="09XXXXXXXXX"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">{gcashInfo.gcash_number || "Not set"}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
            {isEditing ? (
              <input
                type="text"
                value={gcashInfo.gcash_name}
                onChange={(e) => setGcashInfo({...gcashInfo, gcash_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Illura Team"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">{gcashInfo.gcash_name || "Not set"}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">QR Code</label>
            {gcashInfo.qr_code_path ? (
              <div className="flex items-start gap-4">
                <img 
                  src={`http://localhost:5000/uploads/${gcashInfo.qr_code_path}`} 
                  alt="GCash QR Code"
                  className="w-48 h-48 border-2 border-gray-300 rounded-lg object-contain"
                />
                {isEditing && (
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Upload new QR code (optional):</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">No QR code uploaded</p>
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={updateGcashInfo}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setQrCodeFile(null);
                    fetchGcashInfo(); // Reset to original values
                  }}
                  disabled={saving}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Edit GCash Information
              </button>
            )}
          </div>

          {!isEditing && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">How buyers will see this:</h3>
              <p className="text-sm text-blue-700">
                When a user wins an auction, they'll see your GCash number and QR code in their "Auction Wins" page 
                so they know where to send the payment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IlluraAccount;