import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { toast } from 'react-hot-toast';

type RiskTolerance = 'low' | 'medium' | 'high';

const ProfileSettings = () => {
  const { profile, updateProfile, loading } = useProfile();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>(profile?.risk_tolerance || 'medium');
  // Remove any state for investment_style

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        full_name: fullName,
        risk_tolerance: riskTolerance,
        // Don't include investment_style in the update
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-700 mb-1">
            Risk Tolerance
          </label>
          <select
            id="riskTolerance"
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(e.target.value as RiskTolerance)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings; 