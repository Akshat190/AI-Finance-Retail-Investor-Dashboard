import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { toast } from 'react-hot-toast';

const ProfileSettings = () => {
  const { profile, updateProfile, loading } = useProfile();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [riskTolerance, setRiskTolerance] = useState(profile?.risk_tolerance || 'medium');
  // Remove any state for investment_style

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        full_name: fullName,
        risk_tolerance: riskTolerance as 'low' | 'medium' | 'high',
        // Don't include investment_style in the update
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // Rest of your component...
} 