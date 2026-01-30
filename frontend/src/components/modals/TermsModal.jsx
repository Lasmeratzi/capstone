import React, { useState } from "react";

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    setAccepted(true);
    if (onAccept) onAccept();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Terms & Conditions</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mt-2 text-sm">
              Please read and accept our Terms & Conditions to continue.
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
            <div className="space-y-8">
              {/* Introduction */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> By using Illura, you agree to these terms and conditions. 
                  Please read them carefully before proceeding.
                </p>
              </div>

              {/* Terms Section */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
                  Terms of Use
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">Acceptance of Terms</h4>
                    <p className="text-gray-600 mt-1 text-sm">
                      By accessing or using Illura, you agree to be bound by these Terms & Conditions. 
                      If you do not agree to all the terms, you may not access the platform.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">Eligibility Requirements</h4>
                    <p className="text-gray-600 mt-1 text-sm">
                      You must be at least 13 years old to use Illura. If you are under 18, 
                      you must have parental or guardian consent to use our services.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">Account Responsibilities</h4>
                    <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1 mt-1">
                      <li>Provide accurate and complete information during registration</li>
                      <li>Keep your login credentials secure and confidential</li>
                      <li>You are responsible for all activities under your account</li>
                      <li>Notify us immediately of any unauthorized access</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">User Conduct Guidelines</h4>
                    <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1 mt-1">
                      <li>Do not post harmful, illegal, or offensive content</li>
                      <li>Respect intellectual property rights of others</li>
                      <li>No harassment, bullying, or abusive behavior</li>
                      <li>Do not attempt to disrupt or compromise platform security</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Services Section */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
                  Platform Services
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Portfolio Management</h4>
                    <p className="text-gray-600 text-sm">
                      Artists can create professional profiles, upload artwork, organize portfolios, 
                      and showcase their creative work to potential clients.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Client Engagement</h4>
                    <p className="text-gray-600 text-sm">
                      Users can browse artist portfolios, search for specific styles or skills, and connect with artists for potential collaborations.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Interactive Features</h4>
                    <p className="text-gray-600 text-sm">
                      Platform includes likes, comments, messaging, and social features 
                      to facilitate community engagement and networking.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
  <h4 className="font-semibold text-gray-900 mb-2">Auction & Commission Features</h4>
  <p className="text-gray-600 text-sm">
    Participate in art auctions and manage commission requests. Set starting bids, and handle transactions securely through our integrated GCash payment system.
  </p>
  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1 mt-2">
    <li>Create and manage art auctions with bidding systems</li>
    <li>Set commission availability status</li>
    <li>Track bids and payment status</li>
    <li>Secure GCash integration for Filipino artists</li>
  </ul>
</div>
                </div>
              </section>

              {/* Legal Section */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
                  Legal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Intellectual Property</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      All platform content, features, and functionality are owned by Illura and 
                      are protected by international copyright, trademark, and other intellectual 
                      property laws. You may not reproduce, distribute, or create derivative works 
                      without explicit permission.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Content Ownership</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Artists retain all rights to their uploaded artwork. By posting content, 
                      you grant Illura a non-exclusive, worldwide license to display and 
                      distribute your content on the platform.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Limitation of Liability</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Illura is not liable for any indirect, incidental, or consequential damages 
                      arising from your use of the platform. Our total liability is limited to 
                      the amount you have paid us in the last 12 months.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Governing Law</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      These terms are governed by and construed in accordance with the laws of 
                      [Your Country]. Any disputes shall be resolved in the courts of [Your City/Region].
                    </p>
                  </div>
                </div>
              </section>

              {/* Updates Section */}
              <section className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Updates to Terms</h4>
                <p className="text-gray-600 text-sm">
                  We may update these terms periodically. Continued use of Illura after changes 
                  constitutes acceptance of the updated terms. We will notify users of significant 
                  changes via email or platform notifications.
                </p>
              </section>
            </div>
          </div>

          {/* Footer with Accept Button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms-agree"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms-agree" className="ml-3 text-sm text-gray-700">
                  I have read and agree to the Terms & Conditions
                </label>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={handleAccept}
                  disabled={!accepted}
                  className={`px-5 py-2.5 font-medium rounded-lg transition ${
                    accepted 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Accept & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;