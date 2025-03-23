import React, { useState, useEffect } from "react";
import { Calculator, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const InvestmentTaxCalculator: React.FC = () => {
    const [initialInvestment, setInitialInvestment] = useState<number>(10000);
    const [annualContribution, setAnnualContribution] = useState<number>(0);
    const [annualReturnRate, setAnnualReturnRate] = useState<number>(0.08);
    const [years, setYears] = useState<number>(10);
    const [taxRate, setTaxRate] = useState<number>(0.15);
    const [inflationRate, setInflationRate] = useState<number>(0.025);
    
    const [futureValue, setFutureValue] = useState<number>(0);
    const [taxAmount, setTaxAmount] = useState<number>(0);
    const [netAmount, setNetAmount] = useState<number>(0);
    const [realValueAfterInflation, setRealValueAfterInflation] = useState<number>(0);
    
    // Calculate future value with compound interest and annual contributions
    const calculateFutureValue = (
        principal: number, 
        annualContrib: number,
        rate: number, 
        years: number
    ): number => {
        let futureVal = principal;
        
        for (let i = 0; i < years; i++) {
            futureVal = futureVal * (1 + rate) + annualContrib;
        }
        
        return futureVal;
    };
    
    // Calculate capital gains tax
    const calculateTax = (
        futureVal: number, 
        initialInvestment: number, 
        taxRate: number
    ): number => {
        const capitalGain = Math.max(futureVal - initialInvestment, 0);
        return capitalGain * taxRate;
    };
    
    // Calculate real value after inflation
    const calculateRealValue = (
        amount: number, 
        inflationRate: number, 
        years: number
    ): number => {
        return amount / Math.pow(1 + inflationRate, years);
    };
    
    // Update calculations when inputs change
    useEffect(() => {
        const fv = calculateFutureValue(
            initialInvestment, 
            annualContribution,
            annualReturnRate, 
            years
        );
        
        const tax = calculateTax(fv, initialInvestment, taxRate);
        const net = fv - tax;
        const realValue = calculateRealValue(net, inflationRate, years);
        
        setFutureValue(fv);
        setTaxAmount(tax);
        setNetAmount(net);
        setRealValueAfterInflation(realValue);
    }, [initialInvestment, annualContribution, annualReturnRate, years, taxRate, inflationRate]);
    
    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <Calculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Investment Tax Calculator</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Parameters</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Initial Investment ($)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                value={initialInvestment}
                                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                                placeholder="10000"
                                min="0"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Annual Contribution ($)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                value={annualContribution}
                                onChange={(e) => setAnnualContribution(Number(e.target.value))}
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                                placeholder="1000"
                                min="0"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Annual Return Rate (%)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <TrendingUp className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                value={annualReturnRate * 100}
                                onChange={(e) => setAnnualReturnRate(Number(e.target.value) / 100)}
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                                placeholder="8"
                                step="0.1"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Investment Period (Years)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                                placeholder="10"
                                min="1"
                                max="100"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Capital Gains Tax Rate (%)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="number"
                                value={taxRate * 100}
                                onChange={(e) => setTaxRate(Number(e.target.value) / 100)}
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2 sm:text-sm border-gray-300 rounded-md"
                                placeholder="15"
                                step="0.1"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Inflation Rate (%)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="number"
                                value={inflationRate * 100}
                                onChange={(e) => setInflationRate(Number(e.target.value) / 100)}
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2 sm:text-sm border-gray-300 rounded-md"
                                placeholder="2.5"
                                step="0.1"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Results Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Investment Projection</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Future Value (Before Tax)</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                ${futureValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        
                        <div>
                            <p className="text-sm text-gray-500">Capital Gains Tax</p>
                            <p className="text-2xl font-bold text-red-500">
                                -${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">Net Amount (After Tax)</p>
                            <p className="text-2xl font-bold text-green-600">
                                ${netAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">Real Value (Adjusted for Inflation)</p>
                            <p className="text-2xl font-bold text-gray-800">
                                ${realValueAfterInflation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">Total Return</p>
                            <p className="text-xl font-semibold text-indigo-600">
                                {((netAmount / initialInvestment - 1) * 100).toFixed(2)}%
                            </p>
                        </div>
                        
                        <div>
                            <p className="text-sm text-gray-500">Annualized Return (After Tax)</p>
                            <p className="text-xl font-semibold text-indigo-600">
                                {(Math.pow(netAmount / initialInvestment, 1 / years) - 1) * 100 > 0 
                                    ? ((Math.pow(netAmount / initialInvestment, 1 / years) - 1) * 100).toFixed(2) 
                                    : 0}%
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-6 text-xs text-gray-500">
                        <p>* This calculator provides estimates only and should not be considered financial advice.</p>
                        <p>* Tax laws vary by location and may change over time.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestmentTaxCalculator; 