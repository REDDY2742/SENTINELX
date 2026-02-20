import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
  currency: string;
  exchangeRate: number; // INR to selected currency
  convert: (amount: number) => number;
  formatAmount: (amount: number) => string;
  setCurrency: (currency: string) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children, userPreference }: { children: React.ReactNode, userPreference?: string }) {
  const [currency, setCurrency] = useState('INR');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Map user preference strings to currency codes
  const preferenceMap: Record<string, string> = {
    'INR - Indian Rupee (₹)': 'INR',
    'USD - US Dollar ($)': 'USD',
    'EUR - Euro (€)': 'EUR'
  };

  useEffect(() => {
    if (userPreference && preferenceMap[userPreference]) {
      setCurrency(preferenceMap[userPreference]);
    }
  }, [userPreference]);

  useEffect(() => {
    const fetchRate = async () => {
      if (currency === 'INR') {
        setExchangeRate(1);
        return;
      }

      setIsLoading(true);
      try {
        // Using a free rate API (no key required for this specific free tier endpoint usually)
        // or a very reliable mock if connectivity is an issue.
        // For demonstration purposes, we use a real free API.
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/INR`);
        const data = await response.json();
        const rate = data.rates[currency] || 1;
        setExchangeRate(rate);
      } catch (err) {
        console.error('Failed to fetch exchange rates, using fallback', err);
        // Fallback rates if API fails
        const fallbacks: Record<string, number> = {
          'USD': 0.012,
          'EUR': 0.011
        };
        setExchangeRate(fallbacks[currency] || 1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, [currency]);

  const convert = (amount: number) => {
    return amount * exchangeRate;
  };

  const formatAmount = (amount: number) => {
    const converted = convert(amount);
    const symbols: Record<string, string> = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€'
    };
    
    const symbol = symbols[currency] || '₹';
    const formatter = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${symbol}${formatter.format(converted)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, exchangeRate, convert, formatAmount, setCurrency, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
