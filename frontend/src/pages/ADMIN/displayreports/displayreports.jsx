import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin";
import { 
  Flag, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Filter,
  Clock,
  User,
  FileText,
  Globe,
  Users as UsersIcon,
  Lock,
  ChevronDown,
  ChevronUp,
  Search,
  MoreVertical,
  Trash2,
  Check,
  X,
  MessageSquare,
  Image as ImageIcon,
  Gavel
} from "lucide-react";

const DisplayReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);
  
  // Expanded view
  const [expandedReport, setExpandedReport] = useState(null);
  
  // Admin action modal
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionData, setActionData] = useState({
    status: "reviewed",
    action_taken: "none",
    action_notes: "",
  });
  
  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  // Fetch reports
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
  try {
    setLoading(true);
    const token = sessionStorage.getItem("adminToken");
    
    console.log("🔍 Admin Token:", token ? "Exists" : "Missing");
    console.log("🔍 Token value (first 50 chars):", token ? token.substring(0, 50) + "..." : "No token");
    
    if (!token) {
      setError("No admin token found. Please log in again.");
      setLoading(false);
      return;
    }
    
    // Try to decode the token to see what's in it
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("🔍 Token payload:", payload);
      console.log("🔍 Admin username:", payload.username);
      console.log("🔍 Admin role:", payload.role);
    } catch (decodeErr) {
      console.error("Failed to decode token:", decodeErr);
    }
    
    const response = await axios.get("http://localhost:5000/api/admin/reports", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    setReports(response.data);
    setError("");
  } catch (err) {
    console.error("Error fetching reports:", err);
    console.error("Error response:", err.response?.data);
    console.error("Error status:", err.response?.status);
    
    setError(`Failed to load reports: ${err.response?.data?.message || err.message}`);
  } finally {
    setLoading(false);
  }
};

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      under_review: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Eye },
      reviewed: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      dismissed: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: XCircle },
      action_taken: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Flag },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };



  // Add these missing functions to your DisplayReports component:

// Handle action submission
const handleSubmitAction = async () => {
  try {
    const token = sessionStorage.getItem("adminToken");
    
    if (!token) {
      alert("No admin token found. Please log in again.");
      return;
    }
    
    if (!selectedReport) return;
    
    const response = await axios.patch(
      `http://localhost:5000/api/admin/reports/${selectedReport.id}`,
      actionData,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    // Update local state
    setReports(reports.map(report => 
      report.id === selectedReport.id 
        ? { 
            ...report, 
            ...actionData, 
            reviewed_by_admin: "You", 
            reviewed_at: new Date().toISOString() 
          } 
        : report
    ));
    
    alert("Action submitted successfully!");
    setShowActionModal(false);
    setSelectedReport(null);
    setActionData({
      status: "reviewed",
      action_taken: "none",
      action_notes: "",
    });
    
  } catch (err) {
    console.error("Error submitting action:", err);
    console.error("Error response data:", err.response?.data);
    alert(`Failed to submit action: ${err.response?.data?.message || err.message}`);
  }
};

// Confirm and execute action
const confirmAction = async () => {
  try {
    const token = sessionStorage.getItem("adminToken");
    
    if (!token) {
      alert("No admin token found. Please log in again.");
      return;
    }
    
    const response = await axios.patch(
      `http://localhost:5000/api/admin/reports/${actionToConfirm.reportId}`,
      actionToConfirm.data,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    // Update local state
    setReports(reports.map(report => 
      report.id === actionToConfirm.reportId 
        ? { 
            ...report, 
            ...actionToConfirm.data, 
            reviewed_by_admin: "You", 
            reviewed_at: new Date().toISOString() 
          } 
        : report
    ));
    
    alert("Action completed successfully!");
    
  } catch (err) {
    console.error("Error confirming action:", err);
    alert(`Failed to complete action: ${err.response?.data?.message || err.message}`);
  } finally {
    setShowConfirmModal(false);
    setActionToConfirm(null);
  }
};

// Also, update the "Take Action" button to use a proper handler instead of directly showing modal
// Replace the current "Take Action" button in the actions column with:

<button
  onClick={() => handleTakeAction(report)}
  className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
>
  Take Action
</button>

// And add this function:
const handleTakeAction = (report) => {
  setSelectedReport(report);
  setActionData({
    status: "reviewed",
    action_taken: "none",
    action_notes: "",
  });
  setShowActionModal(true);
};

  // Get category badge
  const getCategoryBadge = (category) => {
    const categoryColors = {
      spam: "bg-gray-100 text-gray-800",
      misleading: "bg-orange-100 text-orange-800",
      fake_information: "bg-red-100 text-red-800",
      impersonation: "bg-purple-100 text-purple-800",
      inappropriate: "bg-pink-100 text-pink-800",
      harassment: "bg-red-100 text-red-800",
      hate_speech: "bg-red-100 text-red-800",
      intellectual_property: "bg-blue-100 text-blue-800",
      self_harm: "bg-red-100 text-red-800",
      scam_fraud: "bg-orange-100 text-orange-800",
      violence: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    
    const displayName = category
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    
    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${categoryColors[category] || "bg-gray-100"}`}>
        {displayName}
      </span>
    );
  };

  // Get content type icon
  const getContentTypeIcon = (type) => {
    const icons = {
      post: FileText,
      artwork: ImageIcon,
      auction: Gavel,
    };
    const Icon = icons[type] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  // Get visibility icon
  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case "public": return <Globe className="w-4 h-4" />;
      case "friends": return <UsersIcon className="w-4 h-4" />;
      case "private": return <Lock className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesType = contentTypeFilter === "all" || report.content_type === contentTypeFilter;
    const matchesCategory = categoryFilter === "all" || report.report_category === categoryFilter;
    const matchesSearch = 
      searchTerm === "" ||
      report.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.post_title && report.post_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.artwork_title && report.artwork_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.auction_title && report.auction_title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesType && matchesCategory && matchesSearch;
  });

  // Pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  // Stats
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "pending").length,
    under_review: reports.filter(r => r.status === "under_review").length,
    reviewed: reports.filter(r => r.status === "reviewed").length,
    dismissed: reports.filter(r => r.status === "dismissed").length,
    action_taken: reports.filter(r => r.status === "action_taken").length,
  };

  // Handle action submission
  // Quick actions
const handleQuickAction = async (reportId, action) => {
  try {
    const token = sessionStorage.getItem("adminToken");
    console.log(`🔍 Quick action: ${action} on report ${reportId}`);
    console.log("🔍 Using token:", token ? "Yes" : "No");
    
    if (!token) {
      alert("No admin token found. Please log in again.");
      return;
    }
    
    let updateData = {};
    if (action === "dismiss") {
      updateData = { 
        status: "dismissed", 
        action_taken: "none", 
        action_notes: "Report dismissed without action." 
      };
    } else if (action === "review") {
      updateData = { 
        status: "under_review",
        action_taken: "none",
        action_notes: "Report marked for review."
      };
    }
    
    console.log("🔍 Sending update:", updateData);
    
    const response = await axios.patch(
      `http://localhost:5000/api/admin/reports/${reportId}`,
      updateData,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    console.log("✅ Action successful:", response.data);
    
    // Update local state
    setReports(reports.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            ...updateData, 
            reviewed_by_admin: "You", 
            reviewed_at: new Date().toISOString() 
          } 
        : report
    ));
    
    alert(`Report ${action === "review" ? "marked for review" : "dismissed"} successfully!`);
    
  } catch (err) {
    console.error("Error performing action:", err);
    console.error("Error response data:", err.response?.data);
    console.error("Error status:", err.response?.status);
    
    alert(`Failed to perform action: ${err.response?.data?.message || err.message}`);
  }
};

  if (loading) {
    return (
      <div className="flex bg-gray-100 min-h-screen">
        <SideAdmin />
        <div className="flex-grow p-6 ml-48 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SideAdmin />
      
      <div className="flex-grow p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reports Management</h1>
          <p className="text-gray-600">Review and manage user-reported content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-500 mb-1">Total Reports</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-100">
            <div className="text-sm text-yellow-600 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-100">
            <div className="text-sm text-blue-600 mb-1">Under Review</div>
            <div className="text-2xl font-bold text-blue-700">{stats.under_review}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow border border-green-100">
            <div className="text-sm text-green-600 mb-1">Reviewed</div>
            <div className="text-2xl font-bold text-green-700">{stats.reviewed}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Dismissed</div>
            <div className="text-2xl font-bold text-gray-700">{stats.dismissed}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow border border-purple-100">
            <div className="text-sm text-purple-600 mb-1">Action Taken</div>
            <div className="text-2xl font-bold text-purple-700">{stats.action_taken}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="reviewed">Reviewed</option>
              <option value="dismissed">Dismissed</option>
              <option value="action_taken">Action Taken</option>
            </select>
            
            <select
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
            >
              <option value="all">All Content Types</option>
              <option value="post">Posts</option>
              <option value="artwork">Artworks</option>
              <option value="auction">Auctions</option>
            </select>
            
            <select
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="spam">Spam</option>
              <option value="misleading">Misleading</option>
              <option value="inappropriate">Inappropriate</option>
              <option value="harassment">Harassment</option>
              <option value="hate_speech">Hate Speech</option>
              <option value="other">Other</option>
            </select>
            
            <button
              onClick={() => {
                setStatusFilter("all");
                setContentTypeFilter("all");
                setCategoryFilter("all");
                setSearchTerm("");
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Reports ({filteredReports.length} found)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentReports.length > 0 ? (
                  currentReports.map((report) => (
                    <React.Fragment key={report.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{report.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {report.reporter_name || "Unknown User"}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {report.reason}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getContentTypeIcon(report.content_type)}
                            <span className="text-sm font-medium capitalize">
                              {report.content_type}
                            </span>
                            {report.post_title && (
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                "{report.post_title}"
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getCategoryBadge(report.report_category)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(report.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title={expandedReport === report.id ? "Collapse" : "Expand"}
                            >
                              {expandedReport === report.id ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                            
                            {report.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleQuickAction(report.id, "review")}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
                                >
                                  Review
                                </button>
                                <button
                                  onClick={() => handleQuickAction(report.id, "dismiss")}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200"
                                >
                                  Dismiss
                                </button>
                              </>
                            )}
                            
                            <button
                              onClick={() => {
                                setSelectedReport(report);
                                setShowActionModal(true);
                              }}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
                            >
                              Take Action
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Details */}
                      {expandedReport === report.id && (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">Report Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Reporter ID:</span> {report.reporter_id}
                                  </div>
                                  <div>
                                    <span className="font-medium">Content Author ID:</span> {report.content_author_id}
                                  </div>
                                  <div>
                                    <span className="font-medium">Content ID:</span> {report.post_id || report.artwork_id || report.auction_id}
                                  </div>
                                  <div className="mt-2 p-3 bg-gray-100 rounded">
                                    <span className="font-medium">Reason:</span>
                                    <p className="mt-1">{report.reason}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">Admin Notes</h4>
                                {report.action_notes ? (
                                  <p className="text-sm p-3 bg-blue-50 rounded">{report.action_notes}</p>
                                ) : (
                                  <p className="text-sm text-gray-500 italic">No admin notes yet</p>
                                )}
                                
                                {report.reviewed_by_admin && (
                                  <div className="mt-3 text-sm">
                                    <span className="font-medium">Reviewed by:</span> {report.reviewed_by_admin}
                                    <br />
                                    <span className="font-medium">Reviewed at:</span> {report.reviewed_at ? formatDate(report.reviewed_at) : "Not reviewed"}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <Flag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg">No reports found</p>
                      <p className="text-sm mt-1">Try changing your filters or search term</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstReport + 1} to {Math.min(indexOfLastReport, filteredReports.length)} of {filteredReports.length} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <span className="px-3 py-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Take Action on Report #{selectedReport.id}</h3>
                <button
                  onClick={() => setShowActionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Report Summary</h4>
                <p className="text-sm text-gray-600">{selectedReport.reason}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={actionData.status}
                    onChange={(e) => setActionData({...actionData, status: e.target.value})}
                  >
                    <option value="reviewed">Reviewed</option>
                    <option value="dismissed">Dismissed</option>
                    <option value="action_taken">Action Taken</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action Taken
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={actionData.action_taken}
                    onChange={(e) => setActionData({...actionData, action_taken: e.target.value})}
                  >
                    <option value="none">No Action</option>
                    <option value="content_removed">Content Removed</option>
                    <option value="user_warned">User Warned</option>
                    <option value="content_restricted">Content Restricted</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Visible to content author)
                  </label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Explain the action taken..."
                    value={actionData.action_notes}
                    onChange={(e) => setActionData({...actionData, action_notes: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && actionToConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to {actionToConfirm.action} this report?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setActionToConfirm(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayReports;