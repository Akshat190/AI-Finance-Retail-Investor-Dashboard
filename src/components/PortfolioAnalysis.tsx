   // src/components/PortfolioAnalysis.tsx
   import React, { useState, useEffect } from 'react';
   import { useAuth } from '../contexts/AuthContext';
   import { Card, Button, Spinner, Alert } from 'react-bootstrap';
   import api from '../services/api';

   interface Portfolio {
     [key: string]: any;
   }

   interface User {
     id: string;
     portfolio: Portfolio;
   }

   interface AuthContextType {
     user: User | null;
   }

   const PortfolioAnalysis: React.FC = () => {
     const [analysis, setAnalysis] = useState<string | null>(null);
     const [loading, setLoading] = useState<boolean>(false);
     const [error, setError] = useState<string | null>(null);
     const { user } = useAuth() as AuthContextType;
     
     const fetchAnalysis = async (): Promise<void> => {
       setLoading(true);
       setError(null);
       
       try {
         const response = await api.post('/ai/analyze-portfolio', {
           portfolio: user?.portfolio
         });
         setAnalysis(response.data.analysis);
       } catch (err) {
         setError('Failed to generate portfolio analysis. Please try again later.');
         console.error(err);
       } finally {
         setLoading(false);
       }
     };
     
     useEffect(() => {
       // Load existing analysis if available
       const getExistingAnalysis = async (): Promise<void> => {
         try {
           const response = await api.get('/ai/latest-portfolio-analysis');
           if (response.data) {
             setAnalysis(response.data.analysis);
           }
         } catch (err) {
           console.error('Error fetching existing analysis:', err);
         }
       };
       
       if (user) {
         getExistingAnalysis();
       }
     }, [user]);
     
     return (
       <Card className="mb-4">
         <Card.Header as="h5">AI Portfolio Analysis</Card.Header>
         <Card.Body>
           {error && <Alert variant="danger">{error}</Alert>}
           
           {loading ? (
             <div className="text-center p-4">
               <Spinner animation="border" role="status" />
               <p className="mt-2">Analyzing your portfolio...</p>
             </div>
           ) : analysis ? (
             <div>
               <div className="analysis-content" dangerouslySetInnerHTML={{ __html: analysis }} />
               <Button 
                 variant="outline-primary" 
                 onClick={fetchAnalysis} 
                 className="mt-3"
               >
                 Refresh Analysis
               </Button>
             </div>
           ) : (
             <div className="text-center p-4">
               <p>Get AI-powered insights about your current portfolio.</p>
               <Button variant="primary" onClick={fetchAnalysis}>
                 Analyze My Portfolio
               </Button>
             </div>
           )}
         </Card.Body>
       </Card>
     );
   };
   
   export default PortfolioAnalysis;