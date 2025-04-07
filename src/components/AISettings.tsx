   // src/components/AISettings.tsx
   import React, { useState, useEffect } from 'react';
   import { Card, Form, Button, Alert } from 'react-bootstrap';
   import { useAuth } from '../context/AuthContext';
   import { supabase } from '../lib/supabase';

   interface AIFeatures {
     portfolioAnalysis: boolean;
     recommendations: boolean;
     chatbot: boolean;
     automatedAnalysis: boolean;
   }

   interface UserPreferences {
     riskTolerance: 'conservative' | 'moderate' | 'aggressive';
     investmentHorizon: 'short' | 'medium' | 'long';
     aiFeatures: AIFeatures;
   }

   interface User {
     id: string;
   }

   interface AuthContextType {
     user: User | null;
   }

   const AISettings: React.FC = () => {
     const [preferences, setPreferences] = useState<UserPreferences>({
       riskTolerance: 'moderate',
       investmentHorizon: 'medium',
       aiFeatures: {
         portfolioAnalysis: true,
         recommendations: true,
         chatbot: true,
         automatedAnalysis: false
       }
     });
     const [loading, setLoading] = useState<boolean>(true);
     const [saving, setSaving] = useState<boolean>(false);
     const [error, setError] = useState<string | null>(null);
     const [success, setSuccess] = useState<boolean>(false);
     const { user } = useAuth() as AuthContextType;
     
     useEffect(() => {
       const fetchPreferences = async (): Promise<void> => {
         try {
           const { data, error } = await supabase
             .from('user_preferences')
             .select('*')
             .eq('user_id', user?.id)
             .single();

           if (error) throw error;
           
           if (data) {
             setPreferences(data.preferences);
           }
         } catch (err) {
           console.error('Error fetching preferences:', err);
           setError('Failed to load your preferences');
         } finally {
           setLoading(false);
         }
       };
       
       if (user) {
         fetchPreferences();
       }
     }, [user]);
     
     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
       const { name, value, checked, type } = e.target as HTMLInputElement;
       
       if (name.startsWith('aiFeatures.')) {
         const featureName = name.split('.')[1] as keyof AIFeatures;
         setPreferences(prev => ({
           ...prev,
           aiFeatures: {
             ...prev.aiFeatures,
             [featureName]: checked
           }
         }));
       } else {
         setPreferences(prev => ({
           ...prev,
           [name]: type === 'checkbox' ? checked : value
         }));
       }
     };
     
     const savePreferences = async (e: React.FormEvent): Promise<void> => {
       e.preventDefault();
       setSaving(true);
       setError(null);
       setSuccess(false);
       
       try {
         const { error } = await supabase
           .from('user_preferences')
           .upsert({
             user_id: user?.id,
             preferences: preferences
           });
           
         if (error) throw error;
         
         setSuccess(true);
       } catch (err) {
         console.error('Error saving preferences:', err);
         setError('Failed to save your preferences');
       } finally {
         setSaving(false);
       }
     };
     
     if (loading) {
       return <div>Loading preferences...</div>;
     }
     
     return (
       <Card>
         <Card.Header as="h5">AI Settings</Card.Header>
         <Card.Body>
           {error && <Alert variant="danger">{error}</Alert>}
           {success && <Alert variant="success">Preferences saved successfully!</Alert>}
           
           <Form onSubmit={savePreferences}>
             <Form.Group className="mb-3">
               <Form.Label>Risk Tolerance</Form.Label>
               <Form.Select 
                 name="riskTolerance" 
                 value={preferences.riskTolerance}
                 onChange={handleChange}
               >
                 <option value="conservative">Conservative</option>
                 <option value="moderate">Moderate</option>
                 <option value="aggressive">Aggressive</option>
               </Form.Select>
             </Form.Group>
             
             <Form.Group className="mb-3">
               <Form.Label>Investment Horizon</Form.Label>
               <Form.Select 
                 name="investmentHorizon" 
                 value={preferences.investmentHorizon}
                 onChange={handleChange}
               >
                 <option value="short">Short (less than 2 years)</option>
                 <option value="medium">Medium (2-5 years)</option>
                 <option value="long">Long (more than 5 years)</option>
               </Form.Select>
             </Form.Group>
             
             <Form.Group className="mb-3">
               <Form.Label>AI Features</Form.Label>
               
               <Form.Check 
                 type="checkbox"
                 id="feature-portfolio"
                 label="Portfolio Analysis"
                 name="aiFeatures.portfolioAnalysis"
                 checked={preferences.aiFeatures.portfolioAnalysis}
                 onChange={handleChange}
               />
               
               <Form.Check 
                 type="checkbox"
                 id="feature-recommendations"
                 label="Investment Recommendations"
                 name="aiFeatures.recommendations"
                 checked={preferences.aiFeatures.recommendations}
                 onChange={handleChange}
               />
               
               <Form.Check 
                 type="checkbox"
                 id="feature-chatbot"
                 label="Financial Assistant Chatbot"
                 name="aiFeatures.chatbot"
                 checked={preferences.aiFeatures.chatbot}
                 onChange={handleChange}
               />
               
               <Form.Check 
                 type="checkbox"
                 id="feature-automated"
                 label="Automated Daily Portfolio Analysis"
                 name="aiFeatures.automatedAnalysis"
                 checked={preferences.aiFeatures.automatedAnalysis}
                 onChange={handleChange}
               />
             </Form.Group>
             
             <Button 
               type="submit" 
               variant="primary"
               disabled={saving}
             >
               {saving ? 'Saving...' : 'Save Preferences'}
             </Button>
           </Form>
         </Card.Body>
       </Card>
     );
   };
   
   export default AISettings;